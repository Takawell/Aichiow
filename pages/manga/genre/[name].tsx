'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getMangaByFilter } from '@/lib/mangadex'
import MangaGrid from '@/components/manga/MangaGrid'

export default function MangaByGenrePage() {
  const router = useRouter()
  const { name } = router.query
  const [mangaList, setMangaList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!name) return
    async function load() {
      setLoading(true)
      try {
        const result = await getMangaByFilter({ includedTags: [name as string] })
        setMangaList(result)
      } catch (err) {
        console.error('Failed to load manga by genre:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [name])

  return (
    <main className="px-4 md:px-8 py-8 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 capitalize">
        📚 Genre: {decodeURIComponent(name as string)}
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
