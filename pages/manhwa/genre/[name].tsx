import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import { useManhwaByGenre } from "@/hooks/useManhwaByGenre"
import { FaBookOpen, FaSpinner, FaSadTear } from "react-icons/fa"
import { motion } from "framer-motion"
import ManhwaCard from "@/components/manhwa/ManhwaCard"

export default function GenreManhwaPage() {
  const router = useRouter()
  const { name } = router.query
  const [visibleCount, setVisibleCount] = useState(12)

  const { manhwas, loading } = useManhwaByGenre(
    typeof name === "string" ? decodeURIComponent(name) : "",
    1
  )

  const genreName =
    typeof name === "string"
      ? decodeURIComponent(name)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())
      : ""

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12)
  }

  return (
    <>
      <Head>
        <title>{genreName} Manhwa — Aichiow</title>
      </Head>
      <main className="min-h-screen px-4 py-10 bg-gradient-to-b from-[#0a0f1a] via-[#0d1520] to-[#101826] text-white">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-10 tracking-wide flex items-center gap-3 drop-shadow-lg"
        >
          <FaBookOpen className="text-blue-500 animate-pulse drop-shadow-md" />
          <span>
            <span className="text-blue-400">{genreName}</span> Manhwa
          </span>
        </motion.h1>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center text-lg gap-2 animate-pulse">
            <FaSpinner className="animate-spin text-blue-400 text-xl" />
            Loading manhwa...
          </div>
        ) : manhwas.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-lg text-gray-400 flex flex-col items-center gap-2"
          >
            <FaSadTear className="text-3xl text-blue-400" />
            No manhwa found in this genre.
          </motion.div>
        ) : (
          <>
            {/* Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05 },
                },
              }}
            >
              {manhwas.slice(0, visibleCount).map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <ManhwaCard manhwa={item} />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More */}
            {visibleCount < manhwas.length && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-md text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
