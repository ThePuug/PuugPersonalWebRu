# Migration playbook: Gatsby → Next.js (PuugPersonalWebRu / artudoma.com)

Handoff doc from the completed PuugPersonalWebLct migration (June 2026, merged & live).
This is NOT the binding spec — it's the playbook. Audit first, then write the binding
spec (exact file paths / exports / prop contracts) before any implementation.

## Proven process (from round 1 — follow it)

1. **Audit exhaustively before planning**: read every source file; list every
   framework-specific API actually used. Round 1's subtlest bug (antd v4 emitting
   `ant-row-${align}` classes blindly, making *invalid* prop values load-bearing)
   was only caught by line-level audit. Assume this codebase has equivalents.
2. **Version facts from the npm registry, not memory**:
   `curl https://registry.npmjs.org/-/package/<name>/dist-tags` (note: a package's
   `/latest` packument can contain a literal npm script named "version" — use dist-tags).
3. **Write a binding spec** in repo root with exact contracts, then implement with
   parallel agents on disjoint file sets, then an integrate/build fix-loop.
4. **Adversarial review after the build is green** (multi-lens review, skeptic
   verification per finding). Round 1's only post-build defect — a silently broken
   SSR style pipeline — was invisible to the build and caught only by review.
5. Feature branch → push → branch-preview channel → eyeball → PR merge to main → live.
   All work in a branch; main auto-deploys.

## Reusable artifacts — copy from ../PuugPersonalWebLct (don't rewrite)

- `next.config.mjs` — `output:'export'`, `trailingSlash:true`, `images:{unoptimized:true}`
- `jsconfig.json` (@/* → src/*)
- `.github/workflows/firebase-hosting-merge.yml` and `firebase-hosting-branch-preview.yml`
  (checkout@v5, setup-node@v6 node 24 cache npm, branch→slugified preview channelId).
  This repo currently has only a merge workflow.
- `firebase.json` pattern: hosting.public `"out"`; KEEP all existing rewrites/extras.
- `.gitignore` additions: `.next/`, `out/`; `public/` stays generated+ignored if the
  prebuild-generates-public pattern is used.
- `src/components/styled-components-registry.js` is NOT reusable here — this site is
  MUI/Emotion, needs `@mui/material-nextjs` + Emotion cache registry instead.

## Round-1 gotchas that recur (mechanical — put in the spec)

- Next 16: `params` is a Promise (`await params` in pages + generateMetadata);
  `app/manifest.js` needs `export const dynamic = 'force-static'` under output:'export';
  `dynamicParams = false` on generated routes.
- Turbopack RSC: property access on client-component references returns `undefined`
  in server modules (e.g. `Typography.Title`). Fix: a `'use client'` re-export module.
  MUI's top-level exports mostly dodge this, but watch any `X.Y` component access.
- Duplicate CSS-in-JS runtime hoisting silently kills SSR style extraction (round 1:
  cssinjs v2 hoisted over antd's v1 → unstyled first paint; build stayed green).
  Here the equivalent is Emotion: after install run `npm ls @emotion/react @emotion/cache`
  and verify exported HTML `<head>` contains the SSR style tags on EVERY page.
- CI `cache: npm` + `npm ci` require the fresh `package-lock.json` committed.
- Static export → Firebase: trailingSlash:true reproduces Gatsby's dir/index.html
  structure so URLs don't change.
- MDX→ likely N/A here: no .mdx content exists; gatsby-plugin-mdx looks vestigial — confirm, then drop.

## Ru-specific risks (front-load spikes on the two RED items before writing the spec)

1. **RED — react-firebaseui is dead** (unmaintained, peer React ≤17; this repo is
   React 17). It cannot move to React 19/Next 16. Sign-in UI (src/components/SignIn.js)
   must be rebuilt: plain `firebase/auth` flows or vanilla `firebaseui-web` via dynamic
   import with ssr:false. Spike this FIRST — it shapes the auth architecture.
2. **RED — i18n × static export**: Next's built-in `i18n` config is incompatible with
   `output:'export'`. gatsby-plugin-react-i18next config: languages ['bg','en'],
   defaultLanguage 'bg', redirect:false, generateDefaultLanguagePage:true — meaning
   both unprefixed AND /bg/ + /en/ URLs likely exist. CURL THE LIVE SITE (artudoma.com)
   during audit to enumerate the real URL set; replicate exactly via an app/[locale]/
   segment (+ possibly duplicate unprefixed routes) with generateStaticParams.
   react-i18next can stay (client) or move to next-intl — decide in spec.
3. **ORANGE — Firebase JS SDK v8 → modular**: v8 namespaced API is ancient (current
   v11+); gatsby-plugin-firebase dies with Gatsby anyway. Rewrite src/firebase.js as
   a plain modular-SDK init module; env vars rename GATSBY_FIREBASE_* → NEXT_PUBLIC_*
   (a `.env` exists in repo root, gitignored — check which vars CI needs too).
4. **ORANGE — React 17→19 + MUI 5.5 (March 2022) → current**: check for `@mui/styles`
   (legacy JSS — incompatible with React 18+; rewrite to sx/styled) and alpha-era
   `@mui/core` / `@mui/lab` imports (APIs moved/renamed). Also `gatsby-plugin-material-ui`
   and TopLayout.js / gatsby-ssr.js style injection → replaced by the MUI App Router
   registry. luxon ^1 → bump to ^3 (check API usage: most code ports cleanly).
5. **ORANGE — verification is browser-level here**: auth + Stripe + booking flows can't
   be verified by grepping static HTML (round 1's method). Plan a real browser pass on
   the preview channel: sign-in, booking flow, Stripe test-mode payment. The Pay.js /
   View.js / Loads.js components talk to functions/ + Firestore — exercise them.
6. **Same boundary as round 1**: `functions/`, `firestore.rules`, `firestore.indexes.json`,
   Stripe backend — UNTOUCHED. Frontend-only migration. Check firebase.json rewrites
   before changing anything.
7. Target stack to validate at spec time (re-check dist-tags): next ^16.2.x,
   react ^19.2.x, @mui/material + @mui/icons-material + @mui/lab current (v7?),
   @mui/material-nextjs, @emotion/react+styled+cache, firebase ^11/12, stripe libs current.

## Environment facts (this machine)

- Node 24 at `C:\Program Files\nodejs` — NOT on the harness shell PATH; invoke as
  `& "C:\Program Files\nodejs\npm.cmd"` (PowerShell) or prepend to PATH. npm scripts
  spawning `node` need the dir on PATH too. CI uses setup-node so unaffected.
- `gh` CLI authenticated. Repo remote: github.com/ThePuug/PuugPersonalWebRu (verify).
- Reference implementation (completed, live): ../PuugPersonalWebLct — read its
  src/app/layout.js, workflows, scripts/prebuild.mjs, and git history (PR #2) for
  worked examples of every pattern above.
- GA4: round 1's tracking ID was invalid/dead for years — check what this site uses
  (no gtag plugin seen in gatsby-config; confirm whether analytics exists at all).

## Definition of done (round-1 standard)

Green static export of every current URL; SSR styles verified in exported HTML;
adversarial review passed; CI green on branch; preview channel manually verified
(incl. auth/payment flows); merged to main; production curl-verified.
