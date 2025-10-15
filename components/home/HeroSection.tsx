'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Anime } from '@/types/anime'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlay, FaStar } from 'react-icons/fa'

interface HeroSectionProps {
  anime?: Anime
  loading?: boolean
}

export default function HeroSection({ anime, loading }: HeroSectionProps) {
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoadingDetail(false)
  }, [])

  if (loading || !anime) {
    return (
      <section className="w-full h-[340px] md:h-[480px] bg-neutral-900 rounded-3xl shadow-inner overflow-hidden relative animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-[pulse_2s_infinite]" />
        <div className="flex items-center justify-center h-full z-10 relative">
          <svg
            className="animate-spin h-10 w-10 text-white/70"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      </section>
    )
  }

  return (
    <>
      <div className="relative w-full h-[340px] md:h-[480px] overflow-hidden rounded-3xl shadow-2xl group">
        <Image
          src={anime.bannerImage || anime.coverImage?.extraLarge || anime.coverImage?.large}
          alt={anime.title.romaji}
          fill
          priority
          className="object-cover transition-all duration-[1800ms] group-hover:scale-110 brightness-[.45]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="absolute z-20 bottom-6 md:bottom-12 px-6 md:px-16 w-full"
        >
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-white text-3xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
              {anime.title.english || anime.title.romaji}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
              {anime.averageScore && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <FaStar className="text-yellow-400" /> {anime.averageScore / 10}/10
                </span>
              )}
              {anime.nextAiringEpisode?.episode && (
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs border border-white/10 backdrop-blur-md">
                  Ep {anime.nextAiringEpisode.episode}
                </span>
              )}
              {anime.genres?.slice(0, 3).map((genre) => (
                <Link
                  key={genre}
                  href={`/anime/genre/${encodeURIComponent(genre.toLowerCase())}`}
                  className="px-3 py-1 text-xs font-medium text-white/90 bg-white/10 border border-white/20 rounded-full backdrop-blur-md hover:bg-blue-600/50 hover:text-white transition-all"
                >
                  {genre}
                </Link>
              ))}
            </div>

            <p className="text-gray-200 text-sm md:text-base max-w-2xl line-clamp-3 md:line-clamp-4 leading-relaxed drop-shadow">
              {anime.description?.replace(/<[^>]+>/g, '')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setLoadingDetail(true)
                  router.push(`/anime/${anime.id}`)
                }}
                disabled={loadingDetail}
                className={`px-8 py-3 rounded-full text-sm md:text-base font-semibold text-white shadow-lg transition-all ${
                  loadingDetail
                    ? 'bg-blue-400 cursor-wait'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500'
                }`}
              >
                {loadingDetail ? 'Loading...' : '💓 View Detail'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreview(true)}
                className="px-8 py-3 rounded-full text-sm md:text-base font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-500 hover:to-blue-600 transition shadow-lg flex items-center justify-center gap-2"
              >
                <FaPlay className="text-sm" /> Preview
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-pink-500 opacity-70" />
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border border-white/10 rounded-3xl shadow-2xl w-full max-w-5xl relative overflow-hidden flex flex-col"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10 flex-1 overflow-y-auto custom-scroll">
                <div className="relative h-72 md:h-full rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={anime.coverImage?.extraLarge || anime.coverImage?.large}
                    alt={anime.title.romaji}
                    fill
                    className="object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="flex flex-col justify-between">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                      {anime.title.english || anime.title.romaji}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-300">
                      {anime.format && (
                        <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                          {anime.format}
                        </span>
                      )}
                      {anime.status && (
                        <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                          {anime.status}
                        </span>
                      )}
                      {anime.episodes && (
                        <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                          {anime.episodes} eps
                        </span>
                      )}
                    </div>

                    <p className="text-gray-300 text-sm md:text-base max-h-56 overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      {anime.description?.replace(/<[^>]+>/g, '')}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-5">
                    {anime.genres?.map((g) => (
                      <Link
                        key={g}
                        href={`/anime/genre/${encodeURIComponent(g.toLowerCase())}`}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-blue-600/40 transition text-xs md:text-sm text-white/90"
                      >
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 p-4 md:p-6 bg-black/40 backdrop-blur-md gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPreview(false)}
                  className="px-8 py-3 text-sm md:text-base font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-rose-500 transition rounded-full shadow-md w-full md:w-auto text-center"
                >
                  Close
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowPreview(false)
                    router.push(`/anime/${anime.id}`)
                  }}
                  className="px-8 py-3 text-sm md:text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 transition rounded-full shadow-md w-full md:w-auto text-center"
                >
                  View Detail
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
