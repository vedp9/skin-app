'use client'

import { useState, useEffect } from 'react'
import { QuizHistoryEntry } from '@/types/skin'
import { getQuizHistory } from '@/lib/supabase'

interface QuizHistoryProps {
  userId: string
  onViewResult: (entry: QuizHistoryEntry) => void
}

export default function QuizHistory({ userId, onViewResult }: QuizHistoryProps) {
  const [history, setHistory] = useState<QuizHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getQuizHistory(userId)
      setHistory(data)
      setLoading(false)
    }
    load()
  }, [userId])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 0',
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '2px solid #e8e6e0',
          borderTop: '2px solid #1a1a1a',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div style={{
        padding: '32px 0',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '13px',
          color: '#999',
          lineHeight: '1.7',
        }}>
          No previous quiz results yet.
          <br />
          Retake the quiz to build your history.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 0 16px' }}>

      <p style={{
        fontSize: '11px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: '#999',
        marginBottom: '16px',
      }}>
        {history.length} {history.length === 1 ? 'result' : 'results'}
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {history.map((entry, i) => {
          const isLatest = i === 0

          return (
            <div
              key={entry.id}
              style={{
                backgroundColor: '#ffffff',
                border: `1px solid ${isLatest ? '#1a1a1a' : '#e8e6e0'}`,
                borderRadius: '14px',
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
              onClick={() => onViewResult(entry)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '10px',
              }}>
                <div>
                  {isLatest && (
                    <span style={{
                      fontSize: '9px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      backgroundColor: '#f4f3f0',
                      padding: '3px 8px',
                      borderRadius: '100px',
                      display: 'inline-block',
                      marginBottom: '8px',
                    }}>
                      Latest
                    </span>
                  )}
                  <p style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    textTransform: 'capitalize',
                    marginBottom: '2px',
                  }}>
                    {entry.profile.skinType} skin
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#999',
                  }}>
                    {entry.profile.concerns.join(' · ')}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#1a1a1a',
                    fontWeight: '500',
                    marginBottom: '2px',
                  }}>
                    {formatDate(entry.takenAt)}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: '#999',
                  }}>
                    {formatTime(entry.takenAt)}
                  </p>
                </div>
              </div>

              {/* Goals as pills */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}>
                {entry.profile.goals.map((goal, j) => (
                  <span key={j} style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    backgroundColor: '#f4f3f0',
                    borderRadius: '100px',
                    color: '#666',
                  }}>
                    {goal}
                  </span>
                ))}
                <span style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  backgroundColor: '#f4f3f0',
                  borderRadius: '100px',
                  color: '#666',
                }}>
                  {entry.profile.budget} budget
                </span>
                <span style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  backgroundColor: '#f4f3f0',
                  borderRadius: '100px',
                  color: '#666',
                }}>
                  {entry.profile.climate}
                </span>
              </div>

              <p style={{
                fontSize: '11px',
                color: '#ccc',
                marginTop: '12px',
              }}>
                Tap to view recommendations →
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}