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
      className="w-[150px] md:w-[160px] flex-shrink-0 group transition-transform duration-300 hover:scale-[1.04]"
    >
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 group-hover:border-indigo-500/50 transition-all duration-300 shadow-sm group-hover:shadow-indigo-500/20 group-hover:shadow-md">
        {/* IMAGE */}
        <div className="relative w-full aspect-[3/4]">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.english || anime.title.romaji}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 40vw, 180px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        </div>

        {/* TEXT */}
        <div className="relative z-20 p-3 h-[72px] flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors duration-300 truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
            {anime.title.english || anime.title.romaji}
          </h3>
          <div className="flex gap-1 overflow-hidden whitespace-nowrap">
            {anime.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-white/70 truncate max-w-[48%] backdrop-blur-md"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* GLOW EFFECT ON HOVER */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
          <div className="absolute -inset-1 bg-indigo-500 blur-xl opacity-30" />
        </div>
      </div>
    </Link>
  )
}
