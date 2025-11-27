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
        <meta name="description" content="Search and collect all the manhwa you love only on aichiow" />
      </Head>

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-black to-fuchsia-950/20 pointer-events-none"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-10">
          {loading ? (
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-[280px] sm:h-[380px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-800/50"
            >
              <div className="w-full h-full animate-pulse bg-gradient-to-r from-transparent via-gray-700/20 to-transparent"></div>
            </motion.section>
          ) : manhwa.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ManhwaHeroSection manhwa={manhwa[0]} />
            </motion.div>
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-center py-20 text-lg"
            >
              No manhwa found.
            </motion.p>
          )}

          <motion.form 
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto"
          >
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Search your favorite manhwa..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 focus:border-violet-500/80 focus:ring-2 focus:ring-violet-500/30 text-white placeholder-gray-400 transition-all duration-300 outline-none group-hover:border-gray-600/80"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600/0 via-fuchsia-600/0 to-violet-600/0 group-hover:from-violet-600/5 group-hover:via-fuchsia-600/5 group-hover:to-violet-600/5 transition-all duration-500 pointer-events-none"></div>
            </div>
            <motion.button
              type="submit"
              disabled={searching}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 shadow-lg relative overflow-hidden ${
                searching
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 cursor-wait'
                  : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-violet-600/50 hover:shadow-violet-500/60'
              }`}
            >
              <span className="relative z-10">{searching ? 'Searching...' : 'Search'}</span>
              {!searching && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="flex gap-2.5 overflow-x-auto pb-3 px-1 scrollbar-thin scrollbar-thumb-violet-600/50 scrollbar-track-transparent hover:scrollbar-thumb-violet-500/70">
              {genres.map((genre, idx) => (
                <motion.button
                  key={genre}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedGenre(genre)
                    setPage(1)
                    setSearchResults([])
                  }}
                  className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 overflow-hidden ${
                    selectedGenre === genre
                      ? 'text-white shadow-lg'
                      : 'bg-gray-900/60 backdrop-blur-sm text-gray-300 hover:text-white border border-gray-800/50 hover:border-gray-700/80'
                  }`}
                >
                  {selectedGenre === genre && (
                    <>
                      <motion.div
                        layoutId="genreBackground"
                        className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-violet-400/0 via-fuchsia-400/40 to-violet-400/0"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      />
                    </>
                  )}
                  <span className="relative z-10">{genre}</span>
                </motion.button>
              ))}
            </div>
            <div className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-violet-600/5 via-transparent to-fuchsia-600/5 blur-2xl pointer-events-none opacity-30"></div>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 backdrop-blur-sm"
              >
                <p className="text-red-400 text-center font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && !searching && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-20"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-fuchsia-600/30 border-b-fuchsia-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              </div>
            </motion.div>
          )}
          
          {!loading && displayedList.length === 0 && query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">No results for <span className="text-violet-400 font-semibold">"{query}"</span></p>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {displayedList.map((m, idx) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-violet-600/20 transition-all duration-300 group border border-gray-800/50 hover:border-violet-600/50"
                >
                  <Link href={`/manhwa/${m.id}`}>
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                      <img
                        src={m.coverImage.large}
                        alt={m.title.english || m.title.romaji}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-violet-600/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-violet-500/50">
                        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <motion.h2 
                        className="text-sm sm:text-base font-bold text-white drop-shadow-lg line-clamp-2 leading-tight"
                        initial={false}
                      >
                        {m.title.english || m.title.romaji}
                      </motion.h2>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
                  
          {searchResults.length === 0 && totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center items-center gap-3 mt-8"
            >
              <motion.button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                whileHover={page !== 1 ? { scale: 1.05 } : {}}
                whileTap={page !== 1 ? { scale: 0.95 } : {}}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  page === 1
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-800/50'
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-500/50'
                }`}
              >
                Previous
              </motion.button>
              
              <div className="flex items-center gap-2">
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <motion.button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold transition-all duration-300 ${
                        page === pageNum
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/40'
                          : 'bg-gray-900/60 backdrop-blur-sm text-gray-300 hover:text-white border border-gray-800/50 hover:border-gray-700/80'
                      }`}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                whileHover={page !== totalPages ? { scale: 1.05 } : {}}
                whileTap={page !== totalPages ? { scale: 0.95 } : {}}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  page === totalPages
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-800/50'
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-500/50'
                }`}
              >
                Next
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
