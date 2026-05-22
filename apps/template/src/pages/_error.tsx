// AP-005 mitigation: custom _error page bypasses styled-jsx dependency in Next.js built-ins.
// Required when pnpm workspace creates multiple React instances (app-local react-dom +
// workspace styled-jsx). Without this, /_error: /404 and /_error: /500 fail during build.
// Keep this file in every CSPS app fork. Do not delete.
import type { NextPageContext } from 'next'

function Error({ statusCode }: { statusCode: number }) {
  return (
    <div style={{ padding: 40, fontFamily: 'system-ui', textAlign: 'center' }}>
      <h1 style={{ fontSize: 24 }}>{statusCode ?? 'Error'}</h1>
      <p style={{ color: '#666', marginTop: 8 }}>
        {statusCode === 404 ? 'Page not found.' : 'An unexpected error occurred.'}
      </p>
      <a href="/" style={{ color: '#333', marginTop: 16, display: 'inline-block' }}>← Go home</a>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? (err as { statusCode?: number } | null)?.statusCode ?? 404
  return { statusCode }
}

export default Error
