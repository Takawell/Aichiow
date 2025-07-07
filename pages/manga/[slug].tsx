'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  fetchMangaDetail,
  fetchChapters,
  getCoverImage,
} from '@/lib/mangadex'
import Image from 'next/image'
import Link from 'next/link'

export default function MangaDetailPage() {
  const router = useRouter()
  const { slug } = router.query

  const [manga, setManga] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return

    async function load() {
      try {
        setLoading(true)

        const detail = await fetchMangaDetail(slug)
        const chapterList = await fetchChapters(slug)

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
    return <div className="p-4 text-white">Loading...</div>
  }

  if (error || !manga) {
    return (
      <div className="p-4 text-red-500 font-semibold text-center">
        Manga not found or failed to load.
      </div>
    )
  }

  const title =
    manga.attributes.title?.en ||
    manga.attributes.title?.ja ||
    'Untitled'

  const description =
    manga.attributes.description?.en?.slice(0, 500) || 'No description'

  const cover = manga.relationships.find(
    (rel: any) => rel.type === 'cover_art'
  )
  const coverFileName = cover?.attributes?.fileName || ''

  const author = manga.relationships.find(
    (rel: any) => rel.type === 'author'
  )?.attributes?.name

  return (
    <main className="px-4 md:px-8 py-10 text-white">
      {/* Detail Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 max-w-xs">
          <Image
            src={getCoverImage(manga.id, coverFileName)}
            alt={title}
            width={400}
            height={600}
            className="rounded-lg object-cover w-full h-auto shadow-lg"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm text-zinc-400 mb-2">
            <span className="font-medium text-zinc-300">Author:</span> {author || 'Unknown'}
          </p>
          <p className="text-zinc-300 text-sm whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>

      {/* Chapter List */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">📖 Chapters</h2>
        {chapters.length > 0 ? (
          <ul className="space-y-2">
            {chapters.map((chap) => (
              <li key={chap.id}>
                <Link
                  href={`/read/${chap.id}`}
                  className="block bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm transition"
                >
                  Chapter {chap.attributes.chapter || 'N/A'} -{' '}
                  {chap.attributes.title || 'No Title'}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-400">No chapters available.</p>
        )}
      </div>
    </main>
  )
}
