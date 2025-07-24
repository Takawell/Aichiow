'use client'

import { useState } from 'react'
import Head from 'next/head'
import { useExploreAnime } from '@/hooks/useExploreAnime'
import { useSearchAnime } from '@/hooks/useSearchAnime'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'
import GenreFilter from '@/components/shared/GenreFilter'

export default function ExplorePage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')

  const { anime: exploreAnime, isLoading, loadMore, hasMore } = useExploreAnime()
  const { anime: searchAnime, isLoading: searchLoading } = useSearchAnime(query)

  // Data yang dipakai
  const animeData = query ? searchAnime : exploreAnime

  const filtered = selectedGenre
    ? animeData.filter((a) => a.genres.includes(selectedGenre))
    : animeData

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setQuery(input.trim())
  }

  return (
    <>
      <Head>
        <title>Explore Anime | Aichiow</title>
        <meta name="description" content="Discover and search for anime by genre, popularity, and more." />
      </Head>
      <main className="bg-dark min-h-screen text-white px-4 md:px-10 py-10">
        <SectionTitle title="🔍 Explore Anime" />

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 mb-6 flex flex-col sm:flex-row items-stretch gap-3"
        >
          <input
            type="text"
            placeholder="Search for anime title..."
            className="w-full px-4 py-3 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-300"
          >
            Search
          </button>
        </form>

        {/* Genre Filter */}
        {!query && (
          <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />
        )}

        {/* Anime List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
          {(isLoading || searchLoading) && animeData.length === 0
            ? [...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="h-[260px] bg-neutral-800 animate-pulse rounded-xl"
                />
              ))
            : filtered.map((a) => <AnimeCard key={a.id} anime={a} />)}
        </div>

        {/* Search Result - No Data */}
        {query && !searchLoading && filtered.length === 0 && (
          <p className="text-center text-zinc-400 mt-10">
            No results found for <span className="text-white font-semibold">"{query}"</span>.
          </p>
        )}

        {/* Load More (hanya untuk Explore) */}
        {!query && hasMore && (
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

        {!query && !hasMore && exploreAnime.length > 0 && (
          <p className="text-center text-sm text-neutral-400 mt-6">
            You've reached the end of the list.
          </p>
        )}
      </main>
    </>
  )
}
