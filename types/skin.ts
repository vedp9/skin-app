export type SkinType = 
  | 'oily' 
  | 'dry' 
  | 'combination' 
  | 'sensitive' 
  | 'normal'

export type SkinConcern = 
  | 'acne'
  | 'pigmentation'
  | 'ageing'
  | 'dullness'
  | 'darkCircles'
  | 'uneven texture'
  | 'pores'
  | 'redness'

export type SkinGoal =
  | 'clear skin'
  | 'even tone'
  | 'hydration'
  | 'anti ageing'
  | 'brightening'
  | 'oil control'

export type ClimateZone =
  | 'humid'
  | 'dry'
  | 'tropical'
  | 'cold'
  | 'mixed'

export interface SkinProfile {
  skinType: SkinType
  concerns: SkinConcern[]
  goals: SkinGoal[]
  climate: ClimateZone
  ageRange: '13-17' | '18-24' | '25-34' | '35-44' | '45+'
  budget: 'low' | 'medium' | 'high'
  indianFirst: boolean
}

export interface QuizAnswer {
  questionId: string
  answer: string | string[]
}

export interface ProductRecommendation {
  name: string
  brand: string
  category: string
  price: string
  whyItWorks: string
  ingredients: string[]
  concerns: SkinConcern[]
  buyLink: string
  imageUrl?: string
}

export interface AnalysisResult {
  profile: SkinProfile
  recommendations: ProductRecommendation[]
  foodSuggestions: string[]
  ingredientsToAvoid: string[]
  morningRoutine: string[]
  nightRoutine: string[]
}

export interface IngredientAnalysis {
  name: string
  effect: 'beneficial' | 'harmful' | 'neutral'
  reason: string
}

export interface ProductAnalysis {
  productName: string
  brand: string
  overallScore: number
  verdict: 'yes' | 'no' | 'caution'
  verdictReason: string
  beneficialIngredients: IngredientAnalysis[]
  harmfulIngredients: IngredientAnalysis[]
  neutralIngredients: IngredientAnalysis[]
  safeToUse: boolean
  alternativeSuggestion?: string
}

export interface AnalyseRequest {
  sessionId: string
  inputType: 'link' | 'text' | 'image'
  content: string
}

export interface UserProfile {
  id: string
  email: string | null
  skinType: SkinType | null
  concerns: SkinConcern[]
  goals: SkinGoal[]
  climate: ClimateZone | null
  ageRange: string | null
  budget: 'low' | 'medium' | 'high' | null
  createdAt: string
  updatedAt: string
}

export interface QuizHistoryEntry {
  id: string
  userId: string
  profile: SkinProfile
  result: AnalysisResult
  takenAt: string
}

export interface RoutineLog {
  id: string
  userId: string
  date: string
  morningDone: boolean
  nightDone: boolean
}

export interface AuthUser {
  id: string
  email: string | null
  provider: 'google' | 'email'
}