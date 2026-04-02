'use client'

import { AnalysisResult } from '@/types/skin'

interface ResultsProps {
  result: AnalysisResult
  onRetake: () => void
}

export default function Results({ result, onRetake }: ResultsProps) {
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
          Your skin profile
        </p>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '8px',
        }}>
          {result.profile.skinType.charAt(0).toUpperCase() + result.profile.skinType.slice(1)} skin
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#999',
          marginBottom: '40px',
        }}>
          {result.profile.concerns.join(' · ')}
        </p>

        {/* Recommendations */}
        <h2 style={{
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: '#999',
          marginBottom: '16px',
        }}>
          Recommended products
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          {result.recommendations.map((product, i) => (
            <div key={i} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8e6e0',
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
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '4px',
                  }}>
                    {product.category}
                  </p>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                  }}>
                    {product.brand} — {product.name}
                  </p>
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  whiteSpace: 'nowrap',
                  marginLeft: '12px',
                }}>
                  {product.price}
                </span>
              </div>

              <p style={{
                fontSize: '13px',
                color: '#666',
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
                    backgroundColor: '#f4f3f0',
                    borderRadius: '100px',
                    color: '#666',
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
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  borderBottom: '1px solid #1a1a1a',
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
          color: '#999',
          marginBottom: '16px',
        }}>
          Ingredients to avoid
        </h2>
        <div style={{
          backgroundColor: '#fff8f6',
          border: '1px solid #fde8e0',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '40px',
        }}>
          {result.ingredientsToAvoid.map((item, i) => (
            <p key={i} style={{
              fontSize: '13px',
              color: '#666',
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
          color: '#999',
          marginBottom: '16px',
        }}>
          Foods for your skin
        </h2>
        <div style={{
          backgroundColor: '#f6fbf8',
          border: '1px solid #e0f0e8',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '40px',
        }}>
          {result.foodSuggestions.map((item, i) => (
            <p key={i} style={{
              fontSize: '13px',
              color: '#666',
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
            backgroundColor: '#ffffff',
            border: '1px solid #e8e6e0',
            borderRadius: '14px',
            padding: '20px',
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '14px',
            }}>
              Morning
            </p>
            {result.morningRoutine.map((step, i) => (
              <p key={i} style={{
                fontSize: '12px',
                color: '#666',
                lineHeight: '1.7',
                marginBottom: '6px',
              }}>
                {step}
              </p>
            ))}
          </div>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e8e6e0',
            borderRadius: '14px',
            padding: '20px',
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '14px',
            }}>
              Night
            </p>
            {result.nightRoutine.map((step, i) => (
              <p key={i} style={{
                fontSize: '12px',
                color: '#666',
                lineHeight: '1.7',
                marginBottom: '6px',
              }}>
                {step}
              </p>
            ))}
          </div>
        </div>

        {/* Retake */}
        <button
          onClick={onRetake}
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
          Retake quiz
        </button>

      </div>
    </div>
  )
}