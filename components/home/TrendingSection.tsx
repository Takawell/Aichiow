// components/home/TrendingSection.tsx
import { useTrendingAnime } from '@/hooks/useTrendingAnime'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'

export default function TrendingSection() {
  const { anime, isLoading } = useTrendingAnime()

  return (
    <section className="px-4 md:px-10 py-10">
      <SectionTitle title="🔥 Trending Anime" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
        {isLoading
          ? [...Array(10)].map((_, i) => (
              <div key={i} className="h-64 bg-neutral-700 animate-pulse rounded-xl" />
            ))
          : anime.map((a) => <AnimeCard key={a.id} anime={a} />)}
      </div>
    </section>
  )
}
