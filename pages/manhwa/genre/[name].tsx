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

  const handleLoadMore = () => setVisibleCount((prev) => prev + 12)

  return (
    <>
      <Head>
        <title>{genreName} Manhwa — Aichiow</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#050810] via-[#0a0f1a] to-[#0e1729] px-4 py-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center gap-3 mb-3">
            <FaBookOpen className="text-blue-500 text-3xl drop-shadow-lg animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              {genreName} Manhwa
            </h1>
          </div>
          <p className="text-gray-400 text-sm md:text-base tracking-wide">
            Explore the best <span className="text-blue-400 font-semibold">{genreName}</span> manhwa collection from Aichiow.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center text-lg gap-3 py-20">
            <FaSpinner className="animate-spin text-blue-400 text-2xl" />
            <span className="text-gray-300">Loading manhwa...</span>
          </div>
        ) : manhwas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center justify-center py-24 text-gray-400"
          >
            <FaSadTear className="text-4xl text-blue-500 mb-3" />
            <p className="text-lg">No manhwa found in this genre.</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 sm:gap-6 md:gap-8"
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
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <ManhwaCard manhwa={item} />
                </motion.div>
              ))}
            </motion.div>

            {visibleCount < manhwas.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-12 flex justify-center"
              >
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all duration-300"
                >
                  Load More
                </button>
              </motion.div>
            )}
          </>
        )}
      </main>
    </>
  )
}
