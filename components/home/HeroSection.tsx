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
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 0,
    },
    renderMode: 'performance',
  })

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 5000)
    return () => clearInterval(interval)
  }, [instanceRef])

  if (loading || animeList.length === 0) {
    return (
      <section className="w-full aspect-[16/6] bg-neutral-800 animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading hero anime...</p>
      </section>
    )
  }

  return (
    <div className="relative w-full h-[42vh] md:h-[60vh] overflow-hidden rounded-lg shadow-xl">
      <div ref={sliderRef} className="keen-slider w-full h-full">
        {animeList.slice(0, 5).map((anime, idx) => (
          <div key={anime.id} className="keen-slider__slide relative w-full h-full">
            <Image
              src={anime.bannerImage || anime.coverImage.large}
              alt={anime.title.romaji}
              fill
              className="object-cover brightness-[.4]"
              priority={idx === 0}
            />
            <div className="absolute inset-0 z-10 flex flex-col justify-end px-5 py-6 md:px-12 md:py-10">
              <h1 className="text-white text-2xl md:text-5xl font-bold mb-4 drop-shadow">
                {anime.title.english || anime.title.romaji}
              </h1>
              <p className="text-gray-200 text-sm md:text-base max-w-2xl line-clamp-3 mb-4 drop-shadow">
                {anime.description?.replace(/<[^>]+>/g, '')}
              </p>
              <Link
                href={`/anime/${anime.id}`}
                className="bg-primary hover:bg-blue-600 transition px-4 py-2 rounded text-white text-sm w-fit"
              >
                Watch Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
