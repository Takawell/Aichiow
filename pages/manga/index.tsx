'use client'

import { useEffect, useState } from 'react'
import { fetchPopularManga } from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFire, FaSearch, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa'

export default function MangaLandingPage() {
  const [popular, setPopular] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [log, setLog] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLog({ type: 'loading', message: 'Loading manga list...' })
        const popularRes = await fetchPopularManga()
        setPopular(popularRes)
        setLog({ type: 'success', message: 'Popular manga loaded successfully!' })
      } catch (err: any) {
        console.error('[Manga Landing] Error:', err)
        setLog({ type: 'error', message: `Failed to load: ${err.message}` })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <>
      <Head>
        <title>Manga | Aichiow</title>
        <meta
          name="description"
          content="Discover the hottest manga with a full-featured reader — right at your fingertips."
        />
      </Head>
      
    <main className="px-4 md:px-8 py-10 text-white">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-4 
            bg-gradient-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text"
        >
          Welcome to Aichiow Manga
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-zinc-400 mb-6 max-w-xl mx-auto"
        >
          Discover the hottest manga with a full-featured reader — right at your fingertips.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            href="/manga/explore"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
              text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition"
          >
            <FaSearch /> Explore Manga
          </Link>
        </motion.div>
      </section>

      {/* Debug / Status Log */}
      <AnimatePresence>
        {log && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`max-w-lg mx-auto mb-8 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg
              ${
                log.type === 'success'
                  ? 'bg-green-600/20 text-green-400 border border-green-600/50'
                  : log.type === 'error'
                  ? 'bg-red-600/20 text-red-400 border border-red-600/50'
                  : 'bg-blue-600/20 text-blue-400 border border-blue-600/50'
              }`}
          >
            {log.type === 'success' && <FaCheckCircle />}
            {log.type === 'error' && <FaTimesCircle />}
            {log.type === 'loading' && <FaSpinner className="animate-spin" />}
            <span>{log.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manga Section */}
      {loading ? (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <FaFire className="text-red-500 text-xl animate-pulse" />
            <h2 className="text-2xl font-bold">Most Followed</h2>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-neutral-800/60 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <FaFire className="text-red-500 text-xl" />
            <h2 className="text-2xl font-bold">Most Followed</h2>
          </div>
          <MangaGrid mangaList={popular} />
        </section>
      )}
    </main>
  )
}
