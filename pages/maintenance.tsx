// pages/maintenance.tsx
'use client'

import Link from 'next/link'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center px-6 relative overflow-hidden">
      {/* ✨ Glass blur background */}
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm z-0" />

      {/* 🔧 Content */}
      <div className="z-10 text-center max-w-xl mx-auto">
        {/* Logo */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
          Aichiow
        </h1>

        {/* Status Text */}
        <p className="mt-4 text-gray-300 text-lg md:text-xl">
          We’re performing a quick maintenance check.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          The site will be back online very soon.
        </p>

        {/* Loading Bar */}
        <div className="mt-6 h-1 w-40 mx-auto bg-neutral-700 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-blue-500 animate-pulse" />
        </div>

        {/* Social */}
        <div className="mt-8 text-sm text-gray-500">
          Follow us for updates:
          <div className="flex justify-center gap-4 mt-2 text-blue-400">
            <Link href="https://discord.gg/aichinime" target="_blank">🗨️ Discord</Link>
            <Link href="https://youtube.com/Takadevelopment" target="_blank">▶️ YouTube</Link>
            <Link href="https://tiktok.com/@putrawangyyy" target="_blank">🎵 TikTok</Link>
            <Link href="https://instagram.com/putrasenpaiii" target="_blank">📷 Instagram</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
