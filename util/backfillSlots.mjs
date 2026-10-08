// One-time: mirror every active booking into the public `slots` collection.
// Safe to re-run; each slot is overwritten from its booking.
//
//   ACCESS_TOKEN=$(gcloud auth print-access-token --account <owner>) node backfillSlots.mjs [--dry-run]

const PROJECT = process.env.PROJECT_ID || 'puugpersonalwebru'
const DOCS = `projects/${PROJECT}/databases/(default)/documents`
const API = `https://firestore.googleapis.com/v1/${DOCS}`
const dryRun = process.argv.includes('--dry-run')

if(!process.env.ACCESS_TOKEN) {
  console.error('ACCESS_TOKEN is not set')
  process.exit(1)
}
const headers = {
  authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  'x-goog-user-project': PROJECT,
  'content-type': 'application/json',
}
const call = async (url, init) => {
  const res = await fetch(url, { headers, ...init })
  if(!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return res.json()
}

const bookings = []
let pageToken
do {
  const params = new URLSearchParams({ pageSize: '300', 'mask.fieldPaths': 'date' })
  params.append('mask.fieldPaths', 'duration')
  if(pageToken) params.set('pageToken', pageToken)
  const page = await call(`${API}/bookings?${params}`)
  bookings.push(...(page.documents || []))
  pageToken = page.nextPageToken
} while(pageToken)

// Deleted bookings keep their document with a null date.
const active = bookings.filter(b => b.fields?.date?.timestampValue)
console.log(`${bookings.length} bookings, ${active.length} active`)
for(let i = 0; !dryRun && i < active.length; i += 500) {
  const writes = active.slice(i, i + 500).map(b => ({
    update: {
      name: `${DOCS}/slots/${b.name.split('/').pop()}`,
      fields: {
        date: b.fields.date,
        duration: b.fields.duration || { integerValue: '60' },
      },
    },
  }))
  await call(`${API}:commit`, { method: 'POST', body: JSON.stringify({ writes }) })
}
if(!dryRun) console.log(`wrote ${active.length} slots`)
