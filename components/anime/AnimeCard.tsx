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
      className="w-[140px] sm:w-[160px] flex-shrink-0 group transition-transform duration-300 hover:scale-[1.05]"
    >
      <div className="overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md group-hover:shadow-indigo-500/10 group-hover:border-indigo-400/30 transition-all duration-300">
        
        {/* IMAGE */}
        <div className="relative w-full aspect-[3/4]">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.english || anime.title.romaji}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
            sizes="(max-width: 768px) 40vw, 180px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
        </div>

        {/* TEXT */}
        <div className="relative z-20 p-3 h-[76px] flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors duration-300 truncate leading-snug">
            {anime.title.english || anime.title.romaji}
          </h3>

          {/* GENRE */}
          <div className="flex gap-1 mt-1 overflow-hidden whitespace-nowrap">
            {anime.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 truncate max-w-[48%]"
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
