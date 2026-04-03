'use client'

import { useTheme } from '@/components/ThemeProvider'

interface SettingsMenuProps {
  isOpen: boolean
  onClose: () => void
  onSignOut?: () => void
  userEmail?: string | null
}

export default function SettingsMenu({
  isOpen,
  onClose,
  onSignOut,
  userEmail,
}: SettingsMenuProps) {
  const { theme, setTheme } = useTheme()

  if (!isOpen) return null

  const themeOptions: { value: 'system' | 'light' | 'dark'; label: string; sub: string }[] = [
    { value: 'system', label: 'System default', sub: 'Follows your device setting' },
    { value: 'light', label: 'Light', sub: 'Always light mode' },
    { value: 'dark', label: 'Dark', sub: 'Always dark mode' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--overlay)',
          zIndex: 200,
        }}
      />

      {/* Panel — slides up from bottom */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--surface)',
        borderRadius: '20px 20px 0 0',
        padding: '12px 24px 40px',
        zIndex: 201,
        borderTop: '1px solid var(--border)',
      }}>

        {/* Handle */}
        <div style={{
          width: '36px',
          height: '4px',
          backgroundColor: 'var(--border-strong)',
          borderRadius: '100px',
          margin: '0 auto 28px',
        }} />

        {/* User info */}
        {userEmail && (
          <div style={{
            marginBottom: '28px',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--border)',
          }}>
            <p style={{
              fontSize: '11px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '4px',
            }}>
              Signed in as
            </p>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}>
              {userEmail}
            </p>
          </div>
        )}

        {/* Theme section */}
        <p style={{
          fontSize: '11px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '14px',
          fontWeight: '600',
        }}>
          Appearance
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '28px',
        }}>
          {themeOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '12px',
                border: `1.5px solid ${theme === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: theme === opt.value ? 'var(--accent)' : 'var(--surface)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left',
              }}
            >
              <div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme === opt.value ? 'var(--accent-text)' : 'var(--text-primary)',
                  marginBottom: '2px',
                }}>
                  {opt.label}
                </p>
                <p style={{
                  fontSize: '11px',
                  color: theme === opt.value ? 'var(--accent-text)' : 'var(--text-muted)',
                  opacity: theme === opt.value ? 0.7 : 1,
                }}>
                  {opt.sub}
                </p>
              </div>
              {theme === opt.value && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M3.5 9l4 4 7-7"
                    stroke={theme === opt.value ? 'var(--accent-text)' : 'var(--text-primary)'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Sign out */}
        {onSignOut && (
          <button
            onClick={() => { onSignOut(); onClose() }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: '1.5px solid var(--danger-border)',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        )}

      </div>
    </>
  )
}