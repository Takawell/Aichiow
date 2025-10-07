'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { fetchManhwaList, searchManhwa, fetchGenres } from '@/lib/anilistManhwa'
import { Manhwa } from '@/types/manhwa'
import ManhwaHeroSection from '@/components/manhwa/ManhwaHeroSection'

const tabs = ['Ongoing', 'Completed', 'Top Rated', 'Weekly Best', 'Monthly Best', 'Yearly Best']

export default function ManhwaPage() {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL')
  const [selectedTab, setSelectedTab] = useState<string>('Ongoing')
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
        let sortType = 'TRENDING_DESC'

        if (selectedTab === 'Completed') sortType = 'FINISHED_DESC'
        else if (selectedTab === 'Top Rated') sortType = 'SCORE_DESC'
        else if (selectedTab === 'Weekly Best') sortType = 'POPULARITY_DESC'
        else if (selectedTab === 'Monthly Best') sortType = 'FAVOURITES_DESC'
        else if (selectedTab === 'Yearly Best') sortType = 'TRENDING_DESC'

        const data = await fetchManhwaList(page, selectedGenre !== 'ALL' ? selectedGenre : undefined, sortType)
        setManhwa(data.list)
        setTotalPages(data.totalPages)
        if (genres.length === 0) {
          const genreList = await fetchGenres()
          setGenres(['ALL', ...genreList])
        }
      } catch {
        setError('Gagal memuat daftar manhwa.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [page, selectedGenre, selectedTab])

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
          content="Discover the best manhwa — ongoing, completed, top rated, and more on Aichiow!"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e293b] text-white">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-8">

          {loading ? (
            <section className="w-full h-[320px] md:h-[460px] bg-gray-800/40 rounded-2xl animate-pulse" />
          ) : manhwa.length > 0 ? (
            <ManhwaHeroSection manhwa={manhwa[0]} />
          ) : (
            <p className="text-red-500 text-center">Tidak ada manhwa ditemukan.</p>
          )}

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Cari manhwa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-blue-400 text-white placeholder-gray-400 backdrop-blur-md"
            />
            <button
              type="submit"
              disabled={searching}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                searching
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
              }`}
            >
              {searching ? 'Mencari...' : 'Search'}
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => {
                  setSelectedTab(tab)
                  setPage(1)
                  setSearchResults([])
                }}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                  selectedTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/40'
                    : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

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
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-md shadow-pink-400/30'
                    : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 hover:text-white'
                }`}
              >
                {genre}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {loading && !searching && (
              <p className="text-gray-400 text-center">Memuat data...</p>
            )}
            {!loading && displayedList.length === 0 && (
              <p className="text-gray-400 text-center">
                Tidak ada hasil untuk "{query}".
              </p>
            )}

            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-4"
            >
              {displayedList.map((m, i) => (
                <motion.div
                  key={m.id}
                  layout
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="relative bg-gray-900/60 rounded-2xl overflow-hidden shadow-md hover:shadow-blue-500/40 transition-all group backdrop-blur-lg"
                >
                  <Link href={`/manhwa/${m.id}`}>
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                      <img
                        src={m.coverImage.large}
                        alt={m.title.english || m.title.romaji}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition duration-300" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-3">
                      <h2 className="text-sm sm:text-base font-semibold text-white drop-shadow-md line-clamp-2">
                        {m.title.english || m.title.romaji}
                      </h2>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {searchResults.length === 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? 'bg-gray-600/50 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 transition'
                }`}
              >
                Prev
              </button>
              <span className="text-gray-300">
                Halaman {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === totalPages
                    ? 'bg-gray-600/50 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 transition'
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
