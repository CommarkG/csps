// Debt Collection — Generate Message
// PROTO-K-A Phase 1 | Session S060

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Debt } from '@/lib/debts'

// pageDNA — CSPS governance. const, NOT export const.
const pageDNA = {
  purpose: 'Get a professional message to send — without the awkward conversation.',
  voiceProfile: 'colleague',
  options: ['Use AI suggestion', 'Write your own', 'Copy and send'],
  nextStep: '/dashboard',
  relatedPages: ['/dashboard', '/create'],
}

type PageState = 'loading_debt' | 'generating' | 'ready' | 'error' | 'copied' | 'marking_sent'

export default function MessagePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const debtId = searchParams?.get('id')

  const [debt, setDebt] = useState<Debt | null>(null)
  const [message, setMessage] = useState('')
  const [editedMessage, setEditedMessage] = useState('')
  const [pageState, setPageState] = useState<PageState>('loading_debt')
  const [error, setError] = useState<string | null>(null)

  // Load debt and generate message
  useEffect(() => {
    if (!debtId) {
      setError('No debt ID provided')
      setPageState('error')
      return
    }

    async function load() {
      try {
        // Fetch debt
        const debtRes = await fetch(`/api/debts/${debtId}`)
        if (!debtRes.ok) throw new Error('Debt not found')
        const { debt: loadedDebt } = await debtRes.json()
        setDebt(loadedDebt)

        // Generate message
        setPageState('generating')
        const msgRes = await fetch('/api/generate-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            debtor_name: loadedDebt.debtor_name,
            amount: loadedDebt.amount,
            currency: loadedDebt.currency,
            description: loadedDebt.description,
            due_date: loadedDebt.due_date,
          }),
        })
        if (!msgRes.ok) {
          const err = await msgRes.json()
          throw new Error(err.error ?? 'Failed to generate message')
        }
        const { message: generated } = await msgRes.json()
        setMessage(generated)
        setEditedMessage(generated)
        setPageState('ready')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setPageState('error')
      }
    }

    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debtId])

  async function handleCopy() {
    await navigator.clipboard.writeText(editedMessage)
    setPageState('copied')
    setTimeout(() => setPageState('ready'), 2000)
  }

  async function handleMarkSent() {
    setPageState('marking_sent')
    try {
      await fetch('/api/debts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: debtId, status: 'message_sent', messages_sent: (debt?.messages_sent ?? 0) + 1 }),
      })
      router.push('/dashboard')
    } catch {
      setPageState('ready')
    }
  }

  async function handleMarkPaid() {
    await fetch('/api/debts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: debtId, status: 'paid' }),
    })
    router.push('/dashboard')
  }

  const CURRENCY_SYMBOLS: Record<string, string> = { ILS: '₪', USD: '$', EUR: '€' }
  function formatAmount(amount: number, currency: string) {
    return `${CURRENCY_SYMBOLS[currency] ?? currency}${amount.toLocaleString('en-US')}`
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Back nav */}
        <Link href="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem',
          marginBottom: '1.5rem',
        }}>
          ← Back to dashboard
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.375rem', color: '#111827' }}>
            Message generator
          </h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9375rem' }}>
            {pageDNA.purpose}
          </p>
        </div>

        {/* Loading / error states */}
        {pageState === 'loading_debt' && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            Loading debt details…
          </div>
        )}

        {pageState === 'error' && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px',
            padding: '1.5rem', color: '#991b1b', textAlign: 'center',
          }}>
            <p style={{ margin: '0 0 1rem', fontWeight: 600 }}>Something went wrong</p>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem' }}>{error}</p>
            <Link href="/dashboard" style={{
              background: '#1d4ed8', color: '#fff', padding: '0.5rem 1.25rem',
              borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
            }}>
              Back to dashboard
            </Link>
          </div>
        )}

        {pageState === 'generating' && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>✍️</div>
            <p style={{ margin: 0, fontWeight: 500 }}>Generating your message…</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>Writing something professional and warm</p>
          </div>
        )}

        {(pageState === 'ready' || pageState === 'copied' || pageState === 'marking_sent') && debt && (
          <>
            {/* Debt summary */}
            <div style={{
              background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px',
              padding: '1rem 1.25rem', marginBottom: '1.25rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', color: '#111827' }}>{debt.debtor_name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{debt.description}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.125rem' }}>Due {debt.due_date}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1c1917' }}>
                  {formatAmount(debt.amount, debt.currency)}
                </div>
              </div>
            </div>

            {/* AI-generated message — editable */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                  Your message
                </label>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Edit as needed</span>
              </div>
              <textarea
                value={editedMessage}
                onChange={e => setEditedMessage(e.target.value)}
                rows={8}
                style={{
                  width: '100%', padding: '0.875rem 1rem',
                  border: '1px solid #d1d5db', borderRadius: '8px',
                  fontSize: '0.9375rem', lineHeight: 1.6,
                  fontFamily: 'system-ui, sans-serif', color: '#1f2937',
                  resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  background: '#fff',
                }}
                data-voice-profile={pageDNA.voiceProfile}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleCopy}
                style={{
                  flex: '1 1 auto',
                  padding: '0.75rem 1.5rem',
                  background: pageState === 'copied' ? '#10b981' : '#1d4ed8',
                  color: '#fff', border: 'none', borderRadius: '6px',
                  fontSize: '0.9375rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
                  transition: 'background 0.15s',
                }}
              >
                {pageState === 'copied' ? '✓ Copied!' : 'Copy message'}
              </button>

              <button
                onClick={handleMarkSent}
                disabled={pageState === 'marking_sent'}
                style={{
                  flex: '1 1 auto',
                  padding: '0.75rem 1.5rem',
                  background: '#fff', color: '#374151',
                  border: '1px solid #d1d5db', borderRadius: '6px',
                  fontSize: '0.9375rem', fontWeight: 600,
                  cursor: pageState === 'marking_sent' ? 'not-allowed' : 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                {pageState === 'marking_sent' ? 'Marking…' : 'Mark as sent →'}
              </button>
            </div>

            {/* Already paid? */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                onClick={handleMarkPaid}
                style={{
                  background: 'none', border: 'none', color: '#10b981',
                  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif', padding: 0,
                }}
              >
                ✓ Already paid? Mark as paid
              </button>
            </div>
          </>
        )}

        {/* RelatedPages: /dashboard, /create */}
      </div>
    </div>
  )
}
