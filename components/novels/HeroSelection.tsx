'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LightNovel } from '@/types/lightNovel'
import { useEffect, useState } from 'react'

interface HeroSelectionProps {
  novels: LightNovel[]
}

export default function HeroSelection({ novels }: HeroSelectionProps) {
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    if (novels.length > 0) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % novels.length)
      }, 7000)
      return () => clearInterval(interval)
    }
  }, [novels])

  const nextSlide = () => setHeroIndex((prev) => (prev + 1) % novels.length)
  const prevSlide = () => setHeroIndex((prev) => (prev - 1 + novels.length) % novels.length)

  if (novels.length === 0) return null

  const current = novels[heroIndex]

  return (
    <div className="relative w-full h-[320px] md:h-[460px] rounded-xl overflow-hidden shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={current.bannerImage || current.coverImage.extraLarge}
            alt={current.title.english || current.title.romaji}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
              {current.title.english || current.title.romaji}
            </h2>
            <p className="text-sm text-gray-300 line-clamp-2 mt-1">
              {current.description?.replace(/<[^>]*>/g, '') || 'No description'}
            </p>
            <Link
              href={`/light-novel/${current.id}`}
              className="mt-3 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white font-medium shadow-lg"
            >
              Read More
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </div>
  )
}
