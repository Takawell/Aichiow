'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'

export default function ReadPage() {
  const router = useRouter()
  const { chapterId } = router.query

  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ✅ Validasi: pastikan chapterId adalah string
    if (!chapterId || typeof chapterId !== 'string') return

    async function load() {
      try {
        setLoading(true)
        const chapter = await fetchChapterImages(chapterId)

        // ✅ Fallback jika `data` kosong, gunakan `dataSaver`
        const fullImages = (chapter.data?.length ? chapter.data : chapter.dataSaver).map(
          (file: string) => `${chapter.baseUrl}/data/${chapter.hash}/${file}`
        )

        setImages(fullImages)
      } catch (err) {
        console.error('[Read Error]', err)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [chapterId])

  return (
    <main className="p-4 text-white">
      <h1 className="text-xl font-bold mb-4">📖 Reading Chapter</h1>
      {loading ? (
        <p>Loading...</p>
      ) : images.length === 0 ? (
        <p className="text-zinc-400">❌ No images found for this chapter.</p>
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
