"use client"

import React, { useEffect, useState, useRef } from "react"
import Head from "next/head"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { fetchManhwaList, searchManhwa, fetchGenres } from "@/lib/anilistManhwa"
import { Manhwa } from "@/types/manhwa"

type FetchResult = {
  list: Manhwa[]
  totalPages: number
}

export default function ManhwaPage() {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>("ALL")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Manhwa[]>([])
  const [searching, setSearching] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const searchRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedGenre])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const data: FetchResult = await fetchManhwaList(page, selectedGenre !== "ALL" ? selectedGenre : undefined)
      setManhwa(data.list)
      setTotalPages(data.totalPages)

      if (genres.length === 0) {
        const g = await fetchGenres()
        setGenres(["ALL", ...g])
      }
    } catch (e) {
      console.error(e)
      setError("Gagal memuat daftar manhwa.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      setSearchResults([])
      return
    }
    try {
      setSearching(true)
      const results = await searchManhwa(trimmed)
      setSearchResults(results)
    } catch (e) {
      console.error(e)
      setError("Gagal mencari manhwa.")
    } finally {
      setSearching(false)
    }
  }

  const displayedList = searchResults.length > 0 ? searchResults : manhwa

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-gray-900 to-black text-white">
      <Head>
        <title>Manhwa | Aichiow</title>
        <meta name="description" content="Search and collect all the manhwa you love only on aichiow" />
      </Head>

      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-6">
        <TopBar
          query={query}
          setQuery={setQuery}
          onSubmit={handleSearch}
          searching={searching}
          searchRef={searchRef}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <section className="lg:col-span-3 space-y-6">
            {loading ? (
              <HeroSkeleton />
            ) : manhwa.length > 0 ? (
              <HeroItem manhwa={manhwa[0]} />
            ) : (
              <div className="rounded-lg bg-gray-900 p-6">Tidak ada manhwa ditemukan.</div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <GenreChips
                  genres={genres}
                  selected={selectedGenre}
                  onSelect={(g) => {
                    setSelectedGenre(g)
                    setPage(1)
                    setSearchResults([])
                  }}
                />
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="text-sm text-gray-300">View</div>
                <ToggleView />
              </div>
            </div>

            {error && <div className="text-red-400">{error}</div>}

            {loading && <div className="text-gray-400">Memuat data...</div>}

            {!loading && displayedList.length === 0 && (
              <div className="text-gray-400">Tidak ada hasil untuk "{query}".</div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <AnimatePresence>
                {displayedList.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    whileHover={{ scale: 1.03 }}
                    className="relative bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-blue-500/30 transition-all group"
                  >
                    <ManhwaCard manhwaItem={m} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {searchResults.length === 0 && totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            )}
          </section>

          <aside className="lg:col-span-1 space-y-6">
            <div className="sticky top-20">
              <SearchPanel
                query={query}
                setQuery={setQuery}
                onSubmit={handleSearch}
                searching={searching}
                suggestions={manhwa.slice(0, 6)}
              />

              <div className="mt-6 bg-gray-900 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold mb-2">Top Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.slice(1, 10).map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setSelectedGenre(g)
                        setPage(1)
                        setSearchResults([])
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200
                        ${selectedGenre === g ? 'bg-gradient-to-r from-blue-500 to-indigo-700 text-white shadow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-4 shadow-inner">
                <h4 className="text-sm font-semibold mb-2">Tips</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>- Gunakan search untuk hasil lebih spesifik</li>
                  <li>- Klik cover untuk detail halaman manhwa</li>
                  <li>- Gunakan genre untuk filtering cepat</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

/* ---------------- subcomponents ---------------- */

function TopBar({
  query,
  setQuery,
  onSubmit,
  searching,
  searchRef,
}: {
  query: string
  setQuery: (q: string) => void
  onSubmit: (e?: React.FormEvent) => void
  searching: boolean
  searchRef: React.RefObject<HTMLInputElement>
}) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg p-2 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
          <Link href="/manhwa">
            <a className="text-white font-bold tracking-tight">Aichiow</a>
          </Link>
        </div>
        <div className="hidden md:block text-gray-300">Discover top manhwa & build your collection</div>
      </div>

      <form onSubmit={(e) => onSubmit(e)} className="flex-1 max-w-2xl">
        <div className="relative">
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manhwa, authors, genres..."
            className="w-full rounded-2xl bg-gray-800 border border-gray-700 px-4 py-3 pr-12 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full text-sm font-semibold shadow hover:scale-105 transition-transform
              ${searching ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <div className="flex items-center gap-2">
              <FaSearch />
              <span className="hidden sm:inline">{searching ? 'Mencari...' : 'Search'}</span>
            </div>
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3">
        <button className="hidden md:inline-flex px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700">Explore</button>
        <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 shadow-md">Sign in</button>
      </div>
    </header>
  )
}

function HeroItem({ manhwa }: { manhwa: Manhwa }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 relative aspect-[3/4] md:h-[420px] overflow-hidden">
          <img src={manhwa.coverImage.large} alt={manhwa.title.english || manhwa.title.romaji} className="w-full h-full object-cover" />
        </div>

        <div className="md:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-xs font-semibold">Manhwa</span>
              <h1 className="text-2xl sm:text-3xl font-bold">{manhwa.title.english || manhwa.title.romaji}</h1>
            </div>

            <p className="mt-3 text-sm text-gray-300 line-clamp-4">{manhwa.description ? stripHtml(manhwa.description) : 'No description available.'}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(manhwa.genres || []).slice(0, 6).map((g) => (
                <span key={g} className="text-xs px-3 py-1 rounded-full bg-gray-800 border border-gray-700">{g}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Link href={`/manhwa/${manhwa.id}`}>
              <a className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold shadow hover:scale-[1.02] transition-transform">Open page</a>
            </Link>
            <button className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">Add to list</button>
            <div className="ml-auto text-sm text-gray-400">Rating: {manhwa.averageScore ?? '—'}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ManhwaCard({ manhwaItem }: { manhwaItem: Manhwa }) {
  return (
    <Link href={`/manhwa/${manhwaItem.id}`}>
      <a className="block relative w-full h-full">
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <img src={manhwaItem.coverImage.large} alt={manhwaItem.title.english || manhwaItem.title.romaji} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity"></div>
        </div>

        <div className="p-3">
          <h3 className="text-sm sm:text-base font-semibold line-clamp-2">{manhwaItem.title.english || manhwaItem.title.romaji}</h3>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>{manhwaItem.format ?? '—'}</span>
            <span className="text-right">{manhwaItem.status ?? '—'}</span>
          </div>
        </div>
      </a>
    </Link>
  )
}

function GenreChips({ genres, selected, onSelect }: { genres: string[]; selected: string; onSelect: (g: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {genres.map((genre) => (
        <motion.button
          key={genre}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(genre)}
          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300
            ${selected === genre ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/30' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          {genre}
        </motion.button>
      ))}
    </div>
  )
}

function Pagination({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (n: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        <FaChevronLeft />
      </button>
      <div className="px-3 py-1 text-gray-300">Page {page} / {totalPages}</div>
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        <FaChevronRight />
      </button>
    </div>
  )
}

function SearchPanel({ query, setQuery, onSubmit, searching, suggestions }: { query: string; setQuery: (q: string) => void; onSubmit: (e?: React.FormEvent) => void; searching: boolean; suggestions: Manhwa[] }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-2">Quick Search</h3>
      <form onSubmit={(e) => onSubmit(e)} className="flex gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find manhwa..." className="flex-1 rounded-lg bg-gray-800 px-3 py-2 text-sm placeholder-gray-400" />
        <button type="submit" className={`px-3 py-2 rounded-lg ${searching ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {searching ? '...' : 'Go'}
        </button>
      </form>

      <div className="mt-4">
        <h4 className="text-xs text-gray-400 mb-2">Suggestions</h4>
        <div className="flex flex-col gap-2">
          {suggestions.map((s) => (
            <Link key={s.id} href={`/manhwa/${s.id}`}>
              <a className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
                <img src={s.coverImage.medium} className="w-10 h-12 object-cover rounded" alt={s.title.english || s.title.romaji} />
                <div className="text-sm">{s.title.english || s.title.romaji}</div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToggleView() {
   return (
    <div className="bg-gray-800 rounded-full px-2 py-1 text-xs">Grid</div>
  )
}

function stripHtml(input?: string) {
  if (!input) return ''
  return input.replace(/<[^>]*>/g, '')
}

function HeroSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-gray-800 h-[420px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div className="md:col-span-1 bg-neutral-700" />
        <div className="md:col-span-2 p-6 space-y-3">
          <div className="h-6 bg-neutral-700 w-1/3 rounded" />
          <div className="h-4 bg-neutral-700 w-full rounded" />
          <div className="h-4 bg-neutral-700 w-full rounded" />
          <div className="h-4 bg-neutral-700 w-3/4 rounded" />
          <div className="mt-auto h-10 bg-neutral-700 w-1/4 rounded" />
        </div>
      </div>
    </div>
  )
}
