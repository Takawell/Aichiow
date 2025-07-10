'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Anime } from '@/types/anime'

interface HeroSectionProps {
  anime?: Anime
  loading?: boolean
}

export default function HeroSection({ anime, loading }: HeroSectionProps) {
  if (loading || !anime) {
    return (
      <section className="w-full h-[320px] md:h-[460px] bg-neutral-800 animate-pulse flex items-center justify-center rounded-lg">
        <p className="text-gray-400">Loading hero anime...</p>
      </section>
    )
  }

  return (
    <div className="relative w-full h-[320px] md:h-[460px] min-h-[280px] overflow-hidden rounded-lg shadow-xl">
      <Image
        src={anime.bannerImage || anime.coverImage.large}
        alt={anime.title.romaji}
        fill
        className="object-cover brightness-[.4]"
        priority
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
  )
}
