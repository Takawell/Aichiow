'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { useEffect } from 'react'
import { Anime } from '@/types/anime'

interface HeroSectionProps {
  animeList?: Anime[]
  loading?: boolean
}

export default function HeroSection({ animeList = [], loading }: HeroSectionProps) {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 0 },
    mode: 'snap',
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
    <section
      ref={sliderRef}
      className="keen-slider relative w-full aspect-[21/7] md:rounded-xl overflow-hidden shadow-lg"
    >
      {animeList.slice(0, 5).map((anime, idx) => (
        <div
          key={anime.id}
          className="keen-slider__slide relative w-full h-full"
        >
          <Image
            src={anime.bannerImage || anime.coverImage.large}
            alt={anime.title.romaji}
            fill
            priority={idx === 0}
            className="object-cover brightness-[.4]"
          />
          <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 py-6 md:px-10 md:py-12">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">
              {anime.title.english || anime.title.romaji}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-3 max-w-3xl mb-3 md:mb-5 drop-shadow">
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
