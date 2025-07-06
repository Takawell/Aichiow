import Head from 'next/head'
import HeroSection from '@/components/home/HeroSection'
import AnimeSection from '@/components/home/AnimeSection'
import {
  useHeroAnime,
  useTrendingAnime,
  useOngoingAnime,
  useSeasonalAnime,
  useTopRatedAnime,
} from '@/hooks'

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
        <HeroSection anime={heroAnime} loading={loadingHero} />
        <AnimeSection title="🔥 Trending Now" anime={trendingAnime} />
        <AnimeSection title="📺 Ongoing Anime" anime={ongoingAnime} />
        <AnimeSection title="⛅ Seasonal Anime" anime={seasonalAnime} />
        <AnimeSection title="🏆 Top Rated" anime={topRatedAnime} />
      </main>
    </>
  )
}
