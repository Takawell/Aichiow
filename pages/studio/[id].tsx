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
        className="px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-600/18 to-indigo-600/18 border border-white/6 text-sm font-medium text-sky-100"
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

      <main className="min-h-screen bg-gradient-to-b from-[#07102a] via-[#041028] to-[#02101a] text-white px-4 md:px-12 pb-24">
        <div className="max-w-[1400px] mx-auto pt-10">

          <div className="flex items-center gap-4 mb-6">
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
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden border border-white/6"
            style={{
              background:
                'radial-gradient(800px 200px at 10% 10%, rgba(56,189,248,0.06), transparent), radial-gradient(600px 160px at 90% 80%, rgba(99,102,241,0.04), transparent), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            }}
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
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
                    <div className="lg:col-span-2 flex flex-col gap-4">
                      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-3xl font-extrabold">
                            {studio.name.charAt(0)}
                          </div>
                          <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent" style={{ background: 'linear-gradient(90deg,#fff,#9be1ff)' }}>
                              {studio.name}
                            </h1>
                            <div className="mt-2 text-sm text-sky-100 flex flex-wrap gap-2">
                              <span>{studio.isAnimationStudio ? 'Animation Studio' : 'Studio'}</span>
                              <span className="opacity-60">•</span>
                              <span>{studio.favourites ?? 0} favourites</span>
                              <span className="opacity-60">•</span>
                              <span>{studio.media?.nodes?.length ?? 0} anime</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl p-4 border border-white/6" style={{ background: 'linear-gradient(180deg, rgba(2,6,23,0.6), rgba(2,6,23,0.4))' }}>
                        <div className="text-xs text-sky-200 uppercase tracking-wide">Quick Actions</div>
                        <div className="mt-3 flex gap-3">
                          <button onClick={() => { setQuery(''); setVisibleCount(18) }} className="px-3 py-2 rounded-lg bg-sky-600/10 text-sky-200">Reset</button>
                          <button onClick={() => setTab('anime')} className="px-3 py-2 rounded-lg bg-sky-600/12 text-sky-200">Go to Anime</button>
                          <button onClick={() => setTab('stats')} className="px-3 py-2 rounded-lg bg-sky-600/12 text-sky-200">View Stats</button>
                        </div>
                      </div>

                      <div className="hidden lg:block rounded-2xl p-4 border border-white/6">
                        <div className="text-xs text-sky-200 uppercase tracking-wide">Top Genres</div>
                        <div className="mt-3 flex flex-wrap gap-2">{renderTopGenres()}</div>
                      </div>
                    </div>

                    <div className="lg:col-span-4">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex-1">
                            <input
                              placeholder="Search anime..."
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              className="w-full px-4 py-3 rounded-full bg-transparent border border-white/6 text-sm placeholder:text-sky-100/50 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            />
                          </div>

                          <div className="flex gap-2">
                            {(['anime', 'info', 'stats'] as const).map((key) => (
                              <button
                                key={key}
                                onClick={() => setTab(key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                  tab === key
                                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                                    : 'bg-white/6 text-sky-100 hover:bg-white/8'
                                }`}
                              >
                                {key}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <AnimatePresence mode="wait">
                          {tab === 'anime' && (
                            <motion.div key="anime" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.32 }}>
                              <div className="w-full" style={{ background: 'linear-gradient(180deg, rgba(3,7,18,0.3), transparent)' }}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                  {mediaList.slice(0, visibleCount).map((m) => (
                                    <div key={m.id} className="relative group">
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
                                      <div className="pointer-events-none absolute inset-0 rounded-lg ring-0 group-hover:ring-2 group-hover:ring-sky-500/30 transition" />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {visibleCount < mediaList.length && (
                                <div className="mt-8 flex justify-center">
                                  <button onClick={loadMore} className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold shadow-md">
                                    Load more <FaChevronDown />
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          )}

                          {tab === 'info' && (
                            <motion.div key="info" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.32 }}>
                              <div className="rounded-2xl p-6 border border-white/6" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}>
                                <h4 className="text-sm text-sky-200 uppercase tracking-wide mb-3">Studio Overview</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sky-100 text-sm">
                                  <div><span className="text-sky-300">Name:</span> {studio.name}</div>
                                  <div><span className="text-sky-300">Type:</span> {studio.isAnimationStudio ? 'Animation Studio' : 'N/A'}</div>
                                  <div><span className="text-sky-300">Anime Count:</span> {studio.media?.nodes?.length ?? 0}</div>
                                  <div><span className="text-sky-300">Favourites:</span> {studio.favourites ?? 0}</div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {tab === 'stats' && (
                            <motion.div key="stats" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.32 }}>
                              <div className="rounded-2xl p-6 border border-white/6" style={{ background: 'linear-gradient(180deg, rgba(3,7,18,0.45), rgba(3,7,18,0.35))' }}>
                                <h4 className="text-sm text-sky-200 uppercase tracking-wide mb-4">Top Genres</h4>
                                <div className="flex flex-wrap gap-2">{renderTopGenres()}</div>
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-xs text-sky-300">Produced Titles</div>
                                    <div className="text-lg font-semibold text-sky-100 mt-1">{studio.media?.nodes?.length ?? 0}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-sky-300">Favourites</div>
                                    <div className="text-lg font-semibold text-sky-100 mt-1">{studio.favourites ?? 0}</div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 lg:hidden">
                    <div className="rounded-2xl p-4 border border-white/6">
                      <div className="text-xs text-sky-200 uppercase tracking-wide mb-2">Top Genres</div>
                      <div className="flex flex-wrap gap-2">{renderTopGenres()}</div>
                    </div>
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
