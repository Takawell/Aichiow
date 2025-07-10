'use client'

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
        {/* 🔊 Headline News */}
        <NewsBanner />

        {/* 🎥 Hero Main Highlight */}
        <HeroSection anime={heroAnime?.[0]} loading={loadingHero} />

        {/* 📡 Now Airing Section */}
        <NowAiringSection anime={ongoingAnime} />

        {/* 🔥 Trending */}
        <AnimeSection title="🔥 Trending Now" anime={trendingAnime} />

        {/* 📺 Ongoing Anime */}
        <AnimeSection title="📺 Ongoing Anime" anime={ongoingAnime} />

        {/* ⛅ Seasonal Anime */}
        <AnimeSection title="⛅ Seasonal Anime" anime={seasonalAnime} />

        {/* 🏆 Top Rated Anime */}
        <AnimeSection title="🏆 Top Rated Anime" anime={topRatedAnime} />

        {/* 🏷️ Genre Section */}
        <TopGenres />
      </main>
    </>
  )
}
