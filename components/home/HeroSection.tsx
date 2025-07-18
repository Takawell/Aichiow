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
      <section className="w-full h-[320px] md:h-[460px] bg-neutral-800 animate-pulse flex items-center justify-center rounded-lg">
        <p className="text-gray-400">Loading hero anime...</p>
      </section>
    )
  }

  return (
    <div className="relative w-full h-[320px] md:h-[460px] min-h-[280px] overflow-hidden rounded-2xl shadow-xl group">
      {/* Background Image */}
      <Image
        src={anime.bannerImage || anime.coverImage.large}
        alt={anime.title.romaji}
        fill
        className="object-cover brightness-[0.3] transition duration-700 group-hover:scale-105"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 z-20 flex flex-col justify-end px-5 py-6 md:px-12 md:py-10"
      >
        {/* Genre Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {anime.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="bg-white/10 border border-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-white text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-xl tracking-tight">
          {anime.title.english || anime.title.romaji}
        </h1>

        {/* Description */}
        <p className="text-gray-200 text-sm md:text-base max-w-2xl line-clamp-3 mb-5 drop-shadow">
          {anime.description?.replace(/<[^>]+>/g, '')}
        </p>

        {/* Rating & Episodes */}
        <div className="flex items-center gap-4 text-white text-sm mb-6">
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

        {/* Watch Button */}
        <Link
          href={`/anime/${anime.id}`}
          className="bg-primary hover:bg-blue-600 transition-colors duration-300 px-6 py-3 rounded-full text-white text-sm font-medium shadow-lg"
        >
          Watch Now
        </Link>
      </motion.div>
    </div>
  )
}
