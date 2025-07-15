import Link from 'next/link'
import Image from 'next/image'
import { Anime } from '@/types/anime'

interface Props {
  anime: Anime[] | undefined
}

export default function NowAiringSection({ anime }: Props) {
  if (!anime) return null

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold text-white mb-4">📡 Now Airing</h2>
      <div className="flex gap-4 overflow-x-auto scroll-smooth">
        {anime.slice(0, 10).map((item) => (
          <Link
            key={item.id}
            href={`/anime/${item.id}`}
            className="min-w-[140px] flex-shrink-0 group transition-transform duration-300 hover:scale-[1.04]"
          >
            <div className="relative w-[140px] h-[200px] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-md group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/20 transition-all duration-300">
              {/* Gambar */}
              <Image
                src={item.coverImage.large}
                alt={item.title.english || item.title.romaji}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
            </div>

            {/* Title */}
            <p className="mt-2 text-sm font-medium text-white truncate group-hover:text-indigo-400 transition-colors duration-300">
              {item.title.english || item.title.romaji}
            </p>

            {/* Optional: Genre Badge */}
            {item.genres && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.genres.slice(0, 1).map((genre) => (
                  <span
                    key={genre}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
