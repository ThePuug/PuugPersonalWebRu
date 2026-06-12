# BINDING SPEC: Gatsby → Next.js migration (PuugPersonalWebRu)

Implementation agents: follow this exactly. Where this spec quotes code, the contract is the
quoted code. The old source files are the behavioral reference — port logic verbatim unless a
deviation is listed in §13. Audit evidence lives in `.audit/` (do not commit that directory).

## 1. Target stack (registry-verified 2026-06-11 — do not "upgrade" further)

```
next ^16.2.9            react ^19.2.7           react-dom ^19.2.7
@mui/material ^9.1.1    @mui/icons-material ^9.1.1   @mui/material-nextjs ^9.1.1
@mui/x-date-pickers ^9.5.0
@emotion/react ^11.14.0 @emotion/styled ^11.14.1     @emotion/cache ^11.14.0
firebase ^12.14.0       @stripe/stripe-js ^9.8.0     @stripe/react-stripe-js ^6.6.0
react-i18next ^17.0.8   i18next ^26.3.1              luxon ^3.7.2
dotenv ^17.4.2 (util script)   firebase-admin ^10.0.2 (KEEP, util script)   inquirer ^8.2.1 (KEEP, util script)
```

REMOVED: every `gatsby*`, `@mdx-js/*`, `@mui/core`, `@mui/styles`, `@mui/lab`,
`@emotion/babel-plugin`, `query-string`, `react-firebaseui`, `react-helmet`,
`i18next-xhr-backend`.

MUI note: `@mui/lab` pickers moved to `@mui/x-date-pickers` (peer `@mui/material ^7.3 || ^9`,
`luxon ^3`). `@mui/material-nextjs` import subpath is **`/v16-appRouter`**.

## 2. URL contract (verified live on https://puugpersonalwebru.web.app)

Static export must emit exactly these HTML routes (dir/index.html, `trailingSlash: true`):

```
/            /bg/            /en/             (bg content on / — / duplicates /bg/)
/book/       /bg/book/       /en/book/
/policies/   /bg/policies/   /en/policies/
/404/        /bg/404/        /en/404/
404.html     (copy of /404/index.html — Firebase miss handler)
/manifest.webmanifest   /favicon-32x32.png   /icons/icon-{48,72,96,144,192,256,384,512}x*.png
/images/*    (site images, new stable URLs replacing Gatsby /static/<hash>/)
```

NO robots.txt, NO sitemap.xml (they 404 today; do not add).
manifest.webmanifest contains ONLY an icons array (48–512), no name/start_url/display.

## 3. Repo-root files

### next.config.mjs
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  compiler: { emotion: true },
}
export default nextConfig
```

### jsconfig.json — copy from ../PuugPersonalWebLct verbatim (`@/*` → `./src/*`).

### package.json
Keep name/version/private/description/author. Drop "gatsby" keyword. Scripts:
```json
"develop": "next dev", "start": "next dev", "build": "next build",
"prebuild": "node scripts/prebuild.mjs", "predevelop": "node scripts/prebuild.mjs",
"prestart": "node scripts/prebuild.mjs", "postbuild": "node scripts/postbuild.mjs",
"serve": "npx serve out"
```
`"engines": { "node": ">=20" }`. Dependencies per §1.

### .gitignore — keep all current lines (incl. unanchored `public` — public/ is generated);
ADD `.next/` and `out/`.

### firebase.json — single change: `hosting.public` `"public"` → `"out"`. Everything else
(emulators, firestore, functions blocks, ignore list) byte-identical.

### DELETE: gatsby-config.js, gatsby-node.js, gatsby-ssr.js, gatsby-browser.js, **.babelrc**
(a .babelrc would knock Next off SWC/Turbopack), src/pages/ (all 4), src/components/TopLayout.js,
src/firebase.js (replaced by src/lib/firebase.js).

### scripts/prebuild.mjs  (public/ is 100% generated; stays gitignored)
```js
import fs from 'fs'
import path from 'path'
const root = process.cwd()
const pub = path.join(root, 'public')
fs.rmSync(pub, { recursive: true, force: true })
fs.mkdirSync(path.join(pub, 'icons'), { recursive: true })
fs.cpSync(path.join(root, 'src', 'images'), path.join(pub, 'images'), { recursive: true })
for (const s of [48, 72, 96, 144, 192, 256, 384, 512])
  fs.copyFileSync(path.join(root, 'src', 'icons', `icon-${s}x${s}.png`), path.join(pub, 'icons', `icon-${s}x${s}.png`))
fs.copyFileSync(path.join(root, 'src', 'icons', 'favicon-32x32.png'), path.join(pub, 'favicon-32x32.png'))
fs.copyFileSync(path.join(root, 'src', 'manifest.webmanifest'), path.join(pub, 'manifest.webmanifest'))
```

### scripts/postbuild.mjs
Next's exporter clobbers `out/404/index.html` with its built-in not-found page. postbuild
copies `out/bg/404/index.html` (our real 404 render) over BOTH `out/404/index.html` and
`out/404.html`, failing loudly if the source is missing.

### src/manifest.webmanifest — static file, exactly:
```json
{"icons":[{"src":"icons/icon-48x48.png","sizes":"48x48","type":"image/png"},{"src":"icons/icon-72x72.png","sizes":"72x72","type":"image/png"},{"src":"icons/icon-96x96.png","sizes":"96x96","type":"image/png"},{"src":"icons/icon-144x144.png","sizes":"144x144","type":"image/png"},{"src":"icons/icon-192x192.png","sizes":"192x192","type":"image/png"},{"src":"icons/icon-256x256.png","sizes":"256x256","type":"image/png"},{"src":"icons/icon-384x384.png","sizes":"384x384","type":"image/png"},{"src":"icons/icon-512x512.png","sizes":"512x512","type":"image/png"}]}
```
(src/icons/*.png already committed — downloaded from live site.)

## 4. CI workflows (.github/workflows/)

REPLACE firebase-hosting-merge.yml and ADD firebase-hosting-branch-preview.yml, modeled on
../PuugPersonalWebLct (checkout@v5, setup-node@v6 node 24 cache npm, `npm ci && npm run build`,
FirebaseExtended/action-hosting-deploy@v0). Differences from Lct:
- projectId: `puugpersonalwebru`; service account secret `FIREBASE_SERVICE_ACCOUNT_PUUGPERSONALWEBRU`.
- Build env:
```yaml
env:
  NEXT_PUBLIC_FIREBASE_API_KEY: '${{ secrets.GATSBY_FIREBASE_API_KEY }}'
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'puugpersonalwebru.web.app'
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'puugpersonalwebru'
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY: 'pk_test_51JC43B…'   # hardcoded — publishable keys are public;
  # the GATSBY_STRIPE_PUBLIC_KEY secret held a DIFFERENT Stripe account's key (pk_test_51KYXXP…),
  # which broke confirmCardPayment in production (cross-account client_secret). The backend's
  # functions.config().stripe.privatekey is on the 51JC43B account.
```
(AUTH_DOMAIN hardcoded value preserved verbatim from old workflow — auth popups depend on it.)
- Branch-preview: trigger on push to branches-ignore main; slugified `channelId` step copied from Lct;
  `FIREBASE_CLI_PREVIEWS: hostingchannels` env on deploy step. NO DISCORD_TOKEN anywhere.

## 5. App Router structure — two root layouts (route groups), 12 pages

```
src/app/(bg)/layout.js        ← root layout, <html lang="bg">, locale "bg", serves /, /book/, /policies/, /404/
src/app/(bg)/page.js
src/app/(bg)/book/page.js
src/app/(bg)/policies/page.js
src/app/(bg)/404/page.js
src/app/[locale]/layout.js    ← root layout, <html lang={locale}>, serves /bg/*, /en/*
src/app/[locale]/page.js
src/app/[locale]/book/page.js
src/app/[locale]/policies/page.js
src/app/[locale]/404/page.js
```
There is NO src/app/layout.js and NO not-found.js (404.html comes from postbuild copy).

### src/components/shell.js (server component — shared by both layouts)
```js
import Providers from '@/components/providers'

export const sharedMetadata = {
  title: 'Regain Us',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/favicon-32x32.png', type: 'image/png' }],
    apple: [48, 72, 96, 144, 192, 256, 384, 512].map(s => ({ url: `/icons/icon-${s}x${s}.png`, sizes: `${s}x${s}` })),
  },
}
export const sharedViewport = { width: 'device-width', initialScale: 1, minimumScale: 1 }

export default function Shell({ locale, children }) {
  return (
    <html lang={locale}>
      <body>
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet" />
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  )
}
```
(React 19 hoists the `<link>` into `<head>`.)

### src/app/(bg)/layout.js
```js
import Shell, { sharedMetadata, sharedViewport } from '@/components/shell'
export const metadata = sharedMetadata
export const viewport = sharedViewport
export default function RootLayout({ children }) {
  return <Shell locale="bg">{children}</Shell>
}
```

### src/app/[locale]/layout.js — Next 16: params is a Promise
```js
import Shell, { sharedMetadata, sharedViewport } from '@/components/shell'
export const metadata = sharedMetadata
export const viewport = sharedViewport
export const dynamicParams = false
export function generateStaticParams() { return [{ locale: 'bg' }, { locale: 'en' }] }
export default async function RootLayout({ children, params }) {
  const { locale } = await params
  return <Shell locale={locale}>{children}</Shell>
}
```

### Route pages — thin wrappers around views. All four pairs identical shape:
```js
// (bg)/page.js and [locale]/page.js
import HomeView from '@/views/home'
export default function Page() { return <HomeView /> }
```
book pages are plain wrappers too (the view reads `?for=` from window.location in a lazy
useState initializer instead of useSearchParams — useSearchParams suspends the whole page
during prerender under output:'export', which would export an empty /book/ shell).
policies → `@/views/policies`; 404 → `@/views/not-found`. `[locale]` pages do NOT need params
(locale flows through the layout's Providers). Do NOT add generateStaticParams to leaf pages —
the layout's applies.

## 6. Providers + Emotion SSR (the round-1 silent killer — get this exact)

### src/components/providers.js
```js
'use client'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import theme from '@/theme'
import I18nProvider from '@/components/i18n-provider'

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function Providers({ locale, children }) {
  return (
    <AppRouterCacheProvider options={{ key: 'css', prepend: true }}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <Elements stripe={stripe}>
            <I18nProvider locale={locale}>
              <CssBaseline />
              {children}
            </I18nProvider>
          </Elements>
        </LocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
```
- `key:'css', prepend:true` replaces `StyledEngineProvider injectFirst`; key `'css'` makes the
  emotion `css` prop share the SSR-extracted cache.
- Old TopLayout order preserved: Theme → (engine) → Localization → Elements → CssBaseline.
- src/theme.js: keep file content EXACTLY as today (custom palette keys yellow/pink/teal/blue/
  purple/orange/red/freeSlot/mySlot/bookedSlot). It is imported only from client modules.

### Emotion `css` prop
Every ported component keeps its `css={{...}}` props verbatim. `compiler: { emotion: true }`
must transform them. **Build-loop verification (mandatory):**
1. `npm ls @emotion/react @emotion/cache` → single version each, no duplicates.
2. `Select-String 'css="\[object Object\]"' out/**/*.html` → MUST be zero matches. If not zero,
   the transform is off — fix by adding `/** @jsxImportSource @emotion/react */` as line 1 of
   every file using the css prop (views home/book/policies, components Pay/SignIn/View/Nav/Footer).
3. Every out/**/index.html `<head>` must contain non-empty `<style data-emotion` rules.

## 7. i18n (react-i18next, client-side, resources bundled)

### src/lib/locales.js — static resource map
14 static imports: `import bgBook from '../../locales/bg/book.json'` … for ns
`book, index, policies, _footer, _pay, _signIn, _view` × `bg, en`.
`export default { bg: {...}, en: {...} }` keyed by namespace.

### src/components/i18n-provider.js
```js
'use client'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { createContext, useContext, useMemo, forwardRef } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import resources from '@/lib/locales'

const LocaleContext = createContext('bg')
export const languages = ['bg', 'en']

export default function I18nProvider({ locale, children }) {
  const i18n = useMemo(() => {
    const instance = createInstance()
    instance.use(initReactI18next).init({
      resources, lng: locale, fallbackLng: 'bg',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      returnObjects: false,
    })
    return instance
  }, [locale])
  return (
    <LocaleContext.Provider value={locale}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)

// Drop-in for gatsby-plugin-react-i18next's <Link to language>: ALWAYS locale-prefixes
// (live site evidence: on "/", logo renders href="/bg/", footer href="/bg/policies").
export const Link = forwardRef(function Link({ to, language, ...rest }, ref) {
  const locale = useLocale()
  return <NextLink ref={ref} href={`/${language ?? locale}${to}`} {...rest} />
})

// Drop-in for useI18next(): { languages, originalPath }
export function useI18next() {
  const pathname = usePathname() || '/'
  const originalPath = pathname.replace(/^\/(bg|en)(?=\/|$)/, '') || '/'
  return { languages, originalPath }
}
```
Notes: `t('date', {val, formatParams})` against `"date": "{{val, datetime}}"` uses i18next's
built-in Intl formatter (works in v26; locale comes from lng). `returnObjects: true` is passed
per-call in index view — do not set it globally. `Trans` imports move from
'gatsby-plugin-react-i18next' to 'react-i18next'. `useTranslation` imports likewise.

### Locale JSON edits (the ONLY content edits)
1. **locales/en/_pay.json**: rename top-level key `"resolve"` → `"resolvers"` (fixes the
   pre-existing broken English payment-error lookups; bg already says `resolvers`).
2. **locales/bg/_signIn.json + locales/en/_signIn.json**: add keys for the rebuilt SignIn:
   en: `"signInWithGoogle": "Sign in with Google"`, `"signInWithFacebook": "Continue with Facebook"`,
   `"errors": { "signInFailed": "Sign-in failed. Please try again.", "accountExists": "An account already exists with this email — try the other sign-in provider." }`
   bg: `"signInWithGoogle": "Вход с Google"`, `"signInWithFacebook": "Продължи с Facebook"`,
   `"errors": { "signInFailed": "Неуспешен вход. Моля, опитайте отново.", "accountExists": "Вече съществува акаунт с този имейл — опитайте с другия доставчик." }`
   Preserve existing keys and file encoding (UTF-8, no BOM).

## 8. Firebase — src/lib/firebase.js (modular v12)

```js
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
```
localStorage key `"user"` and the four fields uid/email/displayName/photoURL are a CONTRACT
(consumed by book/Pay/Nav/SignIn). Mechanical call-site rewrites:
- `firebase.auth().onAuthStateChanged(cb)` → `onAuthStateChanged(auth, cb)` (import from 'firebase/auth')
- `firebase.app().functions("europe-central2").httpsCallable(N)(d)` → `httpsCallable(fns, N)(d)` (import from 'firebase/functions'); response `.data` shape unchanged
- `firebase.firestore().collection("bookings").where(A).where(B).get()` →
  `getDocs(query(collection(db, 'bookings'), where(A), where(B)))` ('firebase/firestore');
  `snapshot.forEach`, `doc.id`, `doc.data()`, `data.date.toDate()` all unchanged
- `user.getIdTokenResult().then(t => t.claims)` — unchanged (method on modular User)

## 9. Rebuilt SignIn (react-firebaseui is dead — plain firebase/auth, NO firebaseui)

src/components/SignIn.js, `'use client'`. Props contract unchanged:
`{ onSuccess, onClose, ...rest }` with `open` in rest; renders `Loads(Dialog)` maxWidth="xs",
`css={{textAlign:'center'}}`, ns `_signIn`.

- Signed-in branch (dialog doubles as account/logout UI — Nav depends on it):
  `{t("signedInAs")} {getUser().displayName}` + `<Button variant="outlined" color="secondary">Log out</Button>`
  (label stays hardcoded English) → `await logout(); onClose()`.
- Signed-out branch: `{t('signInToProceed')}` + two stacked contained Buttons:
  `t('signInWithGoogle')` and `t('signInWithFacebook')`, disabled while loading.
- Handler (ORDER IS LOAD-BEARING — setUser BEFORE onSuccess, see book.js handleBookNow re-entrancy):
```js
const handleSignIn = async (makeProvider) => {
  setLoading(true); setError(null)
  try {
    const result = await signInWithPopup(auth, makeProvider())
    setUser(result.user)
    onSuccess()
  } catch (err) {
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {}
    else if (err.code === 'auth/account-exists-with-different-credential') setError(t('errors.accountExists'))
    else setError(t('errors.signInFailed'))
  } finally { setLoading(false) }
}
```
- Providers constructed inside the click handlers, scopes verbatim:
  Google: `new GoogleAuthProvider()` + `addScope('https://www.googleapis.com/auth/userinfo.profile')`
  Facebook: `new FacebookAuthProvider()` + `addScope('user_birthday')` + `addScope('public_profile')`
- Error display: `FormHelperText error` under the buttons. `loading` drives the Loads wrapper.
- Track signed-in state with a useState(false) + onAuthStateChanged effect (NOT
  `isLoggedIn()` as initial state — hydration). The observer fires immediately on subscribe.

## 10. Views (src/views/) — ports of src/pages/

All `'use client'`. Import swaps everywhere: `useTranslation`/`Trans` from 'react-i18next';
`Link`/`useI18next` from '@/components/i18n-provider'; firebase per §8; components via relative
or `@/` paths. Keep every css prop, styled-component, MUI prop — including the INVALID ones
(`Typography variant="title"`, `variant="subtitle"`, `Button color="grey" fontSize="large"`,
`IconButton variant=...`, string `active="true"`, `status` leaking to DOM, `.MuiButton-root`
selectors, `[data-selected=true]`) — they are load-bearing appearance. Do NOT fix them.

### src/views/home.js  (from src/pages/index.js)
- Remove `graphql` query + gatsby imports.
- `StaticImage` → plain `<img>`:
  `<img src="/images/mind.jpg" alt={t('individualConsultation')} style={{ width: '100%', aspectRatio: '2 / 1', objectFit: 'cover', display: 'block' }} />`
  (same for opening.jpg, exploration.jpg; profile.jpg gets `aspectRatio: '0.667'`, i.e. 2/3).
- `navigate("book?for=X")` → RELATIVE resolution preserved (locale prefix must survive):
```js
const router = useRouter()            // next/navigation
const pathname = usePathname() || '/'
const navigate = (rel) => router.push(pathname.endsWith('/') ? pathname + rel : pathname + '/' + rel)
// usage unchanged: navigate("book?for=individual")
```

### src/views/book.js  (from src/pages/book.js — the critical port)
- Drop `withLocation`/@reach/router/query-string. sessionType initial state:
  `useState(() => (isBrowser() ? new URLSearchParams(window.location.search).get('for') : null) || 'individual')`
  (NOT useSearchParams — it suspends the whole page during static prerender. sessionType is
  invisible until a drawer opens, so the server/client initializer difference cannot mismatch.)
- Hydration fixes (the ONLY logic changes):
  - `useState(isLoggedIn())` (Page + _Slot) → `useState(false)`; existing onAuthStateChanged
    effects already sync it on mount.
  - Add `const [mounted, setMounted] = useState(false)` + `useEffect(() => setMounted(true), [])`
    to Page; wrap ONLY the calendar block — `{mounted && <Loads component={Calendar} ...>…</Loads>}`
    (the `<FormControl>`/`<FormLabel>` shell stays SSR; drawers/dialogs/SignIn/Pay/View stay
    as-is — they render closed on the server).
- Firestore/functions/auth rewrites per §8 (`stripePaymentIntent` response `.data` is the bare
  client_secret string — unchanged).
- luxon: import unchanged (`DateTime, Duration` from 'luxon') — v3 API-compatible for every
  call used. Keep createSlots Sofia-time math verbatim.
- i18next date formatting calls verbatim (raw DateTime `val`s included — they coerce via valueOf).

### src/views/policies.js  (from src/pages/policies.js)
- Port verbatim EXCEPT: the one `<Typography variant="body1" paragraph>` that contains a `<ul>`
  (the "Using Your Personal Data" block) gets `component="div"` added (prevents React 19
  hydration error from invalid <ul>-in-<p>; visually identical — MuiTypography classes control
  margins, not the tag).

### src/views/not-found.js  (from src/pages/404.js)
`const NotFound = () => <>Page not found.</>` — no 'use client' needed, no i18n, no Nav/Footer.

## 11. Component ports (src/components/)

- **Loads.js** — unchanged file content (no gatsby imports). No 'use client' (inherits).
- **Footer.js** — `'use client'`; Link from i18n-provider (`to="/"`, `to="/policies"` —
  rendered hrefs become /bg/, /bg/policies etc. exactly like live); useTranslation('_footer');
  keep styled pink Container + `new Date().getFullYear()`.
- **Nav.js** — `'use client'`; logo: `<Link to="/"><img src="/images/logo.png" width={75} alt="" style={{display:'block'}} /></Link>`;
  language switcher verbatim (`<Button to={originalPath} language="bg" component={Link} data-selected={i18n.language === 'bg'}>БГ</Button>` + en twin)
  with Link/useI18next from i18n-provider; `useTranslation()` (NO '_nav' ns — it doesn't exist);
  `useState(false)` for isSignedIn (hydration) + existing observer effect; Avatar
  `src={getUser().photoURL}` only renders when isSignedIn (client-only) — keep.
- **Pay.js** — `'use client'`; Stripe imports/flow/CARD_OPTIONS/RefCardElement forwardRef
  verbatim (CardElement + confirmCardPayment still current API); `httpsCallable(fns,'createBooking')`;
  Trans/useTranslation from react-i18next.
- **View.js** — `'use client'`; DateTimePicker modernization (the ONE real rewrite):
  `import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'`;
  `<DateTimePicker label={t('labels.date')} value={date || null} onChange={v => setDate(v)} />`
  (renderInput is REMOVED in x-date-pickers; default TextField slot is fine). Empty value is
  `null`, never `""`: initial state `useState(null)`, reset `setDate(event.date || null)`.
  Everything else verbatim (claims gating, Slide animation with container ref, callables per §8).
- **SignIn.js** — per §9.

## 12. Env vars

`.env` additions (DONE BY THE ORCHESTRATOR, not agents — contains key values):
`NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`,
`NEXT_PUBLIC_FIREBASE_PROJECT_ID` (copied from GATSBY_*), `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
(copied from GATSBY_STRIPE_PUBLIC_KEY). Old GATSBY_* lines stay (harmless).
Code references EXACTLY these four NEXT_PUBLIC_ names. GATSBY_STRIPE_PUBLIC_KEY_RU is dead — ignore.

## 13. Deliberate deviations from live production (everything else must match)

1. `<html lang>` correct per tree: bg on `/` + `/bg/`, en on `/en/` (live wrongly says "en" everywhere).
2. Degenerate `<link rel="canonical" href="/">` + broken hreflang alternates: DROPPED, not replicated.
3. Emotion SSR styles actually present in `<head>` (live ships an EMPTY data-emotion style tag).
4. en/_pay.json `resolve` → `resolvers` (fixes broken English payment-error text).
5. policies: one Typography gets component="div" (kills hydration error; visually identical).
6. SignIn UI: two MUI buttons replace FirebaseUI's styled buttons (providers/scopes/behavior contract preserved).
7. Gatsby internals (/page-data/*, /static/*, chunk-map.json, webpack.stats.json) not reproduced; /_next/* appears instead.
8. `/bg/404.html` + `/en/404.html` file URLs not emitted (the dir routes /bg/404/ + /en/404/ ARE).
9. Single viewport meta (live has two); no `generator` meta; manifest icon URLs without `?v=` hash.
10. Calendar block on /book/ renders after mount (live prerenders it with build-date dates — a
    hydration bomb under React 19).

## 14. Build & verify (orchestrator)

Node 24: `& "C:\Program Files\nodejs\npm.cmd"`; prepend `C:\Program Files\nodejs` to PATH for
npm scripts that spawn node. Fresh `package-lock.json` MUST be committed (CI cache: npm).
Sequence: npm install → npm run build → §6 emotion checks → URL-set check (every §2 route
exists in out/) → per-page title/lang/content spot-checks → adversarial review workflow →
push branch → CI + preview channel → PR. functions/, firestore.rules, firestore.indexes.json,
util/ are UNTOUCHED (never run bare `firebase deploy`).
