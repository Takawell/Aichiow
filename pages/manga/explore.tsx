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
      } catch (e) {
        console.error('Error fetching genres:', e)
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
      } catch (e) {
        console.error('Error loading manga:', e)
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
      } catch (e) {
        console.error('Live search error:', e)
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
    } catch (e) {
      console.error('Search error:', e)
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
    } catch (e) {
      console.error('Error selecting suggestion:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="px-4 md:px-8 lg:px-12 py-8 text-white">
      <div className="max-w-[1300px] mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.h1
              className="text-3xl md:text-4xl font-extrabold 
                bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text flex items-center gap-3"
            >
              <FaSearch className="text-sky-400" /> Explore Manga
            </motion.h1>
            <span className="hidden md:inline text-zinc-400 ml-2">
              Discover popular & filtered manga — fast.
            </span>
          </div>

          <form
            onSubmit={handleSearch}
            className="w-full md:w-[440px] relative flex items-center"
            role="search"
            aria-label="Search manga"
          >
            <FaSearch className="absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search manga by title..."
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-zinc-900/70 focus:ring-2 focus:ring-sky-500 outline-none text-white placeholder:text-zinc-500 shadow-md"
              onFocus={() => {
                if (suggestions.length) setShowSuggestions(true)
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150)
              }}
            />
            {search ? (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-2.5 p-1 rounded-md hover:bg-zinc-800"
              >
                <FaTimes />
              </button>
            ) : null}
          </form>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <aside className="hidden md:block">
            <div className="sticky top-6">
              <div className="mb-3 flex items-center gap-2 text-zinc-300">
                <FaTags /> <span className="font-semibold">Filter by Genre</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleGenreChange(undefined)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition shadow-sm flex items-center justify-between ${
                    !genre
                      ? 'bg-sky-600 font-semibold text-white'
                      : 'bg-zinc-800/70 hover:bg-zinc-700'
                  }`}
                  aria-pressed={!genre}
                >
                  <span>All</span>
                  <span className="text-sm text-zinc-400">Popular</span>
                </button>

                <div className="max-h-[60vh] overflow-auto pr-1">
                  {genres.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleGenreChange(tag.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition shadow-sm flex items-center justify-between ${
                        genre === tag.id
                          ? 'bg-sky-600 font-semibold text-white'
                          : 'bg-zinc-800/60 hover:bg-zinc-700'
                      }`}
                      aria-pressed={genre === tag.id}
                    >
                      <span className="truncate">{tag.attributes.name.en}</span>
                      <span className="text-xs text-zinc-400">#{tag.attributes.total ?? ''}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-4 md:hidden">
              <div className="flex items-center gap-2 mb-3 text-zinc-300">
                <FaTags /> <span className="font-semibold">Genres</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleGenreChange(undefined)}
                  className={`px-3 py-1 rounded-full text-sm transition shadow-sm ${
                    !genre
                      ? 'bg-sky-600 font-semibold text-white'
                      : 'bg-zinc-700 hover:bg-zinc-600'
                  }`}
                >
                  All
                </button>
                {genres.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleGenreChange(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm transition shadow-sm ${
                      genre === tag.id
                        ? 'bg-sky-600 font-semibold text-white'
                        : 'bg-zinc-700 hover:bg-zinc-600'
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
                  className="mb-4 bg-zinc-900/80 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto"
                  role="listbox"
                >
                  {searchingLive && (
                    <li className="px-3 py-2 text-sm text-zinc-400 flex items-center gap-2">
                      <FaSpinner className="animate-spin" /> Searching...
                    </li>
                  )}
                  {suggestions.map((s: any, i: number) => (
                    <li
                      key={s.id ?? i}
                      role="option"
                      onMouseDown={(ev) => {
                        ev.preventDefault()
                      }}
                    >
                      <button
                        onClick={() => selectSuggestion(s)}
                        className="w-full text-left px-3 py-2 hover:bg-zinc-800 flex items-center gap-3"
                      >
                        <div className="flex-1 text-sm truncate">
                          {s.title ?? s.attributes?.title ?? 'Untitled'}
                          <div className="text-xs text-zinc-500 truncate">
                            {s.latestChapter ? `Ch. ${s.latestChapter}` : s.volumes ? `Vols: ${s.volumes}` : ''}
                          </div>
                        </div>
                        <div className="text-xs text-zinc-400">View</div>
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
                        className="h-60 bg-gradient-to-br from-neutral-800/60 to-neutral-900 rounded-lg animate-pulse"
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
                <div className="flex flex-col items-center gap-3 text-zinc-500 py-12">
                  <FaTimesCircle className="text-4xl" />
                  <p className="text-center">No manga found. Try another keyword or genre.</p>
                  <button
                    onClick={() => {
                      clearSearch()
                      handleGenreChange(undefined)
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
                  >
                    Reset filters
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
