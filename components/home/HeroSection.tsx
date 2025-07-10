'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import { useEffect } from 'react'
import { Anime } from '@/types/anime'
import 'keen-slider/keen-slider.min.css'

interface HeroSectionProps {
  animeList?: Anime[]
  loading?: boolean
}

export default function HeroSection({ animeList = [], loading }: HeroSectionProps) {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    renderMode: 'performance',
    slides: {
      perView: 1,
      spacing: 10,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 15 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 20 },
      },
    },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 5000)
    return () => clearInterval(interval)
  }, [instanceRef])

  if (loading || animeList.length === 0) {
    return (
      <section className="w-full h-[240px] sm:h-[320px] lg:h-[400px] bg-neutral-800 animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading hero anime...</p>
      </section>
    )
  }

  return (
    <section ref={sliderRef} className="keen-slider w-full px-4 mt-4">
      {animeList.slice(0, 5).map((anime, idx) => (
        <div key={anime.id} className="keen-slider__slide relative h-[240px] sm:h-[320px] lg:h-[400px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src={anime.bannerImage || anime.coverImage.large}
            alt={anime.title.romaji}
            fill
            className="object-cover brightness-[.4]"
            priority={idx === 0}
          />
          <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 py-6 md:px-6 md:py-8">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
              {anime.title.english || anime.title.romaji}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mb-2">
              {anime.description?.replace(/<[^>]+>/g, '')}
            </p>
            <Link
              href={`/anime/${anime.id}`}
              className="bg-blue-500 hover:bg-blue-600 transition px-3 py-1.5 rounded text-white text-xs sm:text-sm w-fit"
            >
              Watch Now
            </Link>
          </div>
        </div>
      ))}
    </section>
  )
}
