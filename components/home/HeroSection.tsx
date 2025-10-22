'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Anime } from '@/types/anime'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaStar, FaPlayCircle, FaEye } from 'react-icons/fa'

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
      <section className="w-full h-[320px] md:h-[460px] bg-neutral-900 rounded-lg shadow-inner overflow-hidden relative animate-pulse">
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
      <div className="relative w-full h-[320px] md:h-[460px] overflow-hidden rounded-lg shadow-xl group">
        <Image
          src={anime.bannerImage || anime.coverImage?.extraLarge || anime.coverImage?.large}
          alt={anime.title.romaji}
          fill
          priority
          className="object-cover transition duration-1000 group-hover:scale-105 brightness-[.45]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute z-20 bottom-5 md:bottom-10 px-5 md:px-12 w-full"
        >
          <h1 className="text-white text-2xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
            {anime.title.english || anime.title.romaji}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-white mb-3">
            {anime.averageScore && (
              <span className="flex items-center gap-1">
                <FaStar className="text-yellow-400" /> {anime.averageScore / 10}/10
              </span>
            )}
            {anime.nextAiringEpisode?.episode && (
              <span className="flex items-center gap-1">
                📺 Ep {anime.nextAiringEpisode.episode}
              </span>
            )}
            {anime.genres?.slice(0, 3).map((genre) => (
              <Link
                key={genre}
                href={`/anime/genre/${encodeURIComponent(genre.toLowerCase())}`}
                className="px-3 py-1 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-full backdrop-blur-md hover:bg-blue-600/40 transition"
              >
                {genre}
              </Link>
            ))}
          </div>

          <p className="text-gray-200 text-sm md:text-base max-w-2xl line-clamp-3 mb-4 drop-shadow">
            {anime.description?.replace(/<[^>]+>/g, '')}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setLoadingDetail(true)
                router.push(`/anime/${anime.id}`)
              }}
              disabled={loadingDetail}
              className={`px-6 py-2 rounded-full text-sm font-semibold text-white shadow-md transition-all flex items-center gap-2 ${
                loadingDetail ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loadingDetail ? (
                'Loading...'
              ) : (
                <>
                  <FaPlayCircle className="text-sm" /> Play
                </>
              )}
            </button>

            <button
              onClick={() => setShowPreview(true)}
              className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-600 transition shadow-md flex items-center gap-2"
            >
              <FaEye className="text-sm" /> Preview
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="relative bg-gradient-to-br from-[#0f0f10]/95 to-[#1a1a1d]/95 border border-white/10 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] w-full max-w-6xl overflow-hidden flex flex-col md:flex-row"
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.45 }}
                className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden group"
              >
                <Image
                  src={anime.coverImage?.extraLarge || anime.coverImage?.large}
                  alt={anime.title.romaji}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.18, duration: 0.45 }}
                className="flex flex-col justify-between w-full md:w-1/2 p-6 md:p-8 text-white"
              >
                <div>
                  <h2 className="text-2xl md:text-4xl font-extrabold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {anime.title.english || anime.title.romaji}
                  </h2>

                  <p className="text-gray-300 text-sm md:text-base mb-4 flex flex-wrap gap-3">
                    {anime.format && (
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs md:text-sm border border-white/10">
                        {anime.format}
                      </span>
                    )}
                    {anime.status && (
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs md:text-sm border border-white/10">
                        {anime.status}
                      </span>
                    )}
                    {anime.episodes && (
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs md:text-sm border border-white/10">
                        {anime.episodes} eps
                      </span>
                    )}
                  </p>

                  <div className="relative overflow-y-auto max-h-56 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                      {anime.description?.replace(/<[^>]+>/g, '') || 'No description available.'}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {anime.genres?.map((g, i) => (
                      <Link
                        key={i}
                        href={`/anime/genre/${encodeURIComponent(g.toLowerCase())}`}
                        className="px-3 py-1 rounded-full text-xs md:text-sm bg-white/10 border border-white/10 hover:bg-blue-600/40 transition"
                      >
                        {g}
                      </Link>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6 border-t border-white/10 pt-4 gap-3">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="w-1/2 py-2 bg-red-600/85 hover:bg-red-700 rounded-full text-sm font-semibold transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowPreview(false)
                        router.push(`/anime/${anime.id}`)
                      }}
                      className="w-1/2 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 rounded-full text-sm font-semibold transition-all"
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
