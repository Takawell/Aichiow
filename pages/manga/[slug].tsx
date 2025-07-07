'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchMangaDetail, fetchChapters, getCoverImage } from '@/lib/mangadex'
import Link from 'next/link'

export default function MangaDetailPage() {
  const router = useRouter()
  const { slug } = router.query

  const [manga, setManga] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])

  useEffect(() => {
    if (!slug) return
    async function load() {
      try {
        const detail = await fetchMangaDetail(slug as string)
        setManga(detail)
        const ch = await fetchChapters(slug as string)
        setChapters(ch)
      } catch (err) {
        console.error('Failed to load manga detail:', err)
      }
    }
    load()
  }, [slug])

  if (!manga) return <div className="p-4 text-white">Loading...</div>

  const title = manga.attributes.title?.en || manga.attributes.title?.ja || 'Untitled'
  const description = manga.attributes.description?.en?.replace(/\[.*?\]/g, '') || 'No description.'
  const genres = manga.attributes.tags?.map((tag: any) => tag.attributes.name.en) || []
  const coverRel = manga.relationships.find((rel: any) => rel.type === 'cover_art')
  const coverFileName = coverRel?.attributes?.fileName || ''

  return (
    <main className="px-4 md:px-8 py-8 text-white">
      {/* Top section */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={getCoverImage(manga.id, coverFileName)}
          alt={title}
          className="w-48 md:w-64 rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map((g) => (
              <span
                key={g}
                className="bg-zinc-700 px-3 py-1 text-sm rounded-full"
              >
                {g}
              </span>
            ))}
          </div>
          <p className="text-sm text-zinc-300 whitespace-pre-line">{description}</p>
        </div>
      </div>

      {/* Chapter list */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">📖 Chapters</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {chapters.map((ch) => (
            <Link
              key={ch.id}
              href={`/read/${ch.id}`}
              className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-md text-sm transition"
            >
              Chapter {ch.attributes.chapter || 'Oneshot'} — {ch.attributes.title || 'No title'}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
    }
                                                                
