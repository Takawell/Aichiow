'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
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
              <motion.button
                key={genre}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedGenre(genre)
                  setPage(1)
                  setSearchResults([])
                }}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300
                  ${
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
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/40 transition-shadow"
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
                  page === 1
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
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
