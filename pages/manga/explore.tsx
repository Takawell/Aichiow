'use client'

import { useEffect, useState } from 'react'
import {
  fetchPopularManga,
  fetchGenres,
  searchManga,
  getMangaByFilter,
} from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'

export default function ExploreMangaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [genres, setGenres] = useState<any[]>([])
  const [selectedGenreId, setSelectedGenreId] = useState('')
  const [mangaList, setMangaList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Load genre dan default manga saat mount
  useEffect(() => {
    async function loadInitial() {
      setLoading(true)
      const [popular, tags] = await Promise.all([
        fetchPopularManga(),
        fetchGenres(),
      ])
      setMangaList(popular)
      setGenres(tags)
      setLoading(false)
    }
    loadInitial()
  }, [])

  // Handle Search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchTerm.length > 1) {
        setLoading(true)
        const result = await searchManga(searchTerm)
        setMangaList(result)
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchTerm])

  // Handle Genre Filter
  useEffect(() => {
    async function loadGenre() {
      if (selectedGenreId) {
        setLoading(true)
        const result = await getMangaByFilter({ includedTags: [selectedGenreId] })
        setMangaList(result)
        setLoading(false)
      }
    }
    loadGenre()
  }, [selectedGenreId])

  return (
    <main className="px-4 md:px-8 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Explore Manga</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search manga..."
          className="w-full bg-zinc-800 text-white rounded-md px-4 py-2 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map((tag: any) => (
          <button
            key={tag.id}
            onClick={() =>
              setSelectedGenreId(tag.id === selectedGenreId ? '' : tag.id)
            }
            className={`px-3 py-1 rounded-full text-sm border ${
              tag.id === selectedGenreId
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-zinc-800 border-zinc-600 text-zinc-300'
            }`}
          >
            {tag.attributes.name.en}
          </button>
        ))}
      </div>

      {/* Manga Result */}
      {loading ? (
        <p className="text-zinc-400 text-center">Loading...</p>
      ) : mangaList.length > 0 ? (
        <MangaGrid mangaList={mangaList} />
      ) : (
        <p className="text-zinc-500 text-center">No manga found.</p>
      )}
    </main>
  )
}
