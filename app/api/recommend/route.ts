import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { analyseSkin } from '@/lib/ai'
import { saveSkinProfile, saveUserProfile, saveQuizHistory } from '@/lib/supabase'
import { SkinProfile } from '@/types/skin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { profile, sessionId } = body as {
      profile: SkinProfile
      sessionId: string
    }

    if (!profile || !sessionId) {
      return NextResponse.json(
        { error: 'Missing profile or sessionId' },
        { status: 400 }
      )
    }

    const result = await analyseSkin(profile)

    // Always save to anonymous skin_profiles (Phase 1+2 fallback)
    await saveSkinProfile(sessionId, profile, result)

    // If user is logged in, also save to user tables
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)

      if (user) {
        await saveUserProfile(user.id, user.email ?? null, profile)
        await saveQuizHistory(user.id, profile, result)
      }
    }

    return NextResponse.json({ success: true, result })

  } catch (error) {
    console.error('Recommend API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}