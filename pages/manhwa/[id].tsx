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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-gray-950 to-gray-950" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 px-3 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          <div className="relative w-full md:w-48 lg:w-56 aspect-[3/4] mx-auto md:mx-0 max-w-[200px] md:max-w-none">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-sky-600/20 rounded-xl blur-md animate-pulse" />
            <div className="relative w-full h-full bg-gray-900/80 rounded-xl border border-sky-500/10 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="h-6 sm:h-7 bg-gray-800/80 rounded-lg w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-800/50 rounded w-1/2 animate-pulse" />
            </div>

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 w-16 bg-gray-800/60 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>

            <div className="flex gap-2">
              <div className="h-9 w-24 bg-gray-800/70 rounded-lg animate-pulse" />
              <div className="h-9 w-20 bg-gray-800/70 rounded-lg animate-pulse" />
            </div>

            <div className="space-y-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3 bg-gray-800/40 rounded animate-pulse" style={{ width: `${100 - i * 15}%`, animationDelay: `${i * 50}ms` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-sky-500/20 rounded-lg animate-pulse" />
            <div className="h-5 w-24 bg-gray-800/60 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-900/60 rounded-lg border border-gray-800/50 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        </div>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/90 backdrop-blur-md rounded-full border border-sky-500/20">
            <div className="w-4 h-4 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            <span className="text-xs sm:text-sm text-gray-400">Loading manhwa details...</span>
          </div>
        </div>
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
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFullDesc, setShowFullDesc] = useState(false)

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
            .then((chs) => {
              const sorted = [...chs].sort((a, b) => {
                const numA = parseFloat(a.attributes.chapter || '0')
                const numB = parseFloat(b.attributes.chapter || '0')
                return numB - numA
              })
              setChapters(sorted)
            })
            .finally(() => setLoadingChapters(false))
        } else {
          setLoadingChapters(false)
        }
      })
    }
  }, [manhwa])

  const filteredChapters = chapters
    .filter(ch => {
      if (langFilter !== 'all' && ch.attributes.translatedLanguage !== langFilter) return false
      if (searchQuery) {
        const chNum = ch.attributes.chapter || ''
        const chTitle = ch.attributes.title || ''
        const query = searchQuery.toLowerCase()
        return chNum.includes(query) || chTitle.toLowerCase().includes(query)
      }
      return true
    })
    .sort((a, b) => {
      const numA = parseFloat(a.attributes.chapter || '0')
      const numB = parseFloat(b.attributes.chapter || '0')
      return sortOrder === 'asc' ? numA - numB : numB - numA
    })

  if (loading) return <LoadingSkeleton />

  if (!manhwa) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-gray-950 to-gray-950" />
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
  const description = manhwa.description?.replace(/<[^>]+>/g, '') || 'No description available.'

  return (
    <main className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-gray-950 to-gray-950" />
      <div className="absolute inset-0 -z-10 opacity-5">
        <Image src={manhwa.coverImage.extraLarge || manhwa.coverImage.large} alt="banner" fill className="object-cover blur-2xl" />
      </div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <section className="px-3 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="relative w-full md:w-48 lg:w-56 aspect-[3/4] mx-auto md:mx-0 max-w-[180px] md:max-w-none flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/30 to-sky-600/30 rounded-xl blur-md" />
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-sky-500/20 shadow-xl shadow-sky-500/10">
                <Image src={manhwa.coverImage.extraLarge || manhwa.coverImage.large} alt={shareTitle} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                {shareTitle}
              </motion.h1>

              {manhwa.averageScore && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="text-sky-400 mb-3 text-sm font-medium flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {(manhwa.averageScore / 10).toFixed(1)}/10
                </motion.p>
              )}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                {manhwa.genres?.slice(0, 6).map((genre, i) => (
                  <Link key={genre} href={`/manhwa/genre/${encodeURIComponent(genre)}`} className="text-[10px] sm:text-xs bg-sky-500/10 text-sky-300 px-2 py-1 rounded-full border border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500/40 transition">
                    {genre}
                  </Link>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex gap-2 mb-4">
                <button onClick={toggleFavorite} disabled={favLoading} className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${isFavorite ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30' : 'bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80'}`}>
                  <Heart size={14} className={isFavorite ? 'fill-current' : ''} />
                  <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
                </button>
                <button onClick={() => setShowShare(true)} className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 transition">
                  <Share2 size={14} />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <p className={`text-xs sm:text-sm text-gray-400 leading-relaxed whitespace-pre-line ${!showFullDesc ? 'line-clamp-4 sm:line-clamp-5' : ''}`}>
                  {description}
                </p>
                {description.length > 200 && (
                  <button onClick={() => setShowFullDesc(!showFullDesc)} className="mt-2 text-sky-400 hover:text-sky-300 text-xs sm:text-sm font-medium transition">
                    {showFullDesc ? '← Show less' : 'Read more →'}
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8 sm:mt-10">
            <div className="flex flex-col gap-4 mb-4 sm:mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500/20 to-sky-600/20 rounded-xl border border-sky-500/20 flex items-center justify-center shadow-lg shadow-sky-500/10">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Chapters</h2>
                    <span className="text-xs sm:text-sm text-gray-500">({filteredChapters.length})</span>
                  </div>
                </div>

                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-900/80 hover:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-800/50 hover:border-sky-500/30 transition-all group shadow-lg">
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-sky-400 transition-all duration-300 ${sortOrder === 'asc' ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                </button>
              </div>

              <div className="relative">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search chapters..." className="w-full px-4 sm:px-5 py-3.5 sm:py-4 pl-11 sm:pl-12 bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 focus:border-sky-500/50 focus:bg-gray-900/80 rounded-xl text-sm sm:text-base text-gray-200 placeholder-gray-500 outline-none transition-all shadow-lg" />
                <svg className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition p-1 hover:bg-gray-800/50 rounded-lg">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="relative inline-flex items-center w-full bg-gray-900/60 backdrop-blur-sm rounded-xl p-1.5 border border-gray-800/50 shadow-lg">
                <motion.div className="absolute inset-1.5 bg-gradient-to-r from-sky-500 to-sky-600 rounded-lg shadow-lg shadow-sky-500/30" initial={false} animate={{ x: langFilter === 'all' ? 0 : langFilter === 'en' ? '100%' : '200%' }} transition={{ type: 'spring', stiffness: 400, damping: 35 }} style={{ width: '33.333%' }} />
                <button onClick={() => setLangFilter('all')} className={`relative z-10 flex-1 px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors ${langFilter === 'all' ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}>
                  All
                </button>
                <button onClick={() => setLangFilter('en')} className={`relative z-10 flex-1 px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors ${langFilter === 'en' ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}>
                  EN
                </button>
                <button onClick={() => setLangFilter('id')} className={`relative z-10 flex-1 px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors ${langFilter === 'id' ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}>
                  ID
                </button>
              </div>
            </div>

            {loadingChapters ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-900/60 rounded-xl border border-gray-800/50 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {filteredChapters.length > 0 ? (
                  <motion.ul key={`${langFilter}-${searchQuery}-${sortOrder}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {filteredChapters.map((chapter, i) => {
                      const chapterNumber = chapter.attributes.chapter || '?'
                      const chapterTitle = chapter.attributes.title || `Chapter ${chapterNumber}`
                      const lang = chapter.attributes.translatedLanguage?.toUpperCase()
                    return (
                        <motion.li key={chapter.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                          <Link href={`/read/${chapter.id}`} className="group flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 bg-gray-900/60 hover:bg-gray-800/80 rounded-xl border border-gray-800/50 hover:border-sky-500/30 transition-all shadow-lg hover:shadow-sky-500/10">
                            <span className="text-xs sm:text-sm font-bold text-sky-400 group-hover:text-sky-300 whitespace-nowrap min-w-[60px] sm:min-w-[70px]">Ch. {chapterNumber}</span>
                            <span className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-200 truncate flex-1">{chapterTitle}</span>
                            <span className="text-[10px] sm:text-xs px-2 py-1 bg-gray-800/80 text-gray-400 rounded-md font-medium">{lang}</span>
                          </Link>
                        </motion.li>
                      )
                    })}
                  </motion.ul>
                ) : chapters.length > 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 sm:py-16">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-900/80 rounded-2xl border border-gray-800/50 flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base font-medium mb-2">No chapters found</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Try adjusting your filters or search query</p>
                  </motion.div>
                ) : (
                  <motion.div key="no-chapters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 sm:py-16">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-900/80 rounded-2xl border border-gray-800/50 flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base font-medium mb-2">No chapters available</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Chapters will appear here when available</p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.section>

          {manhwa.characters?.edges && manhwa.characters.edges.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 sm:mt-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500/20 to-sky-600/20 rounded-xl border border-sky-500/20 flex items-center justify-center shadow-lg shadow-sky-500/10">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Characters</h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                {manhwa.characters.edges.map((char, i) => (
                  <motion.div key={char.node.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 + i * 0.03 }} className="group bg-gray-900/60 hover:bg-gray-800/80 p-2 sm:p-3 rounded-xl border border-gray-800/50 hover:border-sky-500/30 flex flex-col items-center text-center transition-all shadow-lg hover:shadow-sky-500/10">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 mb-2">
                      <img src={char.node.image.large} alt={char.node.name.full} className="w-full h-full rounded-full object-cover ring-2 ring-gray-800 group-hover:ring-sky-500/30 transition" />
                    </div>
                    <p className="font-medium text-[10px] sm:text-xs text-gray-300 group-hover:text-white line-clamp-2 transition">{char.node.name.full}</p>
                    <p className="text-[8px] sm:text-[10px] text-sky-400 mt-0.5">{char.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {manhwa.staff?.edges && manhwa.staff.edges.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 sm:mt-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500/20 to-sky-600/20 rounded-xl border border-sky-500/20 flex items-center justify-center shadow-lg shadow-sky-500/10">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Staff</h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                {manhwa.staff.edges.map((st, i) => (
                  <motion.div key={st.node.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.65 + i * 0.03 }} className="group bg-gray-900/60 hover:bg-gray-800/80 p-2 sm:p-3 rounded-xl border border-gray-800/50 hover:border-sky-500/30 flex flex-col items-center text-center transition-all shadow-lg hover:shadow-sky-500/10">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 mb-2">
                      <img src={st.node.image.large} alt={st.node.name.full} className="w-full h-full rounded-full object-cover ring-2 ring-gray-800 group-hover:ring-sky-500/30 transition" />
                    </div>
                    <p className="font-medium text-[10px] sm:text-xs text-gray-300 group-hover:text-white line-clamp-2 transition">{st.node.name.full}</p>
                    {st.role && <p className="text-[8px] sm:text-[10px] text-sky-400 mt-0.5 line-clamp-1">{st.role}</p>}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </section>

        <ShareModal open={showShare} setOpen={setShowShare} url={shareUrl} title={shareTitle} thumbnail={manhwa.coverImage.large} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="max-w-6xl mx-auto px-3 sm:px-5 md:px-6 lg:px-8 pb-8">
          <Link href="/manhwa" className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 rounded-xl text-white text-sm sm:text-base font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 transition-all">
            <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back to Manhwa
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
