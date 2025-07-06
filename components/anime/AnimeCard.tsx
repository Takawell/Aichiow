// components/anime/AnimeCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Anime } from '@/types/anime'

interface Props {
  anime: Anime
}

export default function AnimeCard({ anime }: Props) {
  return (
    <Link href={`/anime/${anime.id}`} className="block group">
      <div className="relative overflow-hidden rounded-xl shadow-lg bg-neutral-800 hover:scale-105 transition">
        <Image
          src={anime.coverImage.large}
          alt={anime.title.romaji}
          width={300}
          height={400}
          className="w-full h-64 object-cover"
        />
        <div className="p-3">
          <h3 className="text-base font-semibold text-white truncate group-hover:text-primary transition">
            {anime.title.english || anime.title.romaji}
          </h3>
          <p className="text-xs text-neutral-400">
            {anime.genres.slice(0, 2).join(', ')}
          </p>
        </div>
      </div>
    </Link>
  )
}
