'use client'

import { useEffect, useState } from 'react'
import { fetchGenres, fetchPopularManga, searchManga, getMangaByFilter } from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ExploreMangaPage() {
  const [genres, setGenres] = useState<any[]>([])
  const [mangaList, setMangaList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedGenre = searchParams.get('genre') || ''

  useEffect(() => {
    async function loadGenres() {
      const tagData = await fetchGenres()
      setGenres(tagData)
    }
    loadGenres()
  }, [])

  useEffect(() => {
    async function loadManga() {
      setLoading(true)
      try {
        if (selectedGenre) {
          const filtered = await getMangaByFilter({ includedTags: [selectedGenre] })
          setMangaList(filtered)
        } else {
          const popular = await fetchPopularManga()
          setMangaList(popular)
        }
      } catch (e) {
        console.error('Error loading manga:', e)
        setMangaList([])
      } finally {
        setLoading(false)
      }
    }
    loadManga()
  }, [selectedGenre])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!search.trim()) return

    setLoading(true)
    try {
      const result = await searchManga(search)
      setMangaList(result)
    } catch (e) {
      console.error('Search error:', e)
    } finally {
      setLoading(false)
    }
  }

  function handleGenreChange(tagId: string) {
    router.push(`/manga/explore?genre=${tagId}`)
  }

  return (
    <main className="px-4 md:px-8 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">🔍 Explore Manga</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search manga..."
          className="w-full md:w-[300px] px-4 py-2 rounded-md bg-zinc-800 text-white placeholder:text-zinc-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold"
        >
          Search
        </button>
      </form>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => router.push('/manga/explore')}
          className={`px-3 py-1 rounded-md text-sm ${
            selectedGenre === ''
              ? 'bg-sky-600 font-semibold'
              : 'bg-zinc-700 hover:bg-zinc-600'
          }`}
        >
          All Genres
        </button>
        {genres.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleGenreChange(tag.id)}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedGenre === tag.id
                ? 'bg-sky-600 font-semibold'
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            {tag.attributes.name.en}
          </button>
        ))}
      </div>

      {/* Manga Grid */}
      {loading ? (
        <p className="text-zinc-400">Loading manga...</p>
      ) : mangaList.length > 0 ? (
        <MangaGrid mangaList={mangaList} />
      ) : (
        <p className="text-zinc-500">No manga found.</p>
      )}
    </main>
  )
}
