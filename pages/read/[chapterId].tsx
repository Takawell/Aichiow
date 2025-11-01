'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { MdArrowBack, MdFullscreen, MdFullscreenExit, MdArrowUpward } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'

export default function ReadPage() {
  const router = useRouter()
  const { chapterId } = router.query

  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [nextId, setNextId] = useState<string | null>(null)
  const [prevId, setPrevId] = useState<string | null>(null)
  const [mode, setMode] = useState<'scroll' | 'swipe'>('scroll')
  const [currentPage, setCurrentPage] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
    }
    checkUser()
  }, [router])

  useEffect(() => {
    if (!router.isReady || !user) return
    const raw = router.query.chapterId
    const chapterIdStr =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : ''

    if (!chapterIdStr) {
      setError('No chapter ID provided.')
      setLoading(false)
      return
    }

    const loadImages = async () => {
      try {
        setLoading(true)
        const chapter = await fetchChapterImages(chapterIdStr)

        if (!chapter || !chapter.hash || !chapter.baseUrl) {
          throw new Error('Invalid chapter data')
        }

        const fileList = chapter.data?.length ? chapter.data : chapter.dataSaver
        const modeStr = chapter.data?.length ? 'data' : 'data-saver'

        if (!fileList || fileList.length === 0) {
          throw new Error('No images found')
        }

        const full = fileList.map(
          (file: string) => `${chapter.baseUrl}/${modeStr}/${chapter.hash}/${file}`
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
  }, [router.isReady, router.query.chapterId, user])

  const handleNavigation = (targetId: string | null) => {
    if (targetId) {
      router.push(`/read/${targetId}`)
      setCurrentPage(0)
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (mode === 'swipe') {
        if (e.key === 'ArrowRight') handleSwipe('left')
        if (e.key === 'ArrowLeft') handleSwipe('right')
      }
      if (e.key === 'f') toggleFullscreen()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mode, currentPage])

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {mode === 'swipe' && (
        <motion.div
          className="fixed top-0 left-0 h-1 bg-blue-500 z-50"
          style={{ width: `${((currentPage + 1) / images.length) * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentPage + 1) / images.length) * 100}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      )}

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

      <main className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full">
        {error && (
          <div className="text-center py-16 text-red-500 font-semibold text-lg">
            {error}
          </div>
        )}

        {images.length > 0 && (
          <>
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

            {mode === 'swipe' && (
              <div
                className="relative w-full flex items-center justify-center overflow-hidden"
                style={{ perspective: '2000px' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    className="relative w-full max-w-4xl"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -100) handleSwipe('left')
                      if (info.offset.x > 100) handleSwipe('right')
                    }}
                    style={{
                      transformOrigin: 'center left',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={images[currentPage]}
                      alt={`Page ${currentPage + 1}`}
                      className="w-full h-auto object-contain"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-4 right-4 bg-black/60 text-xs px-3 py-1 rounded-full">
                  {currentPage + 1} / {images.length}
                </div>
              </div>
            )}
          </>
        )}

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

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={toggleFullscreen}
          className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 shadow-lg"
        >
          {isFullscreen ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 shadow-lg"
        >
          <MdArrowUpward size={20} />
        </button>
      </div>

      <footer className="text-center text-xs text-neutral-600 py-6 border-t border-neutral-800">
        ✨ End of Chapter ✨
      </footer>
    </div>
  )
}
