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
import CTACommunity from '@/components/home/CTACommunity'
import { Flame, CloudSun, Trophy } from 'lucide-react'

export default function HomePage() {
  const { data: heroAnime, isLoading: loadingHero } = useHeroAnime()
  const { data: trendingAnime } = useTrendingAnime()
  const { data: ongoingAnime } = useOngoingAnime()
  const { data: seasonalAnime } = useSeasonalAnime()
  const { data: topRatedAnime } = useTopRatedAnime()

  return (
    <>
      <Head>
        <title>Anime | Aichiow</title>
        <meta
          name="description"
          content="Aichiow - explore trending anime, top rated, seasonal picks, and more!"
        />
      </Head>

      <main className="bg-gradient-to-b from-[#0f0f10] via-[#111215] to-[#0a0a0a] min-h-screen text-white">
        <NewsBanner />
        <HeroSection anime={heroAnime?.[0]} loading={loadingHero} />
        <NowAiringSection anime={ongoingAnime} />

        <AnimeSection
          title={
            <span className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              Trending Now
            </span>
          }
          anime={trendingAnime}
        />

        <AnimeSection
          title={
            <span className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-yellow-400" />
              Seasonal Anime
            </span>
          }
          anime={seasonalAnime}
        />

        <AnimeSection
          title={
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Top Rated Anime
            </span>
          }
          anime={topRatedAnime}
        />

        <TopGenres />
        <CTACommunity />
      </main>
    </>
  )
}
