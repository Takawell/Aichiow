'use client'

import { useEffect, useState } from 'react'
import { fetchPopularManga } from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import Link from 'next/link'

export default function MangaLandingPage() {
  const [mangaList, setMangaList] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const data = await fetchPopularManga()
      setMangaList(data)
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

      {/* Most Followed Manga Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">🔥 Most Followed</h2>
        {mangaList.length > 0 ? (
          <MangaGrid mangaList={mangaList.slice(0, 12)} />
        ) : (
          <p className="text-zinc-400">Loading manga...</p>
        )}
      </section>
    </main>
  )
}
