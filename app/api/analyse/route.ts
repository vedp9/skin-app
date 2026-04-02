import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { analyseProduct } from '@/lib/ai'
import { getSkinProfile, getUserProfile } from '@/lib/supabase'
import { AnalyseRequest, SkinProfile } from '@/types/skin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, inputType, content } = body as AnalyseRequest

    if (!sessionId || !inputType || !content) {
      return NextResponse.json(
        { error: 'Missing sessionId, inputType or content' },
        { status: 400 }
      )
    }

    if (!['link', 'text', 'image'].includes(inputType)) {
      return NextResponse.json(
        { error: 'inputType must be link, text or image' },
        { status: 400 }
      )
    }

    if (content.trim().length < 5) {
      return NextResponse.json(
        { error: 'Content is too short to analyse' },
        { status: 400 }
      )
    }

    let profile: SkinProfile | null = null

    // Try logged in user profile first
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)

      if (user) {
        const userProfile = await getUserProfile(user.id)
        if (userProfile && userProfile.skinType) {
          profile = {
            skinType: userProfile.skinType!,
            concerns: userProfile.concerns as SkinProfile['concerns'],
            goals: userProfile.goals as SkinProfile['goals'],
            climate: userProfile.climate!,
            ageRange: userProfile.ageRange as SkinProfile['ageRange'],
            budget: userProfile.budget!,
            indianFirst: true,
          }
        }
      }
    }

    // Fall back to anonymous session profile
    if (!profile) {
      const saved = await getSkinProfile(sessionId)
      if (!saved) {
        return NextResponse.json(
          { error: 'No skin profile found. Please complete the quiz first.' },
          { status: 404 }
        )
      }
      profile = saved.profile as SkinProfile
    }

    const result = await analyseProduct(content, inputType, profile)

    return NextResponse.json({ success: true, result })

  } catch (error: any) {
    console.error('Analyse API error:', error)

    if (error.message?.includes('Could not identify')) {
      return NextResponse.json(
        { error: error.message },
        { status: 422 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}