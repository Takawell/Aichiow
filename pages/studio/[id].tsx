'use client'

import { useEffect, useState, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaChevronDown, FaSpinner } from 'react-icons/fa'
import { fetchStudioDetail } from '@/lib/anilist'
import type { StudioDetail } from '@/types/studio'

export default function StudioPage() {
  const router = useRouter()
  const { id } = router.query
  const studioId = useMemo(() => (Array.isArray(id) ? Number(id[0]) : id ? Number(id) : null), [id])

  const [studio, setStudio] = useState<StudioDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'anime' | 'info' | 'stats'>('anime')
  const [visibleCount, setVisibleCount] = useState(18)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!studioId) return
    let mounted = true
    setLoading(true)
    setError(null)
    fetchStudioDetail(studioId)
      .then((res) => {
        if (!mounted) return
        setStudio(res || null)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err?.message || 'Failed to load studio')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [studioId])

  useEffect(() => {
    setVisibleCount(18)
  }, [studioId, tab])

  const mediaList = useMemo(() => {
    if (!studio?.media?.nodes) return []
    const nodes = studio.media.nodes.slice()
    if (query.trim()) {
      const q = query.toLowerCase()
      return nodes.filter(
        (m) =>
          (m.title?.romaji || m.title?.english || '').toLowerCase().includes(q) ||
          (m.genres || []).some((g) => g.toLowerCase().includes(q))
      )
    }
    return nodes
  }, [studio, query])

  const loadMore = () => setVisibleCount((v) => v + 12)

  const renderTopGenres = () => {
    const genreCount: Record<string, number> = {}
    ;(studio?.media?.nodes || []).forEach((m) => {
      (m.genres || []).forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1
      })
    })
    const top = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 10)
    if (top.length === 0) return <div className="text-sm text-neutral-400">No genre data</div>
    return (
      <div className="flex flex-wrap gap-3">
        {top.map(([g, c]) => (
          <motion.div
            key={g}
            whileHover={{ scale: 1.05 }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-700/20 to-indigo-600/20 border border-white/10 text-sm text-white/90 font-medium shadow-sm"
          >
            {g}
            <span className="text-xs text-neutral-400 ml-2">({c})</span>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{studio ? `${studio.name} • Studio | Aichiow` : 'Studio • Aichiow'}</title>
        <meta name="description" content="Studio details and produced anime on Aichiow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#06060b] via-[#0b0b11] to-[#040407] text-white px-4 md:px-10 pb-20">
        <div className="max-w-[1350px] mx-auto pt-10 space-y-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
            <div className="flex items-center gap-2">
              {(['anime', 'info', 'stats'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                    tab === key
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-[1.05]'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
          ) : error ? (
            <div className="py-14 text-center text-red-400 text-sm">{error}</div>
          ) : !studio ? (
            <div className="py-14 text-center text-neutral-400 text-sm">Studio not found</div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 border-b border-white/10 pb-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-700/40 to-indigo-500/30 flex items-center justify-center text-3xl font-bold">
                    {studio.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                      {studio.name}
                    </h1>
                    <div className="flex flex-wrap gap-3 text-sm text-neutral-400 mt-2">
                      <span>{studio.isAnimationStudio ? 'Animation Studio' : 'Studio'}</span>
                      <span>•</span>
                      <span>{studio.favourites ?? 0} favourites</span>
                      <span>•</span>
                      <span>{studio.media?.nodes?.length ?? 0} anime</span>
                    </div>
                  </div>
                </div>
                <div>
                  <input
                    placeholder="Search anime..."
                    className="bg-white/5 px-5 py-2.5 rounded-lg text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500/40 transition w-full sm:w-72"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {tab === 'anime' && (
                  <motion.div
                    key="anime"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="divide-y divide-white/5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
                      {mediaList.slice(0, visibleCount).map((m) => (
                        <div
                          key={m.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 hover:bg-white/5 transition"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={m.coverImage?.medium || '/default.png'}
                              alt={m.title?.romaji || m.title?.english || 'Anime'}
                              className="w-14 h-20 object-cover rounded-md"
                            />
                            <div>
                              <h2 className="text-lg font-semibold text-white/90 hover:text-blue-400 transition">
                                {m.title?.romaji || m.title?.english}
                              </h2>
                              <p className="text-xs text-neutral-400 mt-1">
                                {m.genres?.slice(0, 3).join(', ') || 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-neutral-300">
                            Score:{' '}
                            <span className="font-medium text-blue-400">{m.averageScore ?? '—'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {visibleCount < mediaList.length && (
                      <div className="flex justify-center">
                        <button
                          onClick={loadMore}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition text-white font-semibold shadow-md"
                        >
                          Load more <FaChevronDown />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {tab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 p-6 md:p-8 rounded-xl border border-white/10 backdrop-blur-md"
                  >
                    <h4 className="text-sm text-neutral-300 uppercase tracking-wide mb-4">Studio Overview</h4>
                    <div className="grid sm:grid-cols-2 gap-y-2 text-neutral-200 text-sm">
                      <p><span className="text-neutral-400">Name:</span> {studio.name}</p>
                      <p><span className="text-neutral-400">Type:</span> {studio.isAnimationStudio ? 'Animation Studio' : 'N/A'}</p>
                      <p><span className="text-neutral-400">Anime Count:</span> {studio.media?.nodes?.length ?? 0}</p>
                      <p><span className="text-neutral-400">Favourites:</span> {studio.favourites ?? 0}</p>
                    </div>
                  </motion.div>
                )}

                {tab === 'stats' && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 p-6 md:p-8 rounded-xl border border-white/10 backdrop-blur-md"
                  >
                    <h4 className="text-sm text-neutral-300 uppercase tracking-wide mb-4">Top Genres</h4>
                    {renderTopGenres()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}
