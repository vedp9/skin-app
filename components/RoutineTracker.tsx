'use client'

import { useState, useEffect } from 'react'
import { AnalysisResult, RoutineLog } from '@/types/skin'
import { upsertRoutineLog, getTodayRoutineLog, getRoutineStreak } from '@/lib/supabase'

interface RoutineTrackerProps {
  result: AnalysisResult
  userId: string
}

export default function RoutineTracker({ result, userId }: RoutineTrackerProps) {
  const [log, setLog] = useState<RoutineLog | null>(null)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const [todayLog, currentStreak] = await Promise.all([
        getTodayRoutineLog(userId),
        getRoutineStreak(userId),
      ])
      setLog(todayLog)
      setStreak(currentStreak)
      setLoading(false)
    }
    load()
  }, [userId])

  async function toggleMorning() {
    if (saving) return
    setSaving(true)
    const newMorning = !log?.morningDone
    const newNight = log?.nightDone ?? false
    const updated = await upsertRoutineLog(userId, newMorning, newNight)
    if (updated) {
      setLog({
        id: updated[0].id,
        userId,
        date: updated[0].date,
        morningDone: updated[0].morning_done,
        nightDone: updated[0].night_done,
      })
      const newStreak = await getRoutineStreak(userId)
      setStreak(newStreak)
    }
    setSaving(false)
  }

  async function toggleNight() {
    if (saving) return
    setSaving(true)
    const newMorning = log?.morningDone ?? false
    const newNight = !log?.nightDone
    const updated = await upsertRoutineLog(userId, newMorning, newNight)
    if (updated) {
      setLog({
        id: updated[0].id,
        userId,
        date: updated[0].date,
        morningDone: updated[0].morning_done,
        nightDone: updated[0].night_done,
      })
      const newStreak = await getRoutineStreak(userId)
      setStreak(newStreak)
    }
    setSaving(false)
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

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

  const bothDone = log?.morningDone && log?.nightDone

  return (
    <div style={{ padding: '0 0 32px' }}>

      {/* Date + streak */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
      }}>
        <div>
          <p style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#999',
            marginBottom: '4px',
          }}>
            Today
          </p>
          <p style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#1a1a1a',
          }}>
            {today}
          </p>
        </div>

        {streak > 0 && (
          <div style={{
            textAlign: 'right',
          }}>
            <p style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a1a1a',
              lineHeight: 1,
              marginBottom: '2px',
            }}>
              {streak}
            </p>
            <p style={{
              fontSize: '11px',
              color: '#999',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              day streak
            </p>
          </div>
        )}
      </div>

      {/* Completion message */}
      {bothDone && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '20px',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#15803d',
            fontWeight: '600',
          }}>
            Both routines done today. Keep it up.
          </p>
        </div>
      )}

      {/* Morning routine */}
      <div style={{
        backgroundColor: '#ffffff',
        border: `1px solid ${log?.morningDone ? '#bbf7d0' : '#e8e6e0'}`,
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '10px',
        transition: 'border-color 0.2s ease',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: log?.morningDone ? '0' : '16px',
        }}>
          <div>
            <p style={{
              fontSize: '11px',
              color: '#999',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              Morning routine
            </p>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: log?.morningDone ? '#15803d' : '#1a1a1a',
            }}>
              {log?.morningDone ? 'Completed' : `${result.morningRoutine.length} steps`}
            </p>
          </div>

          <button
            onClick={toggleMorning}
            disabled={saving}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: log?.morningDone
                ? 'none'
                : '2px solid #e8e6e0',
              backgroundColor: log?.morningDone ? '#16a34a' : 'transparent',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {log?.morningDone && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8l3.5 3.5L13 5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Steps — hidden when done */}
        {!log?.morningDone && (
          <div>
            {result.morningRoutine.map((step, i) => (
              <p key={i} style={{
                fontSize: '12px',
                color: '#666',
                lineHeight: '1.7',
                paddingLeft: '12px',
                borderLeft: '2px solid #f0f0ee',
                marginBottom: i < result.morningRoutine.length - 1 ? '8px' : '0',
              }}>
                {step}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Night routine */}
      <div style={{
        backgroundColor: '#ffffff',
        border: `1px solid ${log?.nightDone ? '#bbf7d0' : '#e8e6e0'}`,
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '24px',
        transition: 'border-color 0.2s ease',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: log?.nightDone ? '0' : '16px',
        }}>
          <div>
            <p style={{
              fontSize: '11px',
              color: '#999',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              Night routine
            </p>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: log?.nightDone ? '#15803d' : '#1a1a1a',
            }}>
              {log?.nightDone ? 'Completed' : `${result.nightRoutine.length} steps`}
            </p>
          </div>

          <button
            onClick={toggleNight}
            disabled={saving}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: log?.nightDone
                ? 'none'
                : '2px solid #e8e6e0',
              backgroundColor: log?.nightDone ? '#16a34a' : 'transparent',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {log?.nightDone && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8l3.5 3.5L13 5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        {!log?.nightDone && (
          <div>
            {result.nightRoutine.map((step, i) => (
              <p key={i} style={{
                fontSize: '12px',
                color: '#666',
                lineHeight: '1.7',
                paddingLeft: '12px',
                borderLeft: '2px solid #f0f0ee',
                marginBottom: i < result.nightRoutine.length - 1 ? '8px' : '0',
              }}>
                {step}
              </p>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}