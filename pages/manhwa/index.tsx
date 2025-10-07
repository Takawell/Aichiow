'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from 'react-icons/fa'

// Keep these imports as in your project — functions come from your lib.
import {
  fetchManhwaList,
  searchManhwa,
  fetchGenres,
  // Optional: fetchManhwaDetails
} from '@/lib/anilistManhwa'

// Type (simplified) — adapt if your project uses a different shape
type Title = {
  romaji?: string
  english?: string
  native?: string
}

type CoverImage = {
  large?: string
  medium?: string
}

export type Manhwa = {
  id: number | string
  title: Title
  coverImage: CoverImage
  description?: string
  genres?: string[]
  averageScore?: number
  status?: string
  chapters?: number | null
  volumes?: number | null
  startDate?: { year?: number }
  siteUrl?: string
}

export default function ManhwaPage() {
  const [manhwa, setManhwa] = useState<Manhwa[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Manhwa[]>([])
  const [searching, setSearching] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Quick-view modal
  const [preview, setPreview] = useState<Manhwa | null>(null)

  // local favorites (UI-only demo)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  // debounce for search input
  const searchTimeout = useRef<number | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchManhwaList(page, selectedGenre !== 'ALL' ? selectedGenre : undefined)
        setManhwa(data.list || [])
        setTotalPages(data.totalPages || 1)

        if (genres.length === 0) {
          const genreList = await fetchGenres()
          setGenres(['ALL', ...genreList])
        }
      } catch (e) {
        console.error(e)
        setError('Gagal memuat daftar manhwa. Coba muat ulang.')
      } finally {
        setLoading(false)
      }
    }
    // if not searching, load list
    if (!searching) load()
  }, [page, selectedGenre])

  // Search with debounce (instant search feel)
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([])
      setSearching(false)
      return
    }

    setSearching(true)
    if (searchTimeout.current) window.clearTimeout(searchTimeout.current)
    // @ts-ignore
    searchTimeout.current = window.setTimeout(async () => {
      try {
        const res = await searchManhwa(query.trim())
        setSearchResults(res || [])
      } catch (e) {
        console.error(e)
      } finally {
        setSearching(false)
      }
    }, 420)
  }, [query])

  const displayedList = searchResults.length > 0 ? searchResults : manhwa

  // Toggle favorite
  const toggleFavorite = (id: string | number) => {
    setFavorites((s) => ({ ...s, [String(id)]: !s[String(id)] }))
  }

  // Accessible keyboard handler for card quick view
  const handleKeyOpen = (e: React.KeyboardEvent, item: Manhwa) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setPreview(item)
    }
  }

  return (
    <>
      <Head>
        <title>Manhwa | Aichiow</title>
        <meta
          name="description"
          content="Discover thousands of manhwa. Modern cards, quick preview, genre filter and responsive grid."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Manhwa</h1>
              <p className="text-sm text-gray-400 mt-1">Explore trending, search titles, and preview details quickly.</p>
            </div>

            <div className="w-full sm:w-auto">
              <SearchBar
                value={query}
                onChange={(v) => setQuery(v)}
                loading={searching}
                placeholder="Cari judul, author, atau tag..."
              />
            </div>
          </header>

          {/* Genre pills */}
          <div className="flex gap-2 items-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
            {genres.map((g) => (
              <GenrePill
                key={g}
                genre={g}
                active={selectedGenre === g}
                onClick={() => {
                  setSelectedGenre(g)
                  setPage(1)
                }}
              />
            ))}
          </div>

          {/* Hero / spotlight */}
          <section>
            {loading ? (
              <div className="w-full h-[260px] md:h-[360px] rounded-2xl bg-neutral-900 animate-pulse" />
            ) : manhwa[0] ? (
              <ManhwaHeroSection item={manhwa[0]} onQuickView={() => setPreview(manhwa[0])} />
            ) : (
              <p className="text-gray-400">Tidak ada manhwa untuk ditampilkan</p>
            )}
          </section>

          {/* Grid */}
          <section>
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-4">
              {displayedList.map((m) => (
                <ManhwaCard
                  key={m.id}
                  item={m}
                  favorited={!!favorites[String(m.id)]}
                  onToggleFav={() => toggleFavorite(m.id)}
                  onQuickView={() => setPreview(m)}
                />
              ))}
            </div>

            {/* empty / loading states */}
            {loading && displayedList.length === 0 && (
              <div className="mt-6 text-gray-400">Memuat manhwa...</div>
            )}

            {!loading && displayedList.length === 0 && (
              <div className="mt-6 text-gray-400">Tidak ada hasil untuk "{query}"</div>
            )}
          </section>

          {/* Pagination */}
          {searchResults.length === 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`p-2 rounded-md ${page === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <FaChevronLeft />
              </button>
              <div className="text-sm text-gray-300">Page {page} / {totalPages}</div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`p-2 rounded-md ${page === totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* Quick preview modal */}
        <AnimatePresence>
          {preview && (
            <PreviewModal item={preview} onClose={() => setPreview(null)} onToggleFav={() => toggleFavorite(preview.id)} favorited={!!favorites[String(preview.id)]} />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

/* --------------------- Subcomponents --------------------- */

function SearchBar({ value, onChange, loading, placeholder = 'Search...' }: { value: string; onChange: (v: string) => void; loading?: boolean; placeholder?: string }) {
  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-400 outline-none"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        {loading ? <FaSpinner className="animate-spin text-gray-400" /> : <FaSearch className="text-gray-400" />}
      </div>
    </div>
  )
}

function GenrePill({ genre, active, onClick }: { genre: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        active ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-md' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {genre}
    </button>
  )
}

function ManhwaHeroSection({ item, onQuickView }: { item: Manhwa; onQuickView?: () => void }) {
  const title = item.title.english || item.title.romaji || item.title.native
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl">
      <div className="relative h-[220px] md:h-[320px] lg:h-[380px]">
        {item.coverImage?.large ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.coverImage.large} alt={title} className="w-full h-full object-cover brightness-75" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-700" />
        )}
      </div>

      <div className="absolute left-6 bottom-6 right-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-[110px] md:w-[140px] flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-black">
          {item.coverImage?.medium ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.coverImage.medium} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-36 bg-gray-800" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-lg md:text-2xl font-bold leading-tight">{title}</h2>
          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{stripHtml(item.description || '') || 'No description available.'}</p>

          <div className="mt-3 flex gap-2 items-center">
            <button onClick={onQuickView} className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Quick View</button>
            <Link href={`/manhwa/${item.id}`} className="px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700">Details</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ManhwaCard({ item, favorited, onToggleFav, onQuickView }: { item: Manhwa; favorited?: boolean; onToggleFav?: () => void; onQuickView?: () => void }) {
  const title = item.title.english || item.title.romaji || item.title.native

  return (
    <motion.article
      layout
      whileHover={{ scale: 1.02 }}
      className="relative bg-gray-900 rounded-xl overflow-hidden shadow-md group focus-within:ring-2 ring-blue-500"
      tabIndex={0}
      onKeyDown={(e) => handleKeyCard(e, item, onQuickView)}
      aria-label={`Preview ${title}`}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        {item.coverImage?.large ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.coverImage.large} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80" />

        {/* Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleFav && onToggleFav()
            }}
            aria-pressed={favorited}
            title={favorited ? 'Remove favorite' : 'Add favorite'}
            className="bg-black/40 p-2 rounded-full backdrop-blur-md hover:bg-black/30"
          >
            {favorited ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onQuickView && onQuickView()
            }}
            title="Quick view"
            className="bg-black/40 p-2 rounded-full backdrop-blur-md hover:bg-black/30"
          >
            <FaSearch />
          </button>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 w-full p-3">
          <h3 className="text-sm sm:text-base font-semibold text-white drop-shadow-md line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
            <span>{(item.averageScore ?? 0) > 0 ? `${Math.round((item.averageScore || 0) / 10)}/10` : '—'}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{item.status ?? 'Unknown'}</span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function handleKeyCard(e: React.KeyboardEvent, item: Manhwa, onQuickView?: () => void) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    onQuickView && onQuickView()
  }
}

function PreviewModal({ item, onClose, onToggleFav, favorited }: { item: Manhwa; onClose: () => void; onToggleFav?: () => void; favorited?: boolean }) {
  const title = item.title.english || item.title.romaji || item.title.native

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <motion.div
        initial={{ y: 20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.98 }}
        className="relative w-full max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-start gap-4 p-4">
          <div className="w-36 flex-shrink-0 rounded-lg overflow-hidden border border-black">
            {item.coverImage?.medium ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.coverImage.medium} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-800" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <div className="text-sm text-gray-300 mt-1">{item.genres?.slice(0, 4).join(' • ')}</div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={onToggleFav} className="px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700">
                  {favorited ? 'Favorited' : 'Favorite'}
                </button>
                <button onClick={onClose} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-300 max-h-48 overflow-auto space-y-2">
              <p dangerouslySetInnerHTML={{ __html: stripHtml(item.description || 'No description available.') }} />

              <div className="mt-2 text-xs text-gray-400 flex gap-4 flex-wrap">
                <div>Score: {(item.averageScore ?? 0) > 0 ? `${item.averageScore}` : '—'}</div>
                <div>Status: {item.status ?? '—'}</div>
                <div>Chapters: {item.chapters ?? '—'}</div>
                <div>Started: {item.startDate?.year ?? '—'}</div>
              </div>

              <div className="mt-3">
                <Link href={`/manhwa/${item.id}`} className="inline-block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Open full page</Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* --------------------- Helpers --------------------- */

function stripHtml(html: string) {
  // minimal sanitization for preview — you might want to use a library on server
  if (!html) return ''
  return html.replace(/<br\s*\/?>(\s*)/gi, '\n').replace(/<[^>]*>/g, '')
}
