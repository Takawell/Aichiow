'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { MdArrowBack } from 'react-icons/md'
import { motion } from 'framer-motion'

export default function ReadPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [nextId, setNextId] = useState<string | null>(null)
  const [prevId, setPrevId] = useState<string | null>(null)
  const [mode, setMode] = useState<'scroll' | 'swipe'>('scroll')
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    if (!router.isReady) return

    const raw = router.query.chapterId
    const chapterId =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : ''

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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentPage < images.length - 1) {
      setCurrentPage(currentPage + 1)
    }
    if (direction === 'right' && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-neutral-900/80 backdrop-blur px-4 py-3 border-b border-neutral-800 shadow-md">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition"
        >
          <MdArrowBack size={18} />
          Back
        </button>
        <span className="text-sm tracking-wide text-neutral-400">
          📖 Chapter Reader
        </span>

        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('scroll')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
              mode === 'scroll'
                ? 'bg-blue-500 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            Scroll
          </button>
          <button
            onClick={() => setMode('swipe')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
              mode === 'swipe'
                ? 'bg-blue-500 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            Swipe
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full">
        {loading && (
          <div className="text-center py-16 text-zinc-400 animate-pulse text-lg">
            Loading chapter...
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-500 font-semibold text-lg">
            {error}
          </div>
        )}

        {!loading && !error && images.length > 0 && (
          <>
            {/* Scroll Mode */}
            {mode === 'scroll' && (
              <div className="space-y-6">
                {images.map((src, idx) => (
                  <motion.img
                    key={idx}
                    src={src}
                    alt={`Page ${idx + 1}`}
                    loading="lazy"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="w-full h-auto object-contain rounded-lg shadow-lg border border-neutral-800 hover:scale-[1.01] transition-transform"
                  />
                ))}
              </div>
            )}

            {/* Swipe Mode */}
            {mode === 'swipe' && (
              <div className="relative w-full flex items-center justify-center overflow-hidden">
                <motion.img
                  key={currentPage}
                  src={images[currentPage]}
                  alt={`Page ${currentPage + 1}`}
                  className="w-full h-auto object-contain rounded-lg shadow-lg border border-neutral-800"
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -200, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -100) handleSwipe('left')
                    if (info.offset.x > 100) handleSwipe('right')
                  }}
                />

                {/* Page Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-xs px-3 py-1 rounded-full">
                  {currentPage + 1} / {images.length}
                </div>
              </div>
            )}
          </>
        )}

        {/* Chapter Navigation */}
        <div className="flex justify-between items-center gap-4 mt-12">
          <button
            onClick={() => handleNavigation(prevId)}
            disabled={!prevId}
            className={`flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold rounded-lg transition ${
              prevId
                ? 'bg-zinc-800 hover:bg-zinc-700 text-white shadow-md'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <FiChevronLeft size={18} />
            Previous Chapter
          </button>

          <button
            onClick={() => handleNavigation(nextId)}
            disabled={!nextId}
            className={`flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold rounded-lg transition ${
              nextId
                ? 'bg-zinc-800 hover:bg-zinc-700 text-white shadow-md'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Next Chapter
            <FiChevronRight size={18} />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-neutral-600 py-6 border-t border-neutral-800">
        ✨ End of Chapter ✨
      </footer>
    </div>
  )
}
