'use client'

import { useState } from 'react'
import Head from 'next/head'
import AnimeCard from '@/components/anime/AnimeCard'
import { useSearchAnime } from '@/hooks/useSearchAnime'
import SectionTitle from '@/components/shared/SectionTitle'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')
  const { anime, isLoading } = useSearchAnime(query)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setQuery(input.trim())
  }

  return (
    <>
      <Head>
        <title>Search Anime | Aichiow</title>
      </Head>
      <main className="bg-dark min-h-screen text-white px-4 md:px-10 py-10">
        <SectionTitle title="🔎 Search Anime" />

        {/* Search Input */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row items-stretch gap-3"
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

        {/* Search Result */}
        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-neutral-700 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : query && anime.length === 0 ? (
            <p className="text-center text-zinc-400 mt-10">
              No results found for <span className="text-white font-semibold">"{query}"</span>.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {anime.map((a) => (
                <AnimeCard key={a.id} anime={a} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
