'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import { useEffect, useRef } from 'react'
import { Anime } from '@/types/anime'
import 'keen-slider/keen-slider.min.css'

interface HeroSectionProps {
  animeList?: Anime[]
  loading?: boolean
}

export default function HeroSection({ animeList = [], loading }: HeroSectionProps) {
  const sliderContainerRef = useRef<HTMLDivElement>(null)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 0,
    },
    created() {
      // Force resize on load
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 100)
    }
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
    <div className="relative w-full h-[45vh] md:h-[60vh] overflow-hidden rounded-lg shadow-xl" ref={sliderContainerRef}>
      <div ref={sliderRef} className="keen-slider w-full h-full">
        {animeList.map((anime, idx) => (
          <div key={anime.id} className="keen-slider__slide relative w-full h-full">
            <Image
              src={anime.bannerImage || anime.coverImage.large}
              alt={anime.title.romaji}
              fill
              className="object-cover brightness-[.4]"
              priority={idx === 0}
            />
            <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 py-6 md:px-10 md:py-12">
              <h1 className="text-xl md:text-4xl font-bold text-white mb-2 drop-shadow">
                {anime.title.english || anime.title.romaji}
              </h1>
              <p className="text-sm md:text-base text-gray-300 max-w-2xl line-clamp-3 mb-3 drop-shadow">
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
