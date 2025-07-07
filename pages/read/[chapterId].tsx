'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchChapterImages } from '@/lib/mangadex'
import Image from 'next/image'

export default function MangaReaderPage() {
  const router = useRouter()
  const { chapterId } = router.query

  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!chapterId || typeof chapterId !== 'string') return

    async function load() {
      try {
        setLoading(true)
        const chapter = await fetchChapterImages(chapterId)
        const fullImages = chapter.data.map(
          (file: string) => `${chapter.baseUrl}/data/${chapter.hash}/${file}`
        )
        setImages(fullImages)
      } catch (err) {
        setError('Failed to load chapter images.')
        console.error('Reader error:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [chapterId])

  return (
    <main className="min-h-screen bg-black text-white py-8 px-4 md:px-12">
      <h1 className="text-xl font-bold mb-6 text-center">
        📖 Chapter Viewer
      </h1>

      {loading && <p className="text-zinc-400 text-center">Loading chapter...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex flex-col items-center gap-4">
        {images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Page ${index + 1}`}
            width={800}
            height={1200}
            className="rounded-lg w-full max-w-4xl shadow-md"
            unoptimized
          />
        ))}
      </div>
    </main>
  )
}
