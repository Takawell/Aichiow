// pages/explore.tsx
import { useState } from 'react'
import Head from 'next/head'
import { useTrendingAnime } from '@/hooks/useTrendingAnime'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'
import GenreFilter from '@/components/shared/GenreFilter'

export default function ExplorePage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const { data: anime = [], isLoading } = useTrendingAnime(1, 30)

  const filtered = selectedGenre
    ? anime.filter((a) => a.genres.includes(selectedGenre))
    : anime

  return (
    <>
      <Head>
        <title>Explore Anime by Genre | Aichiow</title>
      </Head>
      <main className="bg-dark min-h-screen text-white px-4 md:px-10 py-10">
        <SectionTitle title="🔍 Explore Anime" />
        <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
          {isLoading
            ? [...Array(10)].map((_, i) => (
                <div key={i} className="h-64 bg-neutral-700 animate-pulse rounded-xl" />
              ))
            : filtered.map((a) => <AnimeCard key={a.id} anime={a} />)}
        </div>
      </main>
    </>
  )
}
