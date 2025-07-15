import { useState } from 'react'
import Head from 'next/head'
import { useExploreAnime } from '@/hooks/useExploreAnime'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'
import GenreFilter from '@/components/shared/GenreFilter'

export default function ExplorePage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const { anime, isLoading, loadMore, hasMore } = useExploreAnime()

  const filtered = selectedGenre
    ? anime.filter((a) => a.genres.includes(selectedGenre))
    : anime

  return (
    <>
      <Head>
        <title>Explore Anime by Genre | Aichiow</title>
        <meta name="description" content="Discover hundreds of trending anime by genre, popularity, and more." />
      </Head>
      <main className="bg-dark min-h-screen text-white px-4 md:px-10 py-10">
        <SectionTitle title="🔍 Explore Anime" />
        <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
          {isLoading && anime.length === 0
            ? [...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="h-[260px] bg-neutral-800 animate-pulse rounded-xl"
                />
              ))
            : filtered.map((a) => <AnimeCard key={a.id} anime={a} />)}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {!hasMore && (
          <p className="text-center text-sm text-neutral-400 mt-6">
            You've reached the end of the list.
          </p>
        )}
      </main>
    </>
  )
}
