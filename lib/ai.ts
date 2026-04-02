import { GoogleGenerativeAI } from '@google/generative-ai'
import { SkinProfile, AnalysisResult, ProductAnalysis } from '@/types/skin'

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

export async function analyseProduct(
  content: string,
  inputType: 'link' | 'text' | 'image',
  profile: SkinProfile
): Promise<ProductAnalysis> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

  const contextBlock = `
The user's skin profile:
- Skin type: ${profile.skinType}
- Concerns: ${profile.concerns.join(', ')}
- Goals: ${profile.goals.join(', ')}
- Climate: ${profile.climate}
- Age range: ${profile.ageRange}
- Budget: ${profile.budget}
`

  const inputBlock =
    inputType === 'link'
      ? `The user has shared this product URL: ${content}
         Visit the URL mentally and identify the product name, brand, and ingredient list.`
      : inputType === 'text'
      ? `The user has shared this ingredient list or product description:
         ${content}`
      : `The user has shared a screenshot. Extract the product name, brand, and ingredient list from this text found in the image:
         ${content}`

  const prompt = `
You are an expert cosmetic dermatologist and ingredient safety analyst.

${contextBlock}

${inputBlock}

Your task: Analyse every ingredient in this product against the user's skin profile.

Return ONLY a valid JSON object. No markdown. No explanation. No extra text. Just raw JSON.

The JSON must follow this exact structure:
{
  "productName": "exact product name",
  "brand": "brand name",
  "overallScore": 85,
  "verdict": "yes",
  "verdictReason": "2 sentence explanation of the overall verdict specific to their skin type and concerns",
  "beneficialIngredients": [
    {
      "name": "ingredient name",
      "effect": "beneficial",
      "reason": "specific reason this helps their skin type or concern"
    }
  ],
  "harmfulIngredients": [
    {
      "name": "ingredient name",
      "effect": "harmful",
      "reason": "specific reason this is bad for their skin type or concern"
    }
  ],
  "neutralIngredients": [
    {
      "name": "ingredient name",
      "effect": "neutral",
      "reason": "neither helps nor harms their specific profile"
    }
  ],
  "safeToUse": true,
  "alternativeSuggestion": "only fill this if verdict is no or caution — suggest a specific better product"
}

Rules:
- overallScore must be a number from 0 to 100
- verdict must be exactly one of: "yes", "no", "caution"
- "yes" = score above 70, no harmful ingredients for their skin type
- "caution" = score 40 to 70, some ingredients may cause issues
- "no" = score below 40, contains ingredients clearly harmful for their skin type
- safeToUse is true only when verdict is "yes"
- Every ingredient must appear in exactly one of the three lists
- reasons must mention their specific skin type or at least one concern
- If the URL or content does not contain a recognisable product or ingredient list, return:
  { "error": "Could not identify product or ingredients from the provided input" }
- alternativeSuggestion: only include when verdict is "no" or "caution", otherwise omit the field
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const cleaned = text.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(cleaned)

  if (parsed.error) {
    throw new Error(parsed.error)
  }

  return parsed as ProductAnalysis
}