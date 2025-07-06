// components/trailer/TrailerGrid.tsx
import { useTrendingAnime } from '@/hooks/useTrendingAnime'
import TrailerCard from './TrailerCard'
import SectionTitle from '@/components/shared/SectionTitle'

export default function TrailerGrid() {
  const { anime, isLoading } = useTrendingAnime(1, 20)

  return (
    <section className="px-4 md:px-10 py-10">
      <SectionTitle title="🎥 Anime Trailers" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-neutral-700 animate-pulse rounded-xl" />
            ))
          : anime
              .filter((a) => a.trailer && a.trailer.site === 'youtube')
              .map((a) => <TrailerCard key={a.id} anime={a} />)}
      </div>
    </section>
  )
}
