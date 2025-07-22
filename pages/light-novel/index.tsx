'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
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
  const [totalPages, setTotalPages] = useState(5)

  const [heroIndex, setHeroIndex] = useState(0)

  // Load Light Novels
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchLightNovelList(
          page,
          selectedGenre !== 'ALL' ? selectedGenre : undefined
        )
        setNovels(data.list)
        setTotalPages(data.totalPages)
        if (genres.length === 0) {
          const genreList = await fetchLightNovelGenres()
          setGenres(['ALL', ...genreList])
        }
      } catch (e: any) {
        setError('Gagal memuat daftar Light Novel.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [page, selectedGenre])

  // Hero slider
  useEffect(() => {
    if (novels.length > 0) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % novels.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [novels])

  // Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    const results = await searchLightNovel(query)
    setSearchResults(results)
    setSearching(false)
  }

  const displayedList = searchResults.length > 0 ? searchResults : novels

  return (
    <>
      <Head>
        <title>Light Novels | Aichiow</title>
        <meta name="description" content="Koleksi Light Novel dari AniList." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* HERO SLIDER */}
          {loading ? (
            <section className="w-full h-[320px] md:h-[460px] bg-neutral-900 rounded-lg shadow-inner overflow-hidden animate-pulse"></section>
          ) : novels.length > 0 ? (
            <div className="relative w-full h-[320px] md:h-[460px] rounded-xl overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={novels[heroIndex].id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src={
                      novels[heroIndex].bannerImage ||
                      novels[heroIndex].coverImage.extraLarge
                    }
                    alt={novels[heroIndex].title.english || novels[heroIndex].title.romaji}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 max-w-lg">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {novels[heroIndex].title.english || novels[heroIndex].title.romaji}
                    </h2>
                    <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                      {novels[heroIndex].description?.replace(/<[^>]*>/g, '') || 'No description'}
                    </p>
                    <Link
                      href={`/light-novel/${novels[heroIndex].id}`}
                      className="mt-3 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
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

          {/* GENRE FILTER */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(genre)
                  setPage(1)
                  setSearchResults([])
                }}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg scale-105'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {genre}
              </button>
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
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500 transition-shadow"
              >
                <Link href={`/light-novel/${n.id}`}>
                  <img
                    src={n.coverImage.large}
                    alt={n.title.english || n.title.romaji}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-2">
                    <h2 className="text-sm font-semibold truncate">
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
