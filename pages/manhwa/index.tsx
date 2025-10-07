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

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)

  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchManhwaList(page, selectedGenre !== 'ALL' ? selectedGenre : undefined)
        if (!mounted) return
        setManhwa(data.list || [])
        setTotalPages(data.totalPages || 1)
        if (genres.length === 0) {
          const genreList = await fetchGenres()
          if (!mounted) return
          setGenres(['ALL', ...genreList])
        }
      } catch (e) {
        if (!mounted) return
        setError('Gagal memuat daftar manhwa.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [page, selectedGenre])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const results = await searchManhwa(query.trim())
      setSearchResults(results || [])
    } catch (e) {
      setError('Gagal melakukan pencarian')
    } finally {
      setSearching(false)
    }
  }

  const displayedList = searchResults.length > 0 ? searchResults : manhwa

  return (
    <>
      <Head>
        <title>Manhwa | Aichiow</title>
        <meta name="description" content="Discover top manhwa, filter by genre, search titles, and preview details." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Manhwa</h1>
              <p className="text-sm text-gray-400 mt-1">Explore trending manhwa, search titles, and filter by genre.</p>
            </div>

            <form onSubmit={handleSearch} className="w-full md:w-[420px] flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search manhwa..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-lg py-2 pl-4 pr-12 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{searching ? 'Mencari...' : 'Enter'}</div>
              </div>
              <button
                type="submit"
                disabled={searching}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${searching ? 'bg-blue-400 cursor-wait' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {searching ? 'Mencari...' : 'Search'}
              </button>
            </form>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map((genre) => (
              <motion.button
                key={genre}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedGenre(genre)
                  setPage(1)
                  setSearchResults([])
                }}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre}
              </motion.button>
            ))}
          </div>

          {loading ? (
            <section className="w-full h-[320px] md:h-[460px] bg-neutral-900 rounded-lg shadow-inner overflow-hidden animate-pulse" />
          ) : manhwa.length > 0 ? (
            <ManhwaHeroSection manhwa={manhwa[0]} />
          ) : (
            <p className="text-red-500">Tidak ada manhwa ditemukan.</p>
          )}

          {error && <p className="text-red-500">{error}</p>}

          {loading && !searching && <p className="text-gray-400">Memuat data...</p>}

          {!loading && displayedList.length === 0 && <p className="text-gray-400">Tidak ada hasil untuk "{query}".</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayedList.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.03 }}
                className="relative bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-blue-500/40 transition-all group"
              >
                <Link href={`/manhwa/${m.id}`}>
                  <a className="block">
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                      <img src={m.coverImage.large} alt={m.title.english || m.title.romaji} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition duration-300" />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <h2 className="text-sm sm:text-base font-semibold text-white drop-shadow-md line-clamp-2">{m.title.english || m.title.romaji}</h2>
                      <div className="mt-1 text-xs text-gray-300 flex items-center gap-2">
                        <span>{m.averageScore ? `${Math.round((m.averageScore || 0) / 10)}/10` : '—'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{m.status || 'Unknown'}</span>
                      </div>
                    </div>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>

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
