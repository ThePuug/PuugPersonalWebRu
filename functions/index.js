const functions = require("firebase-functions");
const stripe = require('stripe')(functions.config().stripe.privatekey);
const admin = require('firebase-admin');

admin.initializeApp();

exports.stripeCreateCustomer = functions.region("europe-central2").auth.user().onCreate(async (user) =>  {  
  functions.logger.debug("creating stripe customer for user: " + user.uid)
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.displayName,
    metadata: {
      uid: user.uid
    }
  })
  await admin.firestore().collection("users").doc(user.uid).set({stripeRef:customer.id})
})

exports.stripePaymentIntent = functions.region("europe-central2").https.onCall(async (data,context) => {
  if(!context.auth) throw new functions.https.HttpsError("unauthenticated","not authorised")
  if(!['individual','couple','child'].some(it => it === data.sessionType))
    throw new functions.https.HttpsError("invalid-argument","invalid product code")
  
  const amount = data.sessionType === 'individual' ? 6000 : data.sessionType === 'couple' ? 7500 : 4000
  const user = await admin.firestore().collection("users").doc(context.auth.uid).get()
  const intent = await stripe.paymentIntents.create({
    customer: user.data().stripeRef,
    amount: amount,
    currency: "bgn"
  })
  return intent.client_secret
})

exports.deleteBooking = functions.region("europe-central2").https.onCall(async (data,context) => {
  if(!context.auth) throw new functions.https.HttpsError("unauthenticated","not authorised")
  if(!context.auth.token?.CAN_EDIT_BOOKING_DETAILS) throw new functions.https.HttpsError("unauthenticated","not authorised")

  await admin.firestore().collection("bookings").doc(data.id).delete()
})

exports.updateBooking = functions.region("europe-central2").https.onCall(async (data,context) => {
  if(!context.auth) throw new functions.https.HttpsError("unauthenticated","not authorised")
  if(!context.auth.token?.CAN_EDIT_BOOKING_DETAILS) throw new functions.https.HttpsError("unauthenticated","not authorised")

  var doc = admin.firestore().collection("bookings").doc(data.id)
  await doc.update({
    sessionType: data.sessionType,
    date: new Date(data.date),
    userEmail: data.userEmail
  })
  var newData = await (await doc.get()).data()
  return { ...newData, 
    date:newData.date.toMillis(),
    id:doc.id}
})