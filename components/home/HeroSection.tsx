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
      {/* Background Image */}
      <Image
        src={anime.bannerImage || anime.coverImage.large}
        alt={anime.title.romaji}
        fill
        priority
        className="object-cover transition duration-1000 group-hover:scale-105 brightness-[0.25]"
      />

      {/* Gradient & Blur Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 z-10 backdrop-blur-sm" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute z-20 bottom-0 px-6 py-8 md:px-14 md:py-12 w-full"
      >
        {/* Genres */}
        <div className="flex gap-2 flex-wrap mb-4">
          {anime.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-full backdrop-blur-md"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-3">
          {anime.title.english || anime.title.romaji}
        </h1>

        {/* Description */}
        <p className="text-gray-200 max-w-2xl text-sm md:text-base mb-5 line-clamp-3 drop-shadow">
          {anime.description?.replace(/<[^>]+>/g, '')}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-white mb-6">
          {anime.averageScore && (
            <span className="flex items-center gap-1">
              ⭐ {anime.averageScore / 10}/10
            </span>
          )}
          {anime.episodes && (
            <span className="flex items-center gap-1">
              📺 {anime.episodes} Episodes
            </span>
          )}
        </div>

        {/* Watch Now Button */}
        <Link
          href={`/anime/${anime.id}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-3 rounded-full shadow-lg transition-all duration-300"
        >
          DETAIL
        </Link>
      </motion.div>
    </div>
  )
}
