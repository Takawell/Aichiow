'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  fetchGenres,
  fetchPopularManga,
  searchManga,
  getMangaByFilter,
} from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaTags, FaTimesCircle, FaSpinner } from 'react-icons/fa'

export default function ExploreMangaPage() {
  const router = useRouter()
  const { genre } = router.query

  const [genres, setGenres] = useState<any[]>([])
  const [mangaList, setMangaList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadGenres() {
      const tagData = await fetchGenres()
      setGenres(tagData)
    }
    loadGenres()
  }, [])

  useEffect(() => {
    async function loadManga() {
      setLoading(true)
      try {
        if (genre && typeof genre === 'string') {
          const filtered = await getMangaByFilter({ includedTags: [genre] })
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
  }, [genre])

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

  function handleGenreChange(tagId: string) {
    router.push(`/manga/explore?genre=${tagId}`)
  }

  return (
    <main className="px-4 md:px-8 py-10 text-white">
      {/* Hero Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold mb-8 
          bg-gradient-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text flex items-center gap-3"
      >
        <FaSearch className="text-sky-400" /> Explore Manga
      </motion.h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex flex-wrap gap-3 items-center"
      >
        <div className="relative w-full md:w-[350px]">
          <FaSearch className="absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search manga..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 focus:ring-2 
              focus:ring-sky-500 outline-none text-white placeholder:text-zinc-400 shadow-md"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold shadow-md transition"
        >
          Search
        </button>
      </form>

      {/* Genre Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-zinc-300">
          <FaTags /> <span className="font-semibold">Filter by Genre</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push('/manga/explore')}
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

      {/* Manga Grid */}
      {loading ? (
        <div>
          <div className="flex items-center gap-2 mb-6 text-sky-400">
            <FaSpinner className="animate-spin" /> Loading manga...
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-neutral-800/60 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      ) : mangaList.length > 0 ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MangaGrid mangaList={mangaList} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex flex-col items-center gap-3 text-zinc-500 py-10">
          <FaTimesCircle className="text-4xl" />
          <p>No manga found.</p>
        </div>
      )}
    </main>
  )
}
