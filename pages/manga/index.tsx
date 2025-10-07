'use client'

import { useEffect, useState } from 'react'
import { fetchPopularManga } from '@/lib/mangadex'
import MangaSelection from '@/components/manga/MangaSection'
import MangaGrid from '@/components/manga/MangaGrid'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Head from 'next/head'
import {
  FaFire,
  FaSearch,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'

export default function MangaLandingPage() {
  const [popular, setPopular] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [log, setLog] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLog({ type: 'loading', message: 'Loading manga list...' })
        const res = await fetchPopularManga()
        setPopular(res)
        setLog({ type: 'success', message: 'Popular manga loaded!' })
      } catch (err: any) {
        console.error(err)
        setLog({ type: 'error', message: `Failed: ${err.message}` })
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
        <meta name="description" content="Discover the hottest manga with a full-featured reader." />
        <meta property="og:title" content="Manga | Aichiow" />
        <meta property="og:description" content="Discover the hottest manga with a full-featured reader." />
        <meta property="og:image" content="https://aichiow.vercel.app/logo.png" />
      </Head>

      <main className="px-4 md:px-10 py-10 text-white relative">
       <MangaSection title="Featured Manga" mangas={popular.slice(0, 8)} icon="🔥" />

        <motion.div
          className="text-center mt-10 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/manga/explore"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-sky-600
            px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-blue-600/40 hover:scale-105
            active:scale-95 transition-all"
          >
            <FaSearch /> Explore More
          </Link>
        </motion.div>

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

        <section>
          <div className="flex items-center gap-2 mb-6">
            <FaFire className="text-red-500 text-xl" />
            <h2 className="text-2xl font-bold">Most Followed</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-48 bg-neutral-800/60 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <MangaGrid mangaList={popular} />
          )}
        </section>
      </main>
    </>
  )
}
