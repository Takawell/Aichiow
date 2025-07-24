'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { fetchManhwaList, searchManhwa } from '@/lib/anilistManhwa'
import { Manhwa } from '@/types/manhwa'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ManhwaPage() {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Manhwa[]>([])
  const [searching, setSearching] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)

  const [heroIndex, setHeroIndex] = useState(0)

  // Load Manhwa
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchManhwaList(page)
        setManhwa(data.list)
        setTotalPages(data.totalPages)
      } catch (e: any) {
        setError('Gagal memuat daftar Manhwa.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [page])

  // Hero slider auto change
  useEffect(() => {
    if (manhwa.length > 0) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % manhwa.length)
      }, 7000)
      return () => clearInterval(interval)
    }
  }, [manhwa])

  const nextSlide = () => setHeroIndex((prev) => (prev + 1) % manhwa.length)
  const prevSlide = () => setHeroIndex((prev) => (prev - 1 + manhwa.length) % manhwa.length)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    const results = await searchManhwa(query)
    setSearchResults(results)
    setSearching(false)
  }

  const displayedList = searchResults.length > 0 ? searchResults : manhwa

  return (
    <>
      <Head>
        <title>Manhwa | Aichiow</title>
        <meta name="description" content="Koleksi Manhwa dari AniList." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-6 space-y-6 max-w-[1800px] mx-auto">
          {/* HERO SLIDER */}
          {loading ? (
            <section className="w-full h-[320px] md:h-[460px] bg-neutral-900 rounded-lg shadow-inner overflow-hidden animate-pulse"></section>
          ) : manhwa.length > 0 ? (
            <div className="relative w-full h-[320px] md:h-[460px] rounded-xl overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={manhwa[heroIndex].id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={
                      manhwa[heroIndex].bannerImage ||
                      manhwa[heroIndex].coverImage.extraLarge
                    }
                    alt={manhwa[heroIndex].title.english || manhwa[heroIndex].title.romaji}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
                      {manhwa[heroIndex].title.english || manhwa[heroIndex].title.romaji}
                    </h2>
                    <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                      {manhwa[heroIndex].description?.replace(/<[^>]*>/g, '') || 'No description'}
                    </p>
                    <Link
                      href={`/manhwa/${manhwa[heroIndex].id}`}
                      className="mt-3 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white font-medium shadow-lg"
                    >
                      Detail
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider controls */}
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-3 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>
          ) : (
            <p className="text-red-500">Tidak ada Manhwa ditemukan.</p>
          )}

          {/* SEARCH */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Cari manhwa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-400 text-white"
            />
            <button
              type="submit"
              disabled={searching}
              className={`px-4 py-2 rounded-lg ${
                searching ? 'bg-blue-400 cursor-wait' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {searching ? 'Mencari...' : 'Search'}
            </button>
          </form>

          {/* ERROR */}
          {error && <p className="text-red-500">{error}</p>}

          {/* LIST */}
          {loading && !searching && <p className="text-gray-400">Memuat data...</p>}
          {!loading && displayedList.length === 0 && (
            <p className="text-gray-400">Tidak ada hasil untuk "{query}".</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayedList.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.05 }}
                className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/40 transition-all"
              >
                <Link href={`/manhwa/${m.id}`}>
                  <div className="relative">
                    <img
                      src={m.coverImage.extraLarge}
                      alt={m.title.english || m.title.romaji}
                      className="w-full h-[320px] object-cover group-hover:brightness-90 transition"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3">
                      <h2 className="text-sm sm:text-base font-semibold line-clamp-2">
                        {m.title.english || m.title.romaji}
                      </h2>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* PAGINATION */}
          {searchResults.length === 0 && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-3 py-1 rounded ${
                  page === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Prev
              </button>
              <span className="px-3 py-1 text-gray-300">
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-3 py-1 rounded ${
                  page === totalPages
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
