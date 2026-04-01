import { SkinType, SkinConcern, SkinGoal, ClimateZone } from '@/types/skin'

export interface Question {
  id: string
  question: string
  subtext?: string
  type: 'single' | 'multi'
  options: {
    label: string
    value: string
    emoji: string
  }[]
}

export const questions: Question[] = [
  {
    id: 'ageRange',
    question: 'How old are you?',
    type: 'single',
    options: [
      { label: '13 – 17', value: '13-17', emoji: '🌱' },
      { label: '18 – 24', value: '18-24', emoji: '✨' },
      { label: '25 – 34', value: '25-34', emoji: '🌿' },
      { label: '35 – 44', value: '35-44', emoji: '🍃' },
      { label: '45+',     value: '45+',   emoji: '🌳' },
    ],
  },
  {
    id: 'skinType',
    question: 'How does your skin feel by midday?',
    subtext: 'Without any products on',
    type: 'single',
    options: [
      { label: 'Shiny all over',        value: 'oily',        emoji: '💧' },
      { label: 'Tight and flaky',       value: 'dry',         emoji: '🏜️' },
      { label: 'Oily T-zone only',      value: 'combination', emoji: '〰️' },
      { label: 'Reacts to everything',  value: 'sensitive',   emoji: '🌸' },
      { label: 'Balanced, comfortable', value: 'normal',      emoji: '🙂' },
    ],
  },
  {
    id: 'concerns',
    question: 'What bothers you most about your skin?',
    subtext: 'Pick all that apply',
    type: 'multi',
    options: [
      { label: 'Acne and breakouts',   value: 'acne',            emoji: '🔴' },
      { label: 'Dark spots',           value: 'pigmentation',    emoji: '🟤' },
      { label: 'Fine lines / ageing',  value: 'ageing',          emoji: '⏳' },
      { label: 'Dull skin',            value: 'dullness',        emoji: '😶' },
      { label: 'Dark circles',         value: 'darkCircles',     emoji: '👁️' },
      { label: 'Rough texture',        value: 'uneven texture',  emoji: '🪨' },
      { label: 'Large pores',          value: 'pores',           emoji: '🔬' },
      { label: 'Redness',              value: 'redness',         emoji: '🌹' },
    ],
  },
  {
    id: 'goals',
    question: 'What do you want your skin to look like?',
    subtext: 'Pick up to 2',
    type: 'multi',
    options: [
      { label: 'Clear, no breakouts', value: 'clear skin',    emoji: '✅' },
      { label: 'Even skin tone',      value: 'even tone',     emoji: '🎯' },
      { label: 'Deeply hydrated',     value: 'hydration',     emoji: '💦' },
      { label: 'Younger looking',     value: 'anti ageing',   emoji: '⏪' },
      { label: 'Glowing, bright',     value: 'brightening',   emoji: '☀️' },
      { label: 'Matte, less oily',    value: 'oil control',   emoji: '🧊' },
    ],
  },
  {
    id: 'climate',
    question: 'Where do you live?',
    subtext: 'Climate affects your skin daily',
    type: 'single',
    options: [
      { label: 'Humid — coastal',    value: 'humid',    emoji: '🌊' },
      { label: 'Dry — interior',     value: 'dry',      emoji: '🌵' },
      { label: 'Tropical — hot',     value: 'tropical', emoji: '🌴' },
      { label: 'Cold — hilly',       value: 'cold',     emoji: '❄️' },
      { label: 'Mixed — changes',    value: 'mixed',    emoji: '🌤️' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your monthly skincare budget?',
    type: 'single',
    options: [
      { label: 'Under ₹500',       value: 'low',    emoji: '🪙' },
      { label: '₹500 – ₹2000',    value: 'medium', emoji: '💳' },
      { label: 'Above ₹2000',     value: 'high',   emoji: '💎' },
    ],
  },
]