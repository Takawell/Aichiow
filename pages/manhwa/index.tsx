'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ManhwaHeroSection from '@/components/manhwa/ManhwaHeroSection'
import ManhwaCard from '@/components/manhwa/ManhwaCard'
import { fetchManhwaList, searchManhwa, fetchGenres } from '@/lib/anilistManhwa'
import { Manhwa } from '@/types/manhwa'
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

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
        <meta name="description" content="Search and collect all the manhwa you love on aichiow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-sky-950 via-sky-900/80 to-black text-white relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-sky-500/30 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/20 blur-[160px] rounded-full"></div>

        <div className="relative w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-10">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.section
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-[320px] md:h-[460px] bg-sky-900/30 rounded-2xl shadow-inner animate-pulse"
              />
            ) : manhwa.length > 0 ? (
              <ManhwaHeroSection key={manhwa[0].id} manhwa={manhwa[0]} />
            ) : (
              <p className="text-red-400">Tidak ada manhwa ditemukan.</p>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center w-full sm:w-[400px] mx-auto"
          >
            <FaSearch className="absolute left-3 text-sky-400" />
            <input
              type="text"
              placeholder="Search manhwa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-sky-950/50 border border-sky-700/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
            <motion.button
              type="submit"
              disabled={searching}
              whileTap={{ scale: 0.95 }}
              className={`ml-2 px-5 py-2 rounded-full font-semibold transition-all ${
                searching
                  ? 'bg-sky-400/70 cursor-wait'
                  : 'bg-sky-600 hover:bg-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.6)]'
              }`}
            >
              {searching ? '...' : 'Search'}
            </motion.button>
          </motion.form>

          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide px-1">
            {genres.map((genre) => (
              <motion.button
                key={genre}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedGenre(genre)
                  setPage(1)
                  setSearchResults([])
                }}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md border transition-all duration-300 whitespace-nowrap
                  ${
                    selectedGenre === genre
                      ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.6)]'
                      : 'bg-sky-900/30 border-sky-700/30 text-gray-300 hover:text-white hover:border-sky-500/50 hover:bg-sky-800/40'
                  }`}
              >
                {genre}
              </motion.button>
            ))}
          </div>

          {error && <p className="text-red-400">{error}</p>}
          {!loading && displayedList.length === 0 && (
            <p className="text-gray-400 text-center">Tidak ada hasil untuk "{query}".</p>
          )}

          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {displayedList.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <ManhwaCard manhwa={m} />
              </motion.div>
            ))}
          </motion.div>

          {searchResults.length === 0 && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center gap-3 pt-6"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  page === 1
                    ? 'bg-sky-800/30 text-gray-400 cursor-not-allowed'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-[0_0_10px_rgba(56,189,248,0.6)]'
                }`}
              >
                <FaArrowLeft /> Prev
              </motion.button>

              <span className="text-gray-300 font-medium">
                Page {page} / {totalPages}
              </span>

              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  page === totalPages
                    ? 'bg-sky-800/30 text-gray-400 cursor-not-allowed'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-[0_0_10px_rgba(56,189,248,0.6)]'
                }`}
              >
                Next <FaArrowRight />
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}
