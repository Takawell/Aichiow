import Link from 'next/link'
import Image from 'next/image'
import { Anime } from '@/types/anime'

interface Props {
  anime: Anime
}

export default function AnimeCardSuper({ anime }: Props) {
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="w-[150px] flex-shrink-0 group transition-transform duration-300 hover:scale-[1.05]"
    >
      <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] shadow-md group-hover:shadow-indigo-500/20 transition-all duration-300">
        
        {/* IMAGE */}
        <div className="relative w-full aspect-[3/4]">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.english || anime.title.romaji}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 40vw, 160px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        </div>

        {/* TEXT */}
        <div className="p-3 h-[76px] relative z-20 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-white leading-snug truncate group-hover:text-indigo-400 transition-colors duration-300">
            {anime.title.english || anime.title.romaji}
          </h3>
          <div className="flex gap-1 overflow-hidden whitespace-nowrap mt-1">
            {anime.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-white/70 rounded-full truncate max-w-[48%]"
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
