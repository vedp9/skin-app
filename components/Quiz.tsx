'use client'

import { useState } from 'react'
import { questions } from '@/lib/questions'
import { SkinProfile, QuizAnswer } from '@/types/skin'

interface QuizProps {
  onComplete: (profile: SkinProfile) => void
}

export default function Quiz({ onComplete }: QuizProps) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selected, setSelected] = useState<string[]>([])

  const question = questions[current]
  const isLast = current === questions.length - 1
  const progress = ((current) / questions.length) * 100

  function handleSelect(value: string) {
    if (question.type === 'single') {
      setSelected([value])
    } else {
      setSelected(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
      )
    }
  }

  function handleNext() {
    if (selected.length === 0) return

    const newAnswers = [
      ...answers,
      { questionId: question.id, answer: question.type === 'single' ? selected[0] : selected }
    ]
    setAnswers(newAnswers)

    if (isLast) {
      const profile = buildProfile(newAnswers)
      onComplete(profile)
    } else {
      setCurrent(prev => prev + 1)
      setSelected([])
    }
  }

  function buildProfile(answers: QuizAnswer[]): SkinProfile {
    const get = (id: string) => answers.find(a => a.questionId === id)?.answer

    return {
      skinType: get('skinType') as SkinProfile['skinType'],
      concerns: get('concerns') as SkinProfile['concerns'],
      goals: get('goals') as SkinProfile['goals'],
      climate: get('climate') as SkinProfile['climate'],
      ageRange: get('ageRange') as SkinProfile['ageRange'],
      budget: get('budget') as SkinProfile['budget'],
      indianFirst: true,
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundColor: '#fafaf8',
    }}>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        height: '3px',
        backgroundColor: '#e8e6e0',
        borderRadius: '100px',
        marginBottom: '48px',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#1a1a1a',
          borderRadius: '100px',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Question */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        marginBottom: '8px',
      }}>
        <p style={{
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#999',
          marginBottom: '12px',
        }}>
          {current + 1} of {questions.length}
        </p>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1a1a1a',
          lineHeight: '1.3',
          marginBottom: '8px',
        }}>
          {question.question}
        </h2>
        {question.subtext && (
          <p style={{
            fontSize: '13px',
            color: '#999',
            marginBottom: '32px',
          }}>
            {question.subtext}
          </p>
        )}
      </div>

      {/* Options */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '32px',
      }}>
        {question.options.map(option => {
          const isSelected = selected.includes(option.value)
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                borderRadius: '12px',
                border: isSelected ? '1.5px solid #1a1a1a' : '1.5px solid #e8e6e0',
                backgroundColor: isSelected ? '#1a1a1a' : '#ffffff',
                color: isSelected ? '#ffffff' : '#1a1a1a',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '20px' }}>{option.emoji}</span>
              {option.label}
            </button>
          )
        })}
      </div>

      {/* Next button */}
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: selected.length === 0 ? '#e8e6e0' : '#1a1a1a',
            color: selected.length === 0 ? '#999' : '#ffffff',
            fontSize: '15px',
            fontWeight: '600',
            cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {isLast ? 'See my results →' : 'Next →'}
        </button>
      </div>

    </div>
  )
}