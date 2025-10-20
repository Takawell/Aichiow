'use client'

import { useEffect, useState, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaChevronDown, FaSpinner } from 'react-icons/fa'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'
import { fetchStudioDetail } from '@/lib/anilist'

type StudioMedia = {
  id: number
  title: { romaji?: string; english?: string }
  coverImage?: { large?: string; color?: string }
  bannerImage?: string | null
  averageScore?: number
  genres?: string[]
  seasonYear?: number | null
  format?: string | null
}

type StudioDetail = {
  id: number
  name: string
  isAnimationStudio?: boolean
  favourites?: number
  media?: { nodes?: StudioMedia[] }
}

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
    setStudio(null)
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
    const top = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 8)
    if (top.length === 0) return <div className="text-sm text-neutral-400">No genre data</div>
    return top.map(([g, c]) => (
      <motion.div
        key={g}
        whileHover={{ scale: 1.06 }}
        className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/20 to-blue-500/20 border border-white/10 text-sm font-medium text-white/90 shadow-sm"
      >
        {g}
        <span className="text-xs text-neutral-400 ml-1">({c})</span>
      </motion.div>
    ))
  }

  return (
    <>
      <Head>
        <title>{studio ? `${studio.name} • Studio | Aichiow` : 'Studio • Aichiow'}</title>
        <meta name="description" content="Studio details and produced anime on Aichiow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#06060b] via-[#0b0b11] to-[#040407] text-white px-4 md:px-10 pb-20">
        <div className="max-w-[1450px] mx-auto pt-10">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
            <SectionTitle title="Studio" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 via-white/3 to-transparent border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <div className="relative z-10 p-6 sm:p-8 md:p-10">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
              ) : error ? (
                <div className="py-14 text-center text-red-400 text-sm">{error}</div>
              ) : !studio ? (
                <div className="py-14 text-center text-neutral-400 text-sm">Studio not found</div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div
                        className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 bg-gradient-to-br from-blue-600/30 to-indigo-500/30 border border-white/10"
                      >
                        <span className="text-2xl md:text-3xl font-extrabold">{studio.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                          {studio.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-neutral-300">
                          <span>{studio.isAnimationStudio ? 'Animation Studio' : 'Studio'}</span>
                          <span>•</span>
                          <span>{studio.favourites ?? 0} favourites</span>
                          <span>•</span>
                          <span>{studio.media?.nodes?.length ?? 0} anime</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                      <input
                        placeholder="Search studio anime..."
                        className="bg-white/5 px-4 py-2 rounded-lg text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500/40 transition"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
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
                  </div>

                  <div className="mt-8">
                    <AnimatePresence mode="wait">
                      {tab === 'anime' && (
                        <motion.div
                          key="anime"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {mediaList.slice(0, visibleCount).map((m) => (
                              <AnimeCard
                                key={m.id}
                                anime={{
                                  id: m.id,
                                  title: m.title,
                                  coverImage: m.coverImage,
                                  bannerImage: m.bannerImage,
                                  genres: m.genres,
                                  averageScore: m.averageScore,
                                } as any}
                              />
                            ))}
                          </div>
                          {visibleCount < mediaList.length && (
                            <div className="mt-10 flex justify-center">
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
                          className="space-y-5"
                        >
                          <div className="rounded-xl bg-white/5 p-5 md:p-8 backdrop-blur-md border border-white/10">
                            <h4 className="text-sm text-neutral-300 uppercase tracking-wide">Studio Overview</h4>
                            <div className="mt-3 space-y-2 text-neutral-200 text-sm">
                              <p><span className="text-neutral-400">Name:</span> {studio.name}</p>
                              <p><span className="text-neutral-400">Type:</span> {studio.isAnimationStudio ? 'Animation Studio' : 'N/A'}</p>
                              <p><span className="text-neutral-400">Anime Count:</span> {studio.media?.nodes?.length ?? 0}</p>
                              <p><span className="text-neutral-400">Favourites:</span> {studio.favourites ?? 0}</p>
                            </div>
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
                        >
                          <div className="rounded-xl bg-white/5 p-6 md:p-8 backdrop-blur-md border border-white/10">
                            <h4 className="text-sm text-neutral-300 uppercase tracking-wide mb-4">Top Genres</h4>
                            <div className="flex flex-wrap gap-2">{renderTopGenres()}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}
