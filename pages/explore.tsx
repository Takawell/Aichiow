// pages/explore/index.tsx
'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useExploreAnime } from '@/hooks/useExploreAnime'
import { useSearchAnime } from '@/hooks/useSearchAnime'
import { useTraceSearch } from '@/hooks/useTraceSearch'
import { fetchAnimeById } from '@/lib/anilist'
import { Anime } from '@/types/anime'
import AnimeCard from '@/components/anime/AnimeCard'
import SectionTitle from '@/components/shared/SectionTitle'
import GenreFilter from '@/components/shared/GenreFilter'

export default function ExplorePage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')

  const { anime: exploreAnime, isLoading, loadMore, hasMore } = useExploreAnime()
  const { anime: searchAnime, isLoading: searchLoading } = useSearchAnime(query)
  const {
    loading: traceLoading,
    result: traceResult,
    previewUrl,
    handleSearch,
    error: traceError,
    reset: resetTrace,
  } = useTraceSearch()

  const [traceAnime, setTraceAnime] = useState<Anime | null>(null)

  const animeData = query ? searchAnime : exploreAnime
  const filtered = selectedGenre
    ? animeData.filter((a) => a.genres.includes(selectedGenre))
    : animeData

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setQuery(input.trim())
    resetTrace() // reset TraceMoe result saat user melakukan search manual
  }

  // Fetch detail anime dari anilist berdasarkan traceResult
  useEffect(() => {
    const fetchFromTrace = async () => {
      if (traceResult?.result?.[0]?.anilist) {
        const detail = await fetchAnimeById(traceResult.result[0].anilist)
        setTraceAnime(detail)
      }
    }
    fetchFromTrace()
  }, [traceResult])

  return (
    <>
      <Head>
        <title>Explore Anime | Aichiow</title>
        <meta name="description" content="Discover and search for anime by genre, popularity, and more." />
      </Head>

      <main className="bg-gradient-to-b from-[#0f1117] via-[#0c0e14] to-black min-h-screen text-white px-4 md:px-10 py-12">
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10">
          <SectionTitle title="🔍 Explore Anime" />

          {/* FORM SEARCH */}
          <form onSubmit={handleSubmit} className="mt-6 mb-6 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Find anime by title or keyword..."
              className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-all duration-300"
            >
              Search
            </button>
          </form>

          {/* FORM TRACEMOE */}
          <div className="mb-10">
            <label className="text-sm font-semibold mb-2 block">🎞️ Or upload a screenshot to find anime</label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:hover:bg-blue-700 file:text-white"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleSearch(file)
              }}
            />
          </div>

          {/* PREVIEW UPLOAD */}
          {previewUrl && (
            <div className="mb-6">
              <p className="text-sm text-neutral-400 mb-2">Preview:</p>
              <img src={previewUrl} alt="Preview" className="w-full max-w-xs rounded-lg" />
            </div>
          )}

          {/* HASIL TRACEMOE */}
          {traceLoading && <p className="text-blue-400 mb-4">🔎 Searching via image...</p>}
          {traceError && <p className="text-red-400 mb-4">{traceError}</p>}
          {traceAnime && (
            <div className="mb-10">
              <SectionTitle title="🎯 Match from Screenshot" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mt-4">
                <AnimeCard anime={traceAnime} />
              </div>
            </div>
          )}

          {/* GENRE FILTER */}
          {!query && !traceAnime && (
            <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />
          )}

          {/* HASIL EXPLORE / SEARCH */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {(isLoading || searchLoading) && animeData.length === 0
              ? [...Array(10)].map((_, i) => (
                  <div key={i} className="h-[260px] rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse" />
                ))
              : filtered.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
          </div>

          {/* EMPTY STATE */}
          {query && !searchLoading && filtered.length === 0 && (
            <p className="text-center text-zinc-400 mt-10 text-lg">
              No results found for <span className="text-white font-semibold">"{query}"</span>.
            </p>
          )}

          {/* LOAD MORE */}
          {!query && hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-40"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}

          {!query && !hasMore && exploreAnime.length > 0 && (
            <p className="text-center text-sm text-neutral-400 mt-8">You've reached the end of the list.</p>
          )}
        </div>
      </main>
    </>
  )
}
