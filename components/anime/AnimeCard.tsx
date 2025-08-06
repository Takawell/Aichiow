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
      className="w-[140px] sm:w-[160px] md:w-[180px] flex-shrink-0 group transition-transform duration-300 hover:scale-[1.03]"
    >
      <div className="overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-sm group-hover:shadow-md group-hover:border-indigo-500/40 transition-all duration-300 h-full flex flex-col">
        
        {/* IMAGE */}
        <div className="relative w-full aspect-[2/3]">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.english || anime.title.romaji}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
        </div>

        {/* TEXT */}
        <div className="relative z-20 p-3 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors duration-300 line-clamp-1">
            {anime.title.english || anime.title.romaji}
          </h3>

          {/* GENRE */}
          <div className="flex gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
            {anime.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 truncate max-w-[65px]"
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
