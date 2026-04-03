# Skin App — All 3 Phases Complete

> Personalized skincare recommendations for Indian users.
> Free to run. AI-powered. Mobile-first. Dark mode ready.

---

## Table of Contents

1. [What this app does](#what-this-app-does)
2. [Complete feature list](#complete-feature-list)
3. [How the full app works](#how-the-full-app-works)
4. [Folder structure](#folder-structure)
5. [Tech stack — what, why, cost](#tech-stack--what-why-cost)
6. [Every file explained](#every-file-explained)
7. [All API routes](#all-api-routes)
8. [Database design](#database-design)
9. [Auth system](#auth-system)
10. [Session system](#session-system)
11. [Theme system — dark mode](#theme-system--dark-mode)
12. [PWA — installable on Android and iOS](#pwa--installable-on-android-and-ios)
13. [Environment variables](#environment-variables)
14. [How to run locally](#how-to-run-locally)
15. [How to deploy](#how-to-deploy)
16. [Commit history](#commit-history)

---

## What this app does

Most skincare advice is generic. This app is not.

It asks 6 questions about your skin — type, concerns, goals, climate, age, budget — and gives you a complete personalized plan built specifically for Indian skin and Indian brands.

**Three things the app does:**

**1. Skin analysis**
Complete AI-powered skincare plan: 5 products with exact reasons why each suits your skin, ingredients to avoid, 5 foods that improve your specific concerns, morning and night routines.

**2. Product compatibility checker**
Found a product on Nykaa or Amazon? Paste the link or ingredient list. The app checks every ingredient against your skin profile and gives a compatibility score from 0 to 100, with a breakdown of what helps and what harms.

**3. Routine tracker**
Check off your morning and night routine daily. Builds a streak. Saves your history so you can see how your skin profile changes over time.

---

## Complete feature list

### Phase 1 — Foundation
- 6-question skin quiz with single and multi-select
- AI-generated product recommendations (5 products, Indian brands first)
- Ingredients to avoid with reasons
- Food suggestions for your skin concerns
- Morning and night routine steps
- Anonymous sessions — no login required
- Results saved to browser and database
- Returning user flow — skip or retake quiz
- Pushed to GitHub

### Phase 2 — Product Analyser
- Product compatibility checker
- Input via link, ingredient text, or screenshot description
- Compatibility score 0–100
- Per-ingredient breakdown — beneficial, harmful, neutral
- Verdict — yes, no, or caution — with reason
- Alternative product suggestion when verdict is no or caution
- Bottom navigation — My Profile and Check Product tabs

### Phase 3 — Accounts, Tracker, PWA
- Google login (OAuth)
- Email magic link login (no password, no SMS, free)
- Auth callback route
- User profiles saved to account — accessible from any device
- Quiz history — every past result saved and viewable
- Daily routine tracker with streak counter
- Settings menu — slide-up panel from bottom
- Dark mode — system default, light, or dark — user's choice
- Bold modern UI with CSS variables throughout
- Mobile-first design — large pill navigation, thumb-friendly buttons
- PWA manifest and service worker
- Installable on Android and iOS from browser
- Offline support for cached pages
- Deployed to Vercel on HTTPS

---

## How the full app works

### First time user
```
Opens app → app reads localStorage → nothing found
→ New session ID generated and saved to localStorage
→ Quiz shown — mandatory first time, no skip
→ User answers 6 questions
→ Skin profile built from answers
→ POST /api/recommend with profile + sessionId
→ Gemini AI generates recommendations
→ Result saved to Supabase (skin_profiles table)
→ Result saved to localStorage
→ Results page shown
→ Bottom nav appears — My Profile, Check Product, Routine
```

### Returning anonymous user
```
Opens app → localStorage has session ID and result
→ Welcome back screen shown
→ Shows skin type and concerns as reminder
→ "See my results" → results immediately, no loading
→ "Save to account" → Login screen (optional)
→ "Retake quiz" → new session, fresh start
```

### Logged in user
```
Opens app → Supabase session found
→ getUserProfile(userId) called
→ Profile exists → show welcome back or cached results
→ Profile not found → send to quiz
→ After quiz → saveUserProfile + saveQuizHistory called
→ Results tied to account, accessible from any device
```

### Product analyser flow
```
Tap "Check Product" in bottom nav
→ Choose: Link, Ingredients, or Screenshot
→ Paste content
→ POST /api/analyse with content + sessionId + auth token
→ API fetches skin profile (from user account if logged in, else anonymous session)
→ Gemini analyses every ingredient against skin profile
→ Returns score, verdict, three ingredient lists
→ User sees result instantly
```

### Settings flow
```
Tap ··· button in top bar
→ Settings panel slides up from bottom
→ Three theme options: System default, Light, Dark
→ Selection saved to localStorage
→ Applied to <html data-theme> instantly
→ Sign out option if logged in
```

---

## Folder structure

```
skin-app/
│
├── app/
│   ├── page.tsx                  → Main page, all app states managed here
│   ├── layout.tsx                → Root layout, ThemeProvider, ServiceWorker
│   ├── globals.css               → CSS variables for light and dark mode
│   │
│   └── api/
│       ├── recommend/
│       │   └── route.ts         → Quiz → Gemini → Supabase → result
│       └── analyse/
│           └── route.ts         → Product → Gemini → ingredient analysis
│       └── auth/
│           └── callback/
│               └── route.ts     → Google OAuth callback handler
│
├── components/
│   ├── Quiz.tsx                  → 6-question quiz UI
│   ├── Results.tsx               → Results with current/history tabs
│   ├── Analyser.tsx              → Product compatibility checker
│   ├── Login.tsx                 → Google + email magic link login
│   ├── RoutineTracker.tsx        → Daily routine with streak
│   ├── QuizHistory.tsx           → Past quiz results list
│   ├── SettingsMenu.tsx          → Slide-up settings with theme toggle
│   ├── ThemeProvider.tsx         → Theme context, system/light/dark
│   └── ServiceWorker.tsx         → Registers SW in production only
│
├── lib/
│   ├── ai.ts                     → All Gemini calls (analyseSkin, analyseProduct)
│   ├── supabase.ts               → All DB and auth functions
│   └── questions.ts              → Quiz questions and options
│
├── types/
│   └── skin.ts                   → All TypeScript types
│
├── public/
│   ├── manifest.json             → PWA manifest
│   ├── sw.js                     → Service worker
│   └── icons/
│       ├── icon-192.png          → App icon (Android)
│       └── icon-512.png          → App icon (iOS splash)
│
├── .env.local                    → Secret keys (never pushed)
├── .gitignore                    → Excludes .env.local
├── README.md                     → This file
└── package.json                  → Dependencies
```

---

## Tech stack — what, why, cost

### Next.js on Vercel
**What:** Full-stack React framework. Frontend pages and backend API routes in one project.
**Why:** No separate server needed. One deployment handles everything. Free on Vercel hobby plan.
**Why not plain React:** Plain React needs a separate backend. Next.js combines both.
**Cost:** Free forever.

### Google Gemini API
**What:** AI model powering recommendations and ingredient analysis.
**Why over ChatGPT or Claude:** Gemini 1.5 Flash is the only major AI with a genuine free tier — 1 million tokens per day, 15 requests per minute.
**Why not manual logic:** Manual if-else rules break the moment a new ingredient or concern exists. AI reasons through context like a dermatologist.
**Cost:** Free up to 1M tokens/day. One quiz ≈ 1,500 tokens. One analysis ≈ 800 tokens.

### Supabase
**What:** Hosted PostgreSQL database with auth, dashboard, and pgvector.
**Why:** Free tier with 500MB and 50,000 rows. Built-in Google OAuth. Row Level Security. Visual table editor. Supports pgvector for future semantic search.
**Why not Firebase:** Firebase is unstructured documents. Supabase is SQL — queryable, structured, exportable.
**Cost:** Free up to 500MB.

### Tailwind CSS
**What:** Utility CSS classes.
**Why:** Built into Next.js. Fast and responsive by default.
**Cost:** Free.

### Cloudinary
**What:** Image storage and delivery.
**Why not AWS S3:** S3 charges after 5GB. Cloudinary gives 25GB/month free, no credit card required.
**Cost:** Free up to 25GB/month.

---

## Every file explained

### `types/skin.ts`
Every data shape in the app. If any function returns wrong data, TypeScript catches it at build time.

**Phase 1 types:**
- `SkinType` — oily, dry, combination, sensitive, normal
- `SkinConcern` — acne, pigmentation, ageing, dullness, darkCircles, uneven texture, pores, redness
- `SkinGoal` — clear skin, even tone, hydration, anti ageing, brightening, oil control
- `ClimateZone` — humid, dry, tropical, cold, mixed
- `SkinProfile` — all of the above combined
- `ProductRecommendation` — product with required `whyItWorks` field
- `AnalysisResult` — full AI output

**Phase 2 types:**
- `IngredientAnalysis` — one ingredient with effect and reason
- `ProductAnalysis` — score, verdict, three ingredient lists
- `AnalyseRequest` — sessionId + inputType + content

**Phase 3 types:**
- `UserProfile` — account-linked skin profile
- `QuizHistoryEntry` — one past quiz result
- `RoutineLog` — one day's morning/night completion
- `AuthUser` — logged in user's id, email, provider

---

### `lib/ai.ts`
Two functions. Both talk to Gemini 1.5 Flash.

**`analyseSkin(profile)`**
Takes a `SkinProfile`, returns `AnalysisResult`. The prompt gives Gemini a dermatologist role, injects the full profile, and enforces strict JSON output with rules: 5 products, budget enforcement, Indian brands first, `whyItWorks` required.

**`analyseProduct(content, inputType, profile)`**
Takes product content (link, text, or image description) and the user's skin profile. Builds a different instruction block for Gemini depending on input type. Returns `ProductAnalysis` with per-ingredient verdicts tied to the specific skin profile.

**Why one file:** Switch AI providers by changing one file only.

**Why "Return ONLY valid JSON":** Gemini adds explanation text by default. This breaks `JSON.parse()`. The instruction prevents it. The `cleaned` line strips accidental backticks as backup.

---

### `lib/supabase.ts`
All database and auth operations. Grouped into four sections:

**Session (Phase 1+2):** `generateSessionId`, `saveSkinProfile`, `getSkinProfile`

**Auth (Phase 3):** `signInWithGoogle`, `signInWithEmail`, `signOut`, `getSession`, `onAuthStateChange`

**User profile:** `getUserProfile`, `saveUserProfile`

**Quiz history:** `saveQuizHistory`, `getQuizHistory`

**Routine logs:** `getTodayRoutineLog`, `upsertRoutineLog`, `getRoutineStreak`

**Why `upsert` for routine logs:** One row per user per day enforced by `unique(user_id, date)`. Upsert updates the same row when a user ticks morning, then comes back to tick night. No duplicates.

**Why PGRST116 handled silently in `getUserProfile`:** This is Supabase's "row not found" code. Not an error — just means the user has not taken the quiz yet. Return null, send to quiz. No console noise.

**Why `getRoutineStreak` checks 30 days:** Streak goes backwards from today. If today has a log, streak = 1. Yesterday also, streak = 2. Stop at 30 — practical limit for the query.

---

### `lib/questions.ts`
Six quiz questions. Each has id, type (single or multi), and options with emojis.

**Why 6 questions:** Minimum needed for a meaningful profile. Every extra question reduces completion rate.

**Why climate question:** Delhi's dry winter needs completely different products than Hyderabad's humid summer. Most apps skip this. We do not.

**Why budget in rupees:** ₹500 and ₹2000 are numbers Indian users understand immediately.

---

### `components/ThemeProvider.tsx`
Manages the theme state globally using React Context. Three options: system, light, dark.

**How it works:**
1. On mount, reads `theme` from localStorage
2. If nothing saved, detects system preference via `window.matchMedia`
3. Sets `data-theme` attribute on `<html>` — either `light` or `dark`
4. Listens for system preference changes and updates if user is on `system`
5. Exposes `theme`, `resolvedTheme`, and `setTheme` via context

**Why CSS variables on `<html>` not React state:** CSS variables apply to every element instantly — no re-renders. Toggling one attribute on `<html>` flips the entire UI. Passing theme props through every component would cause hundreds of re-renders.

**Why `system` as the default:** Indian mobile users heavily use auto-brightness and system dark mode. Respecting their system setting on first open feels native.

---

### `components/SettingsMenu.tsx`
Slide-up panel from the bottom of the screen. Contains theme selector and sign out.

**Why slide-up from bottom:** Bottom sheets are the standard mobile pattern for settings — thumb reaches it naturally. A modal in the centre or a top drawer would require stretching the thumb.

**Why three theme options not just a toggle:** A toggle only gives light/dark. System default is the most important option — users who set their phone to auto dark mode at night expect apps to follow. Three options covers all real use cases.

**Why sign out is in settings not the top bar:** Sign out is a destructive, low-frequency action. Hiding it in settings prevents accidental taps. The top bar stays clean — just the app name and settings icon.

---

### `components/Quiz.tsx`
Six-question quiz. Progress bar. Single and multi-select. Builds a typed `SkinProfile` on completion.

**Bold modern UI choices:**
- Question text: 28px, weight 800, letter-spacing -0.8px — confident, not shy
- Option buttons: 18px padding, 14px border-radius, 15px font — easy thumb tap
- Progress bar: 3px thin line — minimal but present
- Active option: filled `var(--accent)` background, white text — unambiguous selection

**Why `buildProfile()` inside the component:** Maps raw string answers to typed `SkinProfile`. Quiz is fully self-contained — takes only `onComplete`, returns a clean typed profile.

---

### `components/Results.tsx`
Displays full AI output. Has a tab switcher — Current results and Past results — for logged in users.

**Why `whyItWorks` is prominent:** Every product card leads with the reason it suits this specific skin. That explanation builds trust. Without it, recommendations are indistinguishable from affiliate marketing.

**Why ingredients to avoid:** Telling users what NOT to buy — and why — is rare and genuinely useful. Shows the app works for the user, not for a brand.

**Why past results tab inside Results:** History and current results are the same type of content. A tab switcher keeps context — users compare without navigating away.

---

### `components/Analyser.tsx`
Product compatibility checker. Three input tabs — Link, Ingredients, Screenshot.

**Why score as large number:** A user glances at 82 in green and knows immediately. No reading required.

**Why three ingredient lists with different visual weight:** Beneficial (green) → harmful (red) → neutral (pills). Visual hierarchy matches what users care about most.

**Why image tab redirects to text:** Honest about what is not built. A broken upload button is worse than a clear message.

---

### `components/Login.tsx`
Three modes: options → email input → sent confirmation.

**Why email magic link not phone OTP:** Phone OTP requires Twilio — paid after trial. Email OTP is built into Supabase at zero cost. No password, no SMS charges.

**Why Google login:** One tap for most users. No email or password friction. Google accounts are universal in India.

**Why `showSkip` prop:** Login is optional. Anonymous users get full Phase 1 and 2 features. The skip option only appears for returning users who already have results. First time users are nudged after the quiz.

---

### `components/RoutineTracker.tsx`
Daily morning and night checklist with streak counter.

**Why steps collapse when marked done:** Reduces visual noise. Collapsing gives satisfying completion feedback. The green border reinforces the save.

**Why streak is a large number:** Motivation metric. 36px bold makes it feel like an achievement worth protecting.

**Why login-gated:** Tracking needs a stable user ID per day. Anonymous sessions are not stable enough across visits. The gate is honest — explains why and gives a direct path to sign in.

---

### `components/QuizHistory.tsx`
List of all past quiz results for logged in users.

**Why latest result has black border:** Visual hierarchy. Most recent = most relevant. Black border makes it obvious without explanation.

**Why goals shown as pills on history cards:** Quick summary of what that session was about. Skin type and date alone are not enough context for a user scanning their history.

---

### `app/auth/callback/route.ts`
Catches the redirect after Google OAuth. Exchanges the code for a Supabase session. Redirects to home.

**Why this file must exist:** Google redirects back to `/auth/callback?code=xyz`. Without this route, the code is never exchanged and the user lands with no session. Silent failure.

---

### `app/api/recommend/route.ts`
Receives skin profile → calls Gemini → saves to anonymous table → if logged in also saves to user tables → returns result.

**Why save to both tables:** Anonymous `skin_profiles` supports Phase 1+2 fallback. `user_profiles` and `quiz_history` support Phase 3 accounts. Dual save means the app works for everyone regardless of login state.

**Why auth token in header not body:** JWT tokens in request bodies can be logged by proxies. Authorization headers are a standard and safer pattern. The server calls `supabase.auth.getUser(token)` to verify identity server-side.

---

### `app/api/analyse/route.ts`
Receives product content → tries logged in profile first → falls back to anonymous session → calls Gemini → returns analysis.

**Why try logged in profile first:** Logged in users get their full account profile — more complete than a session profile. Falls back to session profile for anonymous users so the feature works for everyone.

**Error codes:**
- 400 — missing or invalid input
- 404 — no profile found, quiz not taken
- 422 — content not recognisable as a product
- 500 — server error

---

## Database design

### `skin_profiles` — anonymous sessions
```sql
id          uuid      primary key
session_id  text      not null
profile     jsonb     not null
result      jsonb     not null
created_at  timestamptz
```
Index on `session_id` and `created_at`.

### `user_profiles` — account-linked profiles
```sql
id          uuid      references auth.users primary key
email       text
skin_type   text
concerns    text[]
goals       text[]
climate     text
age_range   text
budget      text
created_at  timestamptz
updated_at  timestamptz
```
Row Level Security: users can only read and write their own row.

### `quiz_history` — every quiz attempt
```sql
id          uuid      primary key
user_id     uuid      references auth.users
profile     jsonb
result      jsonb
taken_at    timestamptz
```
Row Level Security: users can only read and write their own rows.

### `routine_logs` — daily tracking
```sql
id            uuid      primary key
user_id       uuid      references auth.users
date          date
morning_done  boolean
night_done    boolean
created_at    timestamptz
unique(user_id, date)
```
Row Level Security on all operations. `unique(user_id, date)` prevents duplicate daily rows.

**Why Row Level Security on all Phase 3 tables:**
Without RLS, any user with the Supabase anon key could read anyone else's data. With RLS, Supabase checks `auth.uid() = user_id` on every query at the database level — not just in code. Impossible to bypass.

**Why `jsonb` for profile and result:**
Nested arrays (concerns, goals) and flexible structures do not fit cleanly in columns. `jsonb` stores the whole object, is queryable, and is simple to evolve over time.

---

## Auth system

Two sign-in methods. Both are free.

### Google OAuth
1. User taps "Continue with Google"
2. `signInWithGoogle()` redirects to Google
3. Google redirects to `/auth/callback?code=xyz`
4. Callback route calls `supabase.auth.exchangeCodeForSession(code)`
5. Supabase creates session, user is logged in
6. App redirects to home, `onAuthStateChange` fires, app updates state

### Email magic link
1. User enters email, taps "Send login link"
2. `signInWithEmail(email)` calls `supabase.auth.signInWithOtp`
3. Supabase sends an email with a magic link
4. User clicks the link in their email
5. Redirects to `/auth/callback`, session created
6. User is logged in — no password ever created or stored

**Why no phone OTP:**
Twilio (required for SMS OTP) is paid after trial credits. Email OTP is built into Supabase at zero cost. No third-party dependency.

---

## Session system

### Anonymous (Phase 1+2)
```
First visit → generate session_1720000000_ab3f9c2
→ save to localStorage
→ quiz result saved to Supabase skin_profiles with session ID
→ result also saved to localStorage

Return visit → read session ID from localStorage
→ read result from localStorage
→ show welcome back screen instantly
```

### Logged in (Phase 3)
```
Sign in → Supabase session stored in browser automatically
→ getUserProfile(userId) called on every load
→ profile found → welcome back or results
→ profile not found → quiz

Results cached per user: localStorage key is skin_result_{userId}
Different from anonymous key skin_result — no collision
```

**Why both localStorage and Supabase:**
localStorage is instant — zero network call. Supabase is the permanent backup — works across devices and survives browser clears.

---

## Theme system — dark mode

### How it works
1. `ThemeProvider` wraps the entire app in `layout.tsx`
2. On mount it reads `theme` from localStorage
3. If nothing saved, reads system preference via `matchMedia`
4. Sets `data-theme="light"` or `data-theme="dark"` on `<html>`
5. All component styles use CSS variables — `var(--bg)`, `var(--text-primary)` etc.
6. CSS variables defined in `globals.css` under `:root` (light) and `[data-theme="dark"]`
7. Toggling `data-theme` instantly changes every color on the page

### Why CSS variables not React state
CSS variables apply to every element in one DOM operation. No re-renders. React state would require passing a theme prop to every single component — dozens of re-renders on every toggle.

### Variable reference
| Variable | Light | Dark |
|---|---|---|
| `--bg` | #fafaf8 | #111110 |
| `--surface` | #ffffff | #1c1c1a |
| `--border` | #e8e6e0 | #2e2e2b |
| `--text-primary` | #1a1a1a | #f0ede8 |
| `--text-secondary` | #666666 | #a8a49e |
| `--text-muted` | #999999 | #6b6760 |
| `--accent` | #1a1a1a | #f0ede8 |
| `--accent-text` | #ffffff | #111110 |
| `--tag-bg` | #f4f3f0 | #252522 |

---

## PWA — installable on Android and iOS

### What makes this a PWA
- `public/manifest.json` — tells browsers the app name, icons, colors, display mode
- `public/sw.js` — service worker caches static assets for offline use
- `components/ServiceWorker.tsx` — registers the service worker in production only
- HTTPS on Vercel — required for service workers and PWA install prompts

### Install on Android (Chrome)
1. Open the Vercel URL in Chrome
2. Tap the three dots menu
3. Tap "Add to Home screen" → "Install"
4. App icon appears on home screen
5. Opens fullscreen — no browser UI

### Install on iOS (Safari)
1. Open the Vercel URL in Safari
2. Tap the Share button
3. Tap "Add to Home Screen" → "Add"
4. App icon appears on home screen
5. Opens fullscreen — no browser UI

### Why service worker only registers in production
Turbopack (Next.js dev server) blocks service worker registration. Registering in development causes console errors and serves no purpose. `process.env.NODE_ENV === 'production'` check activates it only on Vercel.

### Why `display: standalone` in manifest
Standalone mode removes all browser chrome — no address bar, no tabs, no back button. The app looks and feels native.

---

## Environment variables

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
```

| Key | Where | Cost |
|---|---|---|
| `GEMINI_API_KEY` | aistudio.google.com → Get API key | Free |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Free |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Free |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | cloudinary.com → Dashboard | Free |

**Why `GEMINI_API_KEY` has no `NEXT_PUBLIC_` prefix:**
`NEXT_PUBLIC_` variables are visible in the browser — anyone can read them in page source. Gemini key must stay server-side only. Supabase anon key is designed to be public — RLS handles access control at the database level.

---

## How to run locally

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/skin-app.git
cd skin-app

# 2. Install
npm install

# 3. Create .env.local and fill in keys

# 4. Run
npm run dev

# 5. Open
# http://localhost:3000
```

---

## How to deploy

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Add environment variables
vercel env add GEMINI_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# 4. Deploy to production
vercel --prod
```

After deployment, add your Vercel URL to:
- Supabase → Authentication → URL Configuration → Redirect URLs
- Google OAuth Console → Authorized redirect URIs

Both should point to: `https://your-app.vercel.app/auth/callback`

---

## Commit history

```
phase 1 step 1 — project setup
phase 1 step 2 — types, questions, ai and supabase connectors
phase 1 complete — quiz, AI recommendations, results UI
phase 2 complete — product analyser with ingredient cross-check
returning user flow — welcome back screen with skip or retake option
phase 3 step 1 — auth types and supabase auth connector
phase 3 step 2 — auth callback route and login UI component
phase 3 step 3 — auth wired into API routes and main page
phase 3 step 4 — routine tracker with streak and daily logs
phase 3 step 5 — quiz history with past results tab
phase 3 step 6 — PWA, service worker, manifest, icons
ui redesign — dark mode, pill nav, settings menu, mobile-first CSS variables
fix — service worker production only, getUserProfile PGRST116 silent
phase 1 + 2 + 3 — final README
```

---

Built with zero paid tools. Deployed free. Designed for India.
