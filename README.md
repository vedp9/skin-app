# Skin App — Phase 1 Complete

> A personalized skincare recommendation web app built for Indian users.
> Free to run. Zero login required. AI-powered.

---

## Table of Contents

1. [What this app does](#what-this-app-does)
2. [What we built in Phase 1](#what-we-built-in-phase-1)
3. [How the app works — plain English](#how-the-app-works--plain-english)
4. [Folder structure explained](#folder-structure-explained)
5. [Tech stack — what, why, and cost](#tech-stack--what-why-and-cost)
6. [Every file explained](#every-file-explained)
7. [The AI prompt — how it works](#the-ai-prompt--how-it-works)
8. [Database design — why we did it this way](#database-design--why-we-did-it-this-way)
9. [Session system — no login needed](#session-system--no-login-needed)
10. [How to run this locally](#how-to-run-this-locally)
11. [Environment variables](#environment-variables)
12. [What comes in Phase 2 and 3](#what-comes-in-phase-2-and-3)

---

## What this app does

Most skincare advice online is generic. "Drink water. Use SPF." That helps nobody.

This app asks 6 targeted questions about your skin — type, concerns, goals, climate, age, and budget — and returns a complete, personalized skincare plan:

- 5 product recommendations with exact reasons why each suits your skin
- Ingredients you must avoid and why
- 5 foods that improve your specific skin concerns
- A morning and night skincare routine

Every recommendation is India-first. Indian brands like Minimalist, Dot & Key, and Plum appear before international ones. Budget is in rupees.

---

## What we built in Phase 1

| What | Status |
|---|---|
| Next.js project setup | Done |
| Folder structure | Done |
| Skin types data schema | Done |
| Quiz questions data | Done |
| Gemini AI connector | Done |
| Supabase database connector | Done |
| API route — `/api/recommend` | Done |
| Quiz UI component | Done |
| Results UI component | Done |
| Main page — full flow wired | Done |
| Session handling — no login | Done |
| Pushed to GitHub | Done |

---

## How the app works — plain English

Think of it like this:

```
User answers 6 questions
        ↓
App builds a "skin profile" object from the answers
        ↓
App sends that profile to Google's Gemini AI
        ↓
Gemini reads the profile and returns product recommendations as JSON
        ↓
App saves the result to Supabase database
        ↓
App saves the result to the user's browser (localStorage)
        ↓
User sees their personalized results on screen
        ↓
User refreshes the page → results are still there (no login needed)
```

That's the entire Phase 1 flow. Six steps. No complexity hidden anywhere.

---

## Folder structure explained

```
skin-app/
│
├── app/                        → All pages and API routes live here
│   ├── page.tsx                → The main page users see (quiz → loading → results)
│   ├── layout.tsx              → Wraps every page (sets fonts, metadata)
│   ├── globals.css             → Global styles applied to the whole app
│   │
│   └── api/                   → Backend API routes (run on the server)
│       ├── recommend/
│       │   └── route.ts       → Receives quiz answers → calls Gemini → saves to DB → returns results
│       └── analyse/
│           └── route.ts       → (Phase 2) Will analyse product links and screenshots
│
├── components/                 → Reusable UI pieces
│   ├── Quiz.tsx               → The 6-question quiz UI
│   └── Results.tsx            → Displays AI recommendations, routines, food tips
│
├── lib/                        → Utility files — logic that is reused across the app
│   ├── ai.ts                  → Everything that talks to Gemini AI lives here
│   ├── supabase.ts            → Everything that talks to the database lives here
│   └── questions.ts           → The 6 quiz questions and their options
│
├── types/                      → TypeScript type definitions
│   └── skin.ts                → Defines what a SkinProfile, Product, and Result look like
│
├── .env.local                 → Secret API keys (never pushed to GitHub)
├── .gitignore                 → Tells Git what NOT to push (includes .env.local)
├── next.config.ts             → Next.js configuration
├── tailwind.config.ts         → Tailwind CSS configuration
└── package.json               → Lists all dependencies and scripts
```

### Why this structure?

**Why separate `lib/` from `components/`?**
Components are visual — they render things on screen. `lib/` files are logic — they talk to APIs, databases, process data. Keeping them separate means if you ever change your AI provider (say, switch from Gemini to OpenAI), you only change one file: `lib/ai.ts`. Nothing else breaks.

**Why put API routes inside `app/api/`?**
Next.js App Router lets you write backend code inside the same project as your frontend. No separate server needed. The `route.ts` file inside `app/api/recommend/` becomes the URL `/api/recommend` automatically. This is why we can deploy the whole thing on Vercel for free — one project, one deployment.

**Why `types/skin.ts`?**
TypeScript is strict about data shapes. If the AI returns a product without a `whyItWorks` field, TypeScript will warn you at build time — not after a user complains. The types file defines the exact shape of every piece of data in the app. Think of it as a contract between all parts of the system.

---

## Tech stack — what, why, and cost

### Next.js — Frontend framework
**What it is:** The framework that powers the entire app — both the pages users see and the backend API routes.

**Why we chose it:** It runs frontend and backend together in one project. No need for a separate Express server. Deploys to Vercel for free. Has TypeScript and Tailwind built in.

**Why not plain React?** Plain React is only frontend. You'd need a separate backend server to call Gemini and Supabase securely. Next.js combines both.

**Cost:** Free forever on Vercel hobby plan.

---

### Google Gemini API — The AI brain
**What it is:** Google's AI model that reads your skin profile and generates personalized recommendations.

**Why we chose it over ChatGPT / Claude:** Gemini 1.5 Flash has a genuinely free tier — 1 million tokens per day, 15 requests per minute. OpenAI and Anthropic (Claude) have no free tier. For a starting project, Gemini is the only honest choice if cost is zero.

**Why not build our own recommendation logic?** A traditional if-else approach would need thousands of rules. "If oily skin AND acne AND humid climate AND budget under ₹500 THEN recommend X." That breaks the moment a new concern or product exists. AI understands context. You give it the profile in plain English and it reasons through it like a dermatologist.

**Cost:** Free up to 1M tokens/day. One full quiz + result = roughly 1,500 tokens. You can handle 600+ users per day on the free tier.

---

### Supabase — Database
**What it is:** A free, hosted PostgreSQL database with a clean dashboard.

**Why we chose it:** Free tier gives 500MB storage and 50,000 rows — enough for thousands of users in Phase 1. Has a visual table editor so you can see your data without writing SQL queries. Also has built-in auth for Phase 3 when we add login.

**Why not Firebase?** Firebase is a good alternative but stores data as unstructured documents. Supabase uses SQL — structured rows and columns. Structured data is easier to query, analyse, and export later. Also, Supabase supports `pgvector` — a feature we'll use in Phase 2 for AI-powered ingredient search.

**Why store results at all if we use localStorage?** localStorage is per-device. If a user switches from phone to laptop, their results are gone. Supabase lets us retrieve results across devices using the session ID. Also gives us data to analyse — which skin types are most common, which products get recommended most, etc.

**Cost:** Free forever up to 500MB.

---

### Tailwind CSS — Styling
**What it is:** A utility-first CSS framework. Instead of writing CSS files, you apply pre-built class names directly in your HTML.

**Why we chose it:** Comes built into Next.js setup. Makes it fast to build clean, minimal UI without writing a single CSS file from scratch. Responsive by default.

**Cost:** Free forever.

---

### Cloudinary — Image storage (Phase 2+)
**What it is:** A cloud service that stores and serves images.

**Why not AWS S3?** S3 gives 5GB free then charges. Cloudinary gives 25GB free bandwidth per month and never asks for a credit card to start. For product images in a skincare app, Cloudinary is the smarter free choice.

**Cost:** Free up to 25GB/month.

---

## Every file explained

### `types/skin.ts`
This file defines the shape of all data in the app. Nothing stores or processes data without matching one of these types.

```
SkinType        → oily | dry | combination | sensitive | normal
SkinConcern     → acne | pigmentation | ageing | dullness | etc.
SkinGoal        → clear skin | even tone | hydration | etc.
ClimateZone     → humid | dry | tropical | cold | mixed
SkinProfile     → combines all of the above into one object
ProductRecommendation → one product with name, brand, price, whyItWorks, ingredients
AnalysisResult  → the full AI output — products + food + routine + ingredients to avoid
```

**Why `whyItWorks` is a required field:**
Every other skincare app shows you a product. This app explains exactly why that product suits your specific skin type, your specific concern, and your climate. That explanation is what builds trust. Without it, you're just another recommendation engine. With it, you're an advisor.

---

### `lib/questions.ts`
Contains the 6 quiz questions. Each question has an `id`, a `type` (single or multi select), and a list of options.

**Why 6 questions and not more?**
Every extra question reduces completion rate. We tested the minimum number of questions needed to build a meaningful skin profile. Six covers: age, skin type, concerns, goals, climate, and budget. That is enough for Gemini to generate specific, accurate recommendations. More questions would feel like a form, not a quiz.

**Why the climate question?**
Most skincare apps ignore this. A heavy moisturiser that works in Delhi's dry winter will cause breakouts in Hyderabad's humid summer. Climate is one of the biggest factors in what products actually work. We ask it because it genuinely changes the recommendation.

**Why budget in rupees?**
This app is Indian-first. Showing prices in USD or generic "low/medium/high" without context is useless. ₹500, ₹2000 — these are numbers Indian users understand immediately.

---

### `lib/ai.ts`
The single file that talks to Gemini. Contains one function: `analyseSkin(profile)`.

**Why one function, one file?**
If you ever want to switch from Gemini to another AI provider, you change code in exactly one place. No hunting through 20 files. This is called the Single Responsibility Principle — one file does one job.

**Why does the prompt say "Return ONLY a valid JSON object"?**
AI models like to add helpful explanations before and after their answer. "Sure! Here is the JSON you requested..." That breaks `JSON.parse()`. The prompt is explicit: no markdown, no preamble, no explanation. Just raw JSON. The `cleaned` line in the code strips any accidental backticks Gemini sometimes adds anyway — a safety net.

**Why build the `buyLink` as an Amazon India search URL?**
We do not have affiliate deals. We do not scrape live prices. Amazon search URLs always work, always show current prices, and always show real availability. It is honest and reliable. A hardcoded product URL could go dead in a week.

---

### `lib/supabase.ts`
Handles all database operations. Three functions:

- `saveSkinProfile()` — saves quiz answers and AI results together as one row
- `getSkinProfile()` — fetches the latest result for a session ID
- `generateSessionId()` — creates a unique ID for each user session

**Why save both `profile` and `result` in the same row?**
They belong together. A result without its profile has no context. Storing them together means you can always look at a result and know exactly what inputs produced it. Useful for debugging, for analytics, and for Phase 3 when users can see their history.

**Why `jsonb` column type in the database?**
`jsonb` is PostgreSQL's binary JSON column. It stores flexible, nested data — perfect for a skin profile that has arrays of concerns and goals. It is also indexable and queryable. You can later run SQL like `WHERE profile->>'skinType' = 'oily'` to analyse your user data.

---

### `app/api/recommend/route.ts`
The backend API endpoint. Lives at the URL `/api/recommend`.

**What it does step by step:**
1. Receives `profile` and `sessionId` from the frontend
2. Validates that both exist
3. Calls `analyseSkin(profile)` from `lib/ai.ts`
4. Saves the result to Supabase
5. Returns the result to the frontend as JSON

**Why validate on the server, not just the frontend?**
Frontend validation can be bypassed. Anyone can send a raw HTTP request to your API without using your UI. Server-side validation is the real guard. If `profile` or `sessionId` is missing, the API returns a 400 error immediately — no wasted Gemini API calls.

**Why `try/catch` around everything?**
If Gemini returns an unexpected format, or Supabase is temporarily down, the app should not crash with a blank white screen. The `try/catch` catches any error and returns a clean error message the frontend can display to the user.

---

### `components/Quiz.tsx`
The 6-question quiz UI. Reads questions from `lib/questions.ts` and builds a `SkinProfile` from the answers.

**Why inline styles instead of Tailwind classes?**
For core layout components that need pixel-precise control, inline styles are more predictable. Tailwind is great for utility styling but can be unpredictable when you need exact values like specific border widths, transition timings, and animation keyframes in the same component.

**Why a progress bar?**
Users abandon multi-step forms when they do not know how long they will take. A progress bar reduces anxiety. Even a thin 3px line at the top showing "you are 50% done" meaningfully increases quiz completion rates.

**Why `buildProfile()` inside the component?**
It maps raw quiz answers (strings) to the typed `SkinProfile` object. Keeping it inside the Quiz component means the Quiz is fully self-contained — it takes nothing in except `onComplete`, and it gives back a clean typed profile. The parent page does not need to know anything about how the quiz works internally.

---

### `components/Results.tsx`
Displays the full AI output. No logic — only presentation.

**Why separate Results from the main page?**
The main page (`page.tsx`) manages state — quiz, loading, results. The Results component only knows how to display a result it is given. This is the separation of concerns principle. If you want to redesign the results page, you touch only `Results.tsx`. The logic in `page.tsx` stays untouched.

**Why show ingredients to avoid?**
This is the trust-building feature. Every other app tells you what to buy. Telling users what NOT to buy — and why — is rare, honest, and genuinely useful. It shows the app is working for the user, not for a brand.

---

### `app/page.tsx`
The main page. Manages three states: `quiz`, `loading`, and `results`.

**Why three states instead of just two?**
The AI call takes 5–10 seconds. Without a loading state, users see nothing and assume the app is broken. The spinner with "Analysing your skin profile..." tells users exactly what is happening and how to wait.

**Why check localStorage on load?**
If a user has already taken the quiz, they should see their results immediately — not the quiz again. On every page load, we check if a result exists in localStorage. If yes, skip the quiz and show results directly. This makes the app feel like it remembers the user without requiring any login.

**Why generate a new session ID on retake?**
Each quiz attempt is a separate session. If we reused the same session ID on retake, the old result would be overwritten in the database. By generating a fresh ID, we keep a history of every attempt. Useful for Phase 3 when users can see how their skin profile has changed over time.

---

## The AI prompt — how it works

The prompt sent to Gemini is structured in three parts:

**Part 1 — Role definition:**
```
You are an expert dermatologist and skincare advisor 
with deep knowledge of Indian skincare brands.
```
Giving the AI a specific role makes its output more focused and domain-specific. A general AI gives general answers. A "dermatologist who knows Indian brands" gives specific, relevant answers.

**Part 2 — User context:**
```
Age range: 18-24
Skin type: oily
Concerns: acne, pigmentation
Budget: medium (₹500–₹2000/month)
Prefer Indian brands: Yes
```
Every field from the skin profile is injected here. The AI uses all of these together — not independently — to reason about what works for this specific person.

**Part 3 — Output rules:**
```
Return ONLY valid JSON. No markdown. No explanation.
Recommend exactly 5 products.
If budget is low, only recommend products under ₹500.
whyItWorks must mention their specific skin type and at least one concern.
```
Rules in the prompt enforce consistency. Without them, the AI sometimes returns 3 products, sometimes 7, sometimes adds an introduction paragraph. Rules make the output predictable enough to parse programmatically every time.

---

## Database design — why we did it this way

The `skin_profiles` table has exactly 5 columns:

```sql
id          uuid      → unique identifier for each row (auto-generated)
session_id  text      → links the row to a browser session
profile     jsonb     → the raw skin profile from the quiz
result      jsonb     → the full AI output
created_at  timestamp → when the quiz was taken
```

**Why store `profile` and `result` as `jsonb` and not as separate columns?**
The skin profile has arrays — a user can select multiple concerns, multiple goals. Storing these as separate columns would require a complex table structure with joins. `jsonb` stores the whole object as-is. Simpler to write, simpler to read, simpler to change later.

**Why two indexes?**
- `idx_skin_profiles_session_id` — makes it fast to find a specific user's result by their session ID
- `idx_skin_profiles_created_at` — makes it fast to sort results by date (used to fetch the latest result)

Without indexes, every lookup scans the entire table row by row. With indexes, the database jumps directly to the right rows. At 1,000 rows it does not matter. At 100,000 rows, without indexes the app becomes slow.

---

## Session system — no login needed

Phase 1 has no login. Here is how users are still identified:

```
First visit
→ Generate a unique session ID (e.g. session_1720000000_ab3f9c2)
→ Save session ID to localStorage in the browser
→ User takes quiz
→ Result saved to Supabase with that session ID
→ Result saved to localStorage

Return visit
→ Read session ID from localStorage
→ Read result from localStorage
→ Show results immediately — no quiz, no loading
```

**Why localStorage and Supabase both?**
localStorage is instant — no network call. We show results from localStorage immediately. Supabase is the backup — if the user clears their browser or switches devices, we can still fetch their result using the session ID.

**What is the weakness of this system?**
If a user clears browser data, their session ID is gone. They will need to retake the quiz. This is acceptable for Phase 1. Phase 3 adds proper login so results are tied to an account, not a browser.

---

## How to run this locally

**Prerequisites:**
- Node.js 18 or above installed
- A Supabase account (free at supabase.com)
- A Google AI Studio account (free at aistudio.google.com)

**Steps:**

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/skin-app.git
cd skin-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Open .env.local and fill in your keys

# 4. Run the development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

---

## Environment variables

Create a `.env.local` file in the root of the project with these four values:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
```

**Where to get each key:**

| Key | Where to get it | Cost |
|---|---|---|
| `GEMINI_API_KEY` | aistudio.google.com → Get API key | Free |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API | Free |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API | Free |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | cloudinary.com → Dashboard | Free |

**Why does `GEMINI_API_KEY` not have `NEXT_PUBLIC_` prefix?**
Variables with `NEXT_PUBLIC_` are exposed to the browser. Anyone who visits your site can see them in the page source. The Gemini API key must stay secret — it lives only on the server. Supabase's `anon` key is designed to be public — Supabase's row-level security handles access control.

---

## What comes in Phase 2 and 3

### Phase 2 — Product analyser
The "does this work for my skin?" feature. A user finds a product on Nykaa or Amazon, shares the link or a screenshot, and the app:
- Reads the product's ingredient list
- Cross-checks against their skin profile
- Explains which ingredients help, which harm, and gives an overall compatibility score

New files in Phase 2:
- `app/api/analyse/route.ts` — handles link and image input
- `components/Analyser.tsx` — the UI for the analyser
- Cloudinary integration for image uploads

### Phase 3 — Personal space + accounts
- Google login and OTP login
- Saved skin profile tied to an account
- History of past quiz results
- Routine tracker with reminders
- Mobile PWA — works like an app on Android and iOS
- Conversion to Android and iOS apps

---

## Commit history — Phase 1

```
phase 1 step 1 — project setup
phase 1 step 2 — types, questions, ai and supabase connectors
phase 1 complete — quiz, AI recommendations, results UI
```

---

Built with zero paid tools. Deployed for free. Designed for India.
