'use client'

// Budget Setup — The Threshold Wizard
// 3 crystallization questions (P-META-022 Step 0a applied to end-user UX)
//
// The same coaching philosophy as AI-Governor intake:
//   - Human answers freely (text area, not multiple choice)
//   - No judgment on the answer — all answers are valid
//   - The goal and targets are the user's OWN WORDS
//   - Platform stores exactly what the user said, not a normalized version
//
// Non-skippable: dashboard redirects here until wizard is complete
// UX principle: one decision per screen (ux_principle: progressive-disclosure)

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 1 | 2 | 3

interface BudgetTarget {
  categoryName: string
  monthlyLimit: number
}

export default function BudgetSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [problem, setProblem] = useState('')   // Q1c — context only, not stored
  const [goalStatement, setGoalStatement] = useState('')  // Q2c — stored as BudgetGoal.goalStatement
  const [targets, setTargets] = useState<BudgetTarget[]>([{ categoryName: '', monthlyLimit: 0 }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function addTarget() {
    setTargets([...targets, { categoryName: '', monthlyLimit: 0 }])
  }

  function updateTarget(index: number, field: keyof BudgetTarget, value: string | number) {
    const updated = [...targets]
    updated[index] = { ...updated[index], [field]: value }
    setTargets(updated)
  }

  function removeTarget(index: number) {
    if (targets.length === 1) return
    setTargets(targets.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    const validTargets = targets.filter(t => t.categoryName.trim() && t.monthlyLimit > 0)
    if (!goalStatement.trim()) {
      setError('Please tell us what success looks like for you.')
      return
    }
    if (validTargets.length === 0) {
      setError('Please add at least one spending area with a budget limit.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/budget/wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalStatement: goalStatement.trim(), budgetTargets: validTargets }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Connection error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      {/* Progress indicator */}
      <div style={{ marginBottom: '2rem', color: '#666', fontSize: '0.875rem' }}>
        Step {step} of 3
        <div style={{ height: 4, background: '#eee', borderRadius: 2, marginTop: 6 }}>
          <div style={{ height: '100%', width: `${(step / 3) * 100}%`, background: '#2563eb', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Step 1 — Q1c: What is your biggest money challenge? (problem framing) */}
      {step === 1 && (
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>What&apos;s your biggest money challenge right now?</h1>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            No wrong answer. Just share what&apos;s on your mind — we&apos;ll use this to set up your budget tracker.
          </p>
          <textarea
            value={problem}
            onChange={e => setProblem(e.target.value)}
            placeholder="e.g. I overspend on food and don't know where my money goes..."
            style={{ width: '100%', minHeight: 100, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box' }}
          />
          <button
            onClick={() => setStep(2)}
            disabled={!problem.trim()}
            style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: problem.trim() ? '#2563eb' : '#ddd', color: 'white', border: 'none', borderRadius: 6, cursor: problem.trim() ? 'pointer' : 'not-allowed', fontSize: '1rem' }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2 — Q2c: What does success look like? (goal_statement) */}
      {step === 2 && (
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>What would feeling financially in control look like for you in 30 days?</h1>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Describe your goal in your own words. This becomes your North Star for this budget.
          </p>
          <textarea
            value={goalStatement}
            onChange={e => setGoalStatement(e.target.value)}
            placeholder="e.g. I want to know exactly where my $3000/month goes and have $500 saved..."
            style={{ width: '100%', minHeight: 100, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button onClick={() => setStep(1)} style={{ padding: '0.75rem 1rem', background: '#f3f4f6', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!goalStatement.trim()}
              style={{ flex: 1, padding: '0.75rem', background: goalStatement.trim() ? '#2563eb' : '#ddd', color: 'white', border: 'none', borderRadius: 6, cursor: goalStatement.trim() ? 'pointer' : 'not-allowed', fontSize: '1rem' }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Q3c: What numbers would tell you you're on track? (budget_targets) */}
      {step === 3 && (
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pick 2-3 spending areas with monthly targets</h1>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            These are the numbers that will tell you you&apos;re on track. You can always adjust later.
          </p>

          {targets.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <input
                value={t.categoryName}
                onChange={e => updateTarget(i, 'categoryName', e.target.value)}
                placeholder="e.g. Food, Rent, Transport..."
                style={{ flex: 2, padding: '0.5rem', border: '1px solid #ddd', borderRadius: 4 }}
              />
              <input
                type="number"
                value={t.monthlyLimit || ''}
                onChange={e => updateTarget(i, 'monthlyLimit', parseFloat(e.target.value) || 0)}
                placeholder="$/month"
                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: 4 }}
                min={0}
              />
              {targets.length > 1 && (
                <button onClick={() => removeTarget(i)} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>✕</button>
              )}
            </div>
          ))}

          <button
            onClick={addTarget}
            style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', background: '#f3f4f6', border: '1px dashed #ddd', borderRadius: 4, cursor: 'pointer', width: '100%' }}
          >
            + Add another
          </button>

          {error && <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setStep(2)} style={{ padding: '0.75rem 1rem', background: '#f3f4f6', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ flex: 1, padding: '0.75rem', background: submitting ? '#ddd' : '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '1rem' }}
            >
              {submitting ? 'Setting up...' : 'Start tracking →'}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
