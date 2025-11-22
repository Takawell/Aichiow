"use client"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { fetchGenres, getMangaByFilter } from "@/lib/mangadex"
import MangaGrid from "@/components/manga/MangaGrid"
import { motion } from "framer-motion"

export default function MangaByGenrePage() {
  const router = useRouter()
  const { name } = router.query

  const [mangaList, setMangaList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [genreName, setGenreName] = useState<string | null>(null)

  useEffect(() => {
    if (!name) return

    async function load() {
      setLoading(true)
      try {
        const genres = await fetchGenres()
        const matched = genres.find(
          (tag: any) =>
            tag.attributes.name.en.toLowerCase() === String(name).toLowerCase()
        )

        if (!matched) {
          console.warn("Genre not found:", name)
          setMangaList([])
          setGenreName(null)
          return
        }

        setGenreName(matched.attributes.name.en)

        const result = await getMangaByFilter({ includedTags: [matched.id] })
        setMangaList(result)
      } catch (err) {
        console.error("Failed to load manga by genre:", err)
        setMangaList([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [name])

  return (
    <main className="relative px-3 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6 text-white min-h-screen bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-gray-950 to-gray-950" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <section className="mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative bg-gray-900/60 backdrop-blur-md border border-sky-500/10 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl" />
              
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                  className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] sm:text-xs font-medium text-sky-400/80 tracking-wider uppercase">Genre</span>
                    <span className="w-1 h-1 rounded-full bg-sky-500/50" />
                    <span className="text-[10px] sm:text-xs text-gray-500">Collection</span>
                  </div>
                  
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize truncate">
                    {loading ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-gray-400">Loading</span>
                        <span className="flex gap-0.5">
                          <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      </span>
                    ) : genreName ? (
                      <span className="bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">{genreName}</span>
                    ) : (
                      <span className="text-gray-400">Not Found</span>
                    )}
                  </h1>

                  <p className="mt-1 text-xs sm:text-sm text-gray-400 line-clamp-1">
                    {loading
                      ? "Fetching manga..."
                      : genreName
                      ? `Explore ${mangaList.length} manga in this category`
                      : "Genre not available"}
                  </p>
                </div>

                {!loading && genreName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="hidden sm:flex items-center gap-2"
                  >
                    <span className="px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400 text-xs font-medium">
                      {mangaList.length} titles
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="relative aspect-[3/4] bg-gray-900/50 rounded-lg sm:rounded-xl overflow-hidden border border-gray-800/50"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 space-y-1.5">
                  <div className="h-2.5 sm:h-3 bg-gray-800/80 rounded w-4/5 animate-pulse" />
                  <div className="h-2 bg-gray-800/50 rounded w-3/5 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : mangaList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16 sm:py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-900/80 rounded-2xl mb-4 sm:mb-6 border border-sky-500/10"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">No manga found for this genre</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/manga")}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 rounded-lg sm:rounded-xl text-white text-sm font-medium shadow-lg shadow-sky-500/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Browse All
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.02 },
              },
            }}
          >
            <MangaGrid mangaList={mangaList} />
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 bg-gray-900/90 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-500/40 rounded-xl flex items-center justify-center text-sky-400 z-50 backdrop-blur-sm transition-all shadow-lg"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </div>
    </main>
  )
}
