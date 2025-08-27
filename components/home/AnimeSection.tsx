import Link from 'next/link'
import { Anime } from '@/types/anime'
import AnimeCard from '../anime/AnimeCard'

interface AnimeSectionProps {
  title: string
  anime?: Anime[]
  href?: string
}

export default function AnimeSection({ title, anime, href }: AnimeSectionProps) {
  const isLoading = !anime || anime.length === 0

  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {href && (
          <Link href={href} className="text-blue-400 hover:underline text-sm">
            See All
          </Link>
        )}
      </div>

      <div className="flex overflow-x-auto gap-4 scroll-smooth pb-1">
        {isLoading
          ? [...Array(10)].map((_, i) => (
              <div key={i} className="min-w-[140px] h-64 bg-neutral-700 animate-pulse rounded-xl" />
            ))
          : anime.map((a) => (
              <div key={a.id} className="min-w-[140px]">
                <AnimeCard anime={a} />
              </div>
            ))}
      </div>
    </section>
  )
}
