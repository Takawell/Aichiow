'use client'

import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useExploreAnime } from '@/hooks/useExploreAnime'
import { useSearchAnime } from '@/hooks/useSearchAnime'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'
import GenreFilter from '@/components/shared/GenreFilter'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaArrowDown, FaSpinner } from 'react-icons/fa'
import { LuScanLine } from 'react-icons/lu'
import { searchAnimeByFile } from '@/lib/traceMoe'

export default function ExplorePage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')
  const [scanOpen, setScanOpen] = useState(false)
  const [scanResults, setScanResults] = useState<any[]>([])
  const [scanLoading, setScanLoading] = useState(false)
  const { anime: exploreAnime, isLoading, loadMore, hasMore } = useExploreAnime()
  const { anime: searchAnime, isLoading: searchLoading } = useSearchAnime(query)
  const animeData = query ? searchAnime : exploreAnime
  const filtered = selectedGenre ? animeData.filter((a) => a.genres.includes(selectedGenre)) : animeData

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
              className="w-full pl-11 pr-12 py-3 bg-neutral-900/80 text-white rounded-lg border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 backdrop-blur-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-8"
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
            You've reached the end of the list.
          </motion.p>
        )}

        <AnimatePresence>
          {scanOpen && (
            <ScanOverlay
              onClose={() => setScanOpen(false)}
              onFileChange={handleFileUpload}
              loading={scanLoading}
              results={scanResults}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

type ScanOverlayProps = {
  onClose: () => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  loading: boolean
  results: any[]
}

function VisualBeam({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.08, scaleY: 0.6 }}
      animate={{ opacity: [0.08, 0.22, 0.08], scaleY: [0.6, 1.02, 0.6] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute inset-x-0 h-1/2 top-1/4 pointer-events-none ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 transform-gpu overflow-hidden">
        <div className="absolute left-[-40%] w-[180%] h-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent blur-xl opacity-80 animate-[beamShift_6s_linear_infinite]"></div>
        <div className="absolute left-0 w-full h-1/2 top-1/4 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent mix-blend-screen" />
      </div>
      <style jsx>{`
        @keyframes beamShift {
          0% { transform: translateX(-10%); }
          50% { transform: translateX(10%); }
          100% { transform: translateX(-10%); }
        }
      `}</style>
    </motion.div>
  )
}

function NoiseLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-10"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.01) 1px)',
        animation: 'noiseAnim 8s steps(10) infinite',
      }}
    >
      <style>{`
        @keyframes noiseAnim {
          0% { transform: translateY(0); }
          50% { transform: translateY(1px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function ScanResultCard({ r }: { r: any }) {
  const similarity = typeof r.similarity === 'number' ? (r.similarity * 100).toFixed(1) : '0.0'
  const title = r.title?.romaji || r.title?.english || 'Unknown Title'
  const episode = r.episode ?? '?'
  return (
    <motion.div
      className="relative p-4 rounded-2xl bg-white/5 border border-white/8 hover:border-blue-400/30 transition-all duration-250 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.25)]"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="overflow-hidden rounded-xl bg-black/40 border border-white/6">
        {r.video ? (
          <video src={r.video} className="w-full rounded-t-xl max-h-44 object-cover" controls autoPlay muted loop />
        ) : (
          <div className="h-36 w-full flex items-center justify-center text-neutral-400 text-sm">No preview</div>
        )}
      </div>
      <div className="mt-3">
        <p className="font-semibold text-white text-sm truncate">{title}</p>
        <p className="text-xs text-neutral-400 mt-1">Episode {episode} · Accuracy {similarity}%</p>
        {r.anilist && (
          <Link href={`/anime/${r.anilist}`} className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-xs font-medium transition-all">
            → View Anime Detail
          </Link>
        )}
      </div>
    </motion.div>
  )
}

function ScanOverlay({ onClose, onFileChange, loading, results }: ScanOverlayProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    setTimeout(() => closeBtnRef.current?.focus(), 80)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 backdrop-blur-xl" />
      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative w-[95%] max-w-3xl mt-10 mb-10"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="relative rounded-3xl overflow-hidden border border-white/6 shadow-[0_30px_80px_-30px_rgba(2,6,23,0.8)]">
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-500/10 via-cyan-400/8 to-purple-500/6 blur-xl opacity-80 animate-[pulseBorder_6s_ease-in-out_infinite]" />
          <style>{`
            @keyframes pulseBorder {
              0% { opacity: 0.35; transform: rotate(0.01deg) }
              50% { opacity: 0.65; transform: rotate(-0.01deg) }
              100% { opacity: 0.35; transform: rotate(0.01deg) }
            }
          `}</style>
          <div className="relative bg-gradient-to-b from-[#0f1113]/80 to-[#070809]/80 backdrop-blur-md border border-white/8 rounded-3xl p-7">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[60%] h-36 rounded-full bg-gradient-to-t from-blue-500/6 to-transparent pointer-events-none blur-3xl" />
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="absolute right-5 top-5 text-neutral-400 hover:text-white transition text-2xl z-20"
              aria-label="Close scan modal"
            >
              ✕
            </button>
            <div className="relative z-10 text-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                🔎 Search Engine
              </h2>
              <p className="text-sm text-neutral-400 mt-1">Upload a screenshot to detect the anime instantly</p>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="file-upload"
                  className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-blue-500/25 hover:border-blue-500/50 transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <LuScanLine className="text-2xl text-blue-400" />
                    <div className="text-left">
                      <p className="text-sm text-neutral-100 font-medium">Choose Image</p>
                      <p className="text-xs text-neutral-400">Or drag & drop a screenshot</p>
                    </div>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="mt-3 text-xs text-neutral-500">Supported: JPG, PNG, WebP — max 10MB</div>
                </label>
              </div>
              <div className="w-full md:w-64 flex flex-col items-center md:items-end gap-3">
                <div className="flex items-center gap-2">
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-blue-400" />
                      <span className="text-sm text-neutral-300">Analyzing your image...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                      <span className="text-sm text-neutral-300">Ready to scan</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-neutral-400 bg-white/3 px-3 py-2 rounded-md">Tip: crop the character face for better accuracy.</div>
              </div>
            </div>
            <div className="relative mt-6 z-10">
              <VisualBeam />
              <NoiseLayer />
              <div className="mt-4">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-4xl text-blue-400 mb-3" />
                    <p className="text-sm text-neutral-400">Analyzing your image...</p>
                  </div>
                )}
                {!loading && results.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[56vh] overflow-y-auto pr-2">
                    {results.map((r, i) => (
                      <ScanResultCard key={i} r={r} />
                    ))}
                  </div>
                )}
                {!loading && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-neutral-500 text-sm">
                    <p>No results yet. Upload an image above to start scanning.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
