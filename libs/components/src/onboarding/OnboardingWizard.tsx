// libs/components/src/onboarding/OnboardingWizard.tsx
// S034-C: 3-step onboarding wizard mapping to 5 user archetypes.
// Archetype matrix: goal × experience × team → CSPS user archetype.
// Used to personalize the app experience from first login.

import React, { useState } from 'react'

type WizardStep = 1 | 2 | 3

// Step 1: Goal
const GOALS = [
  { id: 'save-time', label: 'Save time', description: 'Automate repetitive tasks' },
  { id: 'track-data', label: 'Track data', description: 'Measure and analyze outcomes' },
  { id: 'collaborate', label: 'Collaborate', description: 'Work better with my team' },
  { id: 'create-outputs', label: 'Create outputs', description: 'Generate reports and content' },
]

// Step 2: Experience level
const EXPERIENCE = [
  { id: 'novice', label: 'Novice', description: 'Just getting started' },
  { id: 'builder', label: 'Builder', description: 'Comfortable with tools' },
  { id: 'power-user', label: 'Power user', description: 'Advanced workflows' },
]

// Step 3: Team size
const TEAM = [
  { id: 'solo', label: 'Solo', description: 'Just me' },
  { id: 'small-team', label: 'Small team', description: '2–10 people' },
  { id: 'organization', label: 'Organization', description: '10+ people' },
]

// Archetype mapping (goal × team as primary signals, experience as modifier)
function detectArchetype(goal: string, experience: string, team: string): string {
  if (team === 'organization') return 'TEAM_LEAD'
  if (goal === 'track-data') return 'ANALYST'
  if (goal === 'create-outputs') return 'BUILDER'
  if (goal === 'save-time' && experience === 'power-user') return 'EFFICIENCY_SEEKER'
  if (goal === 'collaborate' || team === 'small-team') return 'TEAM_LEAD'
  return 'EXPLORER'
}

type OnboardingWizardProps = {
  onComplete: (archetype: string) => void
  appName: string
  initialStep?: WizardStep
}

function Card({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{description}</p>
      {children}
    </div>
  )
}

function OptionButton({ selected, onClick, label, description }: {
  selected: boolean; onClick: () => void; label: string; description: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '1rem',
        marginBottom: '0.75rem',
        borderRadius: 8,
        border: selected ? '2px solid #111827' : '2px solid #e5e7eb',
        background: selected ? '#f9fafb' : '#fff',
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{description}</div>
    </button>
  )
}

function NavButtons({ onBack, onNext, isLast, canNext }: {
  onBack?: () => void; onNext: () => void; isLast: boolean; canNext: boolean
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
      {onBack ? (
        <button onClick={onBack} style={{ padding: '0.625rem 1.25rem', border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>
          Back
        </button>
      ) : <div />}
      <button
        onClick={onNext}
        disabled={!canNext}
        style={{
          padding: '0.625rem 1.25rem',
          borderRadius: 6,
          border: 'none',
          background: canNext ? '#111827' : '#e5e7eb',
          color: canNext ? '#fff' : '#9ca3af',
          cursor: canNext ? 'pointer' : 'default',
          fontWeight: 500,
        }}
      >
        {isLast ? 'Get started' : 'Next'}
      </button>
    </div>
  )
}

export function OnboardingWizard({ onComplete, appName, initialStep = 1 }: OnboardingWizardProps) {
  const [step, setStep] = useState<WizardStep>(initialStep)
  const [goal, setGoal] = useState('')
  const [experience, setExperience] = useState('')
  const [team, setTeam] = useState('')

  const handleComplete = () => {
    const archetype = detectArchetype(goal, experience, team)
    onComplete(archetype)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#fff' }}>
      {step === 1 && (
        <Card title={`Welcome to ${appName}`} description="What's your main goal?">
          {GOALS.map(g => (
            <OptionButton key={g.id} selected={goal === g.id} onClick={() => setGoal(g.id)} label={g.label} description={g.description} />
          ))}
          <NavButtons onNext={() => setStep(2)} isLast={false} canNext={!!goal} />
        </Card>
      )}
      {step === 2 && (
        <Card title="Your experience" description="How would you describe your technical experience?">
          {EXPERIENCE.map(e => (
            <OptionButton key={e.id} selected={experience === e.id} onClick={() => setExperience(e.id)} label={e.label} description={e.description} />
          ))}
          <NavButtons onBack={() => setStep(1)} onNext={() => setStep(3)} isLast={false} canNext={!!experience} />
        </Card>
      )}
      {step === 3 && (
        <Card title="Your team" description="Who are you setting this up for?">
          {TEAM.map(t => (
            <OptionButton key={t.id} selected={team === t.id} onClick={() => setTeam(t.id)} label={t.label} description={t.description} />
          ))}
          <NavButtons onBack={() => setStep(2)} onNext={handleComplete} isLast={true} canNext={!!team} />
        </Card>
      )}
    </div>
  )
}

// Archetype constants for type-safe usage in app code
export const ARCHETYPES = {
  EFFICIENCY_SEEKER: 'EFFICIENCY_SEEKER',
  BUILDER: 'BUILDER',
  ANALYST: 'ANALYST',
  TEAM_LEAD: 'TEAM_LEAD',
  EXPLORER: 'EXPLORER',
} as const
