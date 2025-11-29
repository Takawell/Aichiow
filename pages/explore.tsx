'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useExploreAnime } from '@/hooks/useExploreAnime'
import { useSearchAnime } from '@/hooks/useSearchAnime'
import AnimeCard from '@/components/anime/AnimeCard'
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
          className="absolute inset-0 opacity-30 pointer-events-none hidden md:block"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0.15), transparent 40%)`
          }}
        />

        <div className="absolute top-10 left-5 md:top-20 md:left-10 w-48 h-48 md:w-72 md:h-72 bg-sky-500/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-64 h-64 md:w-96 md:h-96 bg-sky-600/10 rounded-full blur-[100px] md:blur-[140px] animate-pulse" />

        <div className="relative z-10 px-3 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-10 md:py-16 max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 to-sky-600/20 border border-sky-500/30 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <LuSparkles className="text-sky-400 text-sm" />
              <span className="text-xs md:text-sm text-sky-300 font-medium">Discover Your Next Adventure</span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent leading-tight">
              Explore Anime
            </h1>
            <p className="text-neutral-400 text-sm md:text-base px-4 max-w-2xl mx-auto">
              Search thousands of anime titles, filter by genre, or scan images
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="mb-6 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onMouseEnter={() => setIsHoveringSearch(true)}
            onMouseLeave={() => setIsHoveringSearch(false)}
          >
            <div className="relative max-w-4xl mx-auto">
              <motion.div
                className="absolute -inset-0.5 md:-inset-1 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 rounded-xl md:rounded-2xl blur opacity-20 md:opacity-30"
                animate={isHoveringSearch ? { scale: 1.02 } : { scale: 1 }}
              />
              
              <div className="relative flex flex-col gap-2 bg-neutral-900/90 backdrop-blur-xl rounded-xl md:rounded-2xl p-1.5 md:p-2 border border-white/10">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search anime..."
                    className="w-full pl-10 pr-24 md:pr-28 py-3 md:py-4 bg-transparent text-white text-sm md:text-base rounded-lg md:rounded-xl placeholder-neutral-500 focus:outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm md:text-base" />
                  
                  <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 md:gap-2">
                    <motion.button
                      type="button"
                      onClick={() => setGenreModalOpen(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 bg-gradient-to-r from-sky-600/20 to-sky-500/20 rounded-lg hover:from-sky-600/30 hover:to-sky-500/30 transition border border-sky-500/30"
                    >
                      <FaFilter className="text-sky-400 text-xs md:text-sm" />
                      {selectedGenres.length > 0 && (
                        <span className="text-xs md:text-sm font-medium text-sky-300 min-w-[16px] text-center">
                          {selectedGenres.length}
                        </span>
                      )}
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={() => setScanOpen(true)}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 md:p-2 text-sky-400 hover:text-sky-300 transition"
                    >
                      <LuScanLine className="text-lg md:text-xl" />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 md:py-3 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 rounded-lg md:rounded-xl font-bold text-sm md:text-base transition-all shadow-lg shadow-sky-600/30"
                >
                  Search
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
                className="mb-6 md:mb-8 overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center items-center px-2">
                  <span className="text-xs md:text-sm text-neutral-400 mr-1">Filters:</span>
                  {selectedGenres.map((g, i) => (
                    <motion.div
                      key={g}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-500 rounded-full blur opacity-40 group-hover:opacity-70 transition" />
                      <div className="relative flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-sky-600/90 to-sky-500/90 rounded-full text-white text-xs md:text-sm font-medium">
                        {g}
                        <button
                          onClick={() => toggleGenreLocal(g)}
                          className="hover:rotate-90 transition-transform"
                        >
                          <FaTimes className="text-[10px]" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <motion.button
                    onClick={clearGenres}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2.5 md:px-3 py-1 text-xs md:text-sm text-red-400 hover:text-red-300 font-medium"
                  >
                    Clear
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {(isLoading || searchLoading) && animeData.length === 0
              ? [...Array(18)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-[2/3] bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-xl md:rounded-2xl animate-pulse border border-white/5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                  />
                ))
              : filtered.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.01 }}
                    viewport={{ once: true, margin: "-30px" }}
                    whileHover={{ y: -4 }}
                  >
                    <AnimeCard anime={a} />
                  </motion.div>
                ))}
          </motion.div>

          {query && !searchLoading && filtered.length === 0 && (
            <motion.div
              className="text-center py-12 md:py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">
                <FaSearch className="inline-block text-neutral-600" />
              </div>
              <p className="text-neutral-400 text-base md:text-lg px-4">
                No results for <span className="text-white font-bold">"{query}"</span>
              </p>
              <p className="text-neutral-500 text-xs md:text-sm mt-2">Try different keywords</p>
            </motion.div>
          )}

          {!query && hasMore && (
            <motion.div
              className="mt-10 md:mt-16 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.button
                onClick={loadMore}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-sky-600 to-sky-500 disabled:opacity-50 text-sm md:text-base font-bold"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FaArrowDown />
                    Load More
                  </span>
                )}
              </motion.button>
            </motion.div>
          )}

          {!query && !hasMore && exploreAnime.length > 0 && (
            <motion.div
              className="text-center py-8 md:py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-neutral-400 text-sm md:text-base">You've reached the end</p>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {genreModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-end md:items-center justify-center z-50 p-0 md:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGenreModalOpen(false)}
            >
              <motion.div
                className="relative w-full md:max-w-2xl lg:max-w-3xl bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl p-4 md:p-8 backdrop-blur-3xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto"
                initial={{ scale: 1, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1, opacity: 0, y: 100 }}
                onClick={(e) => e.stopPropagation()}
              >
                
                <motion.button
                  onClick={() => setGenreModalOpen(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  className="absolute right-4 top-4 md:right-6 md:top-6 text-neutral-400 hover:text-white transition z-50"
                >
                  <FaTimes className="text-xl md:text-2xl" />
                </motion.button>

                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent mb-1 md:mb-2">
                    Select Genres
                  </h3>
                  <p className="text-neutral-400 text-xs md:text-sm">Choose genres to filter results</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
                  {genreList.map((g, i) => {
                    const active = selectedGenres.includes(g)
                    return (
                      <motion.button
                        key={g}
                        onClick={() => toggleGenreLocal(g)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.01 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative z-10"
                      >
                        <div className={`absolute -inset-0.5 rounded-lg md:rounded-xl blur transition ${
                          active 
                            ? 'bg-gradient-to-r from-sky-600 to-sky-500 opacity-60' 
                            : 'bg-gradient-to-r from-neutral-600 to-neutral-700 opacity-0 group-hover:opacity-30'
                        }`} />
                        <div className={`relative px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition ${
                          active
                            ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg'
                            : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50'
                        }`}>
                          <span className="block truncate">{g}</span>
                          {active && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px]"
                            >
                              ✓
                            </motion.span>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 md:pt-6 border-t border-white/10">
                  <div className="text-neutral-400 text-xs md:text-sm font-medium">
                    <span className="text-white font-bold">{selectedGenres.length}</span> selected
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 relative z-50">
                    <motion.button
                      onClick={clearGenres}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-300 text-xs md:text-sm font-medium"
                    >
                      Clear
                    </motion.button>
                    <motion.button
                      onClick={() => setGenreModalOpen(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 text-white text-xs md:text-sm font-bold shadow-lg"
                    >
                      Apply
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {scanOpen && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-end md:items-center justify-center z-50 p-0 md:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setScanOpen(false)}
            >
              <motion.div
                className="relative w-full md:max-w-2xl lg:max-w-3xl bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl p-4 md:p-8 backdrop-blur-3xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto"
                initial={{ scale: 1, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1, opacity: 0, y: 100 }}
                onClick={(e) => e.stopPropagation()}
              >
                
                <motion.button
                  onClick={() => setScanOpen(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  className="absolute right-4 top-4 md:right-6 md:top-6 text-neutral-400 hover:text-white transition z-50"
                >
                  <FaTimes className="text-xl md:text-2xl" />
                </motion.button>

                <div className="text-center mb-6 md:mb-8">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block text-4xl md:text-5xl mb-3 md:mb-4"
                  >
                    <LuScanLine className="text-sky-400" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent mb-1 md:mb-2">
                    Scene Scanner
                  </h2>
                  <p className="text-neutral-400 text-xs md:text-sm px-4">Upload an anime screenshot to identify the source</p>
                  <p className="text-yellow-500/80 text-[10px] md:text-xs mt-1 md:mt-2">Results may vary</p>
                </div>

                <div className="flex justify-center mb-6 md:mb-8">
                  <label className="group relative cursor-pointer z-10">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-sky-600 to-sky-500 text-white text-sm md:text-base font-bold shadow-lg"
                    >
                      <span className="flex items-center gap-2">
                        <LuScanLine className="text-lg md:text-xl" />
                        Choose Image
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
                      className="flex flex-col items-center justify-center py-10 md:py-12"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="text-5xl md:text-6xl mb-3 md:mb-4"
                      >
                        <LuScanLine className="text-sky-400" />
                      </motion.div>
                      <p className="text-neutral-300 text-sm md:text-base font-medium">Analyzing...</p>
                      <p className="text-neutral-500 text-xs md:text-sm mt-1 md:mt-2">Please wait</p>
                    </motion.div>
                  )}

                  {!scanLoading && scanResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3 md:space-y-4"
                    >
                      <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6 text-white">
                        Found {scanResults.length} match{scanResults.length !== 1 ? 'es' : ''}
                      </h3>
                      {scanResults.map((r, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="group relative p-3 md:p-4 rounded-xl md:rounded-2xl bg-neutral-800/30 border border-white/5 hover:border-sky-500/40 transition"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-500 rounded-xl md:rounded-2xl blur opacity-0 group-hover:opacity-30 transition" />
                          
                          <div className="relative">
                            <div className="overflow-hidden rounded-lg md:rounded-xl mb-3 md:mb-4">
                              <video
                                src={r.video}
                                className="w-full rounded-lg md:rounded-xl"
                                controls
                                autoPlay
                                muted
                                loop
                              />
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-bold text-sm md:text-base text-white line-clamp-2">
                                {r.title?.romaji || r.title?.english || 'Unknown'}
                              </h4>
                              
                              <div className="flex items-center gap-2 text-xs md:text-sm flex-wrap">
                                <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-sky-600/20 text-sky-300 border border-sky-500/30">
                                  Ep {r.episode || '?'}
                                </span>
                                <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-green-600/20 text-green-300 border border-green-500/30">
                                  {(r.similarity * 100).toFixed(1)}%
                                </span>
                              </div>

                              {r.anilist && (
                                <Link
                                  href={`/anime/${r.anilist}`}
                                  onClick={() => setScanOpen(false)}
                                >
                                  <motion.button
                                    whileHover={{ scale: 1.02, x: 3 }}
                                    className="mt-2 md:mt-3 px-4 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-xs md:text-sm font-semibold transition-all inline-flex items-center gap-1.5">
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
                      className="text-center py-10 md:py-12"
                    >
                      <LuScanLine className="inline-block text-5xl md:text-6xl mb-3 md:mb-4 text-neutral-600" />
                      <p className="text-neutral-400 text-sm md:text-base">No results yet</p>
                      <p className="text-neutral-500 text-xs md:text-sm mt-1 md:mt-2">Upload a screenshot to begin</p>
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
}
