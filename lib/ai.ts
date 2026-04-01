import { GoogleGenerativeAI } from '@google/generative-ai'
import { SkinProfile, AnalysisResult } from '@/types/skin'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyseSkin(profile: SkinProfile): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

  const prompt = `
You are an expert dermatologist and skincare advisor with deep knowledge of Indian skincare brands.

A user has completed a skin quiz. Here is their profile:
- Age range: ${profile.ageRange}
- Skin type: ${profile.skinType}
- Concerns: ${profile.concerns.join(', ')}
- Goals: ${profile.goals.join(', ')}
- Climate: ${profile.climate}
- Budget: ${profile.budget} ${profile.budget === 'low' ? '(under ₹500/month)' : profile.budget === 'medium' ? '(₹500–₹2000/month)' : '(above ₹2000/month)'}
- Prefer Indian brands: ${profile.indianFirst ? 'Yes, prioritise Indian brands first' : 'No preference'}

Your task: Give a complete, honest, science-backed skincare analysis.

Return ONLY a valid JSON object. No markdown. No explanation. No extra text. Just raw JSON.

The JSON must follow this exact structure:
{
  "profile": {
    "skinType": "${profile.skinType}",
    "concerns": ${JSON.stringify(profile.concerns)},
    "goals": ${JSON.stringify(profile.goals)},
    "climate": "${profile.climate}",
    "ageRange": "${profile.ageRange}",
    "budget": "${profile.budget}",
    "indianFirst": ${profile.indianFirst}
  },
  "recommendations": [
    {
      "name": "product name",
      "brand": "brand name",
      "category": "cleanser | toner | serum | moisturiser | sunscreen | treatment",
      "price": "₹XXX",
      "whyItWorks": "specific reason this suits their exact skin type, concerns and climate in 2 sentences",
      "ingredients": ["key ingredient 1", "key ingredient 2"],
      "concerns": ["concern this targets"],
      "buyLink": "https://www.amazon.in/s?k=product+name+brand",
      "imageUrl": ""
    }
  ],
  "foodSuggestions": [
    "specific food with reason why it helps their skin concern"
  ],
  "ingredientsToAvoid": [
    "ingredient name — reason why it is bad for their specific skin type"
  ],
  "morningRoutine": [
    "Step 1: ...",
    "Step 2: ..."
  ],
  "nightRoutine": [
    "Step 1: ...",
    "Step 2: ..."
  ]
}

Rules:
- Recommend exactly 5 products covering: cleanser, moisturiser, sunscreen, serum, and one treatment
- If budget is low, only recommend products under ₹500
- If indianFirst is true, first 3 products must be Indian brands (Minimalist, Dot & Key, Plum, Mamaearth, Pilgrim, Re-equil, Cosrx India etc.)
- whyItWorks must mention their specific skin type and at least one concern
- foodSuggestions: give exactly 5 foods with reasons
- ingredientsToAvoid: give exactly 4 ingredients with reasons
- morningRoutine and nightRoutine: give exactly 4 steps each
- buyLink must be a real Amazon India search URL for that product
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const cleaned = text.replace(/```json|```/g, '').trim()
  const parsed: AnalysisResult = JSON.parse(cleaned)

  return parsed
}