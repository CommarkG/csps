/**
 * @csps-app voice-sorting
 * @csps-batch BATCH-H
 * APP-001 onboarding — 3-question flow per Section 5 spec (OPUS-6 S050)
 * B_HUMBLE_FIRST_STEP: Q3 is text, not voice. Voice calibration happens after first value.
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Role = 'consultant' | 'founder' | 'manager' | 'other'
type CapturePreference = 'voice-first' | 'text-first' | 'doesnt-matter'

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: 'consultant', label: 'Consultant', desc: 'Client work, meetings, deliverables' },
  { value: 'founder', label: 'Founder', desc: 'Building a company, wearing many hats' },
  { value: 'manager', label: 'Manager', desc: 'Leading a team, decisions, follow-ups' },
  { value: 'other', label: 'Other', desc: 'Something different' },
]

const CAPTURE_PREFS: { value: CapturePreference; label: string; desc: string }[] = [
  { value: 'voice-first', label: 'Voice first', desc: 'Speaking comes naturally' },
  { value: 'text-first', label: 'Text first', desc: 'I prefer to type' },
  { value: 'doesnt-matter', label: 'Doesn\'t matter', desc: 'Whatever works' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [role, setRole] = useState<Role | null>(null)
  const [capturePreference, setCapturePreference] = useState<CapturePreference | null>(null)
  const [firstWorry, setFirstWorry] = useState('')

  function handleComplete() {
    // Save to localStorage for E1 prototype (real persistence in E2)
    if (typeof window !== 'undefined') {
      localStorage.setItem('vs_onboarding', JSON.stringify({ role, capturePreference, firstWorry, completedAt: new Date().toISOString() }))
    }
    router.push('/')
  }

  const card = (label: string, desc: string, selected: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        width: '100%',
        padding: '14px 18px',
        borderRadius: 8,
        border: `2px solid ${selected ? '#fff' : '#2a2a2a'}`,
        background: selected ? '#1a1a1a' : '#111',
        color: '#fff',
        cursor: 'pointer',
        textAlign: 'left',
        marginBottom: 8,
        transition: 'border-color 0.1s',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{desc}</div>
    </button>
  )

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 360, width: '100%' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 40 }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: s <= step ? '#fff' : '#2a2a2a',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        {/* Step 1 — Role */}
        {step === 1 && (
          <>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>What describes your work?</h1>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>Helps us tailor what you see first.</p>
            {ROLES.map((r) => card(r.label, r.desc, role === r.value, () => setRole(r.value)))}
            <button
              onClick={() => role && setStep(2)}
              disabled={!role}
              style={{
                width: '100%', padding: '14px', borderRadius: 8,
                border: 'none', background: role ? '#fff' : '#222',
                color: role ? '#0a0a0a' : '#444', fontWeight: 700,
                cursor: role ? 'pointer' : 'not-allowed', marginTop: 8,
                fontSize: 14, transition: 'all 0.15s',
              }}
            >
              Continue
            </button>
          </>
        )}

        {/* Step 2 — Capture preference */}
        {step === 2 && (
          <>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>How do you usually capture ideas?</h1>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>We'll tune the default capture mode.</p>
            {CAPTURE_PREFS.map((c) => card(c.label, c.desc, capturePreference === c.value, () => setCapturePreference(c.value)))}
            <button
              onClick={() => capturePreference && setStep(3)}
              disabled={!capturePreference}
              style={{
                width: '100%', padding: '14px', borderRadius: 8,
                border: 'none', background: capturePreference ? '#fff' : '#222',
                color: capturePreference ? '#0a0a0a' : '#444', fontWeight: 700,
                cursor: capturePreference ? 'pointer' : 'not-allowed', marginTop: 8,
                fontSize: 14, transition: 'all 0.15s',
              }}
            >
              Continue
            </button>
          </>
        )}

        {/* Step 3 — First worry (text, not voice) */}
        {step === 3 && (
          <>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>What's one thing you want to stop worrying about?</h1>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>Type it — your first voice capture will come naturally once you see this working.</p>
            <textarea
              value={firstWorry}
              onChange={(e) => setFirstWorry(e.target.value)}
              placeholder="e.g. Forgetting what I promised people in meetings"
              rows={4}
              style={{
                width: '100%', padding: 14, borderRadius: 8,
                border: '2px solid #2a2a2a', background: '#111',
                color: '#fff', fontSize: 14, resize: 'none',
                outline: 'none', fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleComplete}
              disabled={firstWorry.trim().length < 3}
              style={{
                width: '100%', padding: '14px', borderRadius: 8,
                border: 'none', background: firstWorry.trim().length >= 3 ? '#fff' : '#222',
                color: firstWorry.trim().length >= 3 ? '#0a0a0a' : '#444', fontWeight: 700,
                cursor: firstWorry.trim().length >= 3 ? 'pointer' : 'not-allowed',
                marginTop: 12, fontSize: 14, transition: 'all 0.15s',
              }}
            >
              Start capturing
            </button>
          </>
        )}
      </div>
    </main>
  )
}
