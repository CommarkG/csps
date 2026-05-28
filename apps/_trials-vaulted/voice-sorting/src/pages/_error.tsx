import type { NextPageContext } from 'next'

function Error({ statusCode }: { statusCode: number }) {
  return (
    <div style={{ padding: 40, fontFamily: 'system-ui', textAlign: 'center' }}>
      <h1 style={{ fontSize: 24 }}>{statusCode}</h1>
      <p style={{ color: '#666' }}>
        {statusCode === 404 ? 'Page not found.' : 'An error occurred.'}
      </p>
      <a href="/" style={{ color: '#333' }}>Go home</a>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as { statusCode?: number }).statusCode : 404
  return { statusCode }
}

export default Error
