# Skin App — Phase 1 + Phase 2 Complete

> A personalized skincare recommendation web app built for Indian users.
> Free to run. Zero login required. AI-powered.

---

## Table of Contents

1. [What this app does](#what-this-app-does)
2. [What we built — Phase 1 and Phase 2](#what-we-built--phase-1-and-phase-2)
3. [How the app works — plain English](#how-the-app-works--plain-english)
4. [Folder structure explained](#folder-structure-explained)
5. [Tech stack — what, why, and cost](#tech-stack--what-why-and-cost)
6. [Every file explained](#every-file-explained)
7. [The AI prompts — how they work](#the-ai-prompts--how-they-work)
8. [Database design — why we did it this way](#database-design--why-we-did-it-this-way)
9. [Session system — no login needed](#session-system--no-login-needed)
10. [Returning user flow — skip or retake](#returning-user-flow--skip-or-retake)
11. [How to run this locally](#how-to-run-this-locally)
12. [Environment variables](#environment-variables)
13. [Commit history](#commit-history)
14. [What comes in Phase 3](#what-comes-in-phase-3)

---

## What this app does

Most skincare advice online is generic. "Drink water. Use SPF." That helps nobody.

This app does two things:

**1. Personalized skin analysis**
Asks 6 targeted questions about your skin — type, concerns, goals, climate, age, and budget — and returns a complete personalized skincare plan:
- 5 product recommendations with exact reasons why each suits your skin
- Ingredients you must avoid and why
- 5 foods that improve your specific skin concerns
- A morning and night skincare routine

**2. Product compatibility checker**
You find a product on Instagram, Nykaa, or Amazon and want to know if it works for your skin. Paste the product link or ingredient list. The app:
- Reads every ingredient
- Cross-checks each one against your saved skin profile
- Gives a compatibility score from 0 to 100
- Lists which ingredients help, which harm, which are neutral — all with reasons specific to your skin
- Gives an honest verdict: yes, no, or use with caution

Every recommendation is India-first. Indian brands appear before international ones. Budget is in rupees.

---

## What we built — Phase 1 and Phase 2

### Phase 1 — Foundation

| What | Status |
|---|---|
| Next.js project setup | Done |
| Folder structure | Done |
| Skin types data schema | Done |
| Quiz questions data (6 questions) | Done |
| Gemini AI connector | Done |
| Supabase database connector | Done |
| API route — `/api/recommend` | Done |
| Quiz UI component | Done |
| Results UI component | Done |
| Main page — full flow wired | Done |
| Session handling — no login | Done |
| Pushed to GitHub | Done |

### Phase 2 — Product Analyser

| What | Status |
|---|---|
| Product analysis types added | Done |
| AI analyser function in `lib/ai.ts` | Done |
| API route — `/api/analyse` | Done |
| Analyser UI component | Done |
| Bottom navigation (Profile / Check a Product) | Done |
| Returning user flow — welcome back screen | Done |
| First time users — quiz mandatory once | Done |
| Pushed to GitHub | Done |

---

## How the app works — plain English

### First time user flow

```
User opens the app for the first time
        ↓
App checks localStorage — nothing found
        ↓
App generates a unique session ID and saves it to localStorage
        ↓
User sees the quiz — mandatory, no skip option
        ↓
User answers 6 questions
        ↓
App builds a skin profile object from the answers
        ↓
App sends profile to Gemini AI via /api/recommend
        ↓
Gemini returns product recommendations as JSON
        ↓
App saves result to Supabase database
        ↓
App saves result to localStorage
        ↓
User sees their personalized results
        ↓
Bottom nav appears — "My Skin Profile" and "Check a Product"
```

### Returning user flow

```
User opens the app again (same device, same browser)
        ↓
App checks localStorage — session ID and result found
        ↓
Welcome back screen appears
        ↓
Shows their skin type and concerns as a reminder
        ↓
Two options:
  → "See my results" — goes directly to results, no quiz
  → "Retake quiz"   — clears old data, starts fresh
```

### Product analyser flow

```
User taps "Check a Product" in bottom nav
        ↓
Chooses input type: Link, Ingredients, or Screenshot
        ↓
Pastes a product URL or ingredient list
        ↓
App sends content + session ID to /api/analyse
        ↓
API fetches saved skin profile from Supabase using session ID
        ↓
Sends profile + product content to Gemini AI
        ↓
Gemini analyses every ingredient against the skin profile
        ↓
Returns score, verdict, and per-ingredient breakdown
        ↓
User sees: score out of 100, verdict, beneficial ingredients,
           harmful ingredients, neutral ingredients
```

---

## Folder structure explained

```
skin-app/
│
├── app/                              → All pages and API routes
│   ├── page.tsx                      → Main page — manages all app states
│   ├── layout.tsx                    → Wraps every page
│   ├── globals.css                   → Global styles
│   │
│   └── api/
│       ├── recommend/
│       │   └── route.ts             → Quiz → Gemini → Supabase → results
│       └── analyse/
│           └── route.ts             → Product content → Gemini → analysis
│
├── components/
│   ├── Quiz.tsx                      → 6-question quiz UI
│   ├── Results.tsx                   → Skin profile results display
│   └── Analyser.tsx                  → Product compatibility checker UI
│
├── lib/
│   ├── ai.ts                         → All Gemini AI calls (2 functions)
│   ├── supabase.ts                   → All database calls (3 functions)
│   └── questions.ts                  → Quiz questions and options
│
├── types/
│   └── skin.ts                       → All TypeScript type definitions
│
├── .env.local                        → Secret API keys (never pushed)
├── .gitignore                        → Excludes .env.local from Git
├── README.md                         → This file
└── package.json                      → Dependencies and scripts
```

### Why this structure?

**Why separate `lib/` from `components/`?**
Components render things on screen. `lib/` files handle logic — talking to APIs and databases. Keeping them separate means changing your AI provider means editing one file only: `lib/ai.ts`. No component needs to change.

**Why two API routes?**
`/api/recommend` handles the quiz flow. `/api/analyse` handles the product checker. Separate routes means each has one job. Easier to debug, easier to scale independently.

**Why `types/skin.ts`?**
TypeScript catches data shape errors at build time — not after a user reports a bug. The types file is a contract between every part of the system. Change a type and TypeScript shows you everywhere it breaks immediately.

---

## Tech stack — what, why, and cost

### Next.js — Frontend + Backend framework
**What:** Powers the entire app — pages and API routes together.
**Why:** Frontend and backend in one project, one deployment. No separate server needed.
**Why not plain React?** Plain React is frontend only. You would need a separate backend to call Gemini and Supabase securely.
**Cost:** Free forever on Vercel hobby plan.

---

### Google Gemini API — The AI brain
**What:** Google's AI model. Used twice — recommendations and ingredient analysis.
**Why Gemini over ChatGPT or Claude?** Gemini 1.5 Flash has a genuine free tier — 1 million tokens per day. OpenAI and Anthropic have no free tier.
**Why not manual logic?** An if-else recommendation system needs thousands of rules and breaks the moment a new ingredient or concern exists. AI understands context and reasons like a dermatologist.
**Cost:** Free up to 1 million tokens per day. One quiz = ~1,500 tokens. One analysis = ~800 tokens.

---

### Supabase — Database
**What:** Free hosted PostgreSQL database with a visual dashboard.
**Why:** 500MB free, 50,000 rows, visual editor, built-in auth for Phase 3, supports pgvector for semantic search.
**Why not Firebase?** Firebase stores unstructured documents. Supabase uses SQL — structured, queryable, exportable. Also supports pgvector which Firebase does not.
**Cost:** Free forever up to 500MB.

---

### Tailwind CSS — Styling
**What:** Utility CSS classes in JSX.
**Why:** Built into Next.js setup. Fast, responsive by default.
**Cost:** Free forever.

---

### Cloudinary — Image storage (Phase 3)
**What:** Cloud image storage and delivery.
**Why not AWS S3?** S3 charges after 5GB. Cloudinary gives 25GB free per month with no credit card required to start.
**Cost:** Free up to 25GB per month.

---

## Every file explained

### `types/skin.ts`

**Phase 1 types:**
```
SkinType             → oily | dry | combination | sensitive | normal
SkinConcern          → acne | pigmentation | ageing | dullness | etc.
SkinGoal             → clear skin | even tone | hydration | etc.
ClimateZone          → humid | dry | tropical | cold | mixed
SkinProfile          → all of the above in one object
ProductRecommendation → one product with name, brand, price, whyItWorks, ingredients
AnalysisResult       → full AI output: products + food + routines + avoid list
```

**Phase 2 types:**
```
IngredientAnalysis   → one ingredient: name, effect, reason
ProductAnalysis      → score, verdict, three ingredient lists, alternative suggestion
AnalyseRequest       → sessionId + inputType + content
```

**Why `whyItWorks` is required:**
Every other skincare app shows you a product. This app explains exactly why it suits your specific skin. That explanation builds trust. Without it you are just another recommendation engine.

**Why three ingredient lists:**
Beneficial, harmful, neutral — every ingredient lands in exactly one list. No ingredient gets ignored. Forces the AI to give a complete picture, not just flag the obviously bad ones.

---

### `lib/questions.ts`

Six quiz questions. Each has an `id`, `type` (single or multi-select), and options with emojis.

**Why 6 questions?** Every extra question reduces completion rate. Six covers age, skin type, concerns, goals, climate, budget — the minimum for meaningful recommendations.

**Why the climate question?** A moisturiser that works in Delhi's dry winter causes breakouts in Hyderabad's humid summer. Climate changes what actually works. Most apps skip it. We do not.

**Why budget in rupees?** ₹500 and ₹2000 are numbers Indian users understand immediately. "Low/medium/high" without context is useless.

---

### `lib/ai.ts`

Two exported functions:

**`analyseSkin(profile)`** → full skincare recommendations from skin profile.
**`analyseProduct(content, inputType, profile)`** → ingredient analysis from product content + skin profile.

**Why one file for all AI calls?** If you switch AI providers, you change one file only. No touching components or API routes.

**Why "Return ONLY valid JSON" in the prompt?** Gemini adds explanations before and after answers by default. That breaks `JSON.parse()`. The explicit instruction prevents this. The `cleaned` line strips accidental backticks as backup.

**Why three input types in `analyseProduct`?** Link, text, image — same function handles all three by building different instruction blocks for Gemini. Same output structure regardless of input type.

---

### `lib/supabase.ts`

Three functions:

**`saveSkinProfile(sessionId, profile, result)`** — saves quiz answers and AI result as one row.
**`getSkinProfile(sessionId)`** — fetches latest result for a session ID.
**`generateSessionId()`** — creates a unique ID like `session_1720000000_ab3f9c2`.

**Why save profile and result together?** They are one event. Stored together you can always see what inputs produced what output. Critical for debugging and Phase 3 history.

**Why `jsonb` column type?** The skin profile has arrays — multiple concerns, multiple goals. `jsonb` stores the whole object without extra join tables. Also queryable: `WHERE profile->>'skinType' = 'oily'`.

---

### `app/api/recommend/route.ts`

Quiz → Gemini → Supabase → result.

Validates profile and sessionId exist. Returns 400 if missing. Wraps everything in try/catch — if Gemini or Supabase fails, returns a clean error message, not a crash.

**Why validate on the server?** Frontend validation can be bypassed by anyone sending a raw HTTP request. Server validation is the real guard.

---

### `app/api/analyse/route.ts`

Product content → fetch saved profile → Gemini → analysis.

**Error codes:**
- 400 — missing or invalid fields
- 404 — no skin profile found, quiz not taken yet
- 422 — content provided but Gemini could not identify a product
- 500 — server error

**Why 422 separately from 500?** 422 means the request was valid but the content was not usable. 500 means the server broke. Different problems need different error messages.

**Why fetch the skin profile from Supabase here?** The analyser needs the user's skin profile to judge ingredients. Fetching it by session ID means users do not retake the quiz — the app already knows who they are.

---

### `components/Quiz.tsx`

Six-question quiz. Progress bar. Single and multi-select questions. Builds a typed `SkinProfile` on completion.

**Why a progress bar?** Users abandon multi-step forms when they do not know how long they will take. Even a 3px bar meaningfully increases completion rates.

**Why `buildProfile()` inside the component?** Maps raw quiz answers to a typed `SkinProfile`. The Quiz is fully self-contained — takes nothing in except `onComplete`, gives back a clean typed profile.

---

### `components/Results.tsx`

Displays full AI output. Products, ingredients to avoid, food suggestions, morning and night routines.

**Why show ingredients to avoid?** Telling users what NOT to buy — and why — is rare and genuinely useful. Shows the app works for the user, not for a brand.

---

### `components/Analyser.tsx`

Product compatibility checker. Three input tabs — link, ingredients, screenshot.

**Why the score as a large number?** A user glances at 82 in green and knows immediately. No reading required. Fastest way to communicate compatibility.

**Why neutral ingredients as pills not rows?** Least important information deserves least visual weight. Pills take less space and draw less attention. Hierarchy — beneficial first, harmful second, neutral third — matches what users care about.

**Why image tab redirects to text?** Honest about what is not built yet. A broken upload button is worse than a clear redirect. Real image upload comes in Phase 3.

---

### `app/page.tsx`

Manages five app states:

```
checking      → reading localStorage, blank screen <100ms
welcome_back  → returning user: skip or retake
quiz          → first time users only, mandatory
loading       → spinner while Gemini processes
results       → skin profile + product analyser tabs
analyser      → product compatibility checker
```

**Why `checking` state?** Without it, the app briefly shows the quiz to returning users before localStorage loads. The blank matching-background screen for under 100ms eliminates that flash completely.

**Why `welcome_back` as a separate state?** First time users must take the quiz. Returning users get a choice. These are fundamentally different flows — a dedicated state keeps the logic clean and explicit.

**Why "See my results" is the primary button?** Most returning users want results, not the quiz again. Visual hierarchy — black primary, muted secondary — guides users to the right action without forcing it.

---

## The AI prompts — how they work

### Recommendation prompt

**Three parts:**
1. Role — "Expert dermatologist with deep knowledge of Indian skincare brands"
2. User context — full skin profile: type, concerns, goals, climate, age, budget
3. Output rules — exact JSON structure, 5 products, budget enforcement, Indian brands first

**Why give the AI a role?** A general AI gives general answers. A scoped role gives specific, domain-focused answers. Highest-impact prompt technique.

**Why enforce rules?** Without them the AI returns inconsistent output — 3 products sometimes, 7 others, introduction paragraphs that break JSON parsing. Rules make output predictable every time.

---

### Analyser prompt

**Three parts:**
1. Role — "Expert cosmetic dermatologist and ingredient safety analyst"
2. User skin profile — injected so every ingredient is judged against this specific person
3. Input block — different instruction for link, text, or image

**Why inject the full profile into every analysis?** The AI judges ingredients against this specific person's skin — not in general. A fragrance might be fine for normal skin but harmful for sensitive skin. The profile is what makes the judgement specific and useful.

**Why three verdict values only?** Yes, no, caution. No ambiguity. Users want a clear answer. The 0–100 score provides nuance for those who want it.

---

## Database design — why we did it this way

```sql
create table skin_profiles (
  id          uuid      default gen_random_uuid() primary key,
  session_id  text      not null,
  profile     jsonb     not null,
  result      jsonb     not null,
  created_at  timestamp default timezone('utc', now())
);

create index idx_skin_profiles_session_id on skin_profiles(session_id);
create index idx_skin_profiles_created_at on skin_profiles(created_at desc);
```

**Why `jsonb` not separate columns?** Profile has nested arrays. Separate columns would need extra tables and joins. `jsonb` stores the whole object, is queryable, and is simple to change later.

**Why two indexes?**
- `session_id` index — fast lookup on every page load and every analyse call
- `created_at` index — fast sorting to fetch the latest result per session

Without indexes, every lookup scans the full table. At 100,000 rows the app becomes noticeably slow.

**Why one table?** Profile and result are one event — one row. Separate tables would require a join on every fetch. One table, one row, one query.

---

## Session system — no login needed

```
First visit
→ Generate session ID: session_1720000000_ab3f9c2
→ Save to localStorage
→ Quiz taken, result saved to Supabase with session ID
→ Result also saved to localStorage

Return visit
→ Read session ID from localStorage
→ Read result from localStorage
→ Show welcome back screen instantly — no network call needed
→ "See my results" → results loaded from localStorage immediately
→ "Retake quiz" → new session ID, old data cleared, quiz starts fresh
```

**Why both localStorage and Supabase?**
localStorage is instant — results appear with zero loading. Supabase is the backup — if the user clears their browser or switches devices, results can be fetched using the session ID.

**What is the weakness?**
If a user clears browser data, their session ID is gone. They retake the quiz. Acceptable for Phase 1 and 2. Phase 3 adds login — results tied to an account, not a browser.

---

## Returning user flow — skip or retake

**The rule:**
- First time → quiz is mandatory, no exceptions
- Every time after → welcome back screen with two choices

**Why mandatory first time?**
The app is useless without a skin profile. The analyser cannot work. Results cannot show. The quiz is not optional onboarding — it is the data the entire app runs on.

**Why not force the quiz every time?**
Skin type does not change every day. Forcing a returning user through 6 questions to see existing results is friction with zero benefit.

**Why show skin type and concerns on the welcome back screen?**
A quick reminder of what the app knows. If they see "oily, acne, pigmentation" and think "yes that's me" — they tap "See my results" confidently. If their skin has changed — they retake. The reminder makes the decision easy.

---

## How to run this locally

**Prerequisites:**
- Node.js 18 or above
- Supabase account — free at supabase.com
- Google AI Studio account — free at aistudio.google.com

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/skin-app.git
cd skin-app

# 2. Install dependencies
npm install

# 3. Create .env.local and fill in keys (see below)

# 4. Run dev server
npm run dev

# 5. Open browser
# http://localhost:3000
```

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

**Why `GEMINI_API_KEY` has no `NEXT_PUBLIC_` prefix?**
`NEXT_PUBLIC_` variables are visible in the browser — anyone can read them in the page source. The Gemini key must stay server-side only. Supabase's anon key is designed to be public — Supabase's database security rules handle access control.

---

## Commit history

```
phase 1 step 1 — project setup
phase 1 step 2 — types, questions, ai and supabase connectors
phase 1 complete — quiz, AI recommendations, results UI
phase 2 complete — product analyser with ingredient cross-check
returning user flow — welcome back screen with skip or retake option
phase 1 + 2 — updated README with full architecture explanation
```

---

## What comes in Phase 3

### Accounts and login
- Google login and phone OTP login
- Skin profile tied to an account not a browser
- Results accessible from any device
- History of past results — see how your skin changes over time

### Routine tracker
- Daily morning and night checklist
- Push notification reminders
- Streak tracking

### Real image upload
- Upload product photo or screenshot directly
- Cloudinary stores the image
- Gemini Vision reads ingredients from the image automatically
- No manual typing needed

### Mobile PWA
- Works like a native app on Android and iOS
- Install from browser — no app store needed
- Offline support for saved results

### Android and iOS
- Convert PWA to native apps
- Published on Google Play and Apple App Store

---

Built with zero paid tools. Deployed for free. Designed for India.
