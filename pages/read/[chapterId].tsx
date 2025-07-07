'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'

export default function ReadPage() {
  const router = useRouter()
  const chapterIdRaw = router.query.chapterId

  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Validasi: harus string
    if (typeof chapterIdRaw !== 'string') return

    const chapterId = chapterIdRaw

    async function load() {
      try {
        setLoading(true)
        const chapter = await fetchChapterImages(chapterId)
        const fullImages = chapter.data.map(
          (file: string) => `${chapter.baseUrl}/data/${chapter.hash}/${file}`
        )
        setImages(fullImages)
      } catch (err) {
        console.error('[Read Error]', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [chapterIdRaw])

  return (
    <main className="p-4 text-white">
      <h1 className="text-xl font-bold mb-4">📖 Reading Chapter</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Page ${idx + 1}`}
              className="w-full rounded-md"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </main>
  )
}
