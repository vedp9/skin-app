import { createClient } from '@supabase/supabase-js'
import { SkinProfile, AnalysisResult, UserProfile, QuizHistoryEntry, RoutineLog } from '@/types/skin'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── SESSION (Phase 1+2 anonymous) ──────────────────────────

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export async function saveSkinProfile(
  sessionId: string,
  profile: object,
  result: object
) {
  const { data, error } = await supabase
    .from('skin_profiles')
    .insert([{
      session_id: sessionId,
      profile,
      result,
      created_at: new Date().toISOString(),
    }])
    .select()

  if (error) {
    console.error('Supabase save error:', error)
    return null
  }
  return data
}

export async function getSkinProfile(sessionId: string) {
  const { data, error } = await supabase
    .from('skin_profiles')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Supabase fetch error:', error)
    return null
  }
  return data
}

// ── AUTH ───────────────────────────────────────────────────

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) console.error('Google sign in error:', error)
  return { data, error }
}

export async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) console.error('Email OTP error:', error)
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Sign out error:', error)
  return { error }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) console.error('Get session error:', error)
  return data.session
}

export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}

// ── USER PROFILE ───────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Get user profile error:', error)
    return null
  }

  return {
    id: data.id,
    email: data.email,
    skinType: data.skin_type,
    concerns: data.concerns || [],
    goals: data.goals || [],
    climate: data.climate,
    ageRange: data.age_range,
    budget: data.budget,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function saveUserProfile(
  userId: string,
  email: string | null,
  profile: SkinProfile
) {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      email,
      skin_type: profile.skinType,
      concerns: profile.concerns,
      goals: profile.goals,
      climate: profile.climate,
      age_range: profile.ageRange,
      budget: profile.budget,
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error('Save user profile error:', error)
    return null
  }
  return data
}

// ── QUIZ HISTORY ───────────────────────────────────────────

export async function saveQuizHistory(
  userId: string,
  profile: SkinProfile,
  result: AnalysisResult
) {
  const { data, error } = await supabase
    .from('quiz_history')
    .insert([{
      user_id: userId,
      profile,
      result,
      taken_at: new Date().toISOString(),
    }])
    .select()

  if (error) {
    console.error('Save quiz history error:', error)
    return null
  }
  return data
}

export async function getQuizHistory(userId: string): Promise<QuizHistoryEntry[]> {
  const { data, error } = await supabase
    .from('quiz_history')
    .select('*')
    .eq('user_id', userId)
    .order('taken_at', { ascending: false })

  if (error) {
    console.error('Get quiz history error:', error)
    return []
  }

  return data.map(row => ({
    id: row.id,
    userId: row.user_id,
    profile: row.profile,
    result: row.result,
    takenAt: row.taken_at,
  }))
}

// ── ROUTINE LOGS ───────────────────────────────────────────

export async function getTodayRoutineLog(userId: string): Promise<RoutineLog | null> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('routine_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (error) return null

  return {
    id: data.id,
    userId: data.user_id,
    date: data.date,
    morningDone: data.morning_done,
    nightDone: data.night_done,
  }
}

export async function upsertRoutineLog(
  userId: string,
  morningDone: boolean,
  nightDone: boolean
) {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('routine_logs')
    .upsert({
      user_id: userId,
      date: today,
      morning_done: morningDone,
      night_done: nightDone,
    }, {
      onConflict: 'user_id,date',
    })
    .select()

  if (error) {
    console.error('Upsert routine log error:', error)
    return null
  }
  return data
}

export async function getRoutineStreak(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('routine_logs')
    .select('date, morning_done, night_done')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(30)

  if (error || !data) return 0

  let streak = 0
  const today = new Date()

  for (let i = 0; i < data.length; i++) {
    const logDate = new Date(data[i].date)
    const diffDays = Math.floor(
      (today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === i && (data[i].morning_done || data[i].night_done)) {
      streak++
    } else {
      break
    }
  }

  return streak
}