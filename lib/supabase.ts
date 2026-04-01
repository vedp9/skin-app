import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function saveSkinProfile(
  sessionId: string,
  profile: object,
  result: object
) {
  const { data, error } = await supabase
    .from('skin_profiles')
    .insert([
      {
        session_id: sessionId,
        profile,
        result,
        created_at: new Date().toISOString(),
      },
    ])
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

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}