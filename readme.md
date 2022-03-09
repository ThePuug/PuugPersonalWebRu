# Getting started
- get the repo `git clone https://github.com/unliketea/PuugPersonalWebRu.git` 
- inside the checkout, install packages: `npm install`
- install required global packages: `npm install -g firebase-tools`
- login or reauth: `firebase login` or `firebase login --reauth`
- define stripe.privatekey in `functions/.runtimeconfig.json`, it might be useful to get current config from firebase
- - remove `demo-` from the beginning of projects.default in `.firebaserc`
- - export config: `firebase functions:config:get`
- - IMPORTANT: add `demo-` back before running firebase emulators!
- local development requires you define a few other variables in `.env`: 
- - from stripe developers api keys: `GATSBY_STRIPE_PUBLIC_KEY`, 
- - from firebase authentication authorised domains: `GATSBY_FIREBASE_AUTH_DOMAIN`, 
- - from firebase project settings: `GATSBY_FIREBASE_PROJECT_ID` and `GATSBY_FIREBASE_API_KEY`
- for local development, run `firebase emulators:start --only functions,auth,firestore` then you can use: `gatsby develop`
- test ssr first build (`gatsby build`) then use: `firebase emulators:start`

# Utility functions
- install required modules: `npm install`
- local development required you define a few other variables in `.env`
- - set `FIREBASE_AUTH_EMULATOR_HOST` when you want to connect to the emulator, (usually to `localhost:9099`)
- - set `GOOGLE_DEFAULT_CREDENTIALS` to point at your firebase project's admin sdk key file
- Run scripts with `node <scriptname>`

# Website URL
https://artudoma.com/