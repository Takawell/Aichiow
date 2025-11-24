'use client'

import { useEffect, useState } from 'react'
import { fetchPopularManga } from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFire, FaSearch, FaCheckCircle, FaTimesCircle, FaSpinner, FaStar } from 'react-icons/fa'
import Head from 'next/head'

export default function MangaLandingPage() {
  const [popular, setPopular] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [log, setLog] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      <Head>
        <title>Manga | Aichiow</title>
        <meta
          name="description"
          content="Discover the hottest manga with a full-featured reader."
        />
        <meta property="og:title" content="Manga | Aichiow" />
        <meta
          property="og:description"
          content="Discover the hottest manga with a full-featured reader."
        />
        <meta property="og:image" content="https://aichiow.vercel.app/logo.png" />
        <meta property="og:url" content="https://aichiow.vercel.app/manga" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Manga | Aichiow" />
        <meta
          name="twitter:description"
          content="Discover the hottest manga with a full-featured reader."
        />
        <meta
          name="twitter:image"
          content="https://aichiow.vercel.app/logo.png"
        />
      </Head>
      
      <main className="relative min-h-screen bg-black overflow-hidden">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.08),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.06),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.05),transparent_50%)] pointer-events-none"></div>
        
        <motion.div
          className="fixed inset-0 pointer-events-none z-0"
          animate={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14,165,233,0.06), transparent 40%)`
          }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
        />

        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-500 opacity-50 blur-sm"></div>
        <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            
            <section className="mb-12 sm:mb-16 lg:mb-20 text-center relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl"
              />

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 120 }}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-xs sm:text-sm font-semibold backdrop-blur-xl"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <FaStar className="text-sky-400 text-sm" />
                  </motion.div>
                  <span>Premium Reading Experience</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 
                    bg-gradient-to-b from-white via-sky-100 to-sky-400 text-transparent bg-clip-text
                    tracking-tighter leading-[0.9] drop-shadow-2xl"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  AICHIOW
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative inline-block mb-6 sm:mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 blur-xl"></div>
                  <h2 className="relative text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-sky-300/90 tracking-tight">
                    Manga Collection
                  </h2>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-gray-400 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto px-4 leading-relaxed font-light"
                >
                  Immerse yourself in an extraordinary world of manga. Experience seamless reading with our cutting-edge platform.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/manga/explore"
                    className="group relative inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-sky-500 to-cyan-500
                      hover:from-sky-400 hover:to-cyan-400 text-black px-6 sm:px-8 py-3 sm:py-4 
                      rounded-xl sm:rounded-2xl font-bold shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-[0_0_60px_rgba(14,165,233,0.5)]
                      transition-all duration-500 text-sm sm:text-base overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="relative z-10"
                    >
                      <FaSearch className="text-lg sm:text-xl" />
                    </motion.div>
                    <span className="relative z-10 tracking-wide">Explore Library</span>
                  </Link>
                </motion.div>
              </motion.div>
            </section>

            <AnimatePresence>
              {log && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 150 }}
                  className={`max-w-xl mx-auto mb-8 sm:mb-12 px-4 sm:px-6 py-3 sm:py-4 rounded-xl
                    flex items-center gap-3 text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-2xl
                    border relative overflow-hidden
                    ${
                      log.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-emerald-500/20'
                        : log.type === 'error'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-rose-500/20'
                        : 'bg-sky-500/10 text-sky-300 border-sky-500/30 shadow-sky-500/20'
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                  {log.type === 'success' && <FaCheckCircle className="relative z-10 flex-shrink-0 text-base sm:text-lg" />}
                  {log.type === 'error' && <FaTimesCircle className="relative z-10 flex-shrink-0 text-base sm:text-lg" />}
                  {log.type === 'loading' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FaSpinner className="relative z-10 flex-shrink-0 text-base sm:text-lg" />
                    </motion.div>
                  )}
                  <span className="relative z-10 flex-1">{log.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <section>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl blur-lg opacity-50"></div>
                    <div className="relative p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl shadow-xl">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FaFire className="text-white text-xl sm:text-2xl" />
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter mb-0.5">
                      Most Followed
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm font-light">Trending manga this week</p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.4 }}
                      className="group relative aspect-[3/4] bg-gradient-to-br from-sky-950/30 via-black to-black rounded-lg sm:rounded-xl overflow-hidden border border-sky-500/10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      <motion.div
                        animate={{ 
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 0.5
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/20 to-transparent"
                      />
                      <div className="absolute top-2 right-2 w-6 h-6 bg-sky-500/20 rounded-full animate-pulse"></div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ) : (
              <section>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl blur-lg opacity-50"
                    ></motion.div>
                    <div className="relative p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl shadow-xl">
                      <FaFire className="text-white text-xl sm:text-2xl" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter mb-0.5">
                      Most Followed
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm font-light">Trending manga this week</p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <MangaGrid mangaList={popular} />
                </motion.div>
              </section>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent"></div>
      </main>
    </>
  )
}
