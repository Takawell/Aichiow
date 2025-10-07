'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaSpinner, FaSearch, FaThList, FaThLarge, FaRedo } from 'react-icons/fa'
import ManhwaHeroSection from '@/components/manhwa/ManhwaHeroSection'
import { fetchManhwaList, searchManhwa, fetchGenres } from '@/lib/anilistManhwa'
import { Manhwa } from '@/types/manhwa'

type SortOption = 'TRENDING' | 'TITLE_ASC' | 'TITLE_DESC' | 'SCORE_DESC' | 'YEAR_DESC'

export default function ManhwaPage() {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Manhwa[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('TRENDING')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const g = await fetchGenres()
        if (!mounted) return
        setGenres(['ALL', ...g])
      } catch {}
    })()
    return () => {
      mounted = false
    }
  }, [])

  const fetchPage = async (pageToLoad = 1, reset = false) => {
    setError(null)
    setLoading(true)
    try {
      const genreParam =
        selectedGenres.length === 0 || selectedGenres.includes('ALL')
          ? undefined
          : selectedGenres[0]
      const res = await fetchManhwaList(pageToLoad, genreParam)
      setTotalPages(res.totalPages ?? 1)
      setHasMore(pageToLoad < (res.totalPages ?? 1))
      setManhwa((prev) => {
        if (reset) return res.list
        const ids = new Set(prev.map((p) => p.id))
        const toAdd = res.list.filter((r: Manhwa) => !ids.has(r.id))
        return [...prev, ...toAdd]
      })
    } catch {
      setError('Gagal memuat daftar manhwa. Coba tekan tombol retry.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    setManhwa([])
    setHasMore(true)
    fetchPage(1, true)
  }, [selectedGenres, sortBy])

  useEffect(() => {
    if (!loadMoreRef.current) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && debouncedQuery === '') {
          setPage((p) => {
            const next = p + 1
            fetchPage(next, false)
            return next
          })
        }
      },
      { rootMargin: '200px' }
    )
    observerRef.current.observe(loadMoreRef.current)
    return () => observerRef.current?.disconnect()
  }, [loadMoreRef.current, hasMore, loading, debouncedQuery])

  useEffect(() => {
    let active = true
    const doSearch = async () => {
      if (!debouncedQuery) {
        setSearchResults([])
        setSearching(false)
        return
      }
      setSearching(true)
      try {
        const results = await searchManhwa(debouncedQuery)
        if (!active) return
        setSearchResults(results ?? [])
      } finally {
        if (active) setSearching(false)
      }
    }
    doSearch()
    return () => {
      active = false
    }
  }, [debouncedQuery])

  const baseList = useMemo(() => {
    const list = debouncedQuery ? searchResults : manhwa
    let filtered = list.slice()
    switch (sortBy) {
      case 'TITLE_ASC':
        filtered.sort((a, b) => (a.title.english || a.title.romaji || '').localeCompare(b.title.english || b.title.romaji || ''))
        break
      case 'TITLE_DESC':
        filtered.sort((a, b) => (b.title.english || b.title.romaji || '').localeCompare(a.title.english || a.title.romaji || ''))
        break
      case 'SCORE_DESC':
        filtered.sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0))
        break
      case 'YEAR_DESC':
        filtered.sort((a, b) => (b.startDate?.year ?? 0) - (a.startDate?.year ?? 0))
        break
    }
    return filtered
  }, [manhwa, searchResults, debouncedQuery, sortBy])

  const handleRetry = () => {
    setError(null)
    fetchPage(page, page === 1)
  }

  return (
    <>
      <Head>
        <title>Manhwa | Aichiow</title>
        <meta name="description" content="Discover manhwa — trending, top-rated, and new releases on Aichiow." />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
          <section aria-labelledby="manhwa-hero">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1">
                {loading && manhwa.length === 0 ? (
                  <div className="w-full h-[260px] md:h-[380px] rounded-lg bg-neutral-900 animate-pulse" />
                ) : manhwa.length > 0 ? (
                  <ManhwaHeroSection manhwa={manhwa[0]} />
                ) : (
                  <div className="rounded-lg bg-neutral-900 p-6">
                    <p className="text-gray-300">Tidak ada manhwa untuk ditampilkan.</p>
                  </div>
                )}
              </div>

              <aside className="w-full md:w-[340px] space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setDebouncedQuery(query.trim())
                  }}
                  className="flex items-center gap-2"
                  role="search"
                >
                  <label htmlFor="search" className="sr-only">Search manhwa</label>
                  <div className="flex items-center flex-1 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
                    <FaSearch className="mr-2 text-gray-400" />
                    <input
                      id="search"
                      className="bg-transparent outline-none w-full text-sm"
                      placeholder="Search manhwa..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {searching && <FaSpinner className="ml-2 animate-spin" />}
                    {query && !searching && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery('')
                          setDebouncedQuery('')
                        }}
                        className="ml-2 text-xs text-gray-400"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </form>

                <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                  <h3 className="text-xs text-gray-300 mb-2 font-semibold">Genres</h3>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-2">
                    {genres.length === 0 ? (
                      <div className="text-gray-500 text-sm">Loading genres...</div>
                    ) : (
                      genres.map((g) => {
                        const active = selectedGenres.includes(g)
                        return (
                          <button
                            key={g}
                            onClick={() => {
                              if (g === 'ALL') {
                                setSelectedGenres(['ALL'])
                                return
                              }
                              setSelectedGenres((prev) => {
                                const use = prev.filter((p) => p !== 'ALL')
                                if (use.includes(g)) return use.filter((p) => p !== g)
                                return [...use, g]
                              })
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${active ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white shadow-md' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                          >
                            {g}
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs text-gray-300">Sort</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="mt-1 bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
                      >
                        <option value="TRENDING">Trending</option>
                        <option value="SCORE_DESC">Top score</option>
                        <option value="YEAR_DESC">Newest</option>
                        <option value="TITLE_ASC">Title A → Z</option>
                        <option value="TITLE_DESC">Title Z → A</option>
                      </select>
                    </div>

                    <button
                      title="Toggle view"
                      onClick={() => setViewMode((v) => (v === 'grid' ? 'list' : 'grid'))}
                      className="p-2 rounded-md bg-gray-800 border border-gray-700"
                    >
                      {viewMode === 'grid' ? <FaThList /> : <FaThLarge />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  {error && (
                    <div className="flex-1 bg-red-900/30 rounded p-2 text-sm text-red-300 flex items-center justify-between">
                      <span>{error}</span>
                      <button onClick={handleRetry} className="ml-2 px-2 py-1 bg-red-600 rounded text-white text-sm flex items-center gap-2">
                        <FaRedo /> Retry
                      </button>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </section>

          <section aria-labelledby="manhwa-list">
            <div className="flex items-center justify-between mb-3">
              <h2 id="manhwa-list" className="text-lg font-semibold">Daftar Manhwa</h2>
              <div className="text-sm text-gray-400">
                Menampilkan {baseList.length} items {loading && <span className="ml-2 text-gray-300">— memuat...</span>}
              </div>
            </div>

            {baseList.length === 0 && !loading ? (
              <div className="rounded-lg bg-gray-900 p-6 text-center text-gray-400">
                {debouncedQuery ? (
                  <div>Tidak ada hasil untuk “{debouncedQuery}”.</div>
                ) : (
                  <div>Daftar kosong. Periksa koneksi atau ubah filter.</div>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {baseList.map((m) => (
                  <motion.article
                    key={m.id}
                    whileHover={{ scale: 1.03 }}
                    className="relative bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-blue-500/30 transition-all group"
                    aria-labelledby={`title-${m.id}`}
                  >
                    <Link href={`/manhwa/${m.id}`}>
                      <div className="relative w-full aspect-[3/4] overflow-hidden">
                        <img loading="lazy" src={m.coverImage.large} alt={m.title.english || m.title.romaji} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition duration-300"></div>
                      </div>
                      <div className="p-3">
                        <h3 id={`title-${m.id}`} className="text-sm sm:text-base font-semibold text-white line-clamp-2">
                          {m.title.english || m.title.romaji}
                        </h3>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                          <div>{m.startDate?.year ?? '—'}</div>
                          <div>{m.averageScore ? `${m.averageScore}%` : '—'}</div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {baseList.map((m) => (
                  <article key={m.id} className="flex gap-4 items-center bg-gray-900 rounded-lg p-3 border border-gray-800">
                    <Link href={`/manhwa/${m.id}`} className="flex items-center gap-4">
                      <img loading="lazy" src={m.coverImage.medium} alt={m.title.english || m.title.romaji} className="w-24 h-32 object-cover rounded" />
                    </Link>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold">{m.title.english || m.title.romaji}</h3>
                      <div className="text-sm text-gray-400 mt-1">{m.description ? stripHtml(m.description).slice(0, 180) + (m.description.length > 180 ? '…' : '') : 'No description'}</div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                        <div>{m.startDate?.year ?? '—'}</div>
                        <div>{m.averageScore ? `${m.averageScore}%` : '—'}</div>
                      </div>
                    </div>
                    <div className="w-28 flex flex-col gap-2">
                      <Link href={`/manhwa/${m.id}`} className="text-xs px-3 py-2 rounded bg-blue-600 text-center">Open</Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col items-center">
              {loading && <div className="text-gray-400 flex items-center gap-2"><FaSpinner className="animate-spin" /> Memuat...</div>}
              {!loading && hasMore && debouncedQuery === '' && (
                <button
                  onClick={() => {
                    const next = page + 1
                    setPage(next)
                    fetchPage(next, false)
                  }}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                  Load more
                </button>
              )}
              <div ref={loadMoreRef} className="w-full h-2" />
              {!hasMore && <div className="text-sm text-gray-500 mt-4">End of results</div>}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

function stripHtml(html?: string) {
  if (!html) return ''
  return html.replace(/<\/?[^>]+(>|$)/g, '')
}
