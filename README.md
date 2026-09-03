# Skin App

An AI-powered skincare assistant that provides personalized skincare guidance and product-compatibility insights for Indian users.

> Educational guidance only — not medical advice, diagnosis, or a substitute for a dermatologist.

## Live Demo

🔗 **Live App:** https://skin-mate-app.vercel.app 
💻 **Repository:** https://github.com/vedp9/skin-app

## What It Does

Skin App collects a user’s skin profile through a six-question quiz covering skin type, concerns, goals, climate, age group, and budget.

Using Google Gemini, the app generates personalized skincare recommendations, including suggested routines, product guidance, ingredients to consider or avoid, and lifestyle tips. Users can also paste a product link or ingredient list to receive a compatibility assessment based on their profile.

## Key Features

- Personalized skincare profile quiz
- AI-generated skincare recommendations using Gemini
- Product and ingredient compatibility analysis
- Compatibility score with helpful and potentially unsuitable ingredients
- Morning and night routine suggestions
- Routine tracker with progress history
- User authentication and saved profiles
- Mobile-first responsive design
- Progressive Web App (PWA) support

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **AI:** Google Gemini API
- **Backend and Database:** Supabase and PostgreSQL
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **PWA:** Service worker and web manifest

## Run Locally

### Prerequisites

- Node.js 18 or later
- npm
- A Supabase project
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/vedp9/skin-app.git
cd skin-app
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Highlights

- Built an end-to-end AI application combining user profiling, generative AI, API routes, authentication, and persistent user data.
- Designed the experience for Indian skincare needs, including climate, budget, and local product considerations.
- Implemented an ingredient-analysis workflow that turns user input into understandable compatibility guidance.

## Future Improvements

### Personalization and tracking

- Add weekly skin check-ins for users to record dryness, irritation, breakouts, redness, or product reactions
- Build an adaptive routine that updates recommendations based on progress, user feedback, climate, budget, and current skin concerns
- Add product categories, routine reminders, refill reminders, and a simple progress dashboard
- Add Indian product discovery with filters for budget, availability, skin type, fragrance-free options, and key ingredients
- Add product-label image upload with OCR to extract ingredient lists automatically

### Ingredient intelligence

- Build a more detailed ingredient-compatibility engine that identifies potential irritants, fragrance, comedogenic concerns, active ingredients, duplicates, and ingredient conflicts
- Explain why each ingredient may be helpful or unsuitable for a user’s profile in simple language
- Add a routine conflict checker for combinations such as multiple exfoliating acids, retinoids, benzoyl peroxide, or other potentially irritating active ingredients
- Add a “skin barrier mode” that simplifies a routine when the user reports irritation, dryness, or sensitivity

### Agentic workflow

- Add a single **Skincare Routine Coach Agent** that reviews a user’s profile, current routine, check-ins, product list, and goals before suggesting safe next steps
- Add a **Product Research Agent** that gathers structured product details from approved sources and summarizes ingredients, price, size, availability, and suitability
- Add a **Routine Review Agent** that detects duplicate actives, possible conflicts, missing basics such as sunscreen or moisturizer, and overly complex routines
- Add a **Safety Triage Agent** that detects red-flag symptoms and recommends pausing self-guidance and consulting a qualified dermatologist
- Add human approval controls so the user can review and accept any routine change before it is saved

### Trust, safety, and privacy

- Add stronger medical-safety guardrails: avoid diagnosis, avoid treatment claims, and clearly recommend dermatologist support for persistent, severe, painful, infected, or rapidly changing symptoms
- Cite reliable educational sources for ingredient explanations and recommendations
- Add transparent explanations of how recommendations are generated and which user inputs influenced them
- Add consent, data-export, and account-deletion controls for sensitive skin-profile information
- Add dermatologist-reviewed educational content and clearly separate general guidance from clinical advice

### Product quality

- Add automated tests for API routes, validation, authentication, and ingredient-analysis logic
- Add analytics for recommendation usefulness, user feedback, and routine adherence
- Add screenshot uploads, onboarding improvements, accessibility checks, and performance optimization

### Agent design aim for:

```
User profile + routine + weekly check-in
                ↓
      Routine Coach Orchestrator
                ↓
Product Research | Ingredient Safety | Routine Review
                ↓
      Safety Triage and Guardrails
                ↓
User reviews and approves recommendation
```
## Author

**Veda Praneeth**

- GitHub: [@vedp9](https://github.com/vedp9)

## License

This project is maintained for learning and portfolio purposes.
