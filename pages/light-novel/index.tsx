'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  fetchLightNovelList,
  searchLightNovel,
  fetchLightNovelGenres,
} from '@/lib/anilistLightNovel'
import { Manhwa as LightNovel } from '@/types/manhwa' // Gunakan struktur manhwa sementara

export default function LightNovelPage() {
  const [lightNovels, setLightNovels] = useState<LightNovel[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<LightNovel[]>([])
  const [searching, setSearching] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)

  useEffect(() => {
    const loadLightNovels = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await fetchLightNovelList(
          page,
          selectedGenre !== 'ALL' ? selectedGenre : undefined
        )

        if (data.list.length === 0) {
          setLightNovels([])
        } else {
          setLightNovels(data.list)
        }
        setTotalPages(data.totalPages)

        if (genres.length === 0) {
          const genreList = await fetchLightNovelGenres()
          setGenres(['ALL', ...genreList])
        }
      } catch (err) {
        setError('Gagal memuat daftar Light Novel.')
      } finally {
        setLoading(false)
      }
    }
    loadLightNovels()
  }, [page, selectedGenre])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const results = await searchLightNovel(query)
      setSearchResults(results)
    } finally {
      setSearching(false)
    }
  }

  const displayedList = searchResults.length > 0 ? searchResults : lightNovels

  return (
    <>
      <Head>
        <title>Light Novel | Aichiow</title>
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
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(genre)
                  setPage(1)
                  setSearchResults([])
                }}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  selectedGenre === genre
                    ? 'bg-blue-600 text-white'
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
            <p className="text-gray-400">Tidak ada Light Novel ditemukan.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayedList.map((novel) => (
              <motion.div
                key={novel.id}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500 transition-shadow"
              >
                <Link href={`/light-novel/${novel.id}`}>
                  <img
                    src={novel.coverImage.large}
                    alt={novel.title.english || novel.title.romaji}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-2">
                    <h2 className="text-sm font-semibold truncate">
                      {novel.title.english || novel.title.romaji}
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
