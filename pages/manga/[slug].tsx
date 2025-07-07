'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchChapters, fetchMangaDetail } from '@/lib/mangadex'
import { getCoverImage } from '@/lib/mangadex'
import Image from 'next/image'
import Link from 'next/link'

export default function MangaDetailPage() {
  const router = useRouter()
  const { slug } = router.query

  const [manga, setManga] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!slug) return

    async function load() {
      try {
        setLoading(true)

        // ✅ FIX: safely handle slug type
        const id = Array.isArray(slug) ? slug[0] : slug || ''

        const detail = await fetchMangaDetail(id)
        const chapterList = await fetchChapters(id)

        setManga(detail)
        setChapters(chapterList)
      } catch (err: any) {
        console.error('[Detail Manga Error]', err)
        setError('Failed to load manga detail.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [slug])

  if (loading) {
    return <p className="text-center text-zinc-400 mt-20">Loading manga...</p>
  }

  if (error || !manga) {
    return <p className="text-center text-red-500 mt-20">{error || 'Manga not found.'}</p>
  }

  const title = manga.attributes?.title?.en || manga.attributes?.title?.ja || 'Untitled'
  const description = manga.attributes?.description?.en || 'No description available.'
  const cover = manga.relationships.find((rel: any) => rel.type === 'cover_art')
  const coverUrl = getCoverImage(manga.id, cover?.attributes?.fileName || '')

  return (
    <main className="px-4 md:px-8 py-10 text-white max-w-5xl mx-auto">
      <section className="flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-64 aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-zinc-800">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-zinc-400 text-sm whitespace-pre-line">{description}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">📚 Chapters</h2>
        {chapters.length > 0 ? (
          <ul className="space-y-2">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/read/${chapter.id}`}
                  className="text-blue-400 hover:underline"
                >
                  Chapter {chapter.attributes.chapter || '?'}: {chapter.attributes.title || 'No title'}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">No chapters available.</p>
        )}
      </section>
    </main>
  )
}
