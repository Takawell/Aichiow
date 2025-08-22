// components/home/NewsBanner.tsx
import { useOngoingAnime } from '@/hooks'
import Link from 'next/link'
import { HiOutlineBell } from 'react-icons/hi'

export default function NewsBanner() {
  const { data: ongoingAnime, isLoading } = useOngoingAnime()
  const newsAnime = ongoingAnime?.slice(0, 10)

  if (isLoading || !newsAnime) return null

  return (
    <div className="relative w-full px-4 py-3 border-b border-neutral-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <HiOutlineBell className="text-blue-400 text-lg" />
        <span className="text-sm font-semibold text-white/90">Latest Updates</span>
      </div>

      {/* Scrollable list */}
      <div className="flex gap-3 overflow-x-auto scroll-smooth min-w-max no-scrollbar relative">
        {newsAnime.map((anime) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.id}`}
            className="flex-shrink-0 px-4 py-2 rounded-lg
              bg-zinc-900/70 border border-zinc-700
              hover:bg-zinc-800/80 hover:border-blue-500
              transition transform hover:scale-105
              whitespace-nowrap text-sm text-white"
          >
            📢 {anime.title.english || anime.title.romaji}
          </Link>
        ))}

        {/* Gradient fade edges */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-neutral-900 to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-neutral-900 to-transparent" />
      </div>
    </div>
  )
}
