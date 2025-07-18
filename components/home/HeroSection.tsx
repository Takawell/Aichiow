'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Anime } from '@/types/anime'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface HeroSectionProps {
  anime?: Anime
  loading?: boolean
}

export default function HeroSection({ anime, loading }: HeroSectionProps) {
  const [loadingDetail, setLoadingDetail] = useState(false)

  if (loading || !anime) {
    return (
      <section className="w-full h-[320px] md:h-[460px] bg-neutral-900 rounded-lg shadow-inner overflow-hidden relative animate-pulse">
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
    <div className="relative w-full h-[320px] md:h-[460px] min-h-[280px] overflow-hidden rounded-lg shadow-xl group">
      {/* Background */}
      <Image
        src={anime.bannerImage || anime.coverImage.large}
        alt={anime.title.romaji}
        fill
        priority
        className="object-cover transition duration-1000 group-hover:scale-105 brightness-[.45]"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute z-20 bottom-5 md:bottom-10 px-5 md:px-12 w-full"
      >
        {/* Title */}
        <h1 className="text-white text-2xl md:text-5xl font-bold mb-1 drop-shadow-lg">
          {anime.title.english || anime.title.romaji}
        </h1>

        {/* Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-white mb-2">
          {anime.averageScore && (
            <span className="flex items-center gap-1">
              ⭐ {anime.averageScore / 10}/10
            </span>
          )}
          {anime.nextAiringEpisode?.episode && (
            <span className="flex items-center gap-1">
              📺 Ep {anime.nextAiringEpisode.episode}
            </span>
          )}
          {anime.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-full backdrop-blur-md"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-200 text-sm md:text-base max-w-2xl line-clamp-3 mb-3 drop-shadow">
          {anime.description?.replace(/<[^>]+>/g, '')}
        </p>

        {/* Button */}
        <button
          onClick={() => {
            setLoadingDetail(true)
            window.location.href = `/anime/${anime.id}`
          }}
          disabled={loadingDetail}
          className={`inline-block ${
            loadingDetail ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium text-sm px-6 py-2 rounded-full shadow-md transition-all duration-300`}
        >
          {loadingDetail ? 'Loading...' : '💘 DETAIL'}
        </button>
      </motion.div>
    </div>
  )
}
