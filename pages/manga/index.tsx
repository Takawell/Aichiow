'use client'

import { useEffect, useState } from 'react'
import {
  fetchPopularManga,
  fetchMangaByGenre,
  getMangaSection,
  getLocalizedTitle,
} from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import Link from 'next/link'

export default function MangaLandingPage() {
  const [mangaList, setMangaList] = useState<any[]>([])
  const [actionList, setActionList] = useState<any[]>([])
  const [romanceList, setRomanceList] = useState<any[]>([])
  const [fantasyList, setFantasyList] = useState<any[]>([])
  const [latestList, setLatestList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [log, setLog] = useState<string>('')

  useEffect(() => {
    async function load() {
      try {
        const [popular, action, romance, fantasy, latest] = await Promise.all([
          fetchPopularManga(),
          fetchMangaByGenre('action'),
          fetchMangaByGenre('romance'),
          fetchMangaByGenre('fantasy'),
          getMangaSection('latest'),
        ])
        setLog(`✅ Loaded: ${popular.length} + genres`)
        setMangaList(popular)
        setActionList(action)
        setRomanceList(romance)
        setFantasyList(fantasy)
        setLatestList(latest)
      } catch (err: any) {
        console.error('[Manga Landing] Fetch error:', err)
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
      {log && <p className="text-sm text-center text-pink-400 mb-6">{log}</p>}

      {/* Popular */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">🔥 Most Followed</h2>
        {loading ? (
          <p className="text-zinc-400">Loading manga...</p>
        ) : mangaList.length > 0 ? (
          <MangaGrid mangaList={mangaList.slice(0, 12)} />
        ) : (
          <p className="text-zinc-500">No manga found.</p>
        )}
      </section>

      {/* Latest */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">🆕 Latest Updated</h2>
        <MangaGrid mangaList={latestList.slice(0, 12)} />
      </section>

      {/* Genre Highlights */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">⚔️ Action</h2>
        <MangaGrid mangaList={actionList.slice(0, 12)} />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">💖 Romance</h2>
        <MangaGrid mangaList={romanceList.slice(0, 12)} />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">🧙 Fantasy</h2>
        <MangaGrid mangaList={fantasyList.slice(0, 12)} />
      </section>
    </main>
  )
}
