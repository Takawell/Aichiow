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

      <main className="relative min-h-screen bg-gradient-to-b from-[#0b0b10] via-[#0e1015] to-[#0a0a0f] text-white px-4 md:px-10 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]"
        >
          💫 Explore Manga
        </motion.h1>

        <motion.form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-3.5 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search manga title..."
              className="w-full pl-11 pr-24 py-3 bg-zinc-900/60 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-sky-500 outline-none transition-all duration-300 backdrop-blur-sm"
            />
            <button
              type="button"
              onClick={() => setGenreModalOpen(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition text-sm"
            >
              <FaFilter className="text-sky-400" />
              <span className="hidden sm:inline text-zinc-300">Filter</span>
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-700/30"
          >
            Search
          </button>
        </motion.form>

        {selectedGenres.length > 0 && (
          <motion.div
            className="mb-6 flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {selectedGenres.map((g) => (
              <motion.span
                key={g}
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white text-sm shadow-[0_6px_18px_-8px_rgba(56,189,248,0.6)]"
              >
                {genres.find((x) => x.id === g)?.attributes?.name?.en || g}
                <button
                  onClick={() =>
                    setSelectedGenres((prev) => prev.filter((x) => x !== g))
                  }
                  className="ml-1 text-xs text-white/80 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 mb-6 text-sky-400">
                <FaSpinner className="animate-spin" /> Loading manga...
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-zinc-800/40 backdrop-blur-md rounded-xl animate-pulse border border-zinc-700/40"
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
              className="flex flex-col items-center gap-3 text-zinc-500 py-16"
            >
              <FaTimesCircle className="text-5xl text-zinc-600" />
              <p className="text-lg font-medium">No manga found.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {genreModalOpen && (
            <motion.div
              className="fixed inset-0 bg-[rgba(8,8,12,0.6)] backdrop-blur-2xl flex items-center justify-center z-50 px-3 sm:px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-3xl bg-white/6 border border-white/10 rounded-3xl shadow-[0_30px_80px_-30px_rgba(2,6,23,0.8)] p-5 sm:p-8 backdrop-blur-3xl max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/40 scrollbar-track-transparent"
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28 }}
              >
                <button
                  onClick={() => setGenreModalOpen(false)}
                  className="absolute right-5 top-5 text-neutral-300 hover:text-white text-2xl"
                >
                  ✕
                </button>

                <div className="text-center mb-4 mt-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-300">
                    Select Genres
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    Pick one or more genres to filter manga
                  </p>
                </div>

                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
                  {genres.map((tag) => {
                    const id = tag.id
                    const active = selectedGenres.includes(id)
                    return (
                      <motion.button
                        key={id}
                        onClick={() => toggleGenre(id)}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-[0_10px_30px_-12px_rgba(56,189,248,0.5)] scale-[1.02]'
                            : 'bg-white/4 text-neutral-200 hover:bg-white/6'
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

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-sm text-neutral-300">
                    Selected: {selectedGenres.length}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
                    <button
                      onClick={() => setSelectedGenres([])}
                      className="px-4 py-2 rounded-lg bg-white/6 text-sm text-neutral-200 hover:bg-white/8 transition"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setGenreModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-sm text-white font-medium hover:scale-[1.02] transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
