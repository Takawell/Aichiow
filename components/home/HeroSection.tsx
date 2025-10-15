'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Anime } from '@/types/anime'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlay } from 'react-icons/fa'

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
          src={anime.bannerImage || anime.coverImage?.large}
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
            {anime.averageScore && <span>⭐ {anime.averageScore / 10}/10</span>}
            {anime.nextAiringEpisode?.episode && <span>📺 Ep {anime.nextAiringEpisode.episode}</span>}
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
              className={`px-6 py-2 rounded-full text-sm font-semibold text-white shadow-md transition-all ${
                loadingDetail ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loadingDetail ? 'Loading...' : '💓 DETAIL'}
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-600 transition shadow-md flex items-center gap-2"
            >
              <FaPlay className="text-sm" /> Preview
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
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-neutral-900/90 border border-white/10 rounded-2xl shadow-2xl max-w-5xl w-full relative overflow-hidden flex flex-col"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 flex-1 overflow-y-auto">
                <div className="relative h-72 md:h-full rounded-xl overflow-hidden">
                  <Image
                    src={anime.coverImage?.extraLarge || anime.coverImage?.large}
                    alt={anime.title.romaji}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{anime.title.english || anime.title.romaji}</h2>
                    <p className="text-sm text-gray-300 mb-3">
                      {anime.format} • {anime.status} • {anime.episodes || '?'} eps
                    </p>
                    <p className="text-gray-200 text-sm mb-4 max-h-48 overflow-y-auto pr-2">
                      {anime.description?.replace(/<[^>]+>/g, '')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
                    {anime.genres?.map((g) => (
                      <Link
                        key={g}
                        href={`/anime/genre/${encodeURIComponent(g.toLowerCase())}`}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-blue-600/40 transition"
                      >
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 p-4 bg-black/40 backdrop-blur-md">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-5 py-2 text-sm font-medium text-white bg-red-600/80 hover:bg-red-700 transition rounded-full"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false)
                    router.push(`/anime/${anime.id}`)
                  }}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition rounded-full"
                >
                  View Detail
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
