// Debt Collection — Create Debt
// PROTO-K-A Phase 1 | Session S060

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// pageDNA — CSPS governance. const, NOT export const.
const pageDNA = {
  purpose: 'Record who owes you money and what for.',
  voiceProfile: 'colleague',
  options: ['Fill the form', 'Generate message immediately'],
  nextStep: '/dashboard',
  relatedPages: ['/dashboard', '/message'],
}

type FormState = 'idle' | 'submitting' | 'error'

export default function CreateDebtPage() {
  const router = useRouter()
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setError(null)

    const form = e.currentTarget
    const data = {
      debtor_name: (form.elements.namedItem('debtor_name') as HTMLInputElement).value.trim(),
      amount: parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value),
      currency: (form.elements.namedItem('currency') as HTMLSelectElement).value,
      description: (form.elements.namedItem('description') as HTMLInputElement).value.trim(),
      due_date: (form.elements.namedItem('due_date') as HTMLInputElement).value,
    }

    try {
      const res = await fetch('/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to save debt')
      }

      const { id } = await res.json()
      router.push(`/message?id=${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setState('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '0.625rem 0.875rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.9375rem',
    fontFamily: 'system-ui, sans-serif',
    color: '#111827',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.375rem',
  }

  const fieldStyle: React.CSSProperties = {
    marginBottom: '1.25rem',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Back nav */}
        <Link href="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem',
          marginBottom: '1.5rem',
        }}>
          ← Back to dashboard
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.375rem', color: '#111827' }}>
            Add a debt
          </h1>
          {/* Voice quote from PROTO-K-A spec: colleague tone */}
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9375rem' }}>
            {pageDNA.purpose}
          </p>
        </div>

        {/* Form — voiceProfile="colleague" on all labels */}
        <form onSubmit={handleSubmit} style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.75rem',
        }}>

          {/* Debtor name */}
          <div style={fieldStyle}>
            <label htmlFor="debtor_name" style={labelStyle}>
              Who owes you?
            </label>
            <input
              id="debtor_name"
              name="debtor_name"
              type="text"
              placeholder="e.g. David Cohen"
              required
              style={inputStyle}
              data-voice-profile={pageDNA.voiceProfile}
            />
          </div>

          {/* Amount + currency row */}
          <div style={{ ...fieldStyle, display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 2 }}>
              <label htmlFor="amount" style={labelStyle}>
                How much?
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 5000"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="currency" style={labelStyle}>
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                defaultValue="ILS"
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="ILS">₪ ILS</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={fieldStyle}>
            <label htmlFor="description" style={labelStyle}>
              What for?
            </label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="e.g. Website design project, completed March 2026"
              required
              style={inputStyle}
            />
          </div>

          {/* Due date */}
          <div style={fieldStyle}>
            <label htmlFor="due_date" style={labelStyle}>
              When was it due?
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              required
              style={inputStyle}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '6px', padding: '0.75rem 1rem',
              color: '#991b1b', fontSize: '0.875rem', marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={state === 'submitting'}
            style={{
              width: '100%', padding: '0.75rem',
              background: state === 'submitting' ? '#93c5fd' : '#1d4ed8',
              color: '#fff', border: 'none', borderRadius: '6px',
              fontSize: '0.9375rem', fontWeight: 600,
              cursor: state === 'submitting' ? 'not-allowed' : 'pointer',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {state === 'submitting' ? 'Saving…' : 'Save and generate message →'}
          </button>

        </form>

        {/* RelatedPages: /dashboard, /message */}
      </div>
    </div>
  )
}
