'use client'

import { useState, useEffect } from 'react'
import Quiz from '@/components/Quiz'
import Results from '@/components/Results'
import Analyser from '@/components/Analyser'
import { SkinProfile, AnalysisResult } from '@/types/skin'
import { generateSessionId } from '@/lib/supabase'

type AppState = 'checking' | 'welcome_back' | 'quiz' | 'loading' | 'results' | 'analyser'

export default function Home() {
  const [state, setState] = useState<AppState>('checking')
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
        setState('welcome_back')
        return
      } catch {
        localStorage.removeItem('skin_session_id')
        localStorage.removeItem('skin_result')
      }
    }

    const newId = generateSessionId()
    setSessionId(newId)
    localStorage.setItem('skin_session_id', newId)
    setState('quiz')
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

    } catch (err: any) {
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

  function handleContinue() {
    setState('results')
  }

  // Checking localStorage — blank screen for <100ms, not visible
  if (state === 'checking') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafaf8' }} />
    )
  }

  // Loading spinner
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
        <p style={{ fontSize: '14px', color: '#999', letterSpacing: '0.5px' }}>
          Analysing your skin profile...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Welcome back screen — returning users only
  if (state === 'welcome_back') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafaf8',
        padding: '24px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <p style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#999',
            marginBottom: '12px',
          }}>
            Welcome back
          </p>

          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a1a1a',
            lineHeight: '1.3',
            marginBottom: '8px',
          }}>
            Your skin profile<br />is ready.
          </h1>

          <p style={{
            fontSize: '13px',
            color: '#999',
            lineHeight: '1.7',
            marginBottom: '12px',
          }}>
            Skin type:{' '}
            <span style={{ color: '#1a1a1a', fontWeight: '600', textTransform: 'capitalize' }}>
              {result?.profile.skinType}
            </span>
          </p>

          <p style={{
            fontSize: '13px',
            color: '#999',
            lineHeight: '1.7',
            marginBottom: '40px',
          }}>
            Concerns:{' '}
            <span style={{ color: '#1a1a1a', fontWeight: '600' }}>
              {result?.profile.concerns.join(', ')}
            </span>
          </p>

          {/* Primary — continue */}
          <button
            onClick={handleContinue}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '12px',
              fontFamily: 'inherit',
            }}
          >
            See my results →
          </button>

          {/* Secondary — retake */}
          <button
            onClick={handleRetake}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1.5px solid #e8e6e0',
              backgroundColor: 'transparent',
              color: '#999',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Retake quiz
          </button>

        </div>
      </div>
    )
  }

  return (
    <>
      {/* Error toast */}
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
          whiteSpace: 'nowrap',
        }}>
          {error}
        </div>
      )}

      {/* Bottom nav — only after quiz done */}
      {(state === 'results' || state === 'analyser') && (
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e8e6e0',
          display: 'flex',
          zIndex: 100,
        }}>
          <button
            onClick={() => setState('results')}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '12px',
              fontWeight: '600',
              color: state === 'results' ? '#1a1a1a' : '#999',
              cursor: 'pointer',
              borderTop: state === 'results'
                ? '2px solid #1a1a1a'
                : '2px solid transparent',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
            }}
          >
            My Skin Profile
          </button>
          <button
            onClick={() => setState('analyser')}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '12px',
              fontWeight: '600',
              color: state === 'analyser' ? '#1a1a1a' : '#999',
              cursor: 'pointer',
              borderTop: state === 'analyser'
                ? '2px solid #1a1a1a'
                : '2px solid transparent',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
            }}
          >
            Check a Product
          </button>
        </div>
      )}

      {/* Pages */}
      <div style={{
        paddingBottom: state === 'results' || state === 'analyser' ? '64px' : '0',
      }}>
        {state === 'quiz' && (
          <Quiz onComplete={handleQuizComplete} />
        )}
        {state === 'results' && result && (
          <Results result={result} onRetake={handleRetake} />
        )}
        {state === 'analyser' && (
          <Analyser sessionId={sessionId} />
        )}
      </div>
    </>
  )
}