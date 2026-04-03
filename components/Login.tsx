'use client'

import { useState } from 'react'
import { signInWithGoogle, signInWithEmail } from '@/lib/supabase'

interface LoginProps {
  onSkip?: () => void
  showSkip?: boolean
}

export default function Login({ onSkip, showSkip = false }: LoginProps) {
  const [mode, setMode] = useState<'options' | 'email' | 'sent'>('options')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setLoading(true)
    setError('')
    const { error } = await signInWithGoogle()
    if (error) {
      setError('Could not connect to Google. Please try again.')
      setLoading(false)
    }
  }

  async function handleEmailSubmit() {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await signInWithEmail(email)

    if (error) {
      setError('Could not send login link. Please try again.')
      setLoading(false)
      return
    }

    setMode('sent')
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Header */}
        <p style={{
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '12px',
        }}>
          Save your profile
        </p>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: 'var(--accent)',
          lineHeight: '1.3',
          marginBottom: '8px',
        }}>
          {mode === 'sent'
            ? 'Check your email.'
            : 'Sign in to keep\nyour results.'}
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          lineHeight: '1.7',
          marginBottom: '40px',
        }}>
          {mode === 'sent'
            ? `We sent a login link to ${email}. Click it to sign in — no password needed.`
            : 'Access your skin profile from any device. No password needed.'}
        </p>

        {/* Options mode */}
        {mode === 'options' && (
          <>
            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                border: '1.5px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--accent)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '16px 0',
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            </div>

            {/* Email option */}
            <button
              onClick={() => setMode('email')}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                border: '1.5px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--accent)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '24px',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              Continue with Email
            </button>
          </>
        )}

        {/* Email mode */}
        {mode === 'email' && (
          <>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
              autoFocus
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1.5px solid var(--border)',
                backgroundColor: 'var(--surface)',
                fontSize: '14px',
                color: 'var(--accent)',
                outline: 'none',
                marginBottom: '10px',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: loading ? 'var(--border)' : 'var(--accent)',
                color: loading ? 'var(--text-muted)' : 'var(--accent-text)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '12px',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              {loading ? 'Sending...' : 'Send login link →'}
            </button>
            <button
              onClick={() => { setMode('options'); setError('') }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
              }}
            >
              ← Back
            </button>
          </>
        )}

        {/* Sent mode */}
        {mode === 'sent' && (
          <div style={{
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--success-text)', lineHeight: '1.6' }}>
              Login link sent. Check your inbox and spam folder.
              The link expires in 10 minutes.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
          }}>
            <p style={{ fontSize: '12px', color: 'var(--danger-text)' }}>{error}</p>
          </div>
        )}

        {/* Skip option — only for returning users */}
        {showSkip && onSkip && mode !== 'sent' && (
          <button
            onClick={onSkip}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '12px',
              border: '1.5px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '8px',
              fontFamily: 'inherit',
            }}
          >
            Continue without signing in
          </button>
        )}

        {/* Privacy note */}
        <p style={{
          fontSize: '11px',
          color: 'var(--text-faint)',
          textAlign: 'center',
          marginTop: '24px',
          lineHeight: '1.6',
        }}>
          No password. No spam. Your skin data stays private.
        </p>

      </div>
    </div>
  )
}