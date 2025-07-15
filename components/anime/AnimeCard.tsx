// components/anime/AnimeCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Anime } from '@/types/anime'

interface Props {
  anime: Anime
}

export default function AnimeCard({ anime }: Props) {
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="block group transition-transform duration-300 hover:scale-[1.04]"
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg bg-neutral-900 border border-neutral-800 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/30 transition-all duration-300">
        {/* IMAGE */}
        <div className="relative w-full h-64">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.romaji}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 20vw"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        </div>

        {/* TEXT CONTENT */}
        <div className="relative z-20 p-3">
          <h3 className="text-base font-semibold text-white truncate group-hover:text-indigo-400 transition-colors duration-300">
            {anime.title.english || anime.title.romaji}
          </h3>

          {/* GENRES */}
          <div className="mt-1 flex flex-wrap gap-1">
            {anime.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 backdrop-blur-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
