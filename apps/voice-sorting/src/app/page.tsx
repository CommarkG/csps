/**
 * @csps-app voice-sorting
 * @csps-persona cognitive-offload-professional
 * @csps-batch BATCH-H
 * @csps-epoch E1
 * APP-001 — Voice Sorting App (The Sponge) — V1 homepage
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [mode, setMode] = useState<'private' | 'business'>('private')
  const [isRecording, setIsRecording] = useState(false)

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      userSelect: 'none',
    }}>
      {/* Mode toggle */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 24,
        display: 'flex',
        background: '#1a1a1a',
        borderRadius: 20,
        padding: 2,
        gap: 2,
      }}>
        {(['private', 'business'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '4px 14px',
              borderRadius: 18,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              background: mode === m ? '#fff' : 'transparent',
              color: mode === m ? '#0a0a0a' : '#666',
              transition: 'all 0.15s',
            }}
          >
            {m === 'private' ? 'Private' : 'Business'}
          </button>
        ))}
      </div>

      {/* Center content */}
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <p style={{ fontSize: 15, color: '#888', marginBottom: 48, letterSpacing: '-0.01em' }}>
          Think out loud. We handle the structure.
        </p>

        {/* Capture button */}
        <button
          onMouseDown={() => setIsRecording(true)}
          onMouseUp={() => setIsRecording(false)}
          onTouchStart={() => setIsRecording(true)}
          onTouchEnd={() => setIsRecording(false)}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: `3px solid ${isRecording ? '#fff' : '#333'}`,
            background: isRecording ? '#fff' : '#111',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.1s',
            boxShadow: isRecording
              ? '0 0 0 12px rgba(255,255,255,0.08), 0 0 0 24px rgba(255,255,255,0.04)'
              : 'none',
            margin: '0 auto 24px',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isRecording ? '#0a0a0a' : '#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3"/>
            <path d="M5 10a7 7 0 0 0 14 0"/>
            <line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="8" y1="22" x2="16" y2="22"/>
          </svg>
        </button>

        <p style={{ fontSize: 12, color: isRecording ? '#fff' : '#555', letterSpacing: '0.05em', transition: 'color 0.1s' }}>
          {isRecording ? 'Recording...' : 'Hold to capture'}
        </p>
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'absolute', bottom: 32, display: 'flex', gap: 40 }}>
        <Link href="/vault" style={{ color: '#444', fontSize: 12, textDecoration: 'none' }}>Vault</Link>
        <Link href="/onboarding" style={{ color: '#444', fontSize: 12, textDecoration: 'none' }}>Setup</Link>
      </div>
    </main>
  )
}
