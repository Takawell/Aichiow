'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Manhwa } from '@/types/manhwa'
import { FaStar, FaTimes, FaBookOpen, FaEye } from 'react-icons/fa'

interface HeroProps {
  manhwa?: Manhwa
  loading?: boolean
}

export default function ManhwaHeroSection({ manhwa, loading }: HeroProps) {
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  if (loading || !manhwa) {
    return (
      <section className="w-full h-[320px] md:h-[460px] bg-neutral-900 rounded-2xl shadow-inner overflow-hidden relative animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-[pulse_2s_infinite]" />
      </section>
    )
  }

  return (
    <section className="relative w-full h-[360px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl group">
      <Image
        src={manhwa.bannerImage || manhwa.coverImage.large}
        alt={manhwa.title.romaji}
        fill
        priority
        className="object-cover brightness-[.45] transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

      <div className="absolute z-20 bottom-6 md:bottom-12 left-0 w-full px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-3 md:space-y-4 max-w-3xl"
        >
          <h1 className="text-white text-2xl md:text-5xl font-extrabold drop-shadow-lg line-clamp-2">
            {manhwa.title.english || manhwa.title.romaji}
          </h1>

          <div className="flex flex-wrap gap-3 text-sm text-gray-200 items-center">
            {manhwa.averageScore && (
              <span className="flex items-center gap-1">
                <FaStar className="text-yellow-400" /> {manhwa.averageScore / 10}/10
              </span>
            )}
            <span className="hidden sm:inline">📖 Manhwa</span>
            {manhwa.genres?.slice(0, 3).map((genre) => (
              <span
                key={genre}
                onClick={() =>
                  router.push(
                    `/manhwa/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`
                  )
                }
                className="px-3 py-1 text-xs bg-white/10 border border-white/20 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/20 transition"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="text-gray-300 text-sm md:text-base line-clamp-3 md:line-clamp-2">
            {manhwa.description?.replace(/<[^>]+>/g, '')}
          </p>

          <div className="flex gap-3 pt-2 flex-wrap">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLoadingDetail(true)
                router.push(`/manhwa/${manhwa.id}`)
              }}
              disabled={loadingDetail}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold shadow-lg text-white transition-all duration-300 ${
                loadingDetail
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <FaBookOpen /> {loadingDetail ? 'Loading...' : 'Read'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-6 py-2 rounded-full font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition"
            >
              <FaEye /> Preview
            </motion.button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              className="relative w-full max-w-md md:max-w-2xl bg-neutral-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-3 right-3 text-white/80 hover:text-white transition"
              >
                <FaTimes size={20} />
              </button>

              <div className="relative h-48 md:h-64 w-full overflow-hidden">
                <Image
                  src={manhwa.coverImage.extraLarge || manhwa.coverImage.large}
                  alt={manhwa.title.romaji}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              <div className="p-5 md:p-7 space-y-3">
                <h2 className="text-2xl font-bold text-white">
                  {manhwa.title.english || manhwa.title.romaji}
                </h2>

                <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                  {manhwa.averageScore && (
                    <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                      <FaStar className="text-yellow-400" /> {manhwa.averageScore / 10}/10
                    </span>
                  )}
                  {manhwa.status && (
                    <span className="bg-white/10 px-3 py-1 rounded-full">
                      {manhwa.status}
                    </span>
                  )}
                  {manhwa.genres?.slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <p className="text-gray-300 text-sm md:text-base leading-relaxed max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pr-2">
                  {manhwa.description?.replace(/<[^>]+>/g, '')}
                </p>

                <div className="flex justify-end gap-3 pt-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowPreview(false)
                      setLoadingDetail(true)
                      router.push(`/manhwa/${manhwa.id}`)
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                  >
                    <FaBookOpen /> Read Now
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPreview(false)}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition"
                  >
                    <FaTimes /> Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
