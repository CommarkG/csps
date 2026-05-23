/**
 * @csps-id csps.libs.ui.GuardQuestionForm
 * Form with ZF-style verification.
 * Shows a primary question, a guard question (B_VALIDATE_BEFORE_ASSUME pattern),
 * a textarea for the answer, and a submit button.
 * NOTE: This is a client component — mark with 'use client' at the usage site
 * if the parent is a server component tree.
 */

'use client'

import { useState, type FormEvent } from 'react'

interface GuardQuestionFormProps {
  /** The main question being asked */
  question: string
  /** The guard / validation question (ZF-style: "what evidence proves your answer?") */
  guardText: string
  /** Placeholder for the answer textarea */
  placeholder?: string
  /** Submit handler receives the answer string */
  onSubmit: (answer: string) => void
  /** Submit button label — default "Submit" */
  submitLabel?: string
}

export function GuardQuestionForm({
  question,
  guardText,
  placeholder = 'Enter your answer here…',
  onSubmit,
  submitLabel = 'Submit',
}: GuardQuestionFormProps) {
  const [answer, setAnswer] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (answer.trim()) onSubmit(answer.trim())
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      {/* Main question */}
      <div style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '14px 16px',
        marginBottom: 12,
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0 }}>{question}</p>
      </div>

      {/* Guard question (ZF) */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 6,
        padding: '10px 14px',
        marginBottom: 12,
        fontSize: 12,
        color: '#1e40af',
      }}>
        <strong>Guard:</strong> {guardText}
      </div>

      {/* Answer textarea */}
      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: 6,
          fontSize: 13,
          fontFamily: 'inherit',
          resize: 'vertical',
          outline: 'none',
          marginBottom: 10,
        }}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={!answer.trim()}
        style={{
          background: answer.trim() ? '#111' : '#e5e7eb',
          color: answer.trim() ? '#fff' : '#9ca3af',
          border: 'none',
          borderRadius: 6,
          padding: '8px 20px',
          fontSize: 13,
          fontWeight: 600,
          cursor: answer.trim() ? 'pointer' : 'not-allowed',
          transition: 'background 0.15s',
        }}
      >
        {submitLabel}
      </button>
    </form>
  )
}
