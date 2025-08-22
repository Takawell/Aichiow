// components/home/NewsBanner.tsx
import { useOngoingAnime } from '@/hooks'
import Link from 'next/link'
import { HiOutlineBell } from 'react-icons/hi'

export default function NewsBanner() {
  const { data: ongoingAnime, isLoading } = useOngoingAnime()
  const newsAnime = ongoingAnime?.slice(0, 10)

  if (isLoading || !newsAnime) return null

  return (
    <div className="w-full px-4 py-3 border-b border-neutral-800 bg-neutral-900/70 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <HiOutlineBell className="text-blue-400 text-lg" />
        <span className="text-sm font-semibold text-white tracking-wide">Latest Updates</span>
      </div>

      <div className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar">
        {newsAnime.map((anime) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.id}`}
            className="flex-shrink-0 snap-start px-4 py-2 rounded-xl 
            bg-gradient-to-r from-blue-600/20 to-sky-500/20 border border-blue-500/30
            hover:from-blue-600/40 hover:to-sky-500/40 hover:border-blue-400 
            transition text-sm font-medium text-white/90"
          >
            {anime.title.english || anime.title.romaji}
          </Link>
        ))}
      </div>
    </div>
  )
}
