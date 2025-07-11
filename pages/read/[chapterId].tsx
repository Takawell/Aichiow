'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'

export default function ReadPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const raw = router.query.chapterId
  const chapterId = Array.isArray(raw) ? raw[0] : raw

  useEffect(() => {
    if (!chapterId) return

    async function load() {
      try {
        setLoading(true)

        const chapter = await fetchChapterImages(chapterId)

        if (!chapter || !chapter.baseUrl || !chapter.hash) {
          throw new Error('Invalid chapter data from API')
        }

        const { baseUrl, hash, data, dataSaver } = chapter

        // Pakai data normal, fallback ke dataSaver jika kosong
        const files = Array.isArray(data) && data.length > 0 ? data : dataSaver
        const mode = data?.length > 0 ? 'data' : 'data-saver'

        if (!files || files.length === 0) {
          throw new Error('No images found in this chapter.')
        }

        const fullImages = files.map(
          (file: string) => `${baseUrl}/${mode}/${hash}/${file}`
        )

        setImages(fullImages)
      } catch (err: any) {
        console.error('[ReadPage Error]', err.message || err)
        setError('❌ Failed to load chapter images.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [chapterId])

  return (
    <main className="p-4 md:px-10 text-white max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        📖 Reading Chapter {chapterId || 'Unknown'}
      </h1>

      {loading ? (
        <p className="text-zinc-400">Loading pages...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-6">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Page ${idx + 1}`}
              className="w-full rounded-md shadow"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </main>
  )
}
