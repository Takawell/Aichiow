'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'
import { FiChevronLeft, FiChevronRight, FiX, FiLogIn, FiUserPlus } from 'react-icons/fi'
import { MdArrowBack, MdFullscreen, MdFullscreenExit, MdArrowUpward, MdLock } from 'react-icons/md'
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
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setShowAuthModal(true)
        setLoading(false)
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

  if (loading && !showAuthModal) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => router.back()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl"></div>
              
              <div className="relative bg-gradient-to-br from-neutral-900/95 via-neutral-900/98 to-neutral-800/95 backdrop-blur-2xl rounded-3xl border border-neutral-700/50 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <button
                  onClick={() => router.back()}
                  className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 transition-all duration-300 backdrop-blur-sm border border-neutral-700/50 hover:scale-110 active:scale-95 group"
                >
                  <FiX size={20} className="text-neutral-300 group-hover:text-white transition-colors" />
                </button>

                <div className="p-8 sm:p-10 lg:p-12">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <MdLock className="text-white text-4xl sm:text-5xl relative z-10" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                  >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Authentication Required
                    </h2>
                    <p className="text-neutral-400 text-sm sm:text-base leading-relaxed px-2">
                      Login or create an account to continue reading premium content
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3 sm:space-y-4"
                  >
                    <button
                      onClick={() => router.push('/auth/login')}
                      className="group w-full relative overflow-hidden py-4 sm:py-5 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <FiLogIn className="text-xl sm:text-2xl relative z-10 group-hover:rotate-12 transition-transform" />
                      <span className="relative z-10 text-base sm:text-lg">Login to Continue</span>
                    </button>

                    <button
                      onClick={() => router.push('/auth/register')}
                      className="group w-full relative overflow-hidden py-4 sm:py-5 px-6 bg-neutral-800/80 hover:bg-neutral-700/80 backdrop-blur-sm text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 border-2 border-neutral-700/50 hover:border-neutral-600 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <FiUserPlus className="text-xl sm:text-2xl relative z-10 group-hover:scale-110 transition-transform" />
                      <span className="relative z-10 text-base sm:text-lg">Create Account</span>
                    </button>

                    <button
                      onClick={() => router.back()}
                      className="w-full py-3 sm:py-4 text-neutral-400 hover:text-white font-medium transition-all duration-300 text-sm sm:text-base hover:bg-neutral-800/30 rounded-xl"
                    >
                      Go Back
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 pt-6 border-t border-neutral-700/50"
                  >
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-neutral-500">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span>Secure authentication powered by Supabase</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'swipe' && user && (
        <motion.div
          className="fixed top-0 left-0 h-1 bg-blue-500 z-50"
          style={{ width: `${((currentPage + 1) / images.length) * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentPage + 1) / images.length) * 100}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      )}

      {user && (
        <>
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
        </>
      )}
    </div>
  )
}
