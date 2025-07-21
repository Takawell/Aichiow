'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ManhwaHeroSection from '@/components/manhwa/ManhwaHeroSection'
import { fetchManhwaList, searchManhwa, fetchGenres } from '@/lib/anilistManhwa'
import { Manhwa } from '@/types/manhwa'

export default function ManhwaPage() {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Manhwa[]>([])
  const [searching, setSearching] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)

  // Load trending manhwa
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchManhwaList(page, selectedGenre !== 'ALL' ? selectedGenre : undefined)
        setManhwa(data.list)
        setTotalPages(data.totalPages)
        if (genres.length === 0) {
          const genreList = await fetchGenres()
          setGenres(['ALL', ...genreList])
        }
      } catch (e: any) {
        setError('Gagal memuat daftar manhwa.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [page, selectedGenre])

  // Search
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
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* HERO */}
          {loading ? (
            <section className="w-full h-[320px] md:h-[460px] bg-neutral-900 rounded-lg shadow-inner overflow-hidden animate-pulse"></section>
          ) : manhwa.length > 0 ? (
            <ManhwaHeroSection manhwa={manhwa[0]} />
          ) : (
            <p className="text-red-500">Tidak ada manhwa ditemukan.</p>
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
                searching
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-blue-500 hover:bg-blue-600'
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
          {loading && !searching && (
            <p className="text-gray-400">Memuat data...</p>
          )}
          {!loading && displayedList.length === 0 && (
            <p className="text-gray-400">Tidak ada hasil untuk "{query}".</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayedList.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500 transition-shadow"
              >
                <Link href={`/manhwa/${m.id}`}>
                  <img
                    src={m.coverImage.large}
                    alt={m.title.english || m.title.romaji}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-2">
                    <h2 className="text-sm font-semibold truncate">
                      {m.title.english || m.title.romaji}
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
