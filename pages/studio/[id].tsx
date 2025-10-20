'use client'

import { useEffect, useState, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaChevronDown, FaSpinner, FaSearch, FaStar } from 'react-icons/fa'
import { fetchStudioDetail } from '@/lib/anilist'
import type { StudioDetail } from '@/types/studio'

type TabKey = 'anime' | 'info' | 'stats'

function gradientFromSeed(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) % 360
  }
  const h2 = (h + 50) % 360
  return `linear-gradient(135deg, hsl(${h} 75% 45% / 0.22), hsl(${h2} 65% 55% / 0.18))`
}

function formatCount(n?: number) {
  if (!n) return '0'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export default function StudioPage() {
  const router = useRouter()
  const { id } = router.query
  const studioId = useMemo(() => (Array.isArray(id) ? Number(id[0]) : id ? Number(id) : null), [id])

  const [studio, setStudio] = useState<StudioDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<TabKey>('anime')
  const [visibleCount, setVisibleCount] = useState(18)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

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
        className="px-4 py-1.5 rounded-full bg-white/3 border border-white/8 text-sm font-medium text-white/90 backdrop-blur-sm"
      >
        {g}
        <span className="text-xs text-neutral-400 ml-2">({c})</span>
      </motion.div>
    ))
  }

  const headerGradient = useMemo(() => gradientFromSeed(studio?.name || 'aichiow'), [studio])

  return (
    <>
      <Head>
        <title>{studio ? `${studio.name} • Studio | Aichiow` : 'Studio • Aichiow'}</title>
        <meta name="description" content="Studio details and produced anime on Aichiow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#03040a] via-[#071026] to-[#02030a] text-white px-4 md:px-12 pb-28">
        <div className="max-w-[1450px] mx-auto pt-10">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/8 transition-all duration-200"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-neutral-300">Studio</h2>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-xs text-neutral-400">Theme</div>
              <div className="w-10 h-8 rounded-lg" style={{ background: headerGradient }} />
            </div>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative rounded-3xl overflow-hidden backdrop-blur-2xl border border-white/8"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}
          >
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: `radial-gradient(600px 200px at 10% 10%, rgba(99,102,241,0.06), transparent), radial-gradient(400px 160px at 90% 80%, rgba(59,130,246,0.05), transparent)`,
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 md:p-8">
              <div className="md:col-span-1 flex flex-col gap-5">
                <div className="w-full rounded-2xl overflow-hidden flex items-center justify-center" style={{ minHeight: 180, background: headerGradient }}>
                  <div className="flex items-center gap-4 px-4">
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0 bg-white/6 border border-white/8">
                      <span className="text-3xl font-extrabold">{studio?.name?.charAt(0) ?? 'S'}</span>
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent" style={{ background: 'linear-gradient(90deg,#fff,#9be1ff)' }}>
                        {studio?.name ?? 'Studio'}
                      </h1>
                      <div className="mt-1 text-xs text-neutral-300 flex items-center gap-2">
                        <span>{studio?.isAnimationStudio ? 'Animation Studio' : 'Studio'}</span>
                        <span>•</span>
                        <span>{formatCount(studio?.favourites)} fav</span>
                        <span>•</span>
                        <span>{formatCount(studio?.media?.nodes?.length)} anime</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-b from-white/3 to-transparent p-4 border border-white/6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-neutral-300 uppercase">Quick Info</div>
                      <div className="mt-2 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          <FaStar className="opacity-80" />
                          <span>{formatCount(studio?.favourites)} favourites</span>
                        </div>
                        <div className="mt-2 text-neutral-400 text-sm">
                          {studio?.media?.nodes?.length ?? 0} produced titles
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs text-neutral-400">Founded</div>
                      <div className="text-sm text-white/90 mt-1">{studio?.founded ?? '—'}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-4 border border-white/6 bg-white/2">
                  <div className="text-xs text-neutral-300 uppercase">Search</div>
                  <div className="mt-3 relative">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search studio anime, genres..."
                      className="w-full bg-transparent px-4 py-2 rounded-lg outline-none border border-white/6 placeholder:text-neutral-400"
                    />
                    <div className="absolute right-3 top-3 opacity-80">
                      <FaSearch />
                    </div>
                  </div>
                </div>

                <div className="hidden md:block rounded-2xl p-4 border border-white/6 bg-white/2">
                  <div className="text-xs text-neutral-300 uppercase">Top Genres</div>
                  <div className="mt-3 flex flex-wrap gap-2">{renderTopGenres()}</div>
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2 bg-white/3 rounded-full p-1 border border-white/6">
                      {(['anime', 'info', 'stats'] as TabKey[]).map((k) => (
                        <button
                          key={k}
                          onClick={() => setTab(k)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === k ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' : 'text-neutral-200 hover:bg-white/5'}`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                    <div className="text-sm text-neutral-300">Showing <span className="text-white/90">{tab}</span></div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs text-neutral-400 hidden sm:block">Sort</div>
                    <select className="bg-transparent px-3 py-2 rounded-lg border border-white/6 text-sm outline-none">
                      <option value="popular">Most Popular</option>
                      <option value="latest">Latest</option>
                      <option value="score">Highest Score</option>
                    </select>
                    <button onClick={() => { setQuery(''); setVisibleCount(18); }} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/8">Reset</button>
                  </div>
                </div>

                <div className="rounded-2xl p-4 border border-white/6 bg-white/3 min-h-[420px]">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-28">
                        <FaSpinner className="animate-spin text-4xl text-blue-400" />
                      </motion.div>
                    ) : error ? (
                      <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center text-red-400">
                        {error}
                      </motion.div>
                    ) : !studio ? (
                      <motion.div key="notfound" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center text-neutral-400">
                        Studio not found
                      </motion.div>
                    ) : (
                      <>
                        {tab === 'anime' && (
                          <motion.div key="anime" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
                            <MosaicGrid
                              items={mediaList.slice(0, visibleCount)}
                              onItemHover={(i) => setActiveIndex(i)}
                              activeIndex={activeIndex}
                            />
                            {visibleCount < mediaList.length && (
                              <div className="mt-6 flex justify-center">
                                <button onClick={loadMore} className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg">
                                  Load more <FaChevronDown />
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {tab === 'info' && (
                          <motion.div key="info" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="rounded-xl p-4 bg-white/2 border border-white/6">
                                <div className="text-xs text-neutral-300 uppercase">Overview</div>
                                <div className="mt-3 text-sm text-neutral-200 space-y-2">
                                  <div><span className="text-neutral-400">Name:</span> {studio.name}</div>
                                  <div><span className="text-neutral-400">Type:</span> {studio.isAnimationStudio ? 'Animation Studio' : 'Studio'}</div>
                                  <div><span className="text-neutral-400">Anime Count:</span> {studio.media?.nodes?.length ?? 0}</div>
                                  <div><span className="text-neutral-400">Favourites:</span> {studio.favourites ?? 0}</div>
                                </div>
                              </div>
                              <div className="rounded-xl p-4 bg-white/2 border border-white/6">
                                <div className="text-xs text-neutral-300 uppercase">Social & Links</div>
                                <div className="mt-3 text-sm text-neutral-200">
                                  <div className="text-neutral-400">No external links available</div>
                                </div>
                              </div>
                              <div className="rounded-xl p-4 bg-white/2 border border-white/6">
                                <div className="text-xs text-neutral-300 uppercase">Notes</div>
                                <div className="mt-3 text-sm text-neutral-200">
                                  <div className="text-neutral-400">No additional info</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {tab === 'stats' && (
                          <motion.div key="stats" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="rounded-xl p-4 bg-white/2 border border-white/6">
                                <div className="text-xs text-neutral-300 uppercase">Top Genres</div>
                                <div className="mt-3 flex flex-wrap gap-2">{renderTopGenres()}</div>
                              </div>
                              <div className="rounded-xl p-4 bg-white/2 border border-white/6">
                                <div className="text-xs text-neutral-300 uppercase">Stats Overview</div>
                                <div className="mt-3 text-sm text-neutral-200 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-neutral-400">Produced Titles</div>
                                    <div className="text-white/90">{studio.media?.nodes?.length ?? 0}</div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-neutral-400">Favourites</div>
                                    <div className="text-white/90">{studio.favourites ?? 0}</div>
                                  </div>
                                  <div className="h-3 bg-white/6 rounded-full mt-3 overflow-hidden">
                                    <div style={{ width: `${Math.min(100, (studio.favourites ?? 0) / 1000)}%` }} className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </>
  )
}

function MosaicGrid({ items, onItemHover, activeIndex }: { items: any[]; onItemHover: (i: number | null) => void; activeIndex: number | null }) {
  const layout = useMemo(() => {
    const sizes = ['span-2', 'span-1', 'span-1', 'span-2', 'span-1']
    return items.map((it, idx) => ({ ...it, size: sizes[idx % sizes.length], idx }))
  }, [items])

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-fr">
        {layout.map((m, i) => (
          <motion.div
            key={m.id || i}
            layout
            onMouseEnter={() => onItemHover(i)}
            onMouseLeave={() => onItemHover(null)}
            whileHover={{ scale: 1.025 }}
            className={`relative rounded-xl overflow-hidden group col-span-1 ${m.size === 'span-2' ? 'sm:col-span-2 lg:col-span-3' : ''}`}
            style={{
              minHeight: m.size === 'span-2' ? 220 : 160,
              background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))`,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="absolute inset-0 -z-10">
              <img src={m.bannerImage || m.coverImage?.large || '/default.png'} alt={m.title?.romaji || m.title?.english || ''} className="w-full h-full object-cover filter brightness-75" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(2,6,23,0.6))' }} />
            </div>

            <div className="absolute left-3 top-3 px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-sm bg-white/6 border border-white/8">
              {m.averageScore ? `${Math.round(m.averageScore / 10) / 10}/10` : '—'}
            </div>

            <div className="absolute right-3 top-3 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm bg-white/5 border border-white/8">
              {m.seasonYear ?? ''}
            </div>

            <div className="absolute left-3 bottom-3 right-3 p-3 rounded-md bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <div className="max-w-[80%]">
                  <div className={`text-sm font-semibold leading-tight ${activeIndex === i ? 'text-white' : 'text-neutral-100'}`}>
                    {m.title?.romaji || m.title?.english || 'Untitled'}
                  </div>
                  <div className="text-xs text-neutral-300 mt-1 line-clamp-2">
                    {(m.genres || []).slice(0, 3).join(', ')}
                  </div>
                </div>
                <div className="ml-3 shrink-0 flex items-center gap-2">
                  <button className="w-9 h-9 rounded-full bg-white/6 flex items-center justify-center border border-white/8">
                    <FaStar />
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-100 opacity-0 flex items-center justify-center">
              <div className="rounded-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
