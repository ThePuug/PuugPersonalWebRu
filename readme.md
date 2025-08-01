# Introduction
The purpose of this demo app was to showcase a custom developed scheduling and payment system that is mobile ready and integrated with Stripe payment provider.

# Getting started
- install node.js which includes npm from: https://nodejs.org/en/download/
- get the repo `git clone https://github.com/unliketea/PuugPersonalWebRu.git` 
- inside the checkout, install packages: `npm install`
- install required global packages: 
    - `npm install -g firebase-tools`
    - `npm install -g gatsby-cli`
- login or reauth: `firebase login` or `firebase login --reauth`
- setup an account at stripe.com and ensure the slider is set to `Test mode`
- define a few variables in `functions/.runtimeconfig.json`:
    - from stripe; developers -> API keys -> Secret key: `stripe.privatekey`
- define a few variables in `.env`: 
    - from stripe; developers -> API keys -> Publishable key: `GATSBY_STRIPE_PUBLIC_KEY`, 
    - from firebase console; Authentication -> Sign-in method -> Authorised domains: `GATSBY_FIREBASE_AUTH_DOMAIN`, 
    - from firebase console; Project settings -> Project ID: `GATSBY_FIREBASE_PROJECT_ID`
    - from firebase console; Project settings -> Web API Key: `GATSBY_FIREBASE_API_KEY`
- for local development, run `firebase emulators:start --only functions,auth,firestore` then you can use: `gatsby develop`
- to test ssr first build (`gatsby build`) then use: `firebase emulators:start`

# Using util
- install required modules: `npm install`
- local development requires you define a few other variables in `.env`
    - Uncomment `FIREBASE_AUTH_EMULATOR_HOST` when you want to connect to your local Auth emulator
    - Path to firebase admin sdk key file: `GOOGLE_DEFAULT_CREDENTIALS`; download from firebase console; Project settings -> Service accounts -> Generate new private key
- Run a utility with `node <scriptname>`

# Deploying
- firebase hosting is handled via a github action on push, which needs a few secrets defined (at Settings -> Secrets -> Actions)
    - run `firebase init hosting`, part of which will create FIREBASE_SERVICE_ACCOUNT_&lt;Project ID&gt;
    - from firebase console; Project settings -> Web API Key: `GATSBY_FIREBASE_API_KEY`
    - from stripe; developers -> API keys -> Publishable key: `GATSBY_STRIPE_PUBLIC_KEY`
- deploy firebase functions with `firebase deploy --only functions`
    - New https callable function require permissions for `allUsers` as `Function Invoker` at: https://console.cloud.google.com/functions/list?project=puugpersonalwebru
- deploy firebase firestore rules with `firebase deploy --only firestore:rules`

# Demo
https://puugpersonalwebru.web.app

you can "pay" for reservations using the stripe test cards: https://docs.stripe.com/testing#cards
