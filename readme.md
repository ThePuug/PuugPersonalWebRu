# Introduction
The purpose of this demo app was to showcase a custom developed scheduling and payment system that is mobile ready and integrated with Stripe payment provider.

# Getting started
- install node.js (22 or newer) which includes npm from: https://nodejs.org/en/download/
- get the repo `git clone https://github.com/ThePuug/PuugPersonalWebRu.git`
- inside the checkout, install packages: `npm install`, and for the functions: `npm install --prefix functions`
- install required global packages:
    - `npm install -g firebase-tools`
- login or reauth: `firebase login` or `firebase login --reauth`
- setup an account at stripe.com and ensure the slider is set to `Test mode`
- put the Stripe secret key for the functions emulator in `functions/.secret.local`:
    - from stripe; developers -> API keys -> Secret key: `STRIPE_SECRET_KEY=sk_test_...`
- define a few variables in `.env`:
    - from stripe; developers -> API keys -> Publishable key: `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`,
    - from firebase console; Authentication -> Sign-in method -> Authorised domains: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`,
    - from firebase console; Project settings -> Project ID: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - from firebase console; Project settings -> Web API Key: `NEXT_PUBLIC_FIREBASE_API_KEY`
- for local development, run `firebase emulators:start --only functions,auth,firestore` (needs Java 21+) then you can use: `npm run develop`
- to test the static export first build (`npm run build`) then use: `firebase emulators:start` (serves the `out/` directory)

# Data model
- `bookings` hold client details (email, session type, payment reference). Only the booking's owner, or a user with the `CAN_VIEW_ALL_BOOKINGS` claim, can read them.
- `slots` mirror each active booking with only its `date` and `duration`, under the same id, so the public calendar can show which times are taken.
- All writes to both go through the Cloud Functions in `functions/index.js`, which keep them in step.

# Using util
- install required modules: `npm install --prefix util`
- local development requires you define a few other variables in `.env`
    - Uncomment `FIREBASE_AUTH_EMULATOR_HOST` when you want to connect to your local Auth emulator
    - otherwise the scripts use Application Default Credentials: `gcloud auth application-default login`
- set staff permissions with `npm run permissions --prefix util`

# Deploying
Production deploys are run by hand: Actions -> **Deploy to production** -> Run workflow.
- `deploy` builds the chosen ref and deploys the ticked targets in order: functions, Firestore rules, hosting
- to roll everything back, run `deploy` again with the commit of an earlier successful run (listed under the `production` environment)
- `rollback-hosting` re-releases the previous live site version without rebuilding; the quickest way back from a bad site release
- pushes to non-main branches deploy to a Firebase preview channel named after the branch; the URL is in the run summary

GitHub Actions authenticates to Google with Workload Identity Federation, so there is no service account key. It uses these repository variables (Settings -> Secrets and variables -> Actions -> Variables):
- `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`: the workload identity provider and the deploy service account
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`: public web keys, baked into the site at build time

The Stripe secret key lives in Secret Manager as `STRIPE_SECRET_KEY`; change it with `firebase functions:secrets:set STRIPE_SECRET_KEY`, then redeploy the functions.

New https callable functions require permissions for `allUsers` as `Function Invoker` at: https://console.cloud.google.com/functions/list?project=puugpersonalwebru

# Demo
https://puugpersonalwebru.web.app

you can "pay" for reservations using the stripe test cards: https://docs.stripe.com/testing#cards
