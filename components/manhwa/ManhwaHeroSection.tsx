'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Manhwa } from '@/types/manhwa'
import { FaStar, FaHeart } from 'react-icons/fa'

interface HeroProps {
  manhwa?: Manhwa
  loading?: boolean
}

export default function ManhwaHeroSection({ manhwa, loading }: HeroProps) {
  const [loadingDetail, setLoadingDetail] = useState(false)
  const router = useRouter()

  if (loading || !manhwa) {
    return (
      <section className="w-full h-[320px] md:h-[460px] bg-neutral-900 rounded-2xl shadow-inner overflow-hidden relative animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-[pulse_2s_infinite]" />
        <div className="flex items-center justify-center h-full z-10 relative">
          <svg
            className="animate-spin h-10 w-10 text-white/70"
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-[360px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
    >
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src={manhwa.bannerImage || manhwa.coverImage.large}
          alt={manhwa.title.romaji}
          fill
          priority
          className="object-cover brightness-[.45] transition-all duration-700"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute bottom-5 md:bottom-10 left-1/2 -translate-x-1/2 w-[92%] sm:w-[85%] md:w-[70%] lg:w-[60%] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-7 z-20 hover:bg-white/15 transition-all"
      >
        <div className="flex flex-col md:flex-row gap-5 items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-28 h-40 rounded-xl overflow-hidden shadow-lg flex-shrink-0"
          >
            <Image
              src={manhwa.coverImage.large}
              alt={manhwa.title.romaji}
              fill
              className="object-cover"
            />
          </motion.div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-white text-xl md:text-3xl font-bold line-clamp-1 drop-shadow-lg">
              {manhwa.title.english || manhwa.title.romaji}
            </h1>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-white/90 text-sm">
              {manhwa.averageScore && (
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <FaStar className="text-yellow-400" /> {manhwa.averageScore / 10}/10
                </span>
              )}
              {manhwa.genres?.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  onClick={() =>
                    router.push(`/manhwa/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`)
                  }
                  className="px-3 py-1 text-xs font-medium bg-white/10 border border-white/20 rounded-full cursor-pointer hover:bg-white/20 transition"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-gray-200 text-sm md:text-base line-clamp-3 md:line-clamp-2 drop-shadow">
              {manhwa.description?.replace(/<[^>]+>/g, '')}
            </p>

            <div className="flex justify-center md:justify-start gap-3 pt-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setLoadingDetail(true)
                  router.push(`/manhwa/${manhwa.id}`)
                }}
                disabled={loadingDetail}
                className={`px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 ${
                  loadingDetail
                    ? 'bg-blue-400 cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loadingDetail ? 'Loading...' : '💘 View Detail'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm border border-white/20"
              >
                <FaHeart />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
