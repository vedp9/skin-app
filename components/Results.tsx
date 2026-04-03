'use client'

import { AnalysisResult } from '@/types/skin'
import { useState } from 'react'

import QuizHistory from '@/components/QuizHistory'

interface ResultsProps {
  result: AnalysisResult
  onRetake: () => void
  userId?: string | null
}

export default function Results({ result, onRetake, userId }: ResultsProps) {
  const [tab, setTab] = useState<'current' | 'history'>('current')
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
          Your skin profile
        </p>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          letterSpacing: '-1px',
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}>
          {result.profile.skinType.charAt(0).toUpperCase() + result.profile.skinType.slice(1)} skin
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '24px',
        }}>
          {result.profile.concerns.join(' · ')}
        </p>

        {/* Tab bar — only for logged in users with history */}
        {userId && (
          <div style={{
            display: 'flex',
            gap: '0',
            marginBottom: '28px',
            borderBottom: '1px solid var(--border)',
          }}>
            {[
              { key: 'current', label: 'Current results' },
              { key: 'history', label: 'Past results' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as 'current' | 'history')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: tab === t.key ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  borderBottom: tab === t.key
                    ? '2px solid var(--accent)'
                    : '2px solid transparent',
                  marginBottom: '-1px',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      {(tab === 'current' || !userId) && (
        <>
        {/* Recommendations */}
        <h2 style={{
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '16px',
        }}>
          Recommended products
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          {result.recommendations.map((product, i) => (
            <div key={i} style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '20px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px',
              }}>
                <div>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '4px',
                  }}>
                    {product.category}
                  </p>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--accent)',
                  }}>
                    {product.brand} — {product.name}
                  </p>
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--accent)',
                  whiteSpace: 'nowrap',
                  marginLeft: '12px',
                }}>
                  {product.price}
                </span>
              </div>

              <p style={{
                fontSize: '13px',
                color: 'var(--tag-text)',
                lineHeight: '1.6',
                marginBottom: '12px',
              }}>
                {product.whyItWorks}
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '14px',
              }}>
                {product.ingredients.map((ing, j) => (
                  <span key={j} style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    backgroundColor: 'var(--tag-bg)',
                    borderRadius: '100px',
                    color: 'var(--text-secondary)',
                  }}>
                    {ing}
                  </span>
                ))}
              </div>

              
              <a
                href={product.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--accent)',
                  paddingBottom: '1px',
                }}
              >
                View on Amazon India →
              </a>
            </div>
          ))}
        </div>

        {/* Ingredients to avoid */}
        <h2 style={{
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '16px',
        }}>
          Ingredients to avoid
        </h2>
        <div style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid #fde8e0',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '40px',
        }}>
          {result.ingredientsToAvoid.map((item, i) => (
            <p key={i} style={{
              fontSize: '13px',
              color: 'var(--tag-text)',
              lineHeight: '1.7',
              paddingBottom: i < result.ingredientsToAvoid.length - 1 ? '10px' : '0',
              borderBottom: i < result.ingredientsToAvoid.length - 1 ? '1px solid #fde8e0' : 'none',
              marginBottom: i < result.ingredientsToAvoid.length - 1 ? '10px' : '0',
            }}>
              {item}
            </p>
          ))}
        </div>

        {/* Food suggestions */}
        <h2 style={{
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '16px',
        }}>
          Foods for your skin
        </h2>
        <div style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid #e0f0e8',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '40px',
        }}>
          {result.foodSuggestions.map((item, i) => (
            <p key={i} style={{
              fontSize: '13px',
              color: 'var(--tag-text)',
              lineHeight: '1.7',
              paddingBottom: i < result.foodSuggestions.length - 1 ? '10px' : '0',
              borderBottom: i < result.foodSuggestions.length - 1 ? '1px solid #e0f0e8' : 'none',
              marginBottom: i < result.foodSuggestions.length - 1 ? '10px' : '0',
            }}>
              {item}
            </p>
          ))}
        </div>

        {/* Routines */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '40px',
        }}>
          <div style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '14px',
            }}>
              Morning
            </p>
            {result.morningRoutine.map((step, i) => (
              <p key={i} style={{
                fontSize: '12px',
                color: 'var(--tag-text)',
                lineHeight: '1.7',
                marginBottom: '6px',
              }}>
                {step}
              </p>
            ))}
          </div>
          <div style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '14px',
            }}>
              Night
            </p>
            {result.nightRoutine.map((step, i) => (
              <p key={i} style={{
                fontSize: '12px',
                color: 'var(--tag-text)',
                lineHeight: '1.7',
                marginBottom: '6px',
              }}>
                {step}
              </p>
            ))}
          </div>
        </div>
        </>
      )}
      {/* History tab */}
      {tab === 'history' && userId && (
        <QuizHistory
          userId={userId}
          onViewResult={(entry) => {
            // Future: navigate to historical result
            alert(`Result from ${new Date(entry.takenAt).toLocaleDateString('en-IN')} — ${entry.profile.skinType} skin`)
          }}
        />
      )}
        {/* Retake */}
        <button
          onClick={onRetake}
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
          Retake quiz
        </button>

      </div>
    </div>
  )
}