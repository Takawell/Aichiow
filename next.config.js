/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s4.anilist.co', 'uploads.mangadex.org'],
  },
}

module.exports = nextConfig
