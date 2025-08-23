'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { MdArrowBack, MdViewDay, MdViewCarousel } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

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
        setCurrentPage(0)
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

  const handleSwipeNext = () => {
    if (currentPage < images.length - 1) setCurrentPage((p) => p + 1)
  }

  const handleSwipePrev = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1)
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
        <span className="text-sm tracking-wide text-neutral-400">📖 Chapter Reader</span>
        <button
          onClick={() => setMode(mode === 'scroll' ? 'swipe' : 'scroll')}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
        >
          {mode === 'scroll' ? (
            <>
              <MdViewCarousel size={18} /> Swipe Mode
            </>
          ) : (
            <>
              <MdViewDay size={18} /> Scroll Mode
            </>
          )}
        </button>
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
            {mode === 'scroll' ? (
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
                    className="w-full object-contain rounded-lg shadow-lg border border-neutral-800 hover:scale-[1.01] transition-transform"
                  />
                ))}
              </div>
            ) : (
              <div className="relative w-full aspect-[3/4] flex items-center justify-center bg-black rounded-lg overflow-hidden shadow-xl border border-neutral-800">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPage}
                    src={images[currentPage]}
                    alt={`Page ${currentPage + 1}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="max-h-full max-w-full object-contain"
                  />
                </AnimatePresence>

                {/* Swipe Controls */}
                {currentPage > 0 && (
                  <button
                    onClick={handleSwipePrev}
                    className="absolute left-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
                  >
                    <FiChevronLeft size={28} />
                  </button>
                )}
                {currentPage < images.length - 1 && (
                  <button
                    onClick={handleSwipeNext}
                    className="absolute right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
                  >
                    <FiChevronRight size={28} />
                  </button>
                )}

                {/* Page Indicator */}
                <div className="absolute bottom-3 px-3 py-1 rounded-full bg-black/60 text-xs text-neutral-300">
                  Page {currentPage + 1} / {images.length}
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
