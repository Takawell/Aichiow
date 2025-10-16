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
        <meta
          name="description"
          content="Search and collect all the manhwa you love only on Aichiow."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-600/20 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/20 blur-[180px] rounded-full"></div>

        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-8">

          {loading ? (
            <section className="w-full h-[320px] md:h-[460px] rounded-2xl bg-neutral-900/70 backdrop-blur-md animate-pulse" />
          ) : manhwa.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ManhwaHeroSection manhwa={manhwa[0]} />
            </motion.div>
          ) : (
            <p className="text-red-500">Tidak ada manhwa ditemukan.</p>
          )}

          <motion.form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-lg hover:shadow-blue-500/10 transition-all"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <input
              type="text"
              placeholder="Search manhwa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-transparent border border-white/10 focus:outline-none focus:border-blue-400 text-white placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={searching}
              className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                searching
                  ? 'bg-blue-400/70 cursor-wait'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:brightness-110'
              }`}
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </motion.form>

          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
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
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap backdrop-blur-md transition-all duration-300 border ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent shadow-blue-500/30'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {genre}
              </motion.button>
            ))}
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {loading && !searching && <p className="text-gray-400">Loading...</p>}
          {!loading && displayedList.length === 0 && (
            <p className="text-gray-400">No results for "{query}".</p>
          )}

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.2 },
              },
            }}
          >
            {displayedList.map((m) => (
              <motion.div
                key={m.id}
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-md hover:shadow-blue-500/40 transition-all group backdrop-blur-md"
              >
                <Link href={`/manhwa/${m.id}`}>
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <img
                      src={m.coverImage.large}
                      alt={m.title.english || m.title.romaji}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:opacity-90 transition duration-500" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-3">
                    <h2 className="text-sm sm:text-base font-semibold text-white drop-shadow-lg line-clamp-2">
                      {m.title.english || m.title.romaji}
                    </h2>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {searchResults.length === 0 && totalPages > 1 && (
            <motion.div
              className="flex justify-center items-center gap-3 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-4 py-1.5 rounded-lg transition-all duration-300 ${
                  page === 1
                    ? 'bg-gray-700/50 cursor-not-allowed text-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Prev
              </button>
              <span className="px-3 py-1 text-gray-300 text-sm">
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-4 py-1.5 rounded-lg transition-all duration-300 ${
                  page === totalPages
                    ? 'bg-gray-700/50 cursor-not-allowed text-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Next
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
