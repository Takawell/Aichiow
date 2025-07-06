// pages/search.tsx
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
        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder="Search for anime..."
            className="w-full px-4 py-2 bg-neutral-800 text-white rounded-md focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md font-medium"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
          {isLoading
            ? [...Array(10)].map((_, i) => (
                <div key={i} className="h-64 bg-neutral-700 animate-pulse rounded-xl" />
              ))
            : anime.map((a) => <AnimeCard key={a.id} anime={a} />)}
        </div>
      </main>
    </>
  )
}
