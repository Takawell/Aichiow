'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'

export default function ReadPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = router.query.chapterId

    // ✅ Validasi aman dan eksplisit
    const chapterId = typeof raw === 'string'
      ? raw
      : Array.isArray(raw)
      ? raw[0]
      : undefined

    if (!chapterId) return // ✅ skip kalau undefined

    async function load() {
      try {
        setLoading(true)
        const chapter = await fetchChapterImages(chapterId)
        const fullImages = (chapter.data?.length ? chapter.data : chapter.dataSaver).map(
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
  }, [router.query.chapterId])

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
