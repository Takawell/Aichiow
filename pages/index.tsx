import Head from 'next/head'
import HeroSection from '@/components/home/HeroSection'
import AnimeSection from '@/components/home/AnimeSection'
import { useHeroAnime } from '@/hooks/useHeroAnime'
import { useTrendingAnime } from '@/hooks/useTrendingAnime'
import { useOngoingAnime } from '@/hooks/useOngoingAnime'
import { useSeasonalAnime } from '@/hooks/useSeasonalAnime'
import { useTopRatedAnime } from '@/hooks/useTopRatedAnime'

export default function HomePage() {
  const { anime: heroAnime, isLoading: loadingHero } = useHeroAnime()
  const { anime: trendingAnime } = useTrendingAnime()
  const { anime: ongoingAnime } = useOngoingAnime()
  const { anime: seasonalAnime } = useSeasonalAnime()
  const { anime: topRatedAnime } = useTopRatedAnime()

  return (
    <>
      <Head>
        <title>Aichiow — Anime Showcase</title>
      </Head>
      <main className="bg-dark text-white min-h-screen">
        {!loadingHero && heroAnime && <HeroSection anime={heroAnime} />}
        {trendingAnime && <AnimeSection title="🔥 Trending Now" animeList={trendingAnime} />}
        {ongoingAnime && <AnimeSection title="📺 Ongoing Anime" animeList={ongoingAnime} />}
        {seasonalAnime && <AnimeSection title="🌸 Seasonal Anime" animeList={seasonalAnime} />}
        {topRatedAnime && <AnimeSection title="⭐ Top Rated" animeList={topRatedAnime} />}
      </main>
    </>
  )
}
