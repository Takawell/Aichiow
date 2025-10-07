'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchManhwaList, searchManhwa, fetchGenres } from '@/lib/anilistManhwa'
import { Manhwa } from '@/types/manhwa'
import ManhwaHeroSection from '@/components/manhwa/ManhwaHeroSection'

const tabs = ['Ongoing', 'Completed', 'Top Rated', 'Weekly Best', 'Monthly Best', 'Yearly Best']

export default function ManhwaPage() {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState('ALL')
  const [selectedTab, setSelectedTab] = useState('Ongoing')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Manhwa[]>([])
  const [searching, setSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        let sortType = 'TRENDING_DESC'
        if (selectedTab === 'Completed') sortType = 'FINISHED_DATE_DESC'
        else if (selectedTab === 'Top Rated') sortType = 'SCORE_DESC'
        else if (selectedTab === 'Weekly Best') sortType = 'POPULARITY_DESC'
        else if (selectedTab === 'Monthly Best') sortType = 'FAVOURITES_DESC'
        else if (selectedTab === 'Yearly Best') sortType = 'TRENDING_DESC'

        const data = await fetchManhwaList(page, selectedGenre !== 'ALL' ? selectedGenre : undefined, sortType)
        setManhwa(data.list)
        setTotalPages(data.totalPages)

        if (genres.length === 0) {
          const g = await fetchGenres()
          setGenres(['ALL', ...g])
        }
      } catch (e) {
        setError('Gagal memuat data manhwa.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, selectedGenre, selectedTab])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    const results = await searchManhwa(query)
    setSearchResults(results)
    setSearching(false)
  }

  const list = searchResults.length > 0 ? searchResults : manhwa

  return (
    <>
      <Head>
        <title>Manhwa | Aichiow</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#050B1A] via-[#0B1122] to-[#101828] text-white overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-black/90" />

        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 py-10 space-y-10">

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.section
                key="loading-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-[320px] md:h-[460px] bg-gray-800/40 rounded-2xl animate-pulse"
              />
            ) : list.length > 0 ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ManhwaHeroSection manhwa={list[0]} />
              </motion.div>
            ) : (
              <p className="text-center text-red-400">Tidak ada manhwa ditemukan.</p>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 items-center justify-center"
          >
            <input
              type="text"
              placeholder="🔍 Cari manhwa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 w-full sm:w-[400px] px-5 py-3 rounded-2xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 backdrop-blur-md transition"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={searching}
              className={`px-6 py-3 rounded-2xl font-semibold shadow-md transition-all duration-300 ${
                searching
                  ? 'bg-blue-500/60 cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
              }`}
            >
              {searching ? 'Mencari...' : 'Search'}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedTab(tab)
                  setPage(1)
                  setSearchResults([])
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  selectedTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/40'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide justify-center flex-wrap"
          >
            {genres.map((g) => (
              <motion.button
                key={g}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSelectedGenre(g)
                  setPage(1)
                  setSearchResults([])
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedGenre === g
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-md'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {g}
              </motion.button>
            ))}
          </motion.div>

          {error && (
            <p className="text-center text-red-400 bg-red-900/30 py-2 px-4 rounded-lg">{error}</p>
          )}
          {!loading && list.length === 0 && (
            <p className="text-gray-400 text-center">Tidak ada hasil ditemukan.</p>
          )}

          <AnimatePresence>
            {!loading && list.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
              >
                {list.map((m) => (
                  <motion.div
                    key={m.id}
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="relative bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 hover:border-blue-600/40 group transition"
                  >
                    <Link href={`/manhwa/${m.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <motion.img
                          src={m.coverImage.large}
                          alt={m.title.english || m.title.romaji}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      </div>

                      <div className="absolute bottom-0 left-0 w-full p-3">
                        <h2 className="text-sm sm:text-base font-semibold line-clamp-2 drop-shadow-md">
                          {m.title.english || m.title.romaji}
                        </h2>
                        {m.averageScore && (
                          <p className="text-xs text-blue-400 mt-1">⭐ {m.averageScore}</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {searchResults.length === 0 && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center gap-4 mt-10"
            >
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-5 py-2 rounded-xl font-medium transition ${
                  page === 1
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Prev
              </button>
              <span className="text-gray-300 font-semibold">
                Halaman {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-5 py-2 rounded-xl font-medium transition ${
                  page === totalPages
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </motion.div>
          )}

          <footer className="pt-10 pb-6 text-center text-xs text-gray-500">
            <p>
              For manhwa fans you are presented by <span className="text-blue-400 font-medium">Aichiow Plus</span>
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
