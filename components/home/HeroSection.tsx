'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { Anime } from '@/types/anime'

interface HeroSectionProps {
  animeList?: Anime[]
  loading?: boolean
}

export default function HeroSection({ animeList = [], loading }: HeroSectionProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: 'performance',
    slides: {
      perView: 1,
      spacing: 16
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 20 }
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 24 }
      },
      '(min-width: 1280px)': {
        slides: { perView: 4, spacing: 28 }
      },
      '(min-width: 1536px)': {
        slides: { perView: 5, spacing: 32 }
      }
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 5000)
    return () => clearInterval(interval)
  }, [instanceRef])

  if (!isClient || loading || animeList.length === 0) {
    return (
      <section className="w-full aspect-[21/7] bg-neutral-800 animate-pulse flex items-center justify-center rounded-lg">
        <p className="text-gray-400">Loading hero anime...</p>
      </section>
    )
  }

  return (
    <section ref={sliderRef} className="keen-slider px-4 md:px-8 py-4">
      {animeList.map((anime, idx) => (
        <div
          key={anime.id}
          className="keen-slider__slide relative aspect-[16/6] rounded-lg overflow-hidden shadow-lg"
        >
          <Image
            src={anime.bannerImage || anime.coverImage.large}
            alt={anime.title.romaji}
            fill
            className="object-cover brightness-[.4]"
            priority={idx === 0}
          />
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-6">
            <h1 className="text-lg md:text-2xl font-bold text-white mb-2 line-clamp-1">
              {anime.title.english || anime.title.romaji}
            </h1>
            <p className="text-sm text-gray-300 line-clamp-2 mb-3">
              {anime.description?.replace(/<[^>]+>/g, '')}
            </p>
            <Link
              href={`/anime/${anime.id}`}
              className="bg-blue-500 hover:bg-blue-600 transition px-3 py-1.5 rounded text-white text-sm w-fit"
            >
              Watch Now
            </Link>
          </div>
        </div>
      ))}
    </section>
  )
}
