'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { Anime } from '@/types/anime'

interface HeroSectionProps {
  animeList?: Anime[]
  loading?: boolean
}

export default function HeroSection({ animeList = [], loading }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    renderMode: 'performance',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!instanceRef.current) return
    timerRef.current = setInterval(() => {
      instanceRef.current?.next()
    }, 5000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [instanceRef])

  if (loading || !mounted || animeList.length === 0) {
    return (
      <section className="w-full aspect-[21/7] bg-neutral-800 animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading hero anime...</p>
      </section>
    )
  }

  return (
    <section
      ref={sliderRef}
      className="keen-slider aspect-[21/7] relative overflow-hidden md:rounded-lg shadow-lg"
    >
      {animeList.map((anime, idx) => (
        <div
          key={anime.id}
          className="keen-slider__slide relative w-full h-full"
        >
          <Image
            src={anime.bannerImage || anime.coverImage.large}
            alt={anime.title.romaji}
            fill
            className="object-cover brightness-[.4]"
            priority={idx === 0}
          />
          <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 py-6 md:px-10 md:py-12">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
              {anime.title.english || anime.title.romaji}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 line-clamp-3 mb-3 md:mb-5">
              {anime.description?.replace(/<[^>]+>/g, '')}
            </p>
            <Link
              href={`/anime/${anime.id}`}
              className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded text-white text-sm w-fit"
            >
              Watch Now
            </Link>
          </div>
        </div>
      ))}
    </section>
  )
}
