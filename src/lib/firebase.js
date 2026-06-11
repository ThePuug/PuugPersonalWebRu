import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, signOut } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

const app = getApps().length ? getApp() : initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
})
export const auth = getAuth(app)
export const db = getFirestore(app)
export const fns = getFunctions(app, 'europe-central2')   // region is load-bearing

export const isBrowser = () => typeof window !== 'undefined'
if (isBrowser() && window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectFunctionsEmulator(fns, 'localhost', 5001)
}

export const getUser = () => isBrowser() && window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : {}
export const setUser = (user) => isBrowser() && window.localStorage.setItem('user', JSON.stringify(
  user && user.uid ? { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL } : {}))
export const isLoggedIn = () => !!getUser().email
export const logout = () => signOut(auth).then(() => setUser({}))
