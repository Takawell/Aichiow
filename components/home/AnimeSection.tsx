import Link from 'next/link'
import { Anime } from '@/types/anime'
import AnimeCard from '../anime/AnimeCard'

interface AnimeSectionProps {
  title: string
  animeList?: Anime[] // dijadikan optional supaya tidak error
  href?: string
}

export default function AnimeSection({ title, animeList, href }: AnimeSectionProps) {
  const isLoading = !animeList || animeList.length === 0

  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {href && (
          <Link href={href} className="text-blue-400 hover:underline text-sm">
            See All
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading
          ? [...Array(10)].map((_, i) => (
              <div key={i} className="h-64 bg-neutral-700 animate-pulse rounded-xl" />
            ))
          : animeList.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
      </div>
    </section>
  )
}
