'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchManhwaDetail } from '@/lib/anilistManhwa'
import { ManhwaDetail } from '@/types/manhwa'
import { useFavorites } from '@/hooks/useFavorites'
import { Heart, Share2 } from 'lucide-react'
import { FaArrowLeft } from 'react-icons/fa'
import ShareModal from '@/components/shared/ShareModal'
import { searchManga, fetchChapters, sortChapters } from '@/lib/mangadex'

function LoadingSkeleton() {
  return (
    <div className="bg-gray-950 min-h-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black via-gray-950 to-gray-950" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative w-full h-[280px] sm:h-[320px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        
        <div className="absolute bottom-4 left-3 right-3 sm:bottom-6 sm:left-5 md:bottom-8 md:left-8 z-10 flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-black to-black rounded-xl blur-md animate-pulse" />
            <div className="relative w-[100px] sm:w-[120px] md:w-[160px] aspect-[2/3] bg-gray-800/80 rounded-xl border border-sky-500/30 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-3 pb-1">
            <div className="space-y-2">
              <div className="h-5 sm:h-6 md:h-8 bg-gray-800/80 rounded-lg w-3/4 max-w-md animate-pulse" />
              <div className="h-4 bg-gray-800/50 rounded w-1/3 max-w-[120px] animate-pulse" />
            </div>
            <div className="hidden sm:flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-7 w-16 bg-sky-500/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-28 bg-gray-800/70 rounded-lg animate-pulse" />
              <div className="h-9 w-20 bg-gray-800/70 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-5 md:px-8 mt-4 sm:mt-6">
        <div className="flex flex-wrap gap-2 mb-4 sm:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-6 w-14 bg-sky-500/20 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-800/40 rounded animate-pulse" style={{ width: `${100 - i * 12}%`, animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </div>

      <section className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 md:px-8 mt-8 sm:mt-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-sky-500/20 rounded-lg animate-pulse" />
          <div className="h-5 w-24 bg-gray-800/60 rounded animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-11 bg-gray-900/60 rounded-lg border border-gray-800/50 animate-pulse flex items-center justify-between px-3" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center gap-2">
                <div className="w-20 h-4 bg-sky-500/20 rounded" />
                <div className="w-32 h-3 bg-gray-800/50 rounded hidden sm:block" />
              </div>
              <div className="w-16 h-3 bg-gray-800/40 rounded" />
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 md:px-8 mt-8 sm:mt-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-sky-500/20 rounded-lg animate-pulse" />
          <div className="h-5 w-28 bg-gray-800/60 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-900/60 rounded-xl border border-gray-800/50 overflow-hidden animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="relative w-full aspect-[3/4] bg-gray-800/60" />
              <div className="p-2 space-y-1.5">
                <div className="h-3 bg-gray-800/80 rounded w-4/5" />
                <div className="h-2.5 bg-gray-800/50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 md:px-8 mt-8 sm:mt-10 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-sky-500/20 rounded-lg animate-pulse" />
          <div className="h-5 w-16 bg-gray-800/60 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-900/60 rounded-xl border border-gray-800/50 overflow-hidden animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="relative w-full aspect-[3/4] bg-gray-800/60" />
              <div className="p-2 space-y-1.5">
                <div className="h-3 bg-gray-800/80 rounded w-4/5" />
                <div className="h-2.5 bg-gray-800/50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-4 py-2 bg-gray-900/95 backdrop-blur-md rounded-full border border-sky-500/30 shadow-lg shadow-sky-500/20">
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
          </div>
          <span className="text-xs sm:text-sm text-gray-300">Loading manhwa details...</span>
        </motion.div>
      </div>
    </div>
  )
}

export default function ManhwaDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [manhwa, setManhwa] = useState<ManhwaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [mangaDexId, setMangaDexId] = useState<string | null>(null)
  const [chapters, setChapters] = useState<any[]>([])
  const [loadingChapters, setLoadingChapters] = useState(false)
  const [langFilter, setLangFilter] = useState<'all' | 'en' | 'id'>('all')
  const { isFavorite, toggleFavorite, loading: favLoading } = useFavorites({
    mediaId: id ? Number(id) : undefined,
    mediaType: 'manhwa',
  })

  useEffect(() => {
    if (id) {
      setLoading(true)
      fetchManhwaDetail(Number(id))
        .then((data) => setManhwa(data))
        .finally(() => setLoading(false))
    }
  }, [id])

  useEffect(() => {
    if (manhwa) {
      const title = manhwa.title.english || manhwa.title.romaji || manhwa.title.native || ''
      if (!title) return
      setLoadingChapters(true)
      searchManga(title).then((results) => {
        if (results.length > 0) {
          const md = results[0]
          setMangaDexId(md.id)
          fetchChapters(md.id)
            .then((chs) => setChapters(sortChapters(chs)))
            .finally(() => setLoadingChapters(false))
        } else {
          setLoadingChapters(false)
        }
      })
    }
  }, [manhwa])

  const filteredChapters = chapters.filter(ch => {
    if (langFilter === 'all') return true
    return ch.attributes.translatedLanguage === langFilter
  })

  if (loading) return <LoadingSkeleton />
  if (!manhwa) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black via-gray-950 to-gray-950" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-900/80 rounded-2xl border border-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm sm:text-base mb-4">Manhwa not found.</p>
          <Link href="/manhwa" className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 rounded-lg text-sky-400 text-sm transition">
            <FaArrowLeft className="w-3 h-3" />
            Back to Manhwa
          </Link>
        </motion.div>
      </div>
    )
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = manhwa.title.english || manhwa.title.romaji || 'Manhwa'

  return (
    <div className="bg-gray-950 min-h-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black via-gray-950 to-gray-950" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl" />

      <div className="relative w-full h-[280px] sm:h-[320px] md:h-[400px] overflow-hidden">
        {manhwa.bannerImage ? (
          <Image src={manhwa.bannerImage} alt={manhwa.title.english || manhwa.title.romaji || 'banner'} fill priority className="object-cover brightness-[0.3]" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="absolute bottom-4 left-3 right-3 sm:bottom-6 sm:left-5 md:bottom-8 md:left-8 z-10 flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="relative flex-shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/30 to-sky-600/30 rounded-xl blur-md" />
            <div className="relative w-[100px] sm:w-[120px] md:w-[160px] aspect-[2/3] rounded-xl overflow-hidden border border-sky-500/30 shadow-xl shadow-sky-500/20">
              <Image src={manhwa.coverImage.extraLarge || manhwa.coverImage.large} alt={manhwa.title.english || manhwa.title.romaji || 'cover'} fill className="object-cover" />
            </div>
          </motion.div>
          
          <div className="flex-1 min-w-0 pb-1">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-lg leading-tight line-clamp-2">
              {manhwa.title.english || manhwa.title.romaji}
            </motion.h1>
            {manhwa.averageScore && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sky-400 mt-1.5 text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {(manhwa.averageScore / 10).toFixed(1)}/10
              </motion.p>
            )}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="hidden sm:flex flex-wrap gap-1.5 mt-2">
              {manhwa.genres?.slice(0, 4).map((genre, i) => (
                <Link key={genre} href={`/manhwa/genre/${encodeURIComponent(genre)}`} className="px-2.5 py-1 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-500/40 text-sky-400 text-xs transition">
                  {genre}
                </Link>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-2 mt-3">
              <button onClick={toggleFavorite} disabled={favLoading} className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${isFavorite ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30' : 'bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80'}`}>
                <Heart size={14} className={isFavorite ? 'fill-current' : ''} />
                <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>
              <button onClick={() => setShowShare(true)} className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 transition">
                <Share2 size={14} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <ShareModal open={showShare} setOpen={setShowShare} url={shareUrl} title={shareTitle} thumbnail={manhwa.coverImage.large} />

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-5 md:px-8 mt-4 sm:mt-6">
        {manhwa.genres && manhwa.genres.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5 mb-3 sm:hidden">
            {manhwa.genres.map((genre) => (
              <Link key={genre} href={`/manhwa/genre/${encodeURIComponent(genre)}`} className="px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs">
                {genre}
              </Link>
            ))}
          </motion.div>
        )}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
          {manhwa.description?.replace(/<[^>]+>/g, '')}
        </motion.p>
      </div>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 md:px-8 mt-8 sm:mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-base sm:text-lg font-bold">Chapters</h2>
            {filteredChapters.length > 0 && <span className="text-xs text-gray-500">({filteredChapters.length})</span>}
          </div>

          {chapters.length > 0 && (
            <div className="relative inline-flex items-center bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-1.5 border border-gray-800/50 shadow-2xl shadow-sky-500/10">
              <motion.div
                className="absolute inset-1.5 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 rounded-xl shadow-lg shadow-sky-500/50"
                layoutId="activeTab"
                initial={false}
                animate={{
                  x: langFilter === 'all' ? 0 : langFilter === 'en' ? 'calc(100% + 4px)' : 'calc(200% + 8px)',
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 30,
                  mass: 0.8
                }}
                style={{ 
                  width: 'calc(33.333% - 4px)',
                }}
              />
              <button
                onClick={() => setLangFilter('all')}
                className={`relative z-10 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  langFilter === 'all' 
                    ? 'text-white scale-105' 
                    : 'text-gray-400 hover:text-gray-300 hover:scale-105'
                }`}
              >
               <span className="relative z-10 flex items-center gap-1.5">
                  <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${langFilter === 'all' ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  All
                </span>
              </button>
              <button
                onClick={() => setLangFilter('en')}
                className={`relative z-10 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  langFilter === 'en' 
                    ? 'text-white scale-105' 
                    : 'text-gray-400 hover:text-gray-300 hover:scale-105'
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${langFilter === 'en' ? 'scale-110' : 'scale-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  EN
                </span>
              </button>
              <button
                onClick={() => setLangFilter('id')}
                className={`relative z-10 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  langFilter === 'id' 
                    ? 'text-white scale-105' 
                    : 'text-gray-400 hover:text-gray-300 hover:scale-105'
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${langFilter === 'id' ? 'scale-110' : 'scale-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  ID
                </span>
              </button>
            </div>
          )}
        </div>

        {loadingChapters ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-11 bg-gray-900/60 rounded-lg border border-gray-800/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredChapters.length > 0 ? (
              <motion.div key={langFilter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex flex-col gap-2">
                {filteredChapters.map((ch, i) => (
                  <motion.div key={ch.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                    <Link href={`/read/${ch.id}`} className="group flex items-center justify-between px-3 py-2.5 bg-gray-900/60 hover:bg-gray-800/80 rounded-lg border border-gray-800/50 hover:border-sky-500/30 transition">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-semibold text-sky-400 group-hover:text-sky-300 whitespace-nowrap">Ch. {ch.attributes.chapter || '?'}</span>
                        {ch.attributes.title && <span className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 truncate">- {ch.attributes.title}</span>}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-800/80 text-gray-500 rounded">{ch.attributes.translatedLanguage?.toUpperCase()}</span>
                        <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{new Date(ch.attributes.publishAt).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : chapters.length > 0 ? (
              <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-500 text-sm text-center py-8">
                No chapters available for this language.
              </motion.p>
            ) : (
              <p className="text-gray-500 text-sm">No chapters found.</p>
            )}
          </AnimatePresence>
        )}
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 md:px-8 mt-8 sm:mt-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-bold">Characters</h2>
        </div>
        {manhwa.characters?.edges && manhwa.characters.edges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {manhwa.characters.edges.map((char, i) => (
              <motion.div key={char.node.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 + i * 0.03 }} whileHover={{ scale: 1.03 }} className="group bg-gray-900/60 hover:bg-gray-800/80 rounded-xl border border-gray-800/50 hover:border-sky-500/30 overflow-hidden transition">
                <div className="relative w-full aspect-[3/4]">
                  <Image src={char.node.image.large} alt={char.node.name.full} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-2">
                  <p className="text-xs sm:text-sm font-medium text-sky-400 group-hover:text-white truncate transition">{char.node.name.full}</p>
                  <p className="text-[10px] sm:text-xs text-sky-400">{char.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No character data available.</p>
        )}
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 md:px-8 mt-8 sm:mt-10 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-bold">Staff</h2>
        </div>
        {manhwa.staff?.edges && manhwa.staff.edges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {manhwa.staff.edges.map((st, i) => (
              <motion.div key={st.node.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.65 + i * 0.03 }} whileHover={{ scale: 1.03 }} className="group bg-gray-900/60 hover:bg-gray-800/80 rounded-xl border border-gray-800/50 hover:border-sky-500/30 overflow-hidden transition">
                <div className="relative w-full aspect-[3/4]">
                  <Image src={st.node.image.large} alt={st.node.name.full} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-2">
                  <p className="text-xs sm:text-sm font-medium text-sky-400 group-hover:text-white truncate transition">{st.node.name.full}</p>
                  {st.role && <p className="text-[10px] sm:text-xs text-sky-400 truncate">{st.role}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No staff data available.</p>
        )}
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 md:px-8 pb-8">
        <Link href="/manhwa" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 rounded-lg text-white text-sm font-medium shadow-lg shadow-sky-500/20 transition">
          <FaArrowLeft className="w-3 h-3" />
          Back to Manhwa
        </Link>
      </motion.div>
    </div>
  )
}
