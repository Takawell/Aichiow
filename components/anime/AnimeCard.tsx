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
      className="w-[140px] max-w-[140px] flex-shrink-0 group transition-transform duration-300 hover:scale-[1.03]"
    >
      <div className="overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-sm group-hover:shadow-md group-hover:border-indigo-500/40 transition-all duration-300">       
        <div className="relative w-full h-[200px] overflow-hidden rounded-t-xl">
          <Image
          src={anime.coverImage.large}
          alt={anime.title.english || anime.title.romaji}
          fill
          loading="lazy"
         />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
        </div>
        
        <div className="relative z-20 p-3">
          <h3
            className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors duration-300 truncate whitespace-nowrap overflow-hidden text-ellipsis w-full max-w-[140px]"
          >
            {anime.title.english || anime.title.romaji}
          </h3>

          <div className="mt-1 flex gap-1 overflow-hidden whitespace-nowrap">
            {anime.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 truncate max-w-[48%]"
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
