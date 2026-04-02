import { NextRequest, NextResponse } from 'next/server'
import { analyseProduct } from '@/lib/ai'
import { getSkinProfile } from '@/lib/supabase'
import { AnalyseRequest } from '@/types/skin'

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

    const saved = await getSkinProfile(sessionId)

    if (!saved) {
      return NextResponse.json(
        { error: 'No skin profile found. Please complete the quiz first.' },
        { status: 404 }
      )
    }

    const profile = saved.profile

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