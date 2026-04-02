'use client'

import { useState } from 'react'
import { ProductAnalysis } from '@/types/skin'

interface AnalyserProps {
  sessionId: string
  token?: string | null
}

type InputType = 'link' | 'text' | 'image'
type AnalyserState = 'idle' | 'loading' | 'result' | 'error'

export default function Analyser({ sessionId }: AnalyserProps) {
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
    yes: { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
    caution: { bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
    no: { bg: '#fff1f2', border: '#fecdd3', color: '#be123c' },
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fafaf8',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* Header */}
        <p style={{
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#999',
          marginBottom: '8px',
        }}>
          Product check
        </p>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '8px',
          lineHeight: '1.3',
        }}>
          Does this work<br />for your skin?
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#999',
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
                  ? '1.5px solid #1a1a1a'
                  : '1.5px solid #e8e6e0',
                backgroundColor: inputType === type ? '#1a1a1a' : '#ffffff',
                color: inputType === type ? '#ffffff' : '#999',
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
                  border: '1.5px solid #e8e6e0',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  color: '#1a1a1a',
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
                  border: '1.5px solid #e8e6e0',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  color: '#1a1a1a',
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
                  color: '#999',
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
                    border: '1.5px dashed #e8e6e0',
                    backgroundColor: '#ffffff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    color: '#999',
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
                ? '#e8e6e0'
                : '#1a1a1a',
              color: !content.trim() || state === 'loading'
                ? '#999'
                : '#ffffff',
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
              border: '2.5px solid #e8e6e0',
              borderTop: '2.5px solid #1a1a1a',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ fontSize: '13px', color: '#999' }}>
              Checking ingredients against your skin profile...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div style={{
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '16px',
          }}>
            <p style={{ fontSize: '13px', color: '#be123c' }}>{error}</p>
            <button
              onClick={handleReset}
              style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#be123c',
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
              backgroundColor: '#ffffff',
              border: '1px solid #e8e6e0',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '12px',
            }}>
              <p style={{
                fontSize: '11px',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}>
                {result.brand}
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1a1a1a',
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
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '2px',
                  }}>
                    Skin compatibility score
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
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
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '4px',
                  }}>
                    Better alternative
                  </p>
                  <p style={{ fontSize: '13px', color: '#1a1a1a', lineHeight: '1.6' }}>
                    {result.alternativeSuggestion}
                  </p>
                </div>
              )}
            </div>

            {/* Beneficial ingredients */}
            {result.beneficialIngredients.length > 0 && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '12px',
              }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#15803d',
                  marginBottom: '14px',
                }}>
                  Works for your skin
                </p>
                {result.beneficialIngredients.map((ing, i) => (
                  <div key={i} style={{
                    paddingBottom: i < result.beneficialIngredients.length - 1 ? '12px' : '0',
                    borderBottom: i < result.beneficialIngredients.length - 1
                      ? '1px solid #bbf7d0' : 'none',
                    marginBottom: i < result.beneficialIngredients.length - 1 ? '12px' : '0',
                  }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#15803d',
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
                backgroundColor: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '12px',
              }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#be123c',
                  marginBottom: '14px',
                }}>
                  Watch out for your skin
                </p>
                {result.harmfulIngredients.map((ing, i) => (
                  <div key={i} style={{
                    paddingBottom: i < result.harmfulIngredients.length - 1 ? '12px' : '0',
                    borderBottom: i < result.harmfulIngredients.length - 1
                      ? '1px solid #fecdd3' : 'none',
                    marginBottom: i < result.harmfulIngredients.length - 1 ? '12px' : '0',
                  }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#be123c',
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
                backgroundColor: '#ffffff',
                border: '1px solid #e8e6e0',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px',
              }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#999',
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
                      backgroundColor: '#f4f3f0',
                      borderRadius: '100px',
                      color: '#666',
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
                border: '1.5px solid #e8e6e0',
                backgroundColor: 'transparent',
                color: '#1a1a1a',
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