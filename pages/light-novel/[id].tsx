'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaShareAlt, FaBook, FaStar, FaClock, FaCalendar } from 'react-icons/fa'
import { fetchLightNovelDetail } from '@/lib/anilistLightNovel'
import { LightNovel, LightNovelCharacter, LightNovelStaff } from '@/types/lightNovel'
import { useFavorites } from '@/hooks/useFavorites'
import ShareModal from '@/components/shared/ShareModal'

export default function LightNovelDetail() {
  const router = useRouter()
  const { id } = router.query
  const [novel, setNovel] = useState<LightNovel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [bannerLoaded, setBannerLoaded] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const numericId = Number(id)

  const { isFavorite, toggleFavorite, loading: favLoading } = useFavorites({
    mediaId: Number.isFinite(numericId) ? numericId : undefined,
    mediaType: 'light_novel',
  })

  useEffect(() => {
    if (!id) return
    setError(null)
    setNovel(null)
    setBannerLoaded(false)

    const loadDetail = async () => {
      try {
        setLoading(true)
        const data = await fetchLightNovelDetail(Number(id))
        setNovel(data)
      } catch (e) {
        console.error(e)
        setError('Gagal memuat detail Light Novel.')
      } finally {
        setLoading(false)
      }
    }

    loadDetail()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  const fallbackBanner = '/fallback.png'
  const fallbackCover = '/fallback.png'

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-6xl">
          <div className="animate-pulse space-y-4 sm:space-y-6">
            <div className="h-48 sm:h-56 md:h-72 lg:h-80 bg-gradient-to-r from-sky-900/20 to-sky-700/20 rounded-2xl sm:rounded-3xl backdrop-blur" />
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 bg-gradient-to-br from-sky-800/30 to-sky-600/30 rounded-xl sm:rounded-2xl mx-auto sm:mx-0" />
              <div className="flex-1 space-y-3 sm:space-y-4">
                <div className="h-6 sm:h-8 bg-gradient-to-r from-sky-800/30 to-transparent rounded-lg w-3/4" />
                <div className="h-3 sm:h-4 bg-sky-800/20 rounded-lg w-full" />
                <div className="h-3 sm:h-4 bg-sky-800/20 rounded-lg w-5/6" />
                <div className="flex gap-2">
                  <div className="h-6 sm:h-8 w-16 sm:w-20 bg-sky-700/30 rounded-full" />
                  <div className="h-6 sm:h-8 w-16 sm:w-20 bg-sky-700/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !novel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="text-4xl sm:text-6xl">📚</div>
          <p className="text-base sm:text-xl text-red-400">{error || 'Light Novel tidak ditemukan.'}</p>
          <Link href="/light-novel" className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl hover:shadow-lg hover:shadow-sky-500/50 transition-all text-sm sm:text-base">
            Kembali
          </Link>
        </motion.div>
      </div>
    )
  }

  const title = novel.title.english || novel.title.romaji
  const bannerSrc = novel.bannerImage || novel.coverImage.extraLarge || fallbackBanner
  const coverSrc = novel.coverImage.extraLarge || novel.coverImage.large || fallbackCover
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <>
      <Head>
        <title>{`${title} | Light Novel Detail`}</title>
        <meta name="description" content={`Detail tentang Light Novel ${title}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={novel.description?.slice(0, 150) || 'No description'} />
        <meta property="og:image" content={coverSrc} />
        <meta property="og:url" content={shareUrl} />
      </Head>

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="relative w-full h-[240px] sm:h-[280px] md:h-[360px] lg:h-[420px] overflow-hidden">
          <motion.img
            src={bannerSrc}
            alt={title}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = fallbackBanner)}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={bannerLoaded ? { scale: 1, opacity: 1 } : { scale: 1.1, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            onLoad={() => setBannerLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-20 sm:-mt-24 md:-mt-32 lg:-mt-40 relative z-10 pb-16 sm:pb-20">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex-shrink-0 mx-auto sm:mx-0"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl sm:rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-500" />
                <img
                  src={coverSrc}
                  alt={title}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = fallbackCover)}
                  className="relative w-40 sm:w-44 md:w-52 lg:w-64 rounded-xl sm:rounded-2xl shadow-2xl object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 space-y-4 sm:space-y-6"
            >
              <div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-3 sm:mb-4 bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent text-center sm:text-left"
                >
                  {title}
                </motion.h1>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 justify-center sm:justify-start">
                  {novel.genres.map((g, idx) => (
                    <motion.span
                      key={g}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + idx * 0.05 }}
                      className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-sky-600/80 to-sky-700/80 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg hover:shadow-sky-500/50 hover:scale-105 transition-all"
                    >
                      {g}
                    </motion.span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start">
                  <motion.button
                    onClick={toggleFavorite}
                    disabled={favLoading || !Number.isFinite(numericId)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold shadow-lg transition-all text-xs sm:text-sm ${
                      isFavorite
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-red-500/50'
                        : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:shadow-gray-500/50'
                    } ${favLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <FaHeart className={`text-sm sm:text-base ${isFavorite ? 'text-red-200' : 'text-white'}`} />
                    <span className="hidden xs:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setShareOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold bg-gradient-to-r from-sky-600 to-sky-700 hover:shadow-sky-500/50 shadow-lg transition-all text-xs sm:text-sm"
                  >
                    <FaShareAlt className="text-sm sm:text-base" />
                    <span className="hidden xs:inline">Share</span>
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {[
                  { icon: FaStar, label: 'Score', value: novel.averageScore ? `${novel.averageScore}/100` : 'N/A', color: 'from-yellow-500 to-orange-500' },
                  { icon: FaBook, label: 'Volumes', value: novel.volumes ?? 'N/A', color: 'from-sky-500 to-sky-600' },
                  { icon: FaClock, label: 'Status', value: novel.status || 'Unknown', color: 'from-green-500 to-emerald-500' },
                  { icon: FaCalendar, label: 'Chapters', value: novel.chapters ?? 'N/A', color: 'from-blue-500 to-cyan-500' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r opacity-40 group-hover:opacity-100 rounded-lg sm:rounded-xl blur transition duration-300" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                    <div className="relative bg-gray-900/90 backdrop-blur-sm p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-white/10">
                      <stat.icon className={`text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                      <div className="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">{stat.label}</div>
                      <div className="font-bold text-white text-xs sm:text-sm md:text-base truncate">{stat.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 sm:mt-10 md:mt-12"
          >
            <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {['info', 'characters', 'staff'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold capitalize whitespace-nowrap transition-all text-xs sm:text-sm ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 shadow-lg shadow-sky-500/50'
                      : 'bg-gray-800/50 hover:bg-gray-800 text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-sky-600/20 to-sky-700/20 rounded-xl sm:rounded-2xl blur" />
                    <div className="relative bg-gray-900/70 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-white/10">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">Description</h2>
                      <div className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        <div
                          className={`prose prose-invert prose-sm sm:prose-base max-w-none ${expanded ? '' : 'line-clamp-4 sm:line-clamp-6'}`}
                          dangerouslySetInnerHTML={{ __html: novel.description || 'No description available.' }}
                        />
                        {novel.description && (
                          <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                          >
                            {expanded ? '▲ Show less' : '▼ Read more'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { label: 'Start Date', value: novel.startDate ? `${novel.startDate.day}/${novel.startDate.month}/${novel.startDate.year}` : 'N/A' },
                      { label: 'End Date', value: novel.endDate ? `${novel.endDate.day}/${novel.endDate.month}/${novel.endDate.year}` : 'N/A' },
                    ].map((info, idx) => (
                      <motion.div
                        key={info.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                        className="relative group"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600/30 to-sky-700/30 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-gray-900/60 backdrop-blur-sm p-4 sm:p-5 rounded-lg sm:rounded-xl border border-white/10">
                          <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">{info.label}</div>
                          <div className="text-base sm:text-lg font-bold text-white">{info.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'characters' && (
                <motion.div
                  key="characters"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  {novel.characters && novel.characters.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
                      {novel.characters.map((char: LightNovelCharacter, idx) => (
                        <motion.div
                          key={char.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ y: -8 }}
                          className="relative group cursor-pointer"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-700 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300" />
                          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-hidden border border-white/10">
                            <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                              <img
                                src={char.image.large}
                                alt={char.name.full}
                                loading="lazy"
                                onError={(e) => (e.currentTarget.src = '/fallback.png')}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-2 sm:p-3">
                              <div className="font-semibold text-xs sm:text-sm line-clamp-1 mb-0.5 sm:mb-1">{char.name.full}</div>
                              {char.role && (
                                <div className="text-[10px] sm:text-xs text-sky-400 font-medium">{char.role}</div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 sm:py-12 text-gray-400 text-sm sm:text-base">No character data available</div>
                  )}
                </motion.div>
              )}

              {activeTab === 'staff' && (
                <motion.div
                  key="staff"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  {novel.staff && novel.staff.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
                      {novel.staff.map((person: LightNovelStaff, idx) => (
                        <motion.div
                          key={person.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ y: -8 }}
                          className="relative group cursor-pointer"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-700 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300" />
                          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-hidden border border-white/10">
                            <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                              <img
                                src={person.image.large}
                                alt={person.name.full}
                                loading="lazy"
                                onError={(e) => (e.currentTarget.src = '/fallback.png')}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-2 sm:p-3">
                              <div className="font-semibold text-xs sm:text-sm line-clamp-1">{person.name.full}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 sm:py-12 text-gray-400 text-sm sm:text-base">No staff data available</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 sm:mt-12 text-center"
          >
            <Link href="/light-novel" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-sky-600 to-sky-700 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-sky-500/50 hover:scale-105 transition-all text-sm sm:text-base">
              <span>←</span>
              <span>Back to Light Novels</span>
            </Link>
          </motion.div>
        </section>
      </div>

      <ShareModal
        open={shareOpen}
        setOpen={setShareOpen}
        title={title}
        url={shareUrl}
        thumbnail={coverSrc}
      />
    </>
  )
}
