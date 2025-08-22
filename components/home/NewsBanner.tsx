import { useOngoingAnime } from '@/hooks'
import Link from 'next/link'
import { HiSpeakerphone } from 'react-icons/hi'

export default function NewsBanner() {
  const { data: ongoingAnime, isLoading } = useOngoingAnime()
  const newsAnime = ongoingAnime?.slice(0, 10)

  if (isLoading || !newsAnime) return null

  return (
    <div className="relative w-full overflow-hidden border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900">
      <div className="absolute left-0 top-0 h-full flex items-center px-3 bg-blue-600 text-white font-bold text-sm">
        <HiSpeakerphone className="mr-1 text-lg" />
        News
      </div>

      <div className="flex gap-6 animate-scroll px-28 py-3 whitespace-nowrap">
        {newsAnime.map((anime) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.id}`}
            className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-neutral-800/70 border border-neutral-700 
            hover:bg-blue-600/80 hover:text-white hover:border-blue-500 transition text-sm font-medium"
          >
            {anime.title.english || anime.title.romaji}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .animate-scroll {
          animation: scroll-left 40s linear infinite;
        }
        @keyframes scroll-left {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  )
}
