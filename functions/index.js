const functions = require("firebase-functions/v1");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();

const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");
// Secret values only resolve at runtime, so the client is built on first use.
let stripe
const getStripe = () => stripe ??= new Stripe(STRIPE_SECRET_KEY.value())

const region = functions.region("europe-central2").runWith({ secrets: [STRIPE_SECRET_KEY] })
const HttpsError = functions.https.HttpsError

// Stripe dropped BGN after Bulgaria's euro changeover; amounts are EUR cents.
const SESSION_TYPES = {
  individual: { amount: 6000, duration: 60 },
  couple: { amount: 8000, duration: 90 },
  child: { amount: 4000, duration: 60 },
}
const MAX_DURATION = Math.max(...Object.values(SESSION_TYPES).map(s => s.duration))

// `bookings` hold client details and are readable only by their owner or staff;
// `slots` mirror each active booking with just its time so the public calendar
// can show what's taken. Both share the same document id.
const bookings = () => admin.firestore().collection("bookings")
const slots = () => admin.firestore().collection("slots")
const minutes = m => m * 60 * 1000

const requireSessionType = sessionType => {
  if(!Object.hasOwn(SESSION_TYPES, sessionType))
    throw new HttpsError("invalid-argument","invalid product code")
  return SESSION_TYPES[sessionType]
}
const requireDate = millis => {
  const date = new Date(millis)
  if(typeof millis !== "number" || isNaN(date)) throw new HttpsError("invalid-argument","invalid date")
  return date
}
// Reads through `tx` when given, so the check holds inside a transaction.
const isSlotTaken = async (date, duration, tx) => {
  const start = date.getTime(), end = start + minutes(duration)
  const nearby = slots()
    .where("date",">",new Date(start - minutes(MAX_DURATION)))
    .where("date","<",new Date(end))
  return (await (tx ? tx.get(nearby) : nearby.get())).docs
    .some(s => start < s.get("date").toMillis() + minutes(s.get("duration")) && s.get("date").toMillis() < end)
}
const requireStaff = context => {
  if(!context.auth?.token?.CAN_EDIT_BOOKING_DETAILS) throw new HttpsError("permission-denied","not authorised")
}

exports.stripeCreateCustomer = region.auth.user().onCreate(async (user) => {
  functions.logger.debug("creating stripe customer for user: " + user.uid)
  const customer = await getStripe().customers.create({
    email: user.email,
    name: user.displayName,
    metadata: {
      uid: user.uid
    }
  })
  await admin.firestore().collection("users").doc(user.uid).set({stripeRef:customer.id})
})

exports.stripePaymentIntent = region.https.onCall(async (data,context) => {
  if(!context.auth) throw new HttpsError("unauthenticated","not authorised")
  const { amount, duration } = requireSessionType(data.sessionType)
  const date = requireDate(data.date)
  if(date < new Date()) throw new HttpsError("invalid-argument","this time has already passed")

  // Checked before charging so a taken slot never costs the client anything;
  // createBooking re-checks in case someone else books it while they pay.
  if(await isSlotTaken(date, duration))
    throw new HttpsError("already-exists","This time is already booked")

  const user = await admin.firestore().collection("users").doc(context.auth.uid).get()
  const intent = await getStripe().paymentIntents.create({
    customer: user.data().stripeRef,
    amount: amount,
    currency: "eur",
    payment_method_types: ["card"],
    // What was paid for travels with the payment, so createBooking needn't trust the browser.
    metadata: { sessionType: data.sessionType, date: String(date.getTime()) },
  })
  return intent.client_secret
})

exports.createBooking = region.https.onCall(async (data,context) => {
  if(!context.auth) throw new HttpsError("unauthenticated","not authorised")
  if(typeof data.paymentReference !== "string") throw new HttpsError("invalid-argument","invalid payment reference")

  const intent = await getStripe().paymentIntents.retrieve(data.paymentReference)
  if(intent.status !== "succeeded")
    throw new HttpsError("not-found","the payment reference is not valid")

  const user = await admin.firestore().collection("users").doc(context.auth.uid).get()
  if(intent.customer !== user.data()?.stripeRef)
    throw new HttpsError("permission-denied","the payment does not belong to this user")

  if(!intent.metadata.sessionType || !intent.metadata.date)
    throw new HttpsError("failed-precondition","the payment is missing its booking details")
  const sessionType = intent.metadata.sessionType
  const { amount, duration } = requireSessionType(sessionType)
  const date = requireDate(Number(intent.metadata.date))

  if(intent.currency !== "eur" || intent.amount !== amount)
    throw new HttpsError("invalid-argument","the payment does not match the session type")

  if((await getStripe().refunds.list({payment_intent:data.paymentReference})).data.some(refund => refund.status === "succeeded"))
    throw new HttpsError("cancelled","the provided payment has been refunded")

  const booking = {
    date,
    duration,
    sessionType,
    userEmail: context.auth.token.email || null,
    userId: context.auth.uid,
    paymentReference: data.paymentReference,
  }
  const ref = bookings().doc()
  const outcome = await admin.firestore().runTransaction(async tx => {
    const existing = await tx.get(bookings().where("paymentReference","==",data.paymentReference).limit(1))
    if(!existing.empty) return { existing: existing.docs[0] }
    if(await isSlotTaken(date, duration, tx)) return { taken: true }

    tx.create(ref, booking)
    tx.create(slots().doc(ref.id), { date, duration })
    return {}
  })

  // A retry after a lost response gets the booking this payment already made.
  if(outcome.existing) {
    const existing = outcome.existing.data()
    return { ...existing,
      date: existing.date?.toMillis() ?? null,
      id: outcome.existing.id
    }
  }

  // Someone else booked this time while the client was paying: give the money back.
  if(outcome.taken) {
    await getStripe().refunds.create({ payment_intent: data.paymentReference },
      { idempotencyKey: `slot-taken-${data.paymentReference}` })
    functions.logger.warn("refunded payment for a slot booked meanwhile", { paymentReference: data.paymentReference })
    throw new HttpsError("already-exists","This time was booked by someone else; the payment has been refunded", { refunded: true })
  }

  return { ...booking,
    date: date.getTime(),
    id: ref.id
  }
})

exports.deleteBooking = region.https.onCall(async (data,context) => {
  requireStaff(context)

  // Bookings are kept for the payment record; clearing the date removes them from the calendar.
  const batch = admin.firestore().batch()
  batch.update(bookings().doc(data.id), {date: null})
  batch.delete(slots().doc(data.id))
  await batch.commit()
  return { id: data.id }
})

exports.updateBooking = region.https.onCall(async (data,context) => {
  requireStaff(context)
  const { duration } = requireSessionType(data.sessionType)
  const date = requireDate(data.date)
  if(typeof data.userEmail !== "string") throw new HttpsError("invalid-argument","invalid email")

  const doc = bookings().doc(data.id)
  const batch = admin.firestore().batch()
  batch.update(doc, {
    sessionType: data.sessionType,
    duration,
    date,
    userEmail: data.userEmail
  })
  batch.set(slots().doc(data.id), { date, duration })
  await batch.commit()

  const newData = (await doc.get()).data()
  return { ...newData,
    date:newData.date.toMillis(),
    id:doc.id}
})
