'use client'

import { useEffect, useState, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaChevronDown, FaSpinner, FaSearch } from 'react-icons/fa'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'
import { fetchStudioDetail } from '@/lib/anilist'
import type { StudioDetail, StudioMedia } from '@/types/studio'

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
        className="px-3 py-1 rounded-full bg-gradient-to-r from-sky-600/20 to-indigo-600/20 border border-white/8 text-sm font-medium text-white/90"
      >
        {g}
        <span className="text-xs text-neutral-400 ml-2">({c})</span>
      </motion.div>
    ))
  }

  return (
    <>
      <Head>
        <title>{studio ? `${studio.name} • Studio | Aichiow` : 'Studio • Aichiow'}</title>
        <meta name="description" content="Studio details and produced anime on Aichiow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#04112a] via-[#031022] to-[#01040a] text-white px-4 md:px-12 pb-24">
        <div className="max-w-[1400px] mx-auto pt-10">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/6 hover:bg-white/10 transition-all duration-200"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
            <SectionTitle title="Studio" />
          </div>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-white/8 shadow-[0_10px_40px_rgba(2,6,23,0.8)]"
          >
            <div className="p-6 md:p-8 lg:p-10">
              {loading ? (
                <div className="flex items-center justify-center py-28">
                  <FaSpinner className="animate-spin text-4xl text-sky-400" />
                </div>
              ) : error ? (
                <div className="py-14 text-center text-rose-400 text-sm">{error}</div>
              ) : !studio ? (
                <div className="py-14 text-center text-neutral-400 text-sm">Studio not found</div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 bg-gradient-to-br from-sky-600/30 to-indigo-600/30 border border-white/8">
                        <span className="text-2xl md:text-3xl font-extrabold">{studio.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-300">
                          {studio.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-slate-300">
                          <span>{studio.isAnimationStudio ? 'Animation Studio' : 'Studio'}</span>
                          <span className="opacity-60">•</span>
                          <span>{studio.favourites ?? 0} favourites</span>
                          <span className="opacity-60">•</span>
                          <span>{studio.media?.nodes?.length ?? 0} anime</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                      <div className="relative w-full sm:w-[360px]">
                        <input
                          placeholder="Search studio anime..."
                          className="w-full bg-transparent border border-white/8 px-4 py-2.5 rounded-lg text-sm outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500 transition"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80">
                          <FaSearch />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {(['anime', 'info', 'stats'] as const).map((key) => (
                          <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                              tab === key
                                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm transform scale-[1.03]'
                                : 'bg-white/6 hover:bg-white/10 text-neutral-200'
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
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.32 }}
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
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:scale-105 transition text-white font-semibold shadow-md"
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
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.32 }}
                        >
                          <div className="rounded-xl bg-white/5 p-5 md:p-8 backdrop-blur-sm border border-white/10">
                            <h4 className="text-sm text-slate-300 uppercase tracking-wide">Studio Overview</h4>
                            <div className="mt-4 space-y-2 text-slate-200 text-sm">
                              <p><span className="text-slate-400">Name:</span> {studio.name}</p>
                              <p><span className="text-slate-400">Type:</span> {studio.isAnimationStudio ? 'Animation Studio' : 'N/A'}</p>
                              <p><span className="text-slate-400">Anime Count:</span> {studio.media?.nodes?.length ?? 0}</p>
                              <p><span className="text-slate-400">Favourites:</span> {studio.favourites ?? 0}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {tab === 'stats' && (
                        <motion.div
                          key="stats"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.32 }}
                        >
                          <div className="rounded-xl bg-white/5 p-6 md:p-8 backdrop-blur-sm border border-white/10">
                            <h4 className="text-sm text-slate-300 uppercase tracking-wide mb-4">Top Genres</h4>
                            <div className="flex flex-wrap gap-3">{renderTopGenres()}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </motion.section>
        </div>
      </main>
    </>
  )
}
