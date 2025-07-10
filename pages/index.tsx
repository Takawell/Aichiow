'use client'

import Head from 'next/head'
import Navbar from '@/components/layout/Navbar' // ✅ ini penting!
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

      {/* ✅ Navbar wajib disini */}
      <Navbar />

      <main className="bg-dark min-h-screen">
        <NewsBanner />
        <HeroSection anime={heroAnime?.[0]} loading={loadingHero} />
        <NowAiringSection anime={ongoingAnime} />
        <AnimeSection title="🔥 Trending Now" anime={trendingAnime} />
        <AnimeSection title="📺 Ongoing Anime" anime={ongoingAnime} />
        <AnimeSection title="⛅ Seasonal Anime" anime={seasonalAnime} />
        <AnimeSection title="🏆 Top Rated Anime" anime={topRatedAnime} />
        <TopGenres />
      </main>
    </>
  )
}
