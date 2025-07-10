'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import { useEffect } from 'react'
import { Anime } from '@/types/anime'

interface HeroSectionProps {
  animeList?: Anime[]
  loading?: boolean
}

export default function HeroSection({ animeList = [], loading }: HeroSectionProps) {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    renderMode: 'performance',
    slides: { perView: 1, spacing: 0 }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 5000)
    return () => clearInterval(interval)
  }, [instanceRef])

  if (loading || animeList.length === 0) {
    return (
      <section className="w-full aspect-[21/7] bg-neutral-800 animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading hero anime...</p>
      </section>
    )
  }

  return (
    <section ref={sliderRef} className="keen-slider aspect-[21/7] relative overflow-hidden md:rounded-lg shadow-lg">
      {animeList.slice(0, 5).map((anime, idx) => (
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
