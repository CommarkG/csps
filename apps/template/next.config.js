// CSPS TEMPLATE — replace [App Name] with your app name
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@csps/integrations'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://clerk.com https://*.clerk.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss:; frame-src https://clerk.com https://*.clerk.com; frame-ancestors 'none'" },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ]
  },
  webpack: (config) => {
    config.resolve.symlinks = false
    config.resolve.preferRelative = true
    // Deduplicate React instances across pnpm workspace node_modules tree.
    // Without this, styled-jsx (used by Next.js built-in error pages) loads a different
    // React instance than the app-local react-dom, causing StyleRegistry useContext failure
    // during static generation of /_error pages. AP-005.
    config.resolve.dedupe = ['react', 'react-dom', 'react/jsx-runtime']
    config.ignoreWarnings = [
      { module: /node_modules\/@zenstackhq\/runtime\/enhance\.js/ },
    ]
    return config
  },
}

module.exports = nextConfig
