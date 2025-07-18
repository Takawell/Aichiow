'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Anime } from '@/types/anime'

interface HeroSliderProps {
  animeList: Anime[]
}

export default function HeroSlider({ animeList }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % animeList.length)
  }

  const handlePrev = () => {
    setCurrent((prev) =>
      prev === 0 ? animeList.length - 1 : prev - 1
    )
  }

  const currentAnime = animeList[current]

  return (
    <div className="relative w-full h-[320px] md:h-[460px] rounded-2xl overflow-hidden shadow-xl">
      {/* Background */}
      <Image
        src={currentAnime.bannerImage || currentAnime.coverImage.large}
        alt={currentAnime.title.romaji}
        fill
        className="object-cover brightness-[0.3]"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

      {/* Content */}
      <motion.div
        key={currentAnime.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 z-20 flex flex-col justify-end px-5 py-6 md:px-12 md:py-10"
      >
        <div className="flex flex-wrap gap-2 mb-3">
          {currentAnime.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="bg-white/10 border border-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
            >
              {genre}
            </span>
          ))}
        </div>

        <h1 className="text-white text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-xl tracking-tight">
          {currentAnime.title.english || currentAnime.title.romaji}
        </h1>

        <p className="text-gray-200 text-sm md:text-base max-w-2xl line-clamp-3 mb-5 drop-shadow">
          {currentAnime.description?.replace(/<[^>]+>/g, '')}
        </p>

        <div className="flex items-center gap-4 text-white text-sm mb-6">
          {currentAnime.averageScore && (
            <span>⭐ {currentAnime.averageScore / 10}/10</span>
          )}
          {currentAnime.episodes && (
            <span>📺 {currentAnime.episodes} Episodes</span>
          )}
        </div>

        <Link
          href={`/anime/${currentAnime.id}`}
          className="bg-primary hover:bg-blue-600 transition-colors duration-300 px-6 py-3 rounded-full text-white text-sm font-medium shadow-lg"
        >
          Watch Now
        </Link>
      </motion.div>

      {/* Controls */}
      <div className="absolute inset-x-0 top-1/2 flex justify-between px-4 md:px-8 z-30">
        <button
          onClick={handlePrev}
          className="bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
        >
          ◀
        </button>
        <button
          onClick={handleNext}
          className="bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
        >
          ▶
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2 z-30">
        {animeList.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
