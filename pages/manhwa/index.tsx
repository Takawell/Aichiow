'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
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

  const [previewManhwa, setPreviewManhwa] = useState<Manhwa | null>(null)

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
      } catch {
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
          content="Discover the latest manhwa with Aichiow — search, filter, and preview with a sleek modern UI."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-gray-900 to-black text-white">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-10 py-8 space-y-8">

          {loading ? (
            <div className="w-full h-[320px] md:h-[460px] bg-gray-900/70 rounded-2xl animate-pulse" />
          ) : manhwa.length > 0 ? (
            <ManhwaHeroSection manhwa={manhwa[0]} />
          ) : (
            <p className="text-center text-red-400">Tidak ada manhwa ditemukan.</p>
          )}

           <form
            onSubmit={handleSearch}
            className="relative flex flex-col sm:flex-row items-center gap-3"
          >
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              type="text"
              placeholder="🔍 Search manhwa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-gray-800/60 border border-gray-700 focus:border-blue-500 text-white placeholder-gray-400 shadow-inner backdrop-blur-sm transition"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={searching}
              type="submit"
              className={`px-5 py-2 rounded-xl font-medium shadow-md transition-all duration-300 ${
                searching
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30'
              }`}
            >
              {searching ? 'Mencari...' : 'Search'}
            </motion.button>
          </form>

          <div className="relative w-full">
            <motion.div
              layout
              className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide"
            >
              {genres.map((genre) => (
                <motion.button
                  key={genre}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedGenre(genre)
                    setPage(1)
                    setSearchResults([])
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    selectedGenre === genre
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-gray-800/70 text-gray-300 hover:text-white hover:bg-gray-700/80'
                  }`}
                >
                  {genre}
                </motion.button>
              ))}
            </motion.div>
          </div>

           {error && <p className="text-red-500">{error}</p>}

          <div className="relative">
            {loading && !searching && (
              <p className="text-center text-gray-400">Memuat data...</p>
            )}
            {!loading && displayedList.length === 0 && (
              <p className="text-center text-gray-400">
                Tidak ada hasil untuk "{query}".
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-4">
              {displayedList.map((m) => (
                <motion.div
                  key={m.id}
                  whileHover={{ scale: 1.03 }}
                  className="relative bg-gray-900/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 group"
                  onMouseEnter={() => setPreviewManhwa(m)}
                  onMouseLeave={() => setPreviewManhwa(null)}
                >
                  <Link href={`/manhwa/${m.id}`}>
                    <div className="relative aspect-[3/4]">
                      <img
                        src={m.coverImage.large}
                        alt={m.title.english || m.title.romaji}
                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-all" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-3">
                      <h2 className="text-sm sm:text-base font-semibold text-white drop-shadow-md line-clamp-2">
                        {m.title.english || m.title.romaji}
                      </h2>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {previewManhwa && (
                <motion.div
                  key={previewManhwa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="hidden md:block absolute bottom-0 right-0 bg-gray-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl p-4 w-[320px] backdrop-blur-md z-20"
                >
                  <div className="flex gap-3">
                    <img
                      src={previewManhwa.coverImage.medium}
                      alt={previewManhwa.title.romaji}
                      className="w-[90px] h-[120px] object-cover rounded-lg shadow-md"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {previewManhwa.title.english ||
                          previewManhwa.title.romaji}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-3">
                        {previewManhwa.description
                          ?.replace(/<[^>]+>/g, '')
                          .slice(0, 120) || 'No description.'}
                        ...
                      </p>
                      <Link
                        href={`/manhwa/${previewManhwa.id}`}
                        className="text-sm text-indigo-400 hover:text-indigo-300 mt-2 inline-block"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {searchResults.length === 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? 'bg-gray-700/50 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Prev
              </motion.button>
              <span className="px-3 py-1 text-gray-300">
                Page {page} / {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === totalPages
                    ? 'bg-gray-700/50 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Next
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
