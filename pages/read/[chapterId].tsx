'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'

export default function MangaReaderPage() {
  const router = useRouter()
  const { chapterId } = router.query

  const [images, setImages] = useState<string[]>([])
  const [baseUrl, setBaseUrl] = useState('')
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!chapterId) return

    async function load() {
      try {
        const res = await fetchChapterImages(chapterId as string)
        setImages(res.data)
        setHash(res.hash)
        setBaseUrl(res.baseUrl)
        setLoading(false)
      } catch (err) {
        console.error('Failed to load chapter images:', err)
        setLoading(false)
      }
    }

    load()
  }, [chapterId])

  if (loading) {
    return <div className="text-white p-4">Loading chapter...</div>
  }

  if (!images.length) {
    return <div className="text-white p-4">No images found for this chapter.</div>
  }

  return (
    <main className="px-2 sm:px-4 md:px-8 py-6 bg-black min-h-screen">
      <div className="flex flex-col items-center gap-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={`${baseUrl}/data/${hash}/${img}`}
            alt={`Page ${i + 1}`}
            className="w-full max-w-3xl rounded shadow-lg"
            loading="lazy"
          />
        ))}
      </div>
    </main>
  )
}
