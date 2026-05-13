/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@csps/integrations'],
  webpack: (config) => {
    // symlinks=false lets relative imports inside @csps/integrations resolve
    // from their original disk location (not through the pnpm symlink).
    // Only apply to source files, not node_modules internal resolution.
    const originalResolve = config.resolve
    config.resolve = {
      ...originalResolve,
      symlinks: false,
    }
    return config
  },
}

module.exports = nextConfig
