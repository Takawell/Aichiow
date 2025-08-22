import { useOngoingAnime } from '@/hooks'
import Link from 'next/link'
import { HiOutlineBell } from 'react-icons/hi'

export default function NewsBanner() {
  const { data: ongoingAnime, isLoading } = useOngoingAnime()
  const newsAnime = ongoingAnime?.slice(0, 10)

  if (isLoading || !newsAnime) return null

  return (
    <div className="w-full px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <HiOutlineBell className="text-blue-400 text-lg" />
        <span className="text-sm font-semibold text-white/90">Latest Updates</span>
      </div>

      {/* Scrollable Chips */}
      <div className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar">
        {newsAnime.map((anime) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.id}`}
            className="flex-shrink-0 snap-start px-4 py-2 rounded-lg
            bg-zinc-800/60 border border-zinc-700 
            hover:bg-zinc-700/80 hover:border-blue-500 transition 
            text-sm font-medium text-white/90 whitespace-nowrap"
          >
            {anime.title.english || anime.title.romaji}
          </Link>
        ))}
      </div>
    </div>
  )
}
