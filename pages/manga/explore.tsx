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

      <main className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-sky-950/20 text-white px-4 md:px-10 py-8 md:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.06),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full backdrop-blur-sm">
              <span className="text-sky-400 text-lg">✨</span>
              <span className="text-xs sm:text-sm text-sky-300 font-medium">Discover Your Next Adventure</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
              💫 Explore Manga
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              Search thousands of manga titles and filter by your favorite genres
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto mb-8 md:mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search manga title..."
                  className="w-full pl-11 pr-28 py-3.5 sm:py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setGenreModalOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 transition-all backdrop-blur-sm"
                >
                  <FaFilter className="text-sky-400 text-sm" />
                  <span className="hidden sm:inline text-sky-300 text-sm font-medium">Filter</span>
                </button>
              </div>

              <button
                type="submit"
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-sky-500/25 whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </motion.form>

          {selectedGenres.length > 0 && (
            <motion.div
              className="mb-6 md:mb-8 flex flex-wrap gap-2 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {selectedGenres.map((g) => (
                <motion.span
                  key={g}
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-white text-xs sm:text-sm font-medium backdrop-blur-sm shadow-lg shadow-sky-500/10"
                >
                  {genres.find((x) => x.id === g)?.attributes?.name?.en || g}
                  <button
                    onClick={() =>
                      setSelectedGenres((prev) => prev.filter((x) => x !== g))
                    }
                    className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
                  >
                    <span className="text-xs">✕</span>
                  </button>
                </motion.span>
              ))}
              <button
                onClick={() => setSelectedGenres([])}
                className="px-3 py-1.5 bg-red-500/20 border border-red-400/30 rounded-full text-xs sm:text-sm font-medium hover:bg-red-500/30 transition-colors backdrop-blur-sm"
              >
                Clear All
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-center gap-3 text-sky-400 mb-6">
                  <FaSpinner className="animate-spin text-lg" />
                  <span className="text-sm font-medium">Loading manga...</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] bg-white/5 backdrop-blur-sm rounded-2xl animate-pulse border border-white/10"
                    ></div>
                  ))}
                </div>
              </motion.div>
            ) : mangaList.length > 0 ? (
              <motion.div
                key="manga"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <MangaGrid mangaList={mangaList} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center gap-4 py-16 sm:py-24"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <FaTimesCircle className="text-4xl sm:text-5xl text-slate-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-bold text-slate-400 mb-1">No manga found</p>
                  <p className="text-sm text-slate-600">Try adjusting your search or filters</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {genreModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 px-3 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGenreModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-sky-500/10 max-h-[85vh] overflow-hidden flex flex-col"
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent">
                    Select Genres
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Pick one or more genres to filter manga
                  </p>
                </div>
                <button
                  onClick={() => setGenreModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6 scrollbar-thin scrollbar-thumb-sky-500/40 scrollbar-track-transparent">
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {genres.map((tag) => {
                    const id = tag.id
                    const active = selectedGenres.includes(id)
                    return (
                      <motion.button
                        key={id}
                        onClick={() => toggleGenre(id)}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          active
                            ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-500/30 scale-105'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        {tag.attributes.name.en}
                        {active && (
                          <span className="text-[10px] text-white/90">✓</span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between p-5 sm:p-6 border-t border-white/10 bg-slate-950/50">
                <div className="text-xs sm:text-sm text-slate-500">
                  <span className="font-semibold text-sky-400">{selectedGenres.length}</span> selected
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setSelectedGenres([])}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setGenreModalOpen(false)}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-sky-500/30"
                  >
                    Apply
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
