'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchManhwaList, searchManhwa, fetchGenres } from '@/lib/anilistManhwa'
import { Manhwa } from '@/types/manhwa'

// Lightweight debounce hook
function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// Simple infinite-scroll sentinel
function useSentinel(callback: () => void) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) callback()
    }, { rootMargin: '200px' })
    obs.observe(node)
    return () => obs.disconnect()
  }, [callback])
  return ref
}

const Spinner = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: size, height: size }} className="animate-spin">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m6.36 1.64l-2.83 2.83M20 12h-4M6.36 4.64 3.53 7.47M4 12H0m2.64 6.36 2.83-2.83M12 20v-4" />
  </svg>
)

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

  // fetch genres once
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const gs = await fetchGenres()
        if (!mounted) return
        setGenres(['ALL', ...gs])
      } catch (e) {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [])

  // load manhwa list
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setError(null)
      try {
        if (page === 1) setLoading(true)
        const data = await fetchManhwaList(page, selectedGenre !== 'ALL' ? selectedGenre : undefined)
        if (!mounted) return
        setManhwa((prev) => (page === 1 ? data.list : [...prev, ...data.list]))
        setTotalPages(data.totalPages ?? 1)
      } catch (e) {
        setError('Gagal memuat daftar manhwa.')
      } finally {
        setLoading(false)
        setIsLoadingMore(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [page, selectedGenre])

  // search (debounced)
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
        // ignore
      } finally {
        setSearching(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [debouncedQuery])

  const displayed = searchResults.length > 0 ? searchResults : manhwa

  const loadMore = () => {
    if (isLoadingMore) return
    if (page >= totalPages) return
    setIsLoadingMore(true)
    setPage((p) => p + 1)
  }
  const sentinelRef = useSentinel(loadMore)

  const openPreview = (m: Manhwa) => { setPreviewItem(m); setPreviewOpen(true) }

  const genreCounts = useMemo(() => {
    const map = new Map<string, number>()
    manhwa.forEach((m) => (m.genres || []).forEach((g) => map.set(g, (map.get(g) || 0) + 1)))
    return map
  }, [manhwa])

  return (
    <>
      <Head>
        <title>Manhwa • Aichiow</title>
        <meta name="description" content="Discover manhwa on Aichiow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 py-8">

          {/* header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19V5a1 1 0 0 1 1-1h10l4 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="white"/></svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">Manhwa</h1>
                <p className="text-sm text-gray-400">Trending · Updated · Curated</p>
              </div>
            </div>

            <div className="w-full md:w-[420px]">
              <div className="relative">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search manhwa, tags or authors" className="w-full rounded-lg pl-4 pr-10 py-2 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                  {searching ? <Spinner /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"/></svg>}
                </div>
              </div>
            </div>
          </div>

          {/* hero */}
          <section className="mb-6">
            {loading ? (
              <div className="w-full h-[240px] md:h-[360px] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
            ) : manhwa[0] ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-xl overflow-hidden">
                <div className="relative h-[240px] md:h-[360px] w-full">
                  <Image src={manhwa[0].coverImage.large} alt={manhwa[0].title.english || manhwa[0].title.romaji} fill style={{ objectFit: 'cover' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
                <div className="absolute left-6 bottom-6">
                  <h2 className="text-2xl md:text-4xl font-extrabold">{manhwa[0].title.english || manhwa[0].title.romaji}</h2>
                  <p className="max-w-xl mt-2 text-sm text-gray-300 line-clamp-3">{manhwa[0].description ? manhwa[0].description.replace(/<[^>]+>/g, '') : 'No description.'}</p>
                  <div className="flex gap-3 mt-4">
                    <Link href={`/manhwa/${manhwa[0].id}`} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">Read</Link>
                    <button onClick={() => openPreview(manhwa[0])} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">Preview</button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-gray-400">No featured manhwa</div>
            )}
          </section>

          {/* filters */}
          <section className="mb-6">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {genres.map((g) => (
                  <button key={g} onClick={() => { setSelectedGenre(g); setPage(1); setSearchResults([]); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${selectedGenre === g ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                    {g}{g !== 'ALL' && genreCounts.get(g) ? <span className="ml-2 text-xs text-gray-400">{genreCounts.get(g)}</span> : null}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort</span>
                <select className="bg-gray-800 rounded px-2 py-1 text-sm">
                  <option>Most Popular</option>
                  <option>Newest</option>
                  <option>Highest Score</option>
                </select>
              </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
          </section>

          {/* grid */}
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {loading && page === 1
                ? Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-neutral-900 animate-pulse">
                      <div className="aspect-[3/4] bg-gray-700" />
                      <div className="p-3">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                : displayed.map((m) => (
                    <motion.article key={m.id} whileHover={{ y: -4 }} className="bg-gradient-to-br from-gray-900 to-neutral-900 rounded-xl overflow-hidden shadow-md">
                      <Link href={`/manhwa/${m.id}`} className="block">
                        <div className="relative aspect-[3/4] w-full">
                          <Image src={m.coverImage.large} alt={m.title.english || m.title.romaji} fill style={{ objectFit: 'cover' }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-semibold line-clamp-2">{m.title.english || m.title.romaji}</h3>
                          <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                            <span>{m.chapters ?? '-'} ch</span>
                            <span>{m.averageScore ?? '-'}</span>
                          </div>
                        </div>
                      </Link>
                      <div className="absolute left-3 top-3">
                        <button onClick={(e) => { e.preventDefault(); openPreview(m) }} className="px-2 py-1 rounded bg-black/40">Preview</button>
                      </div>
                    </motion.article>
                  ))}
            </div>

            <div ref={sentinelRef.current ?? null as any} className="mt-6 flex justify-center items-center">
              {isLoadingMore && (
                <div className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-gray-300"><Spinner />Loading more...</div>
              )}
              {!isLoadingMore && page >= totalPages && <div className="text-gray-400">End of results</div>}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button onClick={() => { if (page > 1) setPage((p) => p - 1) }} disabled={page === 1} className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}>Prev</button>
              <span className="text-sm text-gray-300">Page {page} / {totalPages}</span>
              <button onClick={() => { if (page < totalPages) setPage((p) => p + 1) }} disabled={page >= totalPages} className={`px-3 py-1 rounded ${page >= totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>Next</button>
            </div>
          </section>

        </div>

        {/* modal preview */}
        <AnimatePresence>
          {previewOpen && previewItem && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} exit={{ scale: 0.98 }} className="max-w-4xl w-full bg-gradient-to-br from-gray-900 to-neutral-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="md:flex">
                  <div className="md:w-1/3 w-full relative aspect-[3/4]"><Image src={previewItem.coverImage.large} alt={previewItem.title.english || previewItem.title.romaji} fill style={{ objectFit: 'cover' }} /></div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{previewItem.title.english || previewItem.title.romaji}</h3>
                        <p className="text-sm text-gray-300 mt-2 line-clamp-4">{previewItem.description ? previewItem.description.replace(/<[^>]+>/g, '') : 'No description.'}</p>
                        <div className="flex gap-2 mt-3 flex-wrap">{previewItem.genres?.slice(0,6).map(g => <span key={g} className="text-xs bg-gray-800 px-2 py-1 rounded">{g}</span>)}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setPreviewOpen(false)} className="px-3 py-1 rounded bg-gray-700">Close</button>
                        <Link href={`/manhwa/${previewItem.id}`} className="px-3 py-1 rounded bg-blue-600">Open</Link>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                      <div>Status: <span className="text-gray-200">{previewItem.status ?? '-'}</span></div>
                      <div>Chapters: <span className="text-gray-200">{previewItem.chapters ?? '-'}</span></div>
                      <div>Score: <span className="text-gray-200">{previewItem.averageScore ?? '-'}</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  )
}
