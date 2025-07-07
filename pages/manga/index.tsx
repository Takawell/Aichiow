'use client'

import { useEffect, useState } from 'react'
import { fetchPopularManga, fetchGenres, searchManga } from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import Link from 'next/link'

export default function MangaHomePage() {
  const [mangaList, setMangaList] = useState<any[]>([])
  const [genres, setGenres] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const data = await fetchPopularManga()
      const genreData = await fetchGenres()
      setMangaList(data)
      setGenres(genreData)
    }
    load()
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query) return
    const result = await searchManga(query)
    setSearchResults(result)
  }

  const displayedManga = searchResults.length > 0 ? searchResults : mangaList

  return (
    <main className="px-4 md:px-8 py-8">
      {/* Hero Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">📚 Explore Manga</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search manga..."
          className="w-full p-2 rounded-md bg-zinc-800 text-white border border-zinc-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Genre Filter (optional, bisa lanjut nanti) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map((genre) => (
          <Link
            href={`/manga/genre/${genre.id}`}
            key={genre.id}
            className="px-3 py-1 bg-zinc-700 text-sm rounded-full hover:bg-zinc-600 transition"
          >
            {genre.attributes.name.en}
          </Link>
        ))}
      </div>

      {/* Manga Grid */}
      <MangaGrid mangaList={displayedManga} />
    </main>
  )
}
