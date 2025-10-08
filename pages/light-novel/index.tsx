'use client'

import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  fetchLightNovelList,
  fetchLightNovelGenres,
  searchLightNovel,
} from '@/lib/anilistLightNovel'
import { LightNovel } from '@/types/lightNovel'

export default function LightNovelPage() {
  const [novels, setNovels] = useState<LightNovel[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<LightNovel[]>([])
  const [searching, setSearching] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [heroIndex, setHeroIndex] = useState(0)
  const heroTimer = useRef<NodeJS.Timeout | null>(null)

  // Load Light Novels
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchLightNovelList(page, selectedGenre !== 'ALL' ? selectedGenre : undefined)
        setNovels(data.list)
        setTotalPages(data.totalPages)
        if (genres.length === 0) {
          const genreList = await fetchLightNovelGenres()
          setGenres(['ALL', ...genreList])
        }
      } catch (e) {
        setError('Gagal memuat daftar Light Novel.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [page, selectedGenre])

  // Auto hero slider
  useEffect(() => {
    if (novels.length > 0) {
      heroTimer.current = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % novels.length)
      }, 7000)
    }
    return () => {
      if (heroTimer.current) clearInterval(heroTimer.current)
    }
  }, [novels])

  const nextSlide = () => setHeroIndex((prev) => (prev + 1) % novels.length)
  const prevSlide = () => setHeroIndex((prev) => (prev - 1 + novels.length) % novels.length)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setSearching(true)
    try {
      const results = await searchLightNovel(query)
      setSearchResults(results)
    } catch {
      setError('Gagal mencari Light Novel.')
    } finally {
      setSearching(false)
    }
  }

  const displayedList = searchResults.length > 0 ? searchResults : novels

  return (
    <>
      <Head>
        <title>Light Novels | Aichiow</title>
        <meta name="description" content="Koleksi Light Novel dari AniList." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">

          {/* HERO SLIDER */}
          {loading ? (
            <div className="w-full h-[320px] md:h-[460px] bg-gray-800 animate-pulse rounded-xl shadow-inner" />
          ) : novels.length > 0 ? (
            <div className="relative w-full h-[320px] md:h-[460px] rounded-xl overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={novels[heroIndex].id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={novels[heroIndex].bannerImage || novels[heroIndex].coverImage.extraLarge}
                    alt={novels[heroIndex].title.english || novels[heroIndex].title.romaji}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
                      {novels[heroIndex].title.english || novels[heroIndex].title.romaji}
                    </h2>
                    <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                      {novels[heroIndex].description?.replace(/<[^>]*>/g, '') || 'No description'}
                    </p>
                    <Link href={`/light-novel/${novels[heroIndex].id}`}>
                      <a className="mt-3 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white font-medium shadow-lg">
                        Read More
                      </a>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

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
            <p className="text-red-500">Tidak ada Light Novel ditemukan.</p>
          )}

          {/* SEARCH */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Cari Light Novel..."
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

          {/* GENRES */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map((genre) => (
              <motion.button
                key={genre}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedGenre(genre); setPage(1); setSearchResults([]) }}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {genre}
              </motion.button>
            ))}
          </div>

          {/* ERROR */}
          {error && <p className="text-red-500">{error}</p>}

          {/* LIST */}
          {loading && !searching && <p className="text-gray-400">Memuat data...</p>}
          {!loading && displayedList.length === 0 && (
            <p className="text-gray-400">Tidak ada hasil untuk "{query}".</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayedList.map((n) => (
              <motion.div
                key={n.id}
                whileHover={{ scale: 1.03 }}
                className="relative bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-blue-500/40 transition-all group"
              >
                <Link href={`/light-novel/${n.id}`}>
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <img
                      src={n.coverImage.large}
                      alt={n.title.english || n.title.romaji}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition duration-300"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-3">
                    <h2 className="text-sm sm:text-base font-semibold text-white drop-shadow-md line-clamp-2">
                      {n.title.english || n.title.romaji}
                    </h2>
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
                className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Prev
              </button>
              <span className="px-3 py-1 text-gray-300">Page {page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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
