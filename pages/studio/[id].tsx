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
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'anime' | 'info' | 'stats'>('anime')
  const [visibleCount, setVisibleCount] = useState(16)
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
    setVisibleCount(16)
  }, [studioId, tab])

  const mediaList = useMemo<StudioMedia[]>(() => {
    if (!studio?.media?.nodes) return []
    const nodes = studio.media.nodes.slice()
    if (query.trim()) {
      const q = query.toLowerCase()
      return nodes.filter((m) => (m.title?.romaji || m.title?.english || '').toLowerCase().includes(q) || (m.genres || []).some((g) => g.toLowerCase().includes(q)))
    }
    return nodes
  }, [studio, query])

  function loadMore() {
    setVisibleCount((v) => v + 12)
  }

  return (
    <>
      <Head>
        <title>{studio ? `${studio.name} • Studio | Aichiow` : 'Studio • Aichiow'}</title>
        <meta name="description" content="Studio details and produced anime on Aichiow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b0e] to-[#050506] text-white px-4 md:px-10 pb-16">
        <div className="max-w-[1400px] mx-auto pt-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/7 transition"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
            <SectionTitle title="Studio" />
          </div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/6 via-cyan-500/3 to-transparent pointer-events-none" />

              <div className="relative z-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-transparent to-black/30 border border-white/6 backdrop-blur-md">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <FaSpinner className="animate-spin text-4xl text-blue-400" />
                  </div>
                ) : error ? (
                  <div className="py-12 text-center text-sm text-red-400">{error}</div>
                ) : !studio ? (
                  <div className="py-12 text-center text-sm text-neutral-400">Studio not found</div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-28 h-28 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                          style={{
                            background: studio.media?.nodes?.[0]?.coverImage?.color
                              ? `linear-gradient(180deg, ${studio.media?.nodes?.[0]?.coverImage?.color}20, transparent 60%)`
                              : undefined,
                          }}
                        >
                          <div className="text-lg font-bold text-white/90">{studio.name.charAt(0) || 'S'}</div>
                        </div>
                        <div>
                          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{studio.name}</h1>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-neutral-300">
                              {studio.isAnimationStudio ? 'Animation Studio' : 'Studio'}
                            </span>
                            <span className="text-xs text-neutral-400">•</span>
                            <span className="text-xs text-neutral-300">{studio.favourites ?? 0} favourites</span>
                            <span className="text-xs text-neutral-400">•</span>
                            <span className="text-xs text-neutral-300">
                              {studio.media?.nodes?.length ?? 0} anime
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center bg-white/4 px-3 py-2 rounded-lg text-sm">
                          <input
                            aria-label="Search studio anime"
                            placeholder="Search studio anime..."
                            className="bg-transparent placeholder:text-neutral-400 outline-none text-sm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setTab('anime')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                              tab === 'anime'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'bg-white/4 text-neutral-200'
                            }`}
                          >
                            Anime
                          </button>
                          <button
                            onClick={() => setTab('info')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                              tab === 'info'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'bg-white/4 text-neutral-200'
                            }`}
                          >
                            Info
                          </button>
                          <button
                            onClick={() => setTab('stats')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                              tab === 'stats'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'bg-white/4 text-neutral-200'
                            }`}
                          >
                            Stats
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <AnimatePresence mode="wait">
                        {tab === 'anime' && (
                          <motion.div
                            key="anime"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.28 }}
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              {mediaList.length === 0 && (
                                <>
                                  {[...Array(8)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="h-[220px] bg-neutral-900/60 rounded-xl animate-pulse"
                                    />
                                  ))}
                                </>
                              )}

                              {mediaList.slice(0, visibleCount).map((m) => (
                                <div key={m.id} className="relative">
                                  <AnimeCard
                                    anime={{
                                      id: m.id,
                                      title: m.title,
                                      coverImage: m.coverImage,
                                      bannerImage: m.bannerImage,
                                      genres: m.genres,
                                      averageScore: m.averageScore,
                                    } as any}
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 flex items-center justify-center">
                              {visibleCount < mediaList.length ? (
                                <button
                                  onClick={loadMore}
                                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition text-white font-semibold shadow-lg"
                                >
                                  Load more
                                  <FaChevronDown />
                                </button>
                              ) : (
                                <div className="text-xs text-neutral-400">End of list</div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {tab === 'info' && (
                          <motion.div
                            key="info"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.28 }}
                            className="space-y-4"
                          >
                            <div className="rounded-xl bg-white/3 p-4 md:p-6">
                              <h4 className="text-sm text-neutral-300">Studio Overview</h4>
                              <div className="mt-2 text-neutral-200">
                                Name: <span className="font-medium">{studio.name}</span>
                              </div>
                              <div className="mt-1 text-neutral-400 text-sm">
                                {studio.isAnimationStudio ? 'This is an animation studio.' : 'Studio info not available.'}
                              </div>
                              <div className="mt-3 text-sm text-neutral-300">
                                Total Anime: {studio.media?.nodes?.length ?? 0}
                              </div>
                              <div className="mt-2 text-sm text-neutral-300">
                                Favourites: {studio.favourites ?? 0}
                              </div>
                            </div>

                            <div className="rounded-xl bg-white/3 p-4 md:p-6">
                              <h4 className="text-sm text-neutral-300">Recent Releases</h4>
                              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {(studio.media?.nodes || []).slice(0, 6).map((m) => (
                                  <div key={m.id} className="flex items-center gap-3">
                                    <img src={m.coverImage?.large} alt={m.title?.romaji || m.title?.english || ''} className="w-12 h-16 rounded-md object-cover" />
                                    <div>
                                      <div className="text-sm font-medium">{m.title?.romaji || m.title?.english}</div>
                                      <div className="text-xs text-neutral-400">{m.seasonYear ?? '—'}</div>
                                    </div>
                                  </div>
                                ))}
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
                            transition={{ duration: 0.28 }}
                            className="space-y-4"
                          >
                            <div className="rounded-xl bg-white/3 p-4 md:p-6">
                              <h4 className="text-sm text-neutral-300">Statistics</h4>
                              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-3 rounded-lg bg-black/40 text-center">
                                  <div className="text-xl font-extrabold">{studio.media?.nodes?.length ?? 0}</div>
                                  <div className="text-xs text-neutral-400 mt-1">Total Anime</div>
                                </div>
                                <div className="p-3 rounded-lg bg-black/40 text-center">
                                  <div className="text-xl font-extrabold">{studio.favourites ?? 0}</div>
                                  <div className="text-xs text-neutral-400 mt-1">Favourites</div>
                                </div>
                                <div className="p-3 rounded-lg bg-black/40 text-center">
                                  <div className="text-xl font-extrabold">{studio.isAnimationStudio ? 'Yes' : 'No'}</div>
                                  <div className="text-xs text-neutral-400 mt-1">Animation Studio</div>
                                </div>
                                <div className="p-3 rounded-lg bg-black/40 text-center">
                                  <div className="text-xl font-extrabold">
                                    {Math.round(((studio.media?.nodes || []).reduce((acc, cur) => acc + (cur.averageScore || 0), 0) /
                                      (studio.media?.nodes?.length || 1)) || 0)}
                                  </div>
                                  <div className="text-xs text-neutral-400 mt-1">Avg. Score</div>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-xl bg-white/3 p-4 md:p-6">
                              <h4 className="text-sm text-neutral-300">Top Genres</h4>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {(() => {
                                  const genreCount: Record<string, number> = {}
                                  (studio.media?.nodes || []).forEach((m) => {
                                    (m.genres || []).forEach((g) => {
                                      genreCount[g] = (genreCount[g] || 0) + 1
                                    })
                                  })
                                  const top = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 8)
                                  return top.length === 0 ? <div className="text-sm text-neutral-400">No genre data</div> : top.map(([g, c]) => (
                                    <div key={g} className="px-3 py-1 rounded-full bg-white/5 text-sm">
                                      {g} <span className="text-xs text-neutral-400">({c})</span>
                                    </div>
                                  ))
                                })()}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}
