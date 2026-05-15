// libs/integrations/security/headers.ts
// S032-C: Security headers for all CSPS Next.js apps.
// Import in next.config.js headers() to apply platform-standard security headers.
//
// Usage in next.config.js:
//   import { securityHeaders } from '@csps/integrations/security/headers'
//   module.exports = { async headers() { return [{ source: '/(.*)', headers: securityHeaders() }] } }

export function securityHeaders(): { key: string; value: string }[] {
  return [
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://clerk.com https://*.clerk.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https: wss:",
        "frame-src https://clerk.com https://*.clerk.com",
        "frame-ancestors 'none'",
      ].join('; '),
    },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  ]
}
