'use client'

import { useState, useEffect } from 'react'
import Quiz from '@/components/Quiz'
import Results from '@/components/Results'
import { SkinProfile, AnalysisResult } from '@/types/skin'
import { generateSessionId } from '@/lib/supabase'

type AppState = 'quiz' | 'loading' | 'results'

export default function Home() {
  const [state, setState] = useState<AppState>('quiz')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const existing = localStorage.getItem('skin_session_id')
    const existingResult = localStorage.getItem('skin_result')

    if (existing && existingResult) {
      try {
        const parsed = JSON.parse(existingResult)
        setSessionId(existing)
        setResult(parsed)
        setState('results')
        return
      } catch {
        localStorage.removeItem('skin_session_id')
        localStorage.removeItem('skin_result')
      }
    }

    const newId = generateSessionId()
    setSessionId(newId)
    localStorage.setItem('skin_session_id', newId)
  }, [])

  async function handleQuizComplete(profile: SkinProfile) {
    setState('loading')
    setError('')

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, sessionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      localStorage.setItem('skin_result', JSON.stringify(data.result))
      setResult(data.result)
      setState('results')

    } catch (err) {
      setError('Something went wrong. Please try again.')
      setState('quiz')
    }
  }

  function handleRetake() {
    localStorage.removeItem('skin_result')
    const newId = generateSessionId()
    setSessionId(newId)
    localStorage.setItem('skin_session_id', newId)
    setResult(null)
    setState('quiz')
  }

  if (state === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafaf8',
        gap: '20px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '2.5px solid #e8e6e0',
          borderTop: '2.5px solid #1a1a1a',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{
          fontSize: '14px',
          color: '#999',
          letterSpacing: '0.5px',
        }}>
          Analysing your skin profile...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '100px',
          fontSize: '13px',
          zIndex: 1000,
        }}>
          {error}
        </div>
      )}
      {state === 'quiz' && (
        <Quiz onComplete={handleQuizComplete} />
      )}
      {state === 'results' && result && (
        <Results result={result} onRetake={handleRetake} />
      )}
    </>
  )
}