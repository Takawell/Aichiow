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

      <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#1e293b] text-white">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 py-10 space-y-10">

          {loading ? (
            <section className="w-full h-[320px] md:h-[460px] bg-gray-800/40 rounded-2xl animate-pulse" />
          ) : list.length > 0 ? (
            <ManhwaHeroSection manhwa={list[0]} />
          ) : (
            <p className="text-center text-red-500">Tidak ada manhwa ditemukan.</p>
          )}

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Cari manhwa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-900/60 border border-gray-700 focus:border-blue-500 transition text-white placeholder-gray-400 backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={searching}
              className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                searching
                  ? 'bg-blue-500/60 cursor-wait'
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
                whileHover={{ scale: 1.08 }}
                onClick={() => {
                  setSelectedTab(tab)
                  setPage(1)
                  setSearchResults([])
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/40'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {genres.map((g) => (
              <motion.button
                key={g}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSelectedGenre(g)
                  setPage(1)
                  setSearchResults([])
                }}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                  selectedGenre === g
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80'
                }`}
              >
                {g}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {error && <p className="text-center text-red-400">{error}</p>}
            {!loading && list.length === 0 && <p className="text-gray-400 text-center">Tidak ada hasil.</p>}

            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {list.map((m) => (
                <motion.div
                  key={m.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="relative bg-gray-900/70 rounded-2xl overflow-hidden shadow-md hover:shadow-blue-500/40 group"
                >
                  <Link href={`/manhwa/${m.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={m.coverImage.large}
                        alt={m.title.english || m.title.romaji}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
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
          </AnimatePresence>

          {searchResults.length === 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
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
                onClick={() => setPage((p) => p + 1)}
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
      </main>
    </>
  )
}
