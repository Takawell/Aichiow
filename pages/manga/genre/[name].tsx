'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchGenres, getMangaByFilter } from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'

export default function MangaByGenrePage() {
  const router = useRouter()
  const { name } = router.query

  const [mangaList, setMangaList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [genreName, setGenreName] = useState<string | null>(null)

  useEffect(() => {
    if (!name) return

    async function load() {
      setLoading(true)
      try {
        const genres = await fetchGenres()

        // Cari genre berdasarkan slug
        const matched = genres.find((tag: any) =>
          tag.attributes.name.en.toLowerCase() === String(name).toLowerCase()
        )

        if (!matched) {
          console.warn('Genre not found:', name)
          setMangaList([])
          setGenreName(null)
          return
        }

        setGenreName(matched.attributes.name.en)

        const result = await getMangaByFilter({ includedTags: [matched.id] })
        setMangaList(result)
      } catch (err) {
        console.error('Failed to load manga by genre:', err)
        setMangaList([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [name])

  return (
    <main className="px-4 md:px-8 py-8 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 capitalize">
        📚 Genre: {genreName || 'Not Found'}
      </h1>

      {loading ? (
        <p className="text-zinc-300">Loading manga...</p>
      ) : mangaList.length === 0 ? (
        <p className="text-zinc-300">No manga found for this genre.</p>
      ) : (
        <MangaGrid mangaList={mangaList} />
      )}
    </main>
  )
}
