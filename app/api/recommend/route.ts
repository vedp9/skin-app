import { NextRequest, NextResponse } from 'next/server'
import { analyseSkin } from '@/lib/ai'
import { saveSkinProfile } from '@/lib/supabase'
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

    await saveSkinProfile(sessionId, profile, result)

    return NextResponse.json({ success: true, result })

  } catch (error) {
    console.error('Recommend API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}