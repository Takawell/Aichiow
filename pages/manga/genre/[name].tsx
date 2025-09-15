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
    <main className="px-4 md:px-8 py-8 text-white min-h-screen">
      {/* Hero Section */}
      <section className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold capitalize flex items-center gap-2">
            <span className="text-pink-400">📚</span> Genre:{" "}
            {loading ? "Loading..." : genreName || "Not Found"}
          </h1>
          <p className="mt-2 text-zinc-300 text-sm md:text-base">
            {loading
               ? "Fetching the best manga for you..."
               : genreName
               ? `Explore the best manga tagged under ${genreName}.`
               : "We couldn’t find this genre, try exploring others!"}
            </p>
        </motion.div>
      </section>

      {/* Content Section */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-zinc-800/50 rounded-xl shadow-md"
            ></div>
          ))}
        </div>
      ) : mangaList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-zinc-400 text-lg">
            😢 No manga found for this genre.
          </p>
          <button
            onClick={() => router.push("/manga")}
            className="mt-4 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 transition"
          >
            Browse All Manga
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          <MangaGrid mangaList={mangaList} />
        </motion.div>
      )}
    </main>
  )
}
