'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import {
  fetchGenres,
  fetchPopularManga,
  searchManga,
  getMangaByFilter,
} from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaSearch,
  FaTags,
  FaTimesCircle,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa'

export default function ExploreMangaPage() {
  const router = useRouter()
  const { genre } = router.query

  const [genres, setGenres] = useState<any[]>([])
  const [mangaList, setMangaList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchingLive, setSearchingLive] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true
    async function loadGenres() {
      try {
        const tagData = await fetchGenres()
        if (mounted) setGenres(tagData)
      } catch {
        if (mounted) setGenres([])
      }
    }
    loadGenres()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    async function loadManga() {
      setLoading(true)
      try {
        if (genre && typeof genre === 'string') {
          const filtered = await getMangaByFilter({ includedTags: [genre] })
          if (mounted) setMangaList(filtered)
        } else {
          const popular = await fetchPopularManga()
          if (mounted) setMangaList(popular)
        }
      } catch {
        if (mounted) setMangaList([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadManga()
    return () => {
      mounted = false
    }
  }, [genre])

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }
    if (!search.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      setSearchingLive(false)
      return
    }

    setSearchingLive(true)
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await searchManga(search.trim())
        setSuggestions(res.slice(0, 8))
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      } finally {
        setSearchingLive(false)
      }
    }, 450)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [search])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!search.trim()) return
    setLoading(true)
    setShowSuggestions(false)
    try {
      const result = await searchManga(search.trim())
      setMangaList(result)
    } catch {
      setMangaList([])
    } finally {
      setLoading(false)
    }
  }

  function handleGenreChange(tagId?: string) {
    if (!tagId) {
      router.push('/manga/explore')
    } else {
      router.push(`/manga/explore?genre=${tagId}`)
    }
    setShowSuggestions(false)
  }

  function clearSearch() {
    setSearch('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  async function selectSuggestion(item: any) {
    if (!item) return
    setSearch(item.title ?? '')
    setShowSuggestions(false)
    setLoading(true)
    try {
      const res = await searchManga(item.title ?? '')
      setMangaList(res)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="px-4 md:px-8 lg:px-16 py-8 text-white bg-gradient-to-br from-[#050B14] via-[#0B1629] to-[#111827] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent tracking-tight">
              Explore Manga
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Discover trending and genre-based manga with a clean experience.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="relative w-full md:w-[420px]"
            role="search"
          >
            <FaSearch className="absolute left-4 top-3.5 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search manga by title..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder:text-zinc-400 transition-all duration-300"
              onFocus={() => suggestions.length && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-3 p-2 rounded-full hover:bg-white/10 transition"
              >
                <FaTimes className="text-zinc-400" />
              </button>
            )}
          </form>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          <aside className="hidden md:block">
            <div className="sticky top-6 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 mb-3 text-sky-400 font-semibold">
                <FaTags /> Genres
              </div>
              <div className="flex flex-col gap-2 max-h-[65vh] overflow-y-auto">
                <button
                  onClick={() => handleGenreChange(undefined)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                    !genre
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 font-semibold text-white shadow-lg'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                {genres.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleGenreChange(tag.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all truncate ${
                      genre === tag.id
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 font-semibold text-white shadow-lg'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {tag.attributes.name.en}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section>
            <div className="md:hidden mb-6">
              <div className="flex items-center gap-2 text-sky-400 font-semibold mb-3">
                <FaTags /> Genres
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleGenreChange(undefined)}
                  className={`px-4 py-1.5 rounded-full text-sm transition ${
                    !genre
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  All
                </button>
                {genres.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleGenreChange(tag.id)}
                    className={`px-4 py-1.5 rounded-full text-sm transition ${
                      genre === tag.id
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {tag.attributes.name.en}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="mb-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden"
                >
                  {searchingLive && (
                    <li className="px-4 py-2 text-sm text-zinc-400 flex items-center gap-2">
                      <FaSpinner className="animate-spin" /> Searching...
                    </li>
                  )}
                  {suggestions.map((s: any, i: number) => (
                    <li key={s.id ?? i}>
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectSuggestion(s)}
                        className="w-full text-left px-4 py-2 hover:bg-white/20 flex justify-between items-center transition"
                      >
                        <span className="truncate text-sm text-white">
                          {s.title ?? s.attributes?.title ?? 'Untitled'}
                        </span>
                        <span className="text-xs text-zinc-400">View</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            <div>
              {loading ? (
                <>
                  <div className="flex items-center gap-2 mb-6 text-sky-400">
                    <FaSpinner className="animate-spin" /> Loading manga...
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-56 bg-white/5 rounded-2xl animate-pulse"
                      />
                    ))}
                  </div>
                </>
              ) : mangaList.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`manga-grid-${genre ?? 'all'}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.32 }}
                  >
                    <MangaGrid mangaList={mangaList} />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center gap-4 text-zinc-400 py-12">
                  <FaTimesCircle className="text-4xl text-zinc-500" />
                  <p className="text-center">
                    No manga found. Try another keyword or genre.
                  </p>
                  <button
                    onClick={() => {
                      clearSearch()
                      handleGenreChange(undefined)
                    }}
                    className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
