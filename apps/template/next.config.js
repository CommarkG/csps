// CSPS TEMPLATE — replace [App Name] with your app name
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@csps/integrations', '@csps/ui', '@csps/components', '@csps/config'],
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
  webpack: (config, { isServer }) => {
    config.resolve.symlinks = false
    config.resolve.preferRelative = true
    // AP-005 (revised): pnpm workspace uses a single react@18.3.1 instance via .pnpm hoisting.
    // resolve.dedupe is a Vite API — invalid in webpack 5. Removed; no alias needed.
    //
    // AP-006: inngest is "type": "module" (ESM-first). When @csps/integrations is transpiled
    // by webpack, the ESM entry is picked and fails with "Inngest is not a constructor".
    // Fix: alias inngest to its resolved CJS path (require.resolve uses CJS condition in next.config.js).
    if (isServer) {
      // require.resolve('inngest') resolves to index.cjs in a CJS (next.config.js) context.
      const inngestCjs = require.resolve('inngest')
      const inngestDir = path.dirname(inngestCjs)
      // Root alias covers `import from 'inngest'`
      config.resolve.alias = {
        ...config.resolve.alias,
        'inngest': inngestCjs,
      }
      // Subpath 'inngest/next' must be handled via NormalModuleReplacementPlugin
      // because webpack resolves subpaths through the exports map, bypassing resolve.alias.
      const webpack = require('webpack')
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^inngest\/next$/,
          path.join(inngestDir, 'next.cjs')
        )
      )
    }
    config.ignoreWarnings = [
      { module: /node_modules\/@zenstackhq\/runtime\/enhance\.js/ },
    ]
    return config
  },
}

module.exports = nextConfig
