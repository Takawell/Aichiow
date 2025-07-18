'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Anime } from '@/types/anime'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  anime?: Anime
  loading?: boolean
}

export default function HeroSection({ anime, loading }: HeroSectionProps) {
  if (loading || !anime) {
    return (
      <section className="w-full h-[320px] md:h-[500px] bg-neutral-900 animate-pulse flex items-center justify-center rounded-2xl shadow-inner">
        <p className="text-gray-400">Loading hero anime...</p>
      </section>
    )
  }

  return (
    <div className="relative w-full h-[320px] md:h-[500px] rounded-2xl overflow-hidden group shadow-2xl">
      {/* Background */}
      <Image
        src={anime.bannerImage || anime.coverImage.large}
        alt={anime.title.romaji}
        fill
        priority
        className="object-cover transition duration-1000 group-hover:scale-105"
      />

      {/* Light Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute z-20 bottom-6 md:bottom-10 px-6 md:px-14 w-full"
      >
        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2">
          {anime.title.english || anime.title.romaji}
        </h1>

        {/* Info + Genres in same row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-white mb-5">
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
          {/* Genres beside info */}
          {anime.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-full backdrop-blur-md"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Watch Button */}
        <Link
          href={`/anime/${anime.id}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded-full shadow-lg transition-all duration-300"
        >
          🚀 Watch Now
        </Link>
      </motion.div>
    </div>
  )
}
