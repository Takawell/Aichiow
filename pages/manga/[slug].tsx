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
  const [showFullDesc, setShowFullDesc] = useState(false)

  useEffect(() => {
    if (!slug) return

    async function load() {
      try {
        setLoading(true)

        const id = Array.isArray(slug) ? slug[0] : slug || ''
        const detail = await fetchMangaDetail(id)

        if (!detail || !detail.id) throw new Error('Invalid manga detail')

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

  if (loading) return <p className="text-center text-zinc-400 mt-20">Loading manga...</p>
  if (error || !manga) return <p className="text-center text-red-500 mt-20">{error || 'Manga not found.'}</p>

  const title = getLocalizedTitle(manga.attributes?.title || {})
  const description = manga.attributes?.description?.en || 'No description available.'
  const cover = manga.relationships.find((rel: any) => rel.type === 'cover_art')
  const coverUrl = getCoverImage(manga.id, cover?.attributes?.fileName || '')
  const tags = manga.attributes.tags || []

  return (
    <main className="relative bg-neutral-950 text-white">
      {/* Banner blur background */}
      <div className="absolute inset-0 -z-10 opacity-10 blur-lg">
        <Image
          src={coverUrl}
          alt="banner"
          fill
          className="object-cover"
        />
      </div>

      <section className="px-4 md:px-8 py-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-full md:w-60 aspect-[3/4] rounded-xl overflow-hidden border border-zinc-700 shadow-xl">
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 6).map((tag: any) => (
                <span
                  key={tag.attributes.name?.en}
                  className="text-xs bg-white/10 text-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm"
                >
                  {tag.attributes.name?.en}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className={`text-sm text-zinc-300 whitespace-pre-line ${!showFullDesc ? 'line-clamp-5' : ''}`}>
              {description}
            </p>
            {description.length > 200 && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="mt-2 text-blue-400 hover:underline text-sm"
              >
                {showFullDesc ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>

        {/* Chapters */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4">📚 Chapters</h2>
          {chapters.length > 0 ? (
            <ul className="grid md:grid-cols-2 gap-3">
              {chapters.map((chapter) => {
                const chapterNumber = chapter.attributes.chapter || '?'
                const chapterTitle = chapter.attributes.title || `Chapter ${chapterNumber}`
                return (
                  <li key={chapter.id}>
                    <Link
                      href={`/read/${chapter.id}`}
                      className="block px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition"
                    >
                      <span className="font-semibold text-indigo-400">Chapter {chapterNumber}</span>: {chapterTitle}
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-zinc-500">No chapters available.</p>
          )}
        </section>

        {/* Characters */}
        {characters.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold mb-4">🧑‍🎤 Characters & Voice Actors</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {characters.map((char: any, index: number) => (
                <div
                  key={index}
                  className="bg-zinc-900 p-4 rounded-xl flex flex-col items-center text-center shadow border border-zinc-800"
                >
                  <img
                    src={char.node.image?.large}
                    alt={char.node.name.full}
                    className="w-20 h-20 rounded-full object-cover mb-2"
                  />
                  <p className="font-medium text-sm">{char.node.name.full}</p>
                  {char.voiceActors?.[0] && (
                    <div className="mt-2 text-xs text-zinc-400">
                      <p>VA: {char.voiceActors[0].name.full}</p>
                      <img
                        src={char.voiceActors[0].image?.large}
                        alt={char.voiceActors[0].name.full}
                        className="w-8 h-8 rounded-full mx-auto mt-1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}
