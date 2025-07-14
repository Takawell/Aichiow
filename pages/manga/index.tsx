'use client'

import { useEffect, useState } from 'react'
import { fetchPopularManga } from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import Link from 'next/link'

export default function MangaLandingPage() {
  const [popular, setPopular] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [log, setLog] = useState<string>('')

  useEffect(() => {
    async function load() {
      try {
        const popularRes = await fetchPopularManga()
        setPopular(popularRes)
        setLog(`✅ Loaded popular manga`)
      } catch (err: any) {
        console.error('[Manga Landing] Error:', err)
        setLog(`❌ Error: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <main className="px-4 md:px-8 py-10 text-white">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text">
          Welcome to Aichiow Manga
        </h1>
        <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
          Discover the hottest manga. High-quality, full-featured reader — right at your fingertips.
        </p>
        <Link
          href="/manga/explore"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition"
        >
          🔍 Explore Manga
        </Link>
      </section>

      {/* Debug Log */}
      {log && <p className="text-sm text-center text-pink-400 mb-4">{log}</p>}

      {/* Manga Section */}
      {loading ? (
        <p className="text-zinc-400 text-center">Loading manga...</p>
      ) : (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🔥 Most Followed</h2>
          <MangaGrid mangaList={popular} />
        </section>
      )}
    </main>
  )
}
