'use client'

import { useState, useEffect } from 'react'
import Quiz from '@/components/Quiz'
import Results from '@/components/Results'
import Analyser from '@/components/Analyser'
import Login from '@/components/Login'
import RoutineTracker from '@/components/RoutineTracker'
import { SkinProfile, AnalysisResult, AuthUser } from '@/types/skin'
import {
  generateSessionId,
  getSession,
  onAuthStateChange,
  signOut,
  getUserProfile,
  supabase,
} from '@/lib/supabase'

type AppState =
  | 'checking'
  | 'welcome_back'
  | 'quiz'
  | 'loading'
  | 'results'
  | 'analyser'
  | 'login'
  | 'tracker'
  

export default function Home() {
  const [state, setState] = useState<AppState>('checking')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      // Check for logged in session first
      const session = await getSession()

      if (session?.user) {
        const user = session.user
        setAuthUser({
          id: user.id,
          email: user.email ?? null,
          provider: (user.app_metadata?.provider as 'google' | 'email') ?? 'email',
        })
        setToken(session.access_token)
        setSessionId(user.id)

        // Fetch skin profile from user_profiles
        const userProfile = await getUserProfile(user.id)
        if (userProfile?.skinType) {
          // Reconstruct result from localStorage if available
          const cachedResult = localStorage.getItem(`skin_result_${user.id}`)
          if (cachedResult) {
            try {
              setResult(JSON.parse(cachedResult))
              setState('results')
              return
            } catch {
              localStorage.removeItem(`skin_result_${user.id}`)
            }
          }
          // Profile exists but no cached result — show welcome back
          setState('welcome_back')
          return
        }

        // Logged in but no profile yet — take quiz
        setState('quiz')
        return
      }

      // Not logged in — check anonymous session
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
    }

    init()

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (session) => {
      if (session?.user) {
        setAuthUser({
          id: session.user.id,
          email: session.user.email ?? null,
          provider: (session.user.app_metadata?.provider as 'google' | 'email') ?? 'email',
        })
        setToken(session.access_token)
        setSessionId(session.user.id)

        const userProfile = await getUserProfile(session.user.id)
        if (userProfile?.skinType) {
          const cachedResult = localStorage.getItem(`skin_result_${session.user.id}`)
          if (cachedResult) {
            try {
              setResult(JSON.parse(cachedResult))
              setState('results')
              return
            } catch {}
          }
          setState('welcome_back')
        } else {
          setState('quiz')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleQuizComplete(profile: SkinProfile) {
    setState('loading')
    setError('')

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers,
        body: JSON.stringify({ profile, sessionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Cache result
      const cacheKey = authUser
        ? `skin_result_${authUser.id}`
        : 'skin_result'
      localStorage.setItem(cacheKey, JSON.stringify(data.result))

      if (!authUser) {
        localStorage.setItem('skin_session_id', sessionId)
      }

      setResult(data.result)
      setState('results')

    } catch (err: any) {
      setError('Something went wrong. Please try again.')
      setState('quiz')
    }
  }

  function handleRetake() {
    if (authUser) {
      localStorage.removeItem(`skin_result_${authUser.id}`)
    } else {
      localStorage.removeItem('skin_result')
      const newId = generateSessionId()
      setSessionId(newId)
      localStorage.setItem('skin_session_id', newId)
    }
    setResult(null)
    setState('quiz')
  }

  function handleContinue() {
    setState('results')
  }

  async function handleSignOut() {
    await signOut()
    localStorage.clear()
    setAuthUser(null)
    setToken(null)
    setResult(null)
    const newId = generateSessionId()
    setSessionId(newId)
    localStorage.setItem('skin_session_id', newId)
    setState('quiz')
  }

  // ── CHECKING ──
  if (state === 'checking') {
    return <div style={{ minHeight: '100vh', backgroundColor: '#fafaf8' }} />
  }

  // ── LOADING ──
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

  // ── LOGIN ──
  if (state === 'login') {
    return (
      <Login
        showSkip={!!result}
        onSkip={() => setState(result ? 'results' : 'quiz')}
      />
    )
  }

  // ── WELCOME BACK ──
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
            {authUser ? `Signed in as ${authUser.email}` : 'Welcome back'}
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
            marginBottom: '8px',
          }}>
            Skin type:{' '}
            <span style={{
              color: '#1a1a1a',
              fontWeight: '600',
              textTransform: 'capitalize',
            }}>
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
              marginBottom: '10px',
              fontFamily: 'inherit',
            }}
          >
            See my results →
          </button>

          {/* Show sign in nudge only for anonymous users */}
          {!authUser && (
            <button
              onClick={() => setState('login')}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1.5px solid #1a1a1a',
                backgroundColor: 'transparent',
                color: '#1a1a1a',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '10px',
                fontFamily: 'inherit',
              }}
            >
              Save profile to account
            </button>
          )}

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

  // ── MAIN APP ──
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
          whiteSpace: 'nowrap',
        }}>
          {error}
        </div>
      )}

      {/* Top bar — only when logged in */}
      {authUser && (state === 'results' || state === 'analyser') && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '48px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e8e6e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 100,
        }}>
          <p style={{
            fontSize: '11px',
            color: '#999',
            letterSpacing: '1px',
          }}>
            {authUser.email}
          </p>
          <button
            onClick={handleSignOut}
            style={{
              fontSize: '11px',
              color: '#999',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Sign out
          </button>
        </div>
      )}

      {/* Bottom nav */}
      {(state === 'results' || state === 'analyser' || state === 'tracker') && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e8e6e0',
          display: 'flex',
          zIndex: 100,
        }}>
          {[
            { key: 'results', label: 'My Profile' },
            { key: 'analyser', label: 'Check Product' },
            { key: 'tracker', label: 'Routine' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setState(tab.key as AppState)}
              style={{
                flex: 1,
                padding: '16px 8px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '11px',
                fontWeight: '600',
                color: state === tab.key ? '#1a1a1a' : '#999',
                cursor: 'pointer',
                borderTop: state === tab.key
                  ? '2px solid #1a1a1a'
                  : '2px solid transparent',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{
        paddingTop: authUser && (state === 'results' || state === 'analyser' || state === 'tracker')
          ? '48px' : '0',
        paddingBottom: state === 'results' || state === 'analyser' || state === 'tracker'
          ? '64px' : '0',
      }}>
        {state === 'quiz' && (
          <Quiz onComplete={handleQuizComplete} />
        )}
        {state === 'results' && result && (
          <Results
            result={result}
            onRetake={handleRetake}
            userId={authUser?.id ?? null}
          />
        )}
        {state === 'analyser' && (
          <Analyser
            sessionId={sessionId}
            token={token}
          />
        )}
        {state === 'tracker' && result && authUser && (
          <RoutineTracker
            result={result}
            userId={authUser.id}
          />
        )}

        {state === 'tracker' && !authUser && (
          <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '13px',
              color: '#999',
              lineHeight: '1.7',
              marginBottom: '24px',
              maxWidth: '280px',
            }}>
              Sign in to track your daily routine and build a streak.
            </p>
            <button
              onClick={() => setState('login')}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Sign in →
            </button>
          </div>
        )}
      </div>
    </>
  )
}