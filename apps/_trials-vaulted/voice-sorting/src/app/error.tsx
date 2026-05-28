'use client'
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ padding: 40, fontFamily: 'system-ui', textAlign: 'center' }}>
      <h1 style={{ fontSize: 24 }}>Something went wrong</h1>
      <button onClick={reset} style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  )
}
