/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@csps/integrations'],
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.symlinks = false
    return config
  },
}

module.exports = nextConfig
