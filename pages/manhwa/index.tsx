'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchManhwaList, searchManhwa, fetchGenres } from '@/lib/anilistManhwa'
import { Manhwa } from '@/types/manhwa'

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

function useInfiniteScroll(callback: () => void) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const nodeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) callback()
    }, { rootMargin: '300px' })
    const node = nodeRef.current
    if (node) observerRef.current.observe(node)
    return () => observerRef.current?.disconnect()
  }, [callback])

  return nodeRef
}

const IconSpinner = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: size, height: size }}
    className="animate-spin"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v4m0 8v4m8-8h-4M4 12H0" />
  </svg>
)

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 overflow-hidden shadow-lg animate-pulse">
      <div className="w-full aspect-[3/4] bg-gray-700" />
      <div className="p-3">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  )
}

function ModalPreview({ open, manhwa, onClose }: { open: boolean; manhwa?: Manhwa | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && manhwa && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="max-w-4xl w-full bg-gradient-to-br from-gray-900 to-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/3 w-full relative aspect-[3/4]">
                <Image src={manhwa.coverImage.large} alt={manhwa.title.english || manhwa.title.romaji} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">{manhwa.title.english || manhwa.title.romaji}</h3>
                    <p className="text-sm text-gray-300 mt-1 line-clamp-3">{manhwa.description ? manhwa.description.replace(/<[^>]+>/g, '') : 'No description available.'}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {manhwa.genres?.slice(0, 6).map((g) => (
                        <span key={g} className="text-xs bg-gray-800 px-2 py-1 rounded-full">{g}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={onClose} className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">Close</button>
                    <Link href={`/manhwa/${manhwa.id}`} className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700">Open</Link>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <div>Status: <span className="text-gray-200">{manhwa.status || 'Unknown'}</span></div>
                  <div>Chapters: <span className="text-gray-200">{manhwa.chapters ?? '-'}</span></div>
                  <div>Score: <span className="text-gray-200">{manhwa.averageScore ?? '-'}</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ManhwaPage() {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 450)
  const [searchResults, setSearchResults] = useState<Manhwa[]>([])
  const [searching, setSearching] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState<Manhwa | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const gs = await fetchGenres()
        if (!mounted) return
        setGenres(['ALL', ...gs])
      } catch (e) {
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setError(null)
      try {
        if (page === 1) setLoading(true)
        const data = await fetchManhwaList(page, selectedGenre !== 'ALL' ? selectedGenre : undefined)
        if (!mounted) return
        if (page === 1) setManhwa(data.list)
        else setManhwa((prev) => [...prev, ...data.list])
        setTotalPages(data.totalPages ?? 1)
      } catch (e) {
        setError('Gagal memuat daftar manhwa. Coba refresh.')
      } finally {
        setLoading(false)
        setIsLoadingMore(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [page, selectedGenre])

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([])
        setSearching(false)
        return
      }
      setSearching(true)
      try {
        const res = await searchManhwa(debouncedQuery)
        if (!mounted) return
        setSearchResults(res)
      } catch (e) {
      } finally {
        setSearching(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [debouncedQuery])

  const displayedList = searchResults.length > 0 ? searchResults : manhwa

  const loadMore = () => {
    if (isLoadingMore) return
    if (page >= totalPages) return
    setIsLoadingMore(true)
    setPage((p) => p + 1)
  }
  const sentinelRef = useInfiniteScroll(loadMore)

  const genreCounts = useMemo(() => {
    const map = new Map<string, number>()
    manhwa.forEach((m) => (m.genres || []).forEach((g) => map.set(g, (map.get(g) || 0) + 1)))
    return map
  }, [manhwa])

  const openPreview = (m: Manhwa) => {
    setPreviewItem(m)
    setPreviewOpen(true)
  }

  // NEW: modern interactive pager UI handlers
  const handleLoadNewer = () => {
    // If we're on page > 1, load previous page (newer content)
    if (page > 1) {
      setIsLoadingMore(true)
      setPage((p) => Math.max(1, p - 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // if already on first page, refresh current
      setLoading(true)
      setPage(1)
    }
  }

  const handleLoadMore = () => {
    // semantic "Load more" (older content)
    loadMore()
  }

  return (
    <>
      <Head>
        <title>Manhwa • Aichiow</title>
        <meta name="description" content="Discover and explore the best manhwa" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-8">
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-2 shadow-lg">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19V5a1 1 0 0 1 1-1h10l4 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="white" opacity="0.95" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">Manhwa</h1>
                <p className="text-xs text-gray-400">Latest, trending, and curated manhwa — all in one place.</p>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <label className="relative block">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search manhwa, authors, tags..."
                  className="w-full md:w-[420px] rounded-lg pl-4 pr-12 py-2 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {searching ? <IconSpinner /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
                  </svg>}
                </div>
              </label>
            </div>
          </div>

          <section className="mb-6">
            {loading ? (
              <div className="w-full h-[260px] md:h-[420px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
            ) : manhwa[0] ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-xl overflow-hidden">
                <div className="relative w-full h-[260px] md:h-[420px]">
                  <Image src={manhwa[0].coverImage.large} alt={manhwa[0].title.english || manhwa[0].title.romaji} fill style={{ objectFit: 'cover' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="absolute left-6 bottom-6">
                  <h2 className="text-2xl md:text-4xl font-extrabold">{manhwa[0].title.english || manhwa[0].title.romaji}</h2>
                  <p className="max-w-xl mt-2 text-sm text-gray-300 line-clamp-3">{manhwa[0].description ? manhwa[0].description.replace(/<[^>]+>/g, '') : 'No description available.'}</p>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/manhwa/${manhwa[0].id}`} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">Read</Link>
                    <button onClick={() => openPreview(manhwa[0])} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">Preview</button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-gray-400">No featured manhwa.</div>
            )}
          </section>

          <section className="mb-6">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setSelectedGenre(g)
                      setPage(1)
                      setSearchResults([])
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedGenre === g ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    {g} {g !== 'ALL' && genreCounts.get(g) ? <span className="ml-2 text-xs text-gray-400">{genreCounts.get(g)}</span> : null}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort:</span>
                <select onChange={(e) => { /* optional sort handler */ }} className="bg-gray-800 rounded px-2 py-1 text-sm">
                  <option value="popular">Most Popular</option>
                  <option value="new">New</option>
                  <option value="score">Highest Score</option>
                </select>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          </section>

           <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {loading && page === 1
                ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
                : displayedList.map((m) => (
                    <motion.article key={m.id} layout whileHover={{ scale: 1.02 }} className="relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-900 to-neutral-900">
                      <div className="relative aspect-[3/4] w-full overflow-hidden">
                        <Image src={m.coverImage.large} alt={m.title.english || m.title.romaji} fill style={{ objectFit: 'cover' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80" />
                        <div className="absolute left-3 top-3 flex gap-2">
                          <button onClick={(e) => { e.preventDefault(); openPreview(m) }} aria-label="Preview" className="px-2 py-1 rounded bg-black/40 hover:bg-black/20 backdrop-blur-sm">Preview</button>
                        </div>
                      </div>

                      <div className="p-3">
                        <h3 className="text-sm font-semibold line-clamp-2">{m.title.english || m.title.romaji}</h3>
                        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                          <span>{m.chapters ?? '-'} ch</span>
                          <span>{m.averageScore ?? '-'}</span>
                        </div>
                      </div>

                    </motion.article>
                  ))}
            </div>

            <div ref={sentinelRef.current ?? null as any} className="mt-6 flex justify-center items-center">
              {isLoadingMore && (
                <div className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-gray-300">
                  <IconSpinner />
                  <span>Loading more...</span>
                </div>
              )}
              {!isLoadingMore && page >= totalPages && (
                <div className="text-gray-400 text-sm">You've reached the end.</div>
              )}
            </div>

            {/* MODERN / INTERACTIVE pager */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleLoadNewer}
                disabled={page === 1 && !loading}
                aria-disabled={page === 1 && !loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${page === 1 && !loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-white/5 to-white/3 hover:from-white/6'}`}
                title="Load newer results (previous page)"
              >
                {/* left chevron + label */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 -ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
                <span className="text-sm">{page > 1 ? 'Load Newer' : (loading ? 'Refreshing' : 'Latest')}</span>
              </motion.button>

              <div className="text-sm text-gray-300 select-none">Page {page} / {totalPages}</div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleLoadMore}
                disabled={page >= totalPages}
                aria-disabled={page >= totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${page >= totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                title="Load more results"
              >
                <span className="text-sm">Load more</span>
                {/* right chevron */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 -mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </motion.button>
            </div>

            {/* mobile sticky load-more (very handy on phones) */}
            <div className="sm:hidden fixed left-4 right-4 bottom-6 z-40">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleLoadMore}
                disabled={page >= totalPages}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl ${page >= totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoadingMore ? <IconSpinner /> : null}
                <span className="font-medium">{page >= totalPages ? 'No more results' : 'Load more'}</span>
              </motion.button>
            </div>

          </section>

        </div>

        <ModalPreview open={previewOpen} manhwa={previewItem} onClose={() => setPreviewOpen(false)} />
      </div>
    </>
  )
}
