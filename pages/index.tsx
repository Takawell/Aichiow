// pages/index.tsx
import Head from 'next/head'
import {
  useHeroAnime,
  useTrendingAnime,
  useOngoingAnime,
  useSeasonalAnime,
  useTopRatedAnime
} from '@/hooks'
import HeroSection from '@/components/home/HeroSection'
import AnimeSection from '@/components/home/AnimeSection'

export default function HomePage() {
  const { data: heroAnime, isLoading: loadingHero } = useHeroAnime()
  const { data: trendingAnime } = useTrendingAnime()
  const { data: ongoingAnime } = useOngoingAnime()
  const { data: seasonalAnime } = useSeasonalAnime()
  const { data: topRatedAnime } = useTopRatedAnime()

  return (
    <>
      <Head>
        <title>Aichiow — Anime Showcase</title>
      </Head>
      <main className="bg-dark min-h-screen">
        <HeroSection anime={heroAnime?.[0]} loading={loadingHero} />
        <AnimeSection title="🔥 Trending Now" anime={trendingAnime} />
        <AnimeSection title="📺 Ongoing Anime" anime={ongoingAnime} />
        <AnimeSection title="⛅ Seasonal Anime" anime={seasonalAnime} />
        <AnimeSection title="🏆 Top Rated Anime" anime={topRatedAnime} />
      </main>
    </>
  )
}
