/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['i.scdn.co', 'github.com', 'avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig
