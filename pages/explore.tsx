'use client'

import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useExploreAnime } from '@/hooks/useExploreAnime'
import { useSearchAnime } from '@/hooks/useSearchAnime'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaArrowDown, FaSpinner, FaFilter } from 'react-icons/fa'
import { LuScanLine } from 'react-icons/lu'
import { searchAnimeByFile } from '@/lib/traceMoe'

const genreList = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Romance',
  'Sci-Fi',
  'Horror',
  'Mystery',
  'Sports',
  'Slice of Life',
  'Supernatural',
  'Mecha',
  'Music',
  'Historical'
]

export default function ExplorePage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')
  const [scanOpen, setScanOpen] = useState(false)
  const [genreModalOpen, setGenreModalOpen] = useState(false)
  const [scanResults, setScanResults] = useState<any[]>([])
  const [scanLoading, setScanLoading] = useState(false)

  const { anime: exploreAnime, isLoading, loadMore, hasMore } = useExploreAnime()
  const { anime: searchAnime, isLoading: searchLoading } = useSearchAnime(query)

  const animeData = query ? searchAnime : exploreAnime
  const filtered =
    selectedGenres.length > 0
      ? animeData.filter((a) => a.genres && a.genres.some((g: string) => selectedGenres.includes(g)))
      : animeData

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

      <main className="bg-gradient-to-b from-[#0d0d10] via-[#111215] to-[#0a0a0a] min-h-screen text-white px-4 md:px-10 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionTitle title="💫 Explore Anime" />
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-8 mb-6 flex flex-col sm:flex-row items-stretch gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative w-full flex-1">
            <input
              type="text"
              placeholder="Search for anime title..."
              className="w-full pl-11 pr-28 py-3 bg-neutral-900/80 text-white rounded-lg border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 backdrop-blur-sm"
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
            <button
              type="button"
              onClick={() => setScanOpen(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition"
              title="Scan anime from image"
            >
              <LuScanLine className="text-2xl animate-pulse" />
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-700/30"
          >
            Search
          </button>
        </motion.form>

        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-4 flex flex-wrap gap-2 items-center"
          >
            {selectedGenres.length === 0 ? (
              <div className="text-sm text-neutral-400">No genre selected</div>
            ) : (
              selectedGenres.map((g) => (
                <motion.span
                  key={g}
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm shadow-[0_6px_18px_-8px_rgba(59,130,246,0.6)]"
                >
                  {g}
                  <button
                    onClick={() => setSelectedGenres((prev) => prev.filter((x) => x !== g))}
                    className="ml-1 text-xs text-white/80 rounded-full w-5 h-5 flex items-center justify-center"
                    aria-label={`Remove ${g}`}
                  >
                    ✕
                  </button>
                </motion.span>
              ))
            )}
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {(isLoading || searchLoading) && animeData.length === 0
            ? [...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-[240px] bg-neutral-800 rounded-xl animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                />
              ))
            : filtered.map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <AnimeCard anime={a} />
                </motion.div>
              ))}
        </motion.div>

        {query && !searchLoading && filtered.length === 0 && (
          <motion.p
            className="text-center text-zinc-400 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No results found for <span className="text-white font-semibold">"{query}"</span>.
          </motion.p>
        )}

        {!query && hasMore && (
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all duration-300 shadow-lg shadow-blue-700/30"
            >
              <FaArrowDown className="text-white" />
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </motion.div>
        )}

        {!query && !hasMore && exploreAnime.length > 0 && (
          <motion.p
            className="text-center text-sm text-neutral-400 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            You're reached the end of the list.
          </motion.p>
        )}

        <AnimatePresence>
          {genreModalOpen && (
            <motion.div
              className="fixed inset-0 bg-[rgba(8,8,12,0.6)] backdrop-blur-2xl flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-3xl bg-white/6 border border-white/10 rounded-3xl shadow-[0_30px_80px_-30px_rgba(2,6,23,0.8)] p-6 sm:p-8 backdrop-blur-3xl"
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
                  <h3 className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Select Genres
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">Pick one or more genres to filter the list</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {genreList.map((g) => {
                    const active = selectedGenres.includes(g)
                    return (
                      <motion.button
                        key={g}
                        onClick={() =>
                          setSelectedGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))
                        }
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_10px_30px_-12px_rgba(59,130,246,0.5)] transform-gpu scale-[1.02]'
                            : 'bg-white/4 text-neutral-200 hover:bg-white/6'
                        }`}
                      >
                        <span className="truncate">{g}</span>
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
                        setSelectedGenres(genreList.slice(0, 3))
                      }}
                      className="px-4 py-2 rounded-lg bg-white/6 text-sm text-neutral-200 hover:bg-white/8 transition"
                    >
                      Quick: Top 3
                    </button>
                    <button
                      onClick={() => clearGenres()}
                      className="px-4 py-2 rounded-lg bg-white/6 text-sm text-neutral-200 hover:bg-white/8 transition"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setGenreModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-sm text-white font-medium hover:scale-[1.02] transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {scanOpen && (
            <motion.div
              className="fixed inset-0 bg-[rgba(10,10,15,0.6)] backdrop-blur-2xl flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-[92%] sm:w-[80%] md:w-[70%] lg:w-[50%] bg-white/10 border border-white/20 rounded-3xl shadow-[0_0_50px_-10px_rgba(59,130,246,0.4)] p-6 sm:p-8 backdrop-blur-3xl flex flex-col items-center transition-all duration-300"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-400/5 to-transparent pointer-events-none rounded-3xl" />

                <button
                  onClick={() => setScanOpen(false)}
                  className="absolute right-5 top-5 text-neutral-300 hover:text-white transition text-2xl"
                >
                  ✕
                </button>

                <div className="text-center mb-6 mt-2">
                  <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    🔎 Search Engine
                  </h2>
                  <p className="text-sm text-neutral-400 mt-1">Upload a screenshot to detect the anime instantly</p>
                </div>

                <div className="flex justify-center w-full">
                  <label className="relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-blue-700/30">
                    <LuScanLine className="text-lg" />
                    <span>Choose Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                </div>

                {scanLoading && (
                  <motion.div className="flex flex-col items-center justify-center mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <FaSpinner className="animate-spin text-blue-400 text-3xl mb-2" />
                    <p className="text-neutral-400 text-sm">Analyzing your image...</p>
                  </motion.div>
                )}

                {!scanLoading && scanResults.length > 0 && (
                  <motion.div
                    className="mt-6 grid gap-5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-transparent w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {scanResults.map((r, i) => (
                      <motion.div
                        key={i}
                        className="relative p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)] group"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="overflow-hidden rounded-xl">
                          <video src={r.video} className="rounded-xl w-full group-hover:scale-[1.02] transition-all duration-300" controls autoPlay muted loop />
                        </div>

                        <div className="mt-3">
                          <p className="font-semibold text-white">{r.title?.romaji || r.title?.english || 'Unknown Title'}</p>
                          <p className="text-sm text-neutral-400">Episode {r.episode || '?'} · Accuracy {(r.similarity * 100).toFixed(1)}%</p>

                          {r.anilist && (
                            <Link href={`/anime/${r.anilist}`} onClick={() => setScanOpen(false)} className="inline-block mt-3 text-blue-400 hover:text-blue-300 font-medium transition-all">
                              → View Anime Detail
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {!scanLoading && scanResults.length === 0 && (
                  <motion.p className="text-neutral-400 mt-6 text-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    No results yet. Try uploading an image!
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
