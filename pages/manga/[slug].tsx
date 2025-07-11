'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchChapters, fetchMangaDetail, getCoverImage, getLocalizedTitle } from '@/lib/mangadex'
import { fetchMangaCharacters } from '@/lib/anilist'
import Image from 'next/image'
import Link from 'next/link'

export default function MangaDetailPage() {
  const router = useRouter()
  const { slug } = router.query

  const [manga, setManga] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])
  const [characters, setCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!slug) return

    async function load() {
      try {
        setLoading(true)

        const id = Array.isArray(slug) ? slug[0] : slug || ''
        const detail = await fetchMangaDetail(id)

        if (!detail || !detail.id) {
          throw new Error('Invalid manga detail')
        }

        const chapterList = await fetchChapters(id)

        const sortedChapters = [...chapterList].sort((a, b) => {
          const numA = parseFloat(a.attributes.chapter || '0')
          const numB = parseFloat(b.attributes.chapter || '0')
          return numB - numA
        })

        setManga(detail)
        setChapters(sortedChapters)

        const title = getLocalizedTitle(detail.attributes?.title || {})
        const chars = await fetchMangaCharacters(title)
        setCharacters(chars || [])
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

  const title = getLocalizedTitle(manga.attributes?.title || {})
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
            {chapters.map((chapter) => {
              const chapterNumber = chapter.attributes.chapter || '?'
              const chapterTitle = chapter.attributes.title || `Chapter ${chapterNumber}`
              return (
                <li key={chapter.id}>
                  <Link
                    href={`/read/${chapter.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    Chapter {chapterNumber}: {chapterTitle}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-zinc-500">No chapters available.</p>
        )}
      </section>

      {characters.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-4">🧑‍🎤 Characters & Voice Actors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {characters.map((char: any, index: number) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-xl flex flex-col items-center text-center shadow"
              >
                <img
                  src={char.node.image?.large}
                  alt={char.node.name.full}
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
                <p className="font-medium">{char.node.name.full}</p>
                {char.voiceActors?.[0] && (
                  <div className="mt-2 text-sm text-gray-400">
                    <p>VA: {char.voiceActors[0].name.full}</p>
                    <img
                      src={char.voiceActors[0].image?.large}
                      alt={char.voiceActors[0].name.full}
                      className="w-10 h-10 rounded-full mx-auto mt-1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
