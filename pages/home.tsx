// pages/home.tsx
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
import NewsBanner from '@/components/home/NewsBanner'
import NowAiringSection from '@/components/home/NowAiringSection'
import TopGenres from '@/components/home/TopGenres'
import Divider from '@/components/ui/Divider'
import FeaturedStudios from '@/components/home/FeaturedStudios'
import CTACommunity from '@/components/home/CTACommunity'
import TopCharacters from '@/components/home/TopCharacters'

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
        <meta name="description" content="Aichiow - explore trending anime, top rated, seasonal picks, and more!" />
      </Head>

      <main className="bg-gradient-to-b from-[#0f0f10] via-[#111215] to-[#0a0a0a] min-h-screen text-white">
        {/* 🗞️ Headline News */}
        <NewsBanner />

        {/* 🎬 Hero Section */}
        <HeroSection anime={heroAnime?.[0]} loading={loadingHero} />

        <Divider title="Now Airing" />
        <NowAiringSection anime={ongoingAnime} />

        <Divider title="Trending Now" />
        <AnimeSection title="🔥 Trending Now" anime={trendingAnime} />

        <Divider title="Seasonal Picks" />
        <AnimeSection title="⛅ Seasonal Anime" anime={seasonalAnime} />

        <Divider title="Top Rated" />
        <AnimeSection title="🏆 Top Rated Anime" anime={topRatedAnime} />

        <Divider title="Genres You May Like" />
        <TopGenres />

        <Divider title="Studios Behind the Magic" />
        <FeaturedStudios />

        <Divider title="Top Characters" />
        <TopCharacters />

        <CTACommunity />
      </main>
    </>
  )
}
