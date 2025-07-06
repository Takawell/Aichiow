// components/home/HeroSection.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Anime } from '@/types/anime'

interface HeroSectionProps {
  anime: Anime
}

export default function HeroSection({ anime }: HeroSectionProps) {
  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      <Image
        src={anime.bannerImage || anime.coverImage.large}
        alt={anime.title.romaji}
        fill
        className="object-cover brightness-[.4]"
        priority
      />
      <div className="absolute bottom-10 left-10 z-10 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">{anime.title.english || anime.title.romaji}</h1>
        <p className="mb-4 text-sm text-gray-300 line-clamp-3">{anime.description?.replace(/<[^>]+>/g, '')}</p>
        <Link
          href={`/anime/${anime.id}`}
          className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 transition"
        >
          Watch Now
        </Link>
      </div>
    </section>
  )
}
