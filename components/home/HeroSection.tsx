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
    renderMode: 'performance',
    slides: {
      perView: 1,
      spacing: 0,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: {
          perView: 2,
          spacing: 10,
        },
      },
      '(min-width: 1024px)': {
        slides: {
          perView: 3,
          spacing: 16,
        },
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
      <section className="w-full aspect-[21/7] bg-neutral-800 animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading hero anime...</p>
      </section>
    )
  }

  return (
    <section ref={sliderRef} className="keen-slider w-full px-4 mt-4">
      {animeList.map((anime, idx) => (
        <div
          key={anime.id}
          className="keen-slider__slide relative aspect-[21/7] rounded-lg overflow-hidden shadow-md"
        >
          <Image
            src={anime.bannerImage || anime.coverImage.large}
            alt={anime.title.romaji}
            fill
            className="object-cover brightness-[.4]"
            priority={idx === 0}
          />
          <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 py-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
              {anime.title.english || anime.title.romaji}
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 mb-2">
              {anime.description?.replace(/<[^>]+>/g, '')}
            </p>
            <Link
              href={`/anime/${anime.id}`}
              className="bg-blue-500 hover:bg-blue-600 transition px-3 py-1 rounded text-white text-xs w-fit"
            >
              Watch Now
            </Link>
          </div>
        </div>
      ))}
    </section>
  )
}
