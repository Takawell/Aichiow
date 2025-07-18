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
      <section className="w-full h-[320px] md:h-[460px] bg-neutral-900 animate-pulse flex items-center justify-center rounded-lg shadow-inner">
        <p className="text-gray-400">Loading hero anime...</p>
      </section>
    )
  }

  return (
    <div className="relative w-full h-[460px] min-h-[280px] overflow-hidden rounded-lg shadow-xl group">
      {/* Background */}
      <Image
        src={anime.bannerImage || anime.coverImage.large}
        alt={anime.title.romaji}
        fill
        priority
        className="object-cover transition duration-1000 group-hover:scale-105 brightness-[.45]"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute z-20 bottom-4 md:bottom-6 px-5 md:px-12 w-full"
      >
        {/* Title */}
        <h1 className="text-white text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
          {anime.title.english || anime.title.romaji}
        </h1>

        {/* Info row: rating, episode, genres */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-white mb-3">
          {anime.averageScore && (
            <span className="flex items-center gap-1">
              ⭐ {anime.averageScore / 10}/10
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
        <p className="text-gray-200 text-sm md:text-base max-w-3xl line-clamp-3 mb-4 drop-shadow">
          {anime.description?.replace(/<[^>]+>/g, '')}
        </p>

        {/* Button */}
        <Link
          href={`/anime/${anime.id}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded-full shadow-md transition-all duration-300"
        >
          💘 DETAIL
        </Link>
      </motion.div>
    </div>
  )
}
