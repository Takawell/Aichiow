'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  fetchGenres,
  fetchPopularManga,
  searchManga,
  getMangaByFilter,
} from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaSpinner, FaFilter, FaTimesCircle } from 'react-icons/fa'

const fallbackGenres = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'School Life',
  'Sci-Fi',
  'Slice of Life',
  'Supernatural',
  'Sports',
  'Mystery',
  'Psychological',
  'Thriller',
]

export default function ExploreMangaPage() {
  const router = useRouter()
  const { genre } = router.query

  const [genres, setGenres] = useState<any[]>([])
  const [mangaList, setMangaList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [genreModalOpen, setGenreModalOpen] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  useEffect(() => {
    async function loadGenres() {
      try {
        const tagData = await fetchGenres()
        setGenres(tagData)
      } catch {
        setGenres(
          fallbackGenres.map((g) => ({
            id: g,
            attributes: { name: { en: g } },
          }))
        )
      }
    }
    loadGenres()
  }, [])

  useEffect(() => {
    async function loadManga() {
      setLoading(true)
      try {
        if (selectedGenres.length > 0) {
          const filtered = await getMangaByFilter({ includedTags: selectedGenres })
          setMangaList(filtered)
        } else {
          const popular = await fetchPopularManga()
          setMangaList(popular)
        }
      } catch (e) {
        console.error('Error loading manga:', e)
        setMangaList([])
      } finally {
        setLoading(false)
      }
    }
    loadManga()
  }, [selectedGenres])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!search.trim()) return
    setLoading(true)
    try {
      const result = await searchManga(search)
      setMangaList(result)
    } catch (e) {
      console.error('Search error:', e)
    } finally {
      setLoading(false)
    }
  }

  function toggleGenre(id: string) {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  return (
    <>
      <Head>
        <title>Explore Manga | Aichiow</title>
        <meta
          name="description"
          content="Discover and search for manga by genre, popularity, and more."
        />
      </Head>

      <main className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-black to-black text-white px-3 sm:px-4 md:px-8 lg:px-10 py-6 sm:py-8 md:py-12 overflow-x-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU2LDE4OSwyNDgsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>
        
        <div className="absolute top-20 left-10 w-72 h-72 md:w-96 md:h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 md:w-96 md:h-96 bg-sky-400/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-6 sm:mb-8 md:mb-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-6 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-sky-500/15 to-sky-600/10 border border-sky-400/25 rounded-full backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(56,189,248,0.3)]"
            >
              <span className="text-base sm:text-lg md:text-xl text-sky-400 animate-pulse">✨</span>
              <span className="text-[10px] sm:text-xs md:text-sm text-sky-200 font-semibold tracking-wide">Discover Your Next Adventure</span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-2 sm:mb-3 md:mb-5 bg-gradient-to-br from-sky-300 via-sky-400 to-sky-600 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(56,189,248,0.4)] leading-tight pb-1">
              Explore Manga
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed px-2">
              Dive into thousands of manga titles across every genre imaginable
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-sky-600/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <FaSearch className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-all duration-300 z-10 text-xs sm:text-sm md:text-base" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search your favorite manga..."
                    className="w-full pl-9 sm:pl-11 md:pl-14 pr-24 sm:pr-28 md:pr-32 py-3 sm:py-3.5 md:py-4 lg:py-5 bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base placeholder:text-slate-500 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30 outline-none transition-all duration-300 shadow-2xl shadow-black/20"
                  />
                  <button
                    type="button"
                    onClick={() => setGenreModalOpen(true)}
                    className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-sky-500/20 to-sky-600/20 hover:from-sky-500/30 hover:to-sky-600/30 border border-sky-400/30 transition-all backdrop-blur-sm shadow-lg hover:shadow-sky-500/20 hover:scale-105 active:scale-95"
                  >
                    <FaFilter className="text-sky-400 text-xs sm:text-sm" />
                    <span className="hidden sm:inline text-sky-200 text-xs sm:text-sm font-semibold">Filter</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 lg:py-5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 active:scale-95 shadow-[0_0_40px_-8px_rgba(56,189,248,0.6)] hover:shadow-[0_0_50px_-5px_rgba(56,189,248,0.8)] whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </motion.form>

          <AnimatePresence>
            {selectedGenres.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 sm:mb-6 md:mb-8 flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5 justify-center items-center"
              >
                {selectedGenres.map((g, idx) => (
                  <motion.span
                    key={g}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-sky-500/20 to-sky-600/20 border border-sky-400/30 text-white text-xs sm:text-sm font-semibold backdrop-blur-xl shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-all"
                  >
                    <span className="truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                      {genres.find((x) => x.id === g)?.attributes?.name?.en || g}
                    </span>
                    <button
                      onClick={() => setSelectedGenres((prev) => prev.filter((x) => x !== g))}
                      className="hover:bg-white/20 rounded-full p-0.5 sm:p-1 transition-all hover:rotate-90"
                    >
                      <span className="text-[10px] sm:text-xs leading-none">✕</span>
                    </button>
                  </motion.span>
                ))}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={() => setSelectedGenres([])}
                  className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 rounded-full text-xs sm:text-sm font-semibold hover:from-red-500/30 hover:to-red-600/30 transition-all backdrop-blur-xl shadow-lg"
                >
                  Clear All
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 sm:space-y-6 md:space-y-8"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-sky-400 mb-4 sm:mb-6 md:mb-8">
                  <FaSpinner className="animate-spin text-lg sm:text-xl md:text-2xl" />
                  <span className="text-xs sm:text-sm md:text-base font-semibold">Loading amazing manga...</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="aspect-[3/4] bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl animate-pulse border border-slate-700/30 shadow-xl"
                    ></motion.div>
                  ))}
                </div>
              </motion.div>
            ) : mangaList.length > 0 ? (
              <motion.div
                key="manga"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <MangaGrid mangaList={mangaList} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5 py-12 sm:py-16 md:py-20 lg:py-32"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-full flex items-center justify-center border border-slate-700/40 shadow-2xl backdrop-blur-sm"
                >
                  <FaTimesCircle className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-slate-600" />
                </motion.div>
                <div className="text-center space-y-1 sm:space-y-2 px-4">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-300">No manga found</p>
                  <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-md">Try different keywords or adjust your genre filters to discover more</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {genreModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setGenreModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-5xl bg-gradient-to-br from-slate-900/98 to-slate-950/98 backdrop-blur-3xl border border-slate-700/50 rounded-2xl sm:rounded-3xl shadow-[0_0_80px_-20px_rgba(56,189,248,0.3)] max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 lg:p-8 border-b border-slate-700/50 bg-gradient-to-r from-sky-500/5 to-transparent">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Select Genres
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-slate-400">
                    Choose your favorite genres to refine your manga search
                  </p>
                </div>
                <button
                  onClick={() => setGenreModalOpen(false)}
                  className="ml-2 sm:ml-3 md:ml-4 p-1.5 sm:p-2 md:p-2.5 hover:bg-slate-800/60 rounded-lg sm:rounded-xl transition-all text-slate-400 hover:text-white text-xl sm:text-2xl leading-none hover:rotate-90 duration-300"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-sky-500/40 scrollbar-track-slate-800/30">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5 md:gap-3">
                  {genres.map((tag, idx) => {
                    const id = tag.id
                    const active = selectedGenres.includes(id)
                    return (
                      <motion.button
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        onClick={() => toggleGenre(id)}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 lg:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                          active
                            ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-[0_0_30px_-8px_rgba(56,189,248,0.6)] border border-sky-400/50'
                            : 'bg-slate-800/40 hover:bg-slate-800/60 text-slate-300 border border-slate-700/40 hover:border-slate-600/60'
                        }`}
                      >
                        <span className="truncate">{tag.attributes.name.en}</span>
                        {active && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-[10px] sm:text-xs"
                          >
                            ✓
                          </motion.span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 lg:p-8 border-t border-slate-700/50 bg-gradient-to-r from-sky-500/5 to-transparent">
                <div className="text-xs sm:text-sm text-slate-400 order-2 sm:order-1">
                  <span className="font-bold text-sky-400 text-sm sm:text-base md:text-lg">{selectedGenres.length}</span>
                  <span className="ml-1 sm:ml-1.5">genre{selectedGenres.length !== 1 ? 's' : ''} selected</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedGenres([])}
                    className="flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-slate-800/60 hover:bg-slate-800 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-all border border-slate-700/50"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setGenreModalOpen(false)}
                    className="flex-1 sm:flex-none px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-[0_0_30px_-8px_rgba(56,189,248,0.6)] hover:shadow-[0_0_40px_-5px_rgba(56,189,248,0.8)] hover:scale-105 active:scale-95"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
