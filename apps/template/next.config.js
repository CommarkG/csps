// CSPS TEMPLATE — replace [App Name] with your app name
const { securityHeaders } = require('../../libs/integrations/security/headers')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@csps/integrations'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders(),
      },
    ]
  },
  webpack: (config) => {
    config.resolve.symlinks = false
    config.resolve.preferRelative = true
    config.ignoreWarnings = [
      { module: /node_modules\/@zenstackhq\/runtime\/enhance\.js/ },
    ]
    return config
  },
}

module.exports = nextConfig
