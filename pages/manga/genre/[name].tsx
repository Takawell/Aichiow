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
    <main className="relative px-4 md:px-8 lg:px-12 py-8 text-white min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sky-400/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[150px]" />
      
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2387CEEB' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

      <div className="relative z-10">
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-r from-gray-900/90 via-gray-900/95 to-gray-900/90 backdrop-blur-xl border border-sky-500/20 p-8 md:p-10 rounded-3xl shadow-2xl shadow-sky-500/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl" />
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-1.5 h-10 bg-gradient-to-b from-sky-400 to-sky-600 rounded-full" />
                <span className="text-sky-400 text-sm font-medium tracking-widest uppercase">Manga Collection</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black capitalize flex flex-wrap items-center gap-3 md:gap-4">
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl shadow-lg shadow-sky-500/30"
                >
                  <svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </motion.span>
                <span className="text-white">Genre:</span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 bg-clip-text text-transparent"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-3 h-3 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-3 h-3 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  ) : genreName || "Not Found"}
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-5 text-gray-300 text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed"
              >
                {loading
                  ? "Fetching the best manga for you..."
                  : genreName
                  ? `Explore the best manga tagged under ${genreName}.`
                  : "We couldn't find this genre, try exploring others!"}
              </motion.p>

              {!loading && genreName && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-6 flex flex-wrap gap-3"
                >
                  <span className="px-4 py-2 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-sm font-medium">
                    {mangaList.length} Manga Found
                  </span>
                  <span className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-full text-gray-400 text-sm">
                    Updated Daily
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/20 to-sky-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-64 md:h-72 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl overflow-hidden border border-gray-700/30">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <div className="h-4 bg-gray-700/50 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-700/30 rounded-lg w-1/2 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : mangaList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 md:py-32"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full mb-8 border border-sky-500/20"
            >
              <svg className="w-12 h-12 md:w-16 md:h-16 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-xl md:text-2xl mb-8"
            >
              No manga found for this genre.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/manga")}
              className="relative group px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-600 transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Browse All Manga
              </span>
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
                transition: { staggerChildren: 0.03 },
              },
            }}
          >
            <MangaGrid mangaList={mangaList} />
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full shadow-lg shadow-sky-500/30 flex items-center justify-center text-white z-50 border border-sky-400/30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </div>
    </main>
  )
}
