// components/home/TrendingSection.tsx
import { useTrendingAnime } from '@/hooks/useTrendingAnime'
import AnimeCard from '@/components/anime/AnimeCard'

export default function TrendingSection() {
  const { data, isLoading } = useTrendingAnime()

  return (
    <section className="px-4 md:px-10 py-10">
      <h2 className="text-white text-2xl font-bold mb-4">Trending Anime</h2>
      {isLoading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {data?.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </section>
  )
}
