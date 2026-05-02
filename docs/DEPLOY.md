# Deploy Guide

The fastest path from this codebase to a public URL.

---

## Local setup

```bash
git clone <your-repo-url>
cd wasta-v2
npm install
npm run dev
```

Open http://localhost:3000.

### Verify it builds

Before deploying anywhere, confirm the production build succeeds locally:

```bash
npm run build
npm run start
```

Visit http://localhost:3000 to confirm the production version renders correctly. (You need internet access for the Google Fonts fetch the first time.)

---

## Vercel (recommended for Phase 1)

### 1. Create a Vercel account

https://vercel.com — sign up with GitHub.

### 2. Push this codebase to GitHub

```bash
gh repo create wasta --private --source=. --push
# or manually:
git init
git add .
git commit -m "Initial drop"
git remote add origin git@github.com:your-handle/wasta.git
git push -u origin main
```

### 3. Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import" next to your `wasta` repo
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: leave blank (this is the repo root)
5. Environment variables: **none required** for Phase 1 (game is fully client-side, localStorage only)
6. Click **Deploy**

First deploy takes ~2 minutes. You'll get a URL like `wasta-xxx.vercel.app`. Done.

### 4. Custom domain (optional)

In Vercel → Settings → Domains, add your domain. Vercel provides DNS instructions.

For Bader specifically: a domain like `wasta.bader.kw` or `wasta.app` would work. Apple App Store later requires a real domain anyway.

---

## Production checklist before launch

- [ ] All Phase 1 voice review passed by Bader
- [ ] No English fallback strings in the player-facing path (run `grep -r "TODO" app/ components/ lib/data/`)
- [ ] Manifest + favicon for installable PWA (TODO Phase 4)
- [ ] Open Graph image for social sharing (TODO Phase 4)
- [ ] Vercel Analytics enabled (free tier)
- [ ] Sentry or similar error tracking
- [ ] Privacy policy if collecting any data (currently we don't — localStorage only)

---

## Capacitor → App Store (Phase 4)

When you're ready for App Store:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init wasta com.bader.wasta --web-dir=out

# Build static export
# (you'll need to add `output: "export"` to next.config.ts and resolve any
# server-only features — there are currently none in this codebase, so this
# should "just work")
npm run build

# Add iOS
npm install @capacitor/ios
npx cap add ios
npx cap copy ios
npx cap open ios   # opens in Xcode
```

In Xcode:
1. Select Team (your Apple Developer account)
2. Set Bundle Identifier to `com.bader.wasta` (must be unique on App Store)
3. Add app icons (1024×1024 + various sizes)
4. Add launch screen
5. Archive → upload to App Store Connect

Apple App Store requires:
- Apple Developer account ($99/year)
- App icons (1024×1024 minimum)
- Screenshots in 5 sizes
- Privacy policy URL
- App description in English + Arabic
- Age rating (likely 12+ for the prose intensity)

---

## Performance budget

Current bundle sizes (from `npm run build`):

| Route | Size | First Load JS |
|-------|------|---------------|
| / | 1.3 kB | 116 kB |
| /new | 3.0 kB | 118 kB |
| /play | 1.4 kB | 116 kB |
| /play/people | 2.7 kB | 118 kB |
| /play/places | 1.6 kB | 116 kB |
| /play/prologue | 41 kB | 156 kB |
| /play/quests | 2.2 kB | 117 kB |
| /play/you | 2.9 kB | 118 kB |

The prologue is the biggest because it bundles framer-motion. That's acceptable — it only loads once. Everything else stays under 120 kB First Load JS.

**Budget:** Don't let any single route exceed 200 kB First Load JS without a strong reason.

---

## Common gotchas

### "Cannot find module 'next/font/google'"

You need internet on first build (Google Fonts fetch). If you're in an air-gapped env, swap `next/font/google` for `next/font/local` and ship the .woff2 files in `/public/fonts/`.

### "localStorage is not defined" during build

Already handled — `lib/engine/persistence.ts` checks `typeof window === "undefined"` before touching localStorage. If you add new client-side persistence, do the same.

### Type errors after pulling latest

Run:

```bash
npm install
npm run type-check
```

If it still fails, delete `node_modules` and `.next` and reinstall.

### Save not persisting between deploys

Saves are localStorage — they're per-browser, not on Vercel. That's intentional for Phase 1. Cloud saves are Phase 4.

---

## When something breaks in production

1. Check Vercel deployment logs (https://vercel.com/your-project/deployments)
2. Check the browser console (F12)
3. Check `/lib/engine/persistence.ts` — most "I lost my save!" reports are schema mismatches after a `GameState` shape change. Bump `SCHEMA_VERSION` in `initialState.ts` and write a migration if you change the shape.
4. If still stuck, file an issue and ping Bader.
