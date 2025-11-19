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
      className="w-full sm:w-[160px] md:w-[180px] lg:w-[200px] group block"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/60">
        
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.english || anime.title.romaji}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
          
          {anime.averageScore && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-bold text-white">{anime.averageScore}</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2 text-xs text-white/90 mb-2">
              {anime.format && (
                <span className="px-2 py-1 rounded-md bg-indigo-500/80 backdrop-blur-sm font-medium">
                  {anime.format}
                </span>
              )}
              {anime.episodes && (
                <span className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm">
                  {anime.episodes} EP
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm sm:text-base font-bold text-white leading-tight line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors duration-300">
            {anime.title.english || anime.title.romaji}
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {anime.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 font-medium border border-indigo-500/30 backdrop-blur-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {anime.status && (
            <div className="mt-3 pt-3 border-t border-neutral-800/50">
              <span className="text-xs text-neutral-400 font-medium">
                {anime.status}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-700 pointer-events-none" />
      </div>
    </Link>
  )
}
