import { useOngoingAnime } from '@/hooks'
import Link from 'next/link'

export default function NewsBanner() {
  const { data: ongoingAnime, isLoading } = useOngoingAnime()
  const newsAnime = ongoingAnime?.slice(0, 10)

  if (isLoading || !newsAnime) return null

  return (
    <div className="w-full overflow-x-auto scroll-smooth px-4 py-3 border-b border-neutral-800">
      <div className="flex gap-4 min-w-max">
        {newsAnime.map((anime) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.id}`}
            className="flex-shrink-0 bg-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-800 transition whitespace-nowrap text-sm text-white border border-neutral-700"
          >
            📢 {anime.title.english || anime.title.romaji}
          </Link>
        ))}
      </div>
    </div>
  )
}
