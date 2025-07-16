'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'

export default function ReadPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [nextId, setNextId] = useState<string | null>(null)
  const [prevId, setPrevId] = useState<string | null>(null)

  useEffect(() => {
    if (!router.isReady) return

    const raw = router.query.chapterId
    const chapterId = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : ''

    if (!chapterId) {
      setError('No chapter ID provided.')
      setLoading(false)
      return
    }

    async function loadImages() {
      try {
        setLoading(true)

        const chapter = await fetchChapterImages(chapterId)

        if (!chapter || !chapter.hash || !chapter.baseUrl) {
          throw new Error('Invalid chapter data')
        }

        const fileList = chapter.data?.length ? chapter.data : chapter.dataSaver
        const mode = chapter.data?.length ? 'data' : 'data-saver'

        if (!fileList || fileList.length === 0) {
          throw new Error('No images found')
        }

        const full = fileList.map(
          (file: string) => `${chapter.baseUrl}/${mode}/${chapter.hash}/${file}`
        )

        setImages(full)
        setNextId(chapter.next ?? null)
        setPrevId(chapter.prev ?? null)
      } catch (err: any) {
        console.error(err)
        setError('Failed to load chapter.')
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [router.isReady, router.query.chapterId])

  const handleNavigation = (targetId: string | null) => {
    if (targetId) {
      router.push(`/read/${targetId}`)
      window.scrollTo(0, 0)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-40 flex items-center justify-between bg-neutral-900/80 backdrop-blur px-4 py-3 border-b border-neutral-800">
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-400 hover:underline"
        >
          ← Back
        </button>
        <span className="text-sm text-neutral-400">Reader</span>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading && (
          <div className="text-center py-10 text-zinc-400 animate-pulse">
            Loading chapter...
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500 font-medium">{error}</div>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="space-y-6">
            {images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Page ${idx + 1}`}
                loading="lazy"
                className="w-full object-contain rounded-md shadow border border-neutral-800"
              />
            ))}
          </div>
        )}

        {/* Chapter Navigation */}
        <div className="flex justify-between items-center gap-4 mt-10">
          <button
            onClick={() => handleNavigation(prevId)}
            disabled={!prevId}
            className={`w-full py-3 text-sm font-semibold rounded-md transition ${
              prevId
                ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            ← Previous Chapter
          </button>

          <button
            onClick={() => handleNavigation(nextId)}
            disabled={!nextId}
            className={`w-full py-3 text-sm font-semibold rounded-md transition ${
              nextId
                ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Next Chapter →
          </button>
        </div>
      </main>

      <footer className="text-center text-xs text-neutral-600 py-6">End of Chapter</footer>
    </div>
  )
}
