'use client'

import { useEffect, useState, useMemo } from 'react'
import Head from 'next/head'
import {
  fetchGenres,
  fetchPopularManga,
  searchManga,
  getMangaByFilter,
} from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import SectionTitle from '@/components/shared/SectionTitle'
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
  const [genres, setGenres] = useState<any[]>([])
  const [mangaList, setMangaList] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
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
    const q = input.trim()
    if (!q) return
    setQuery(q)
    setLoading(true)
    try {
      const result = await searchManga(q)
      setMangaList(result)
    } catch (e) {
      console.error('Search error:', e)
    } finally {
      setLoading(false)
    }
  }

  // Optional: memoize filtered by genres from the client-side if needed
  const displayedManga = useMemo(() => {
    if (selectedGenres.length === 0) return mangaList
    return mangaList.filter((m) =>
      (m.tags || m.genres || []).some((t: any) =>
        selectedGenres.includes(t.id ?? t)
      )
    )
  }, [mangaList, selectedGenres])

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

      <main className="bg-gradient-to-b from-[#0d0d10] via-[#111215] to-[#0a0a0a] min-h-screen text-white px-4 md:px-10 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionTitle title="💫 Explore Manga" />
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          className="mt-8 mb-6 flex flex-col sm:flex-row items-stretch gap-3 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative w-full flex-1">
            <input
              type="text"
              placeholder="Search for manga title..."
              className="w-full pl-11 pr-28 py-3 bg-neutral-900/80 text-white rounded-lg border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all duration-300 backdrop-blur-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGenreModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/6 rounded-full hover:bg-white/8 transition text-sm"
                title="Filter genres"
              >
                <FaFilter className="text-sm text-neutral-200" />
                <span className="hidden sm:inline text-neutral-200">Filter</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-700/30"
          >
            Search
          </button>
        </motion.form>

        {!query && selectedGenres.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-4 flex justify-center"
          >
            <div className="text-sm text-neutral-400">No genre selected</div>
          </motion.div>
        )}

        {selectedGenres.length > 0 && (
          <motion.div
            className="mb-6 flex flex-wrap gap-2 items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {selectedGenres.map((g) => (
              <motion.span
                key={g}
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white text-sm shadow-[0_6px_18px_-8px_rgba(56,189,248,0.6)]"
              >
                {genres.find((x) => x.id === g)?.attributes?.name?.en || g}
                <button
                  onClick={() => setSelectedGenres((prev) => prev.filter((x) => x !== g))}
                  className="ml-1 text-xs text-white/80 rounded-full w-5 h-5 flex items-center justify-center"
                  aria-label={`Remove ${g}`}
                >
                  ✕
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-2 max-w-6xl mx-auto">
          {loading ? (
            [...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="h-[260px] bg-neutral-800 rounded-xl animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
              />
            ))
          ) : displayedManga.length > 0 ? (
            displayedManga.map((m: any) => (
              <motion.div
                key={m.id || m.identifier || Math.random()}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <MangaGrid mangaList={[m]} single />
              </motion.div>
            ))
          ) : (
            <motion.div className="col-span-full">
              <div className="flex flex-col items-center gap-3 text-zinc-500 py-16">
                <FaTimesCircle className="text-5xl text-zinc-600" />
                <p className="text-lg font-medium">No manga found.</p>
              </div>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {genreModalOpen && (
            <motion.div
              className="fixed inset-0 bg-[rgba(8,8,12,0.6)] backdrop-blur-2xl flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-3xl bg-white/6 border border-white/10 rounded-3xl shadow-[0_30px_80px_-30px_rgba(2,6,23,0.8)] p-6 sm:p-8 backdrop-blur-3xl max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-transparent"
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28 }}
              >
                <div className="absolute right-4 top-4">
                  <button
                    onClick={() => setGenreModalOpen(false)}
                    className="text-neutral-300 hover:text-white text-2xl"
                    aria-label="Close genre modal"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center mb-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
                    Select Genres
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">Pick one or more genres to filter manga</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(genres.length ? genres : fallbackGenres.map((g) => ({ id: g, attributes: { name: { en: g } } }))).map((tag: any) => {
                    const id = tag.id
                    const active = selectedGenres.includes(id)
                    return (
                      <motion.button
                        key={id}
                        onClick={() => toggleGenre(id)}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-[0_10px_30px_-12px_rgba(56,189,248,0.5)] transform-gpu scale-[1.02]'
                            : 'bg-white/4 text-neutral-200 hover:bg-white/6'
                        }`}
                      >
                        {tag.attributes?.name?.en || tag.attributes?.name || id}
                        {active && <span className="text-xs text-white/90">✓</span>}
                      </motion.button>
                    )
                  })}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-sm text-neutral-300">Selected: {selectedGenres.length}</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedGenres((prev) => {
                          // quick pick: first 3 genres from list
                          const firstThree = (genres.length ? genres : fallbackGenres.map((g) => ({ id: g }))).slice(0, 3).map((x: any) => x.id)
                          return firstThree
                        })
                      }}
                      className="px-4 py-2 rounded-lg bg-white/6 text-sm text-neutral-200 hover:bg-white/8 transition"
                    >
                      Quick: Top 3
                    </button>
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
