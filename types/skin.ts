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