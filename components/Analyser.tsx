'use client'

import { useState } from 'react'
import { ProductAnalysis } from '@/types/skin'

interface AnalyserProps {
  sessionId: string
  token?: string | null
}

type InputType = 'link' | 'text' | 'image'
type AnalyserState = 'idle' | 'loading' | 'result' | 'error'

export default function Analyser({ sessionId, token }: AnalyserProps) {
  const [inputType, setInputType] = useState<InputType>('link')
  const [content, setContent] = useState('')
  const [state, setState] = useState<AnalyserState>('idle')
  const [result, setResult] = useState<ProductAnalysis | null>(null)
  const [error, setError] = useState('')

  async function handleAnalyse() {
    if (!content.trim()) return
    setState('loading')
    setError('')
    setResult(null)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers,
        body: JSON.stringify({ sessionId, inputType, content }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setResult(data.result)
      setState('result')

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setState('error')
    }
  }

  function handleReset() {
    setContent('')
    setResult(null)
    setError('')
    setState('idle')
  }

  const scoreColor = (score: number) =>
    score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626'

  const verdictLabel = {
    yes: '✓ Good for your skin',
    caution: '⚠ Use with caution',
    no: '✗ Not recommended',
  }

  const verdictBg = {
    yes: { bg: 'var(--success-bg)', border: 'var(--success-border)', color: 'var(--success-text)' },
    caution: { bg: 'var(--warn-bg)', border: 'var(--warn-border)', color: 'var(--warn-text)' },
    no: { bg: 'var(--danger-bg)', border: 'var(--danger-border)', color: 'var(--danger-text)' },
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* Header */}
        <p style={{
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}>
          Product check
        </p>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: 'var(--accent)',
          marginBottom: '8px',
          lineHeight: '1.3',
        }}>
          Does this work<br />for your skin?
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '36px',
          lineHeight: '1.6',
        }}>
          Share a product link, paste ingredients, or describe the product.
          We check it against your skin profile.
        </p>

        {/* Input type selector */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
        }}>
          {(['link', 'text', 'image'] as InputType[]).map(type => (
            <button
              key={type}
              onClick={() => { setInputType(type); setContent('') }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: inputType === type
                  ? '1.5px solid var(--accent)'
                  : '1.5px solid var(--border)',
                backgroundColor: inputType === type ? 'var(--accent)' : 'var(--surface)',
                color: inputType === type ? 'var(--accent-text)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {type === 'link' ? '🔗 Link' : type === 'text' ? '📋 Ingredients' : '📷 Screenshot'}
            </button>
          ))}
        </div>

        {/* Input area */}
        {state !== 'result' && (
          <div style={{ marginBottom: '16px' }}>
            {inputType === 'link' && (
              <input
                type="url"
                placeholder="Paste product URL from Amazon, Nykaa, etc."
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  fontSize: '14px',
                  color: 'var(--accent)',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            )}

            {inputType === 'text' && (
              <textarea
                placeholder={`Paste the ingredient list here.\n\nExample:\nWater, Niacinamide 10%, Zinc PCA, Glycerin, Sodium Hyaluronate...`}
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  fontSize: '13px',
                  color: 'var(--accent)',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                }}
              />
            )}

            {inputType === 'image' && (
              <div>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  marginBottom: '10px',
                  lineHeight: '1.6',
                }}>
                  Screenshot upload coming soon. For now, take a screenshot,
                  read the ingredients from it, and paste them using the
                  Ingredients tab above.
                </p>
                <div
                  onClick={() => setInputType('text')}
                  style={{
                    width: '100%',
                    padding: '32px',
                    borderRadius: '12px',
                    border: '1.5px dashed var(--border)',
                    backgroundColor: 'var(--surface)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                  }}
                >
                  Switch to paste ingredients →
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analyse button */}
        {state !== 'result' && inputType !== 'image' && (
          <button
            onClick={handleAnalyse}
            disabled={!content.trim() || state === 'loading'}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: !content.trim() || state === 'loading'
                ? 'var(--border)'
                : 'var(--accent)',
              color: !content.trim() || state === 'loading'
                ? 'var(--text-muted)'
                : 'var(--accent-text)',
              fontSize: '15px',
              fontWeight: '600',
              cursor: !content.trim() || state === 'loading'
                ? 'not-allowed'
                : 'pointer',
              transition: 'all 0.15s ease',
              marginBottom: '32px',
            }}
          >
            {state === 'loading' ? 'Analysing...' : 'Check this product →'}
          </button>
        )}

        {/* Loading */}
        {state === 'loading' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            padding: '40px 0',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2.5px solid var(--border)',
              borderTop: '2.5px solid var(--accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Checking ingredients against your skin profile...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div style={{
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '16px',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--danger-text)' }}>{error}</p>
            <button
              onClick={handleReset}
              style={{
                marginTop: '12px',
                fontSize: '12px',
                color: 'var(--danger-text)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {state === 'result' && result && (
          <div>

            {/* Product header */}
            <div style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '12px',
            }}>
              <p style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}>
                {result.brand}
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'var(--accent)',
                marginBottom: '16px',
              }}>
                {result.productName}
              </p>

              {/* Score */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
              }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: scoreColor(result.overallScore),
                  lineHeight: 1,
                }}>
                  {result.overallScore}
                </div>
                <div>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '2px',
                  }}>
                    Skin compatibility score
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--tag-text)' }}>
                    out of 100 for your skin profile
                  </p>
                </div>
              </div>

              {/* Verdict */}
              <div style={{
                backgroundColor: verdictBg[result.verdict].bg,
                border: `1px solid ${verdictBg[result.verdict].border}`,
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '12px',
              }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: verdictBg[result.verdict].color,
                  marginBottom: '4px',
                }}>
                  {verdictLabel[result.verdict]}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: verdictBg[result.verdict].color,
                  lineHeight: '1.6',
                  opacity: 0.85,
                }}>
                  {result.verdictReason}
                </p>
              </div>

              {/* Alternative suggestion */}
              {result.alternativeSuggestion && (
                <div style={{
                  backgroundColor: '#f8f7f4',
                  borderRadius: '10px',
                  padding: '12px 16px',
                }}>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '4px',
                  }}>
                    Better alternative
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--accent)', lineHeight: '1.6' }}>
                    {result.alternativeSuggestion}
                  </p>
                </div>
              )}
            </div>

            {/* Beneficial ingredients */}
            {result.beneficialIngredients.length > 0 && (
              <div style={{
                backgroundColor: 'var(--success-bg)',
                border: '1px solid var(--success-border)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '12px',
              }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'var(--success-text)',
                  marginBottom: '14px',
                }}>
                  Works for your skin
                </p>
                {result.beneficialIngredients.map((ing, i) => (
                  <div key={i} style={{
                    paddingBottom: i < result.beneficialIngredients.length - 1 ? '12px' : '0',
                    borderBottom: i < result.beneficialIngredients.length - 1
                      ? '1px solid var(--success-border)' : 'none',
                    marginBottom: i < result.beneficialIngredients.length - 1 ? '12px' : '0',
                  }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--success-text)',
                      marginBottom: '2px',
                    }}>
                      {ing.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#166534', lineHeight: '1.6' }}>
                      {ing.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Harmful ingredients */}
            {result.harmfulIngredients.length > 0 && (
              <div style={{
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '12px',
              }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'var(--danger-text)',
                  marginBottom: '14px',
                }}>
                  Watch out for your skin
                </p>
                {result.harmfulIngredients.map((ing, i) => (
                  <div key={i} style={{
                    paddingBottom: i < result.harmfulIngredients.length - 1 ? '12px' : '0',
                    borderBottom: i < result.harmfulIngredients.length - 1
                      ? '1px solid var(--danger-border)' : 'none',
                    marginBottom: i < result.harmfulIngredients.length - 1 ? '12px' : '0',
                  }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--danger-text)',
                      marginBottom: '2px',
                    }}>
                      {ing.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9f1239', lineHeight: '1.6' }}>
                      {ing.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Neutral ingredients */}
            {result.neutralIngredients.length > 0 && (
              <div style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px',
              }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '14px',
                }}>
                  Neutral for your skin
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  {result.neutralIngredients.map((ing, i) => (
                    <span key={i} style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      backgroundColor: 'var(--tag-bg)',
                      borderRadius: '100px',
                      color: 'var(--tag-text)',
                    }}>
                      {ing.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Check another */}
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1.5px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--accent)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Check another product
            </button>

          </div>
        )}

      </div>
    </div>
  )
}