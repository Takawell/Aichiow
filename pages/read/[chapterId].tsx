'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchChapterImages } from '@/lib/mangadex'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { MdArrowBack, MdFullscreen, MdFullscreenExit, MdArrowUpward, MdClose, MdLock, MdLogin, MdPersonAdd, MdBook, MdBlurOn, MdBlurOff } from 'react-icons/md'
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
  const [blurredPages, setBlurredPages] = useState<Set<number>>(new Set())

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
  }, [])

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
        
        const initialBlurred = new Set<number>()
        full.forEach((_: string, idx: number) => {
          if (Math.random() > 0.7) initialBlurred.add(idx)
        })
        setBlurredPages(initialBlurred)
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

  const toggleBlur = (pageIndex: number) => {
    setBlurredPages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(pageIndex)) {
        newSet.delete(pageIndex)
      } else {
        newSet.add(pageIndex)
      }
      return newSet
    })
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

  if (showAuthModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950 flex items-center justify-center p-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => router.back()}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative bg-gradient-to-br from-neutral-900/95 via-neutral-900/90 to-zinc-900/95 backdrop-blur-2xl border border-sky-500/30 rounded-3xl shadow-2xl shadow-sky-500/20 max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-transparent pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
              
              <button
                onClick={() => router.back()}
                className="absolute top-5 right-5 p-2.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-700/80 backdrop-blur-md transition-all duration-300 z-10 group border border-neutral-700/50 hover:border-neutral-600/50"
              >
                <MdClose className="text-neutral-400 group-hover:text-white transition-colors" size={22} />
              </button>

              <div className="relative p-10 space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                    className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-sky-500/60 border border-sky-400/30"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
                    <MdLock className="text-white relative z-10" size={36} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
                      Authentication Required
                    </h2>
                    <p className="text-neutral-400 text-sm leading-relaxed max-w-xs mx-auto">
                      Access exclusive content and unlock all reader features by signing in to your account
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3.5"
                >
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:via-sky-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-xl shadow-sky-500/40 hover:shadow-2xl hover:shadow-sky-500/60 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group border border-sky-400/30 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <MdLogin className="group-hover:rotate-12 transition-transform duration-300" size={22} />
                    <span className="relative">Sign In</span>
                  </button>

                  <button
                    onClick={() => router.push('/auth/register')}
                    className="w-full py-4 px-6 bg-neutral-800/80 hover:bg-neutral-700/80 text-white font-bold rounded-xl border-2 border-sky-500/40 hover:border-sky-400/60 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group shadow-lg hover:shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <MdPersonAdd className="group-hover:rotate-12 transition-transform duration-300" size={22} />
                    <span className="relative">Create Account</span>
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-6 border-t border-neutral-800/80"
                >
                  <p className="text-xs text-neutral-500 text-center leading-relaxed">
                    Protected by enterprise-grade security
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
          </div>
          <p className="text-neutral-400 font-medium tracking-wide">Loading content</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950 text-white flex flex-col">
      {mode === 'swipe' && (
        <motion.div
          className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 z-50 shadow-lg shadow-sky-500/60"
          style={{ width: `${((currentPage + 1) / images.length) * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentPage + 1) / images.length) * 100}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      )}

      <header className="sticky top-0 z-40 flex items-center justify-between bg-neutral-900/90 backdrop-blur-xl px-4 sm:px-6 py-4 border-b border-neutral-800/80 shadow-xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2.5 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-all duration-300 group"
        >
          <MdArrowBack size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex items-center gap-2 text-sm tracking-wide text-neutral-300 font-medium">
          <MdBook size={20} className="text-sky-400" />
          <span className="hidden sm:inline">Chapter Reader</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('scroll')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
              mode === 'scroll'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/50 scale-105'
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700/80 hover:text-neutral-200'
            }`}
          >
            Scroll
          </button>
          <button
            onClick={() => setMode('swipe')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
              mode === 'swipe'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/50 scale-105'
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700/80 hover:text-neutral-200'
            }`}
          >
            Swipe
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {error && (
          <div className="text-center py-20 text-red-400 font-bold text-lg bg-red-500/10 rounded-2xl border border-red-500/30">
            {error}
          </div>
        )}

        {images.length > 0 && (
          <>
            {mode === 'scroll' && (
              <div className="space-y-8">
                {images.map((src, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.5 }}
                    className="relative group"
                  >
                    <div className={`relative overflow-hidden rounded-2xl shadow-2xl border border-neutral-800/80 hover:border-sky-500/30 transition-all duration-500 ${blurredPages.has(idx) ? 'ring-2 ring-sky-500/50' : ''}`}>
                      <img
                        src={src}
                        alt={`Page ${idx + 1}`}
                        loading="lazy"
                        className={`w-full h-auto object-contain transition-all duration-500 ${
                          blurredPages.has(idx) ? 'blur-xl scale-105' : 'blur-0 scale-100'
                        }`}
                      />
                      {blurredPages.has(idx) && (
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 flex items-center justify-center backdrop-blur-sm">
                          <div className="text-center space-y-4 p-6">
                            <MdBlurOn className="mx-auto text-sky-400" size={48} />
                            <p className="text-white font-bold text-lg">Spoiler Protection</p>
                            <p className="text-neutral-300 text-sm max-w-xs">This page is hidden to prevent spoilers</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => toggleBlur(idx)}
                      className="absolute top-4 right-4 p-3 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md border border-neutral-700/50 hover:border-sky-500/50 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-xl"
                    >
                      {blurredPages.has(idx) ? (
                        <MdBlurOff className="text-sky-400" size={20} />
                      ) : (
                        <MdBlurOn className="text-neutral-400" size={20} />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {mode === 'swipe' && (
              <div className="relative w-full flex items-center justify-center min-h-[600px]" style={{ perspective: '2000px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    className="relative w-full max-w-4xl border border-neutral-800/80 hover:border-sky-500/30 transition-all duration-500"
                    initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
                    animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                    exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -100) handleSwipe('left')
                      if (info.offset.x > 100) handleSwipe('right')
                    }}
                    style={{
                      transformOrigin: 'center',
                      boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(14, 165, 233, 0.15)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}
                  >
                    <div className={`relative ${blurredPages.has(currentPage) ? 'blur-xl' : ''}`}>
                      <img
                        src={images[currentPage]}
                        alt={`Page ${currentPage + 1}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    {blurredPages.has(currentPage) && (
                      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 flex items-center justify-center backdrop-blur-md">
                        <div className="text-center space-y-6 p-8">
                          <MdBlurOn className="mx-auto text-sky-400 drop-shadow-lg" size={56} />
                          <div className="space-y-2">
                            <p className="text-white font-bold text-xl">Spoiler Alert</p>
                            <p className="text-neutral-300 text-sm max-w-sm">Click the button below to reveal this page</p>
                          </div>
                          <button
                            onClick={() => toggleBlur(currentPage)}
                            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-xl shadow-sky-500/40 transition-all duration-300 transform hover:scale-105"
                          >
                            Reveal Page
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-xl px-5 py-3 rounded-full shadow-2xl border border-neutral-700/50 flex items-center gap-3">
                  <span className="text-sky-400 font-bold text-sm">{currentPage + 1}</span>
                  <span className="text-neutral-600">/</span>
                  <span className="text-neutral-400 text-sm">{images.length}</span>
                </div>

                {!blurredPages.has(currentPage) && (
                  <button
                    onClick={() => toggleBlur(currentPage)}
                    className="absolute top-6 right-6 p-3 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-xl border border-neutral-700/50 hover:border-sky-500/50 transition-all duration-300 shadow-xl"
                  >
                    <MdBlurOn className="text-neutral-400 hover:text-sky-400 transition-colors" size={20} />
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16">
          <button
            onClick={() => handleNavigation(prevId)}
            disabled={!prevId}
            className={`flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 text-sm font-bold rounded-xl transition-all duration-300 transform ${
              prevId
                ? 'bg-neutral-800/80 hover:bg-neutral-700/80 text-white shadow-xl hover:shadow-2xl hover:scale-105 border border-neutral-700/50 hover:border-sky-500/30'
                : 'bg-neutral-900/50 text-neutral-600 cursor-not-allowed border border-neutral-800/50'
            }`}
          >
            <FiChevronLeft size={20} />
            Previous
          </button>
          <button
            onClick={() => handleNavigation(nextId)}
            disabled={!nextId}
            className={`flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 text-sm font-bold rounded-xl transition-all duration-300 transform ${
              nextId
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-xl shadow-sky-500/40 hover:shadow-2xl hover:shadow-sky-500/60 hover:scale-105'
                : 'bg-neutral-900/50 text-neutral-600 cursor-not-allowed border border-neutral-800/50'
            }`}
          >
            Next
            <FiChevronRight size={20} />
          </button>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={toggleFullscreen}
          className="p-4 rounded-xl bg-neutral-800/90 hover:bg-neutral-700/90 backdrop-blur-xl shadow-2xl border border-neutral-700/50 hover:border-sky-500/50 transition-all duration-300 transform hover:scale-110 group"
        >
          {isFullscreen ? (
            <MdFullscreenExit className="text-sky-400 group-hover:text-sky-300 transition-colors" size={22} />
          ) : (
            <MdFullscreen className="text-neutral-400 group-hover:text-sky-400 transition-colors" size={22} />
          )}
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-4 rounded-xl bg-neutral-800/90 hover:bg-neutral-700/90 backdrop-blur-xl shadow-2xl border border-neutral-700/50 hover:border-sky-500/50 transition-all duration-300 transform hover:scale-110 group"
        >
          <MdArrowUpward className="text-neutral-400 group-hover:text-sky-400 transition-colors" size={22} />
        </button>
      </div>

      <footer className="text-center text-sm text-neutral-600 py-8 border-t border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-2">
          <MdBook className="text-sky-500" size={18} />
          <span className="font-medium">End of Chapter</span>
        </div>
      </footer>
    </div>
  )
}
