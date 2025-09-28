import Head from 'next/head'
import { useAnimeByGenre } from '@/hooks/useAnimeByGenre'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FaFilm, FaSpinner, FaSadTear } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function GenreAnimePage() {
  const { anime, loading } = useAnimeByGenre()
  const router = useRouter()
  const { name } = router.query
  const [visibleCount, setVisibleCount] = useState(12)

  const genreName = typeof name === 'string'
    ? decodeURIComponent(name)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : ''

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12)
  }

  return (
    <>
      <Head>
        <title>{genreName} Anime — Aichiow</title>
      </Head>
      <main className="min-h-screen px-4 py-10 bg-gradient-to-b from-[#0f0f0f] via-[#121212] to-[#1a1a1a] text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-10 tracking-wide flex items-center gap-3 drop-shadow-lg"
        >
          <FaFilm className="text-blue-500 animate-pulse" />
          <span>
            <span className="text-blue-400">{genreName}</span> Anime
          </span>
        </motion.h1>

        {loading ? (
          <div className="flex justify-center items-center text-lg gap-2 animate-pulse">
            <FaSpinner className="animate-spin text-blue-400 text-xl" />
            Loading anime...
          </div>
        ) : anime.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-lg text-gray-400 flex flex-col items-center gap-2"
          >
            <FaSadTear className="text-3xl text-blue-400" />
            No anime found in this genre.
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {anime.slice(0, visibleCount).map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Link
                    href={`/anime/${item.id}`}
                    className="group transition-all duration-300 hover:scale-[1.05]"
                  >
                    <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-md group-hover:shadow-blue-500/30 group-hover:border-blue-500/30 transition-all">
                      <Image
                        src={item.coverImage.large}
                        alt={item.title.english || item.title.romaji}
                        fill
                        className="object-cover group-hover:brightness-110 group-hover:saturate-150 transition"
                      />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-center line-clamp-2 group-hover:text-blue-400 transition">
                      {item.title.english || item.title.romaji}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {visibleCount < anime.length && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-md text-white font-semibold shadow-lg"
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
