/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@csps/integrations'],
  typescript: {
    ignoreBuildErrors: true,
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
