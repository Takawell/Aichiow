// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      's4.anilist.co', // anime image
      'uploads.mangadex.org', // ✅ manga cover
      'mangadex.org', // optional
    ],
  },
}

module.exports = nextConfig
