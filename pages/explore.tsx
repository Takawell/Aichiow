'use client'

import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useExploreAnime } from '@/hooks/useExploreAnime'
import { useSearchAnime } from '@/hooks/useSearchAnime'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaArrowDown, FaSpinner, FaFilter, FaTimes } from 'react-icons/fa'
import { LuScanLine, LuSparkles } from 'react-icons/lu'
import { searchAnimeByFile } from '@/lib/traceMoe'

const genreList = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Ecchi',
  'Fantasy',
  'Hentai',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'School',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller'
]

export default function ExplorePage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')
  const [scanOpen, setScanOpen] = useState(false)
  const [genreModalOpen, setGenreModalOpen] = useState(false)
  const [scanResults, setScanResults] = useState<any[]>([])
  const [scanLoading, setScanLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHoveringSearch, setIsHoveringSearch] = useState(false)

  const { anime: exploreAnime, isLoading, loadMore, hasMore } = useExploreAnime()
  const { anime: searchAnime, isLoading: searchLoading } = useSearchAnime(query)

  const animeData = query ? searchAnime : exploreAnime
  const filtered =
    selectedGenres.length > 0
      ? animeData.filter((a) => a.genres && a.genres.some((g: string) => selectedGenres.includes(g)))
      : animeData

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setQuery(input.trim())
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setScanLoading(true)
    setScanResults([])

    try {
      const res = await searchAnimeByFile(file)
      setScanResults(res)
    } catch (err) {
      console.error(err)
    } finally {
      setScanLoading(false)
    }
  }

  function toggleGenreLocal(g: string) {
    setSelectedGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))
  }

  function clearGenres() {
    setSelectedGenres([])
  }

  return (
    <>
      <Head>
        <title>Explore Anime | Aichiow</title>
        <meta name="description" content="Discover and search for anime by genre, popularity, and more." />
      </Head>

      <main className="relative bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#050810] min-h-screen text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent pointer-events-none" />
        
        <motion.div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0.15), transparent 40%)`
          }}
        />

        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-600/10 rounded-full blur-[140px] animate-pulse delay-1000" />

        <div className="relative z-10 px-4 md:px-10 lg:px-16 py-8 md:py-16 max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500/20 to-sky-600/20 border border-sky-500/30 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <LuSparkles className="text-sky-400" />
              <span className="text-sm text-sky-300 font-medium">Discover Your Next Adventure</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent leading-tight">
              Explore Anime
            </h1>
            <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">
              Search thousands of anime titles, filter by genre, or scan images to find what you're looking for
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onMouseEnter={() => setIsHoveringSearch(true)}
            onMouseLeave={() => setIsHoveringSearch(false)}
          >
            <div className="relative max-w-4xl mx-auto">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"
                animate={isHoveringSearch ? { scale: 1.02 } : { scale: 1 }}
              />
              
              <div className="relative flex flex-col sm:flex-row gap-3 bg-neutral-900/90 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search anime titles, characters, studios..."
                    className="w-full pl-12 pr-32 py-4 bg-transparent text-white rounded-xl placeholder-neutral-500 focus:outline-none transition-all duration-300"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
                  
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <motion.button
                      type="button"
                      onClick={() => setGenreModalOpen(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600/20 to-sky-500/20 rounded-lg hover:from-sky-600/30 hover:to-sky-500/30 transition border border-sky-500/30"
                    >
                      <FaFilter className="text-sky-400" />
                      <span className="hidden sm:inline text-sm font-medium text-sky-300">
                        {selectedGenres.length > 0 ? `${selectedGenres.length}` : 'Filter'}
                      </span>
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={() => setScanOpen(true)}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-sky-400 hover:text-sky-300 transition"
                    >
                      <LuScanLine className="text-2xl" />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-sky-600/30 relative overflow-hidden group"
                >
                  <span className="relative z-10">Search</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.button>
              </div>
            </div>
          </motion.form>

          <AnimatePresence>
            {selectedGenres.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  <span className="text-sm text-neutral-400 mr-2">Active Filters:</span>
                  {selectedGenres.map((g, i) => (
                    <motion.div
                      key={g}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-500 rounded-full blur opacity-40 group-hover:opacity-70 transition" />
                      <div className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600/90 to-sky-500/90 rounded-full text-white text-sm font-medium">
                        {g}
                        <button
                          onClick={() => toggleGenreLocal(g)}
                          className="hover:rotate-90 transition-transform duration-200"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <motion.button
                    onClick={clearGenres}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-sm text-red-400 hover:text-red-300 font-medium transition"
                  >
                    Clear All
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {(isLoading || searchLoading) && animeData.length === 0
              ? [...Array(18)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-[2/3] bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-2xl animate-pulse border border-white/5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                  />
                ))
              : filtered.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.02 }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ y: -8 }}
                  >
                    <AnimeCard anime={a} />
                  </motion.div>
                ))}
          </motion.div>

          {query && !searchLoading && filtered.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-6xl mb-4">
                <FaSearch className="inline-block text-neutral-600" />
              </div>
              <p className="text-neutral-400 text-lg">
                No results found for <span className="text-white font-bold">"{query}"</span>
              </p>
              <p className="text-neutral-500 text-sm mt-2">Try searching with different keywords</p>
            </motion.div>
          )}

          {!query && hasMore && (
            <motion.div
              className="mt-16 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.button
                onClick={loadMore}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-sky-600 to-sky-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative z-10 flex items-center gap-3 font-bold">
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <FaArrowDown className="group-hover:animate-bounce" />
                      Load More Anime
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          )}

          {!query && !hasMore && exploreAnime.length > 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-neutral-400">You've reached the end of the list</p>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {genreModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-2xl flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGenreModalOpen(false)}
            >
              <motion.div
                className="relative w-full max-w-4xl bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-10 backdrop-blur-3xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 rounded-3xl blur-xl opacity-20" />
                
                <motion.button
                  onClick={() => setGenreModalOpen(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  className="absolute right-6 top-6 text-neutral-400 hover:text-white transition z-10"
                >
                  <FaTimes className="text-2xl" />
                </motion.button>

                <div className="text-center mb-8 relative">
                  <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent mb-2">
                    Select Genres
                  </h3>
                  <p className="text-neutral-400">Choose your favorite genres to filter results</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                  {genreList.map((g, i) => {
                    const active = selectedGenres.includes(g)
                    return (
                      <motion.button
                        key={g}
                        onClick={() => toggleGenreLocal(g)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative"
                      >
                        <div className={`absolute -inset-0.5 rounded-xl blur transition-opacity duration-300 ${
                          active 
                            ? 'bg-gradient-to-r from-sky-600 to-sky-500 opacity-60' 
                            : 'bg-gradient-to-r from-neutral-600 to-neutral-700 opacity-0 group-hover:opacity-30'
                        }`} />
                        <div className={`relative px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          active
                            ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg'
                            : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50'
                        }`}>
                          <span className="block truncate">{g}</span>
                          {active && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs"
                            >
                              ✓
                            </motion.span>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
                  <div className="text-neutral-400 font-medium">
                    <span className="text-white text-lg font-bold">{selectedGenres.length}</span> genres selected
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={clearGenres}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-300 font-medium transition"
                    >
                      Clear All
                    </motion.button>
                    <motion.button
                      onClick={() => setGenreModalOpen(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-bold shadow-lg transition"
                    >
                      Apply Filters
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {scanOpen && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setScanOpen(false)}
            >
              <motion.div
                className="relative w-full max-w-3xl bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-10 backdrop-blur-3xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 rounded-3xl blur-xl opacity-20" />

                <motion.button
                  onClick={() => setScanOpen(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  className="absolute right-6 top-6 text-neutral-400 hover:text-white transition z-10"
                >
                  <FaTimes className="text-2xl" />
                </motion.button>

                <div className="text-center mb-8 relative">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block text-5xl mb-4"
                  >
                    <LuScanLine className="text-sky-400" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent mb-2">
                    Anime Scene Scanner
                  </h2>
                  <p className="text-neutral-400 text-sm">Upload an anime screenshot to identify the source</p>
                  <p className="text-yellow-500/80 text-xs mt-2">Results may vary in accuracy</p>
                </div>

                <div className="flex justify-center mb-8">
                  <label className="group relative cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-bold shadow-lg shadow-sky-600/30 transition-all overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <span className="relative z-10 flex items-center gap-3">
                        <LuScanLine className="text-xl" />
                        Choose Image File
                      </span>
                    </motion.div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <AnimatePresence mode="wait">
                  {scanLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="text-6xl mb-4"
                      >
                        <LuScanLine className="text-sky-400" />
                      </motion.div>
                      <p className="text-neutral-300 font-medium">Analyzing your image...</p>
                      <p className="text-neutral-500 text-sm mt-2">This may take a few seconds</p>
                    </motion.div>
                  )}

                  {!scanLoading && scanResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-center mb-6 text-white">
                        Found {scanResults.length} match{scanResults.length !== 1 ? 'es' : ''}
                      </h3>
                      {scanResults.map((r, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="group relative p-4 rounded-2xl bg-neutral-800/30 border border-white/5 hover:border-sky-500/40 transition-all duration-300"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                          
                          <div className="relative">
                            <div className="overflow-hidden rounded-xl mb-4">
                              <video
                                src={r.video}
                                className="w-full rounded-xl group-hover:scale-105 transition-transform duration-300"
                                controls
                                autoPlay
                                muted
                                loop
                              />
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-bold text-lg text-white">
                                {r.title?.romaji || r.title?.english || 'Unknown Title'}
                              </h4>
                              
                              <div className="flex items-center gap-4 text-sm">
                                <span className="px-3 py-1 rounded-full bg-sky-600/20 text-sky-300 border border-sky-500/30">
                                  Episode {r.episode || '?'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-300 border border-green-500/30">
                                  {(r.similarity * 100).toFixed(1)}% Match
                                </span>
                              </div>

                              {r.anilist && (
                                <Link
                                  href={`/anime/${r.anilist}`}
                                  onClick={() => setScanOpen(false)}
                                >
                                  <motion.button
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="mt-3 px-6 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold transition-all inline-flex items-center gap-2"
                                  >
                                    View Details
                                    <span>→</span>
                                  </motion.button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {!scanLoading && scanResults.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <LuScanLine className="inline-block text-6xl mb-4 text-neutral-600" />
                      <p className="text-neutral-400">No results yet</p>
                      <p className="text-neutral-500 text-sm mt-2">Upload an anime screenshot to get started</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
