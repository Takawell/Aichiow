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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-64 md:h-80 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl backdrop-blur" />
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-48 h-64 bg-gradient-to-br from-purple-800/40 to-blue-800/40 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gradient-to-r from-purple-800/40 to-transparent rounded-xl w-3/4" />
                <div className="h-4 bg-purple-800/30 rounded-lg w-full" />
                <div className="h-4 bg-purple-800/30 rounded-lg w-5/6" />
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-purple-700/40 rounded-full" />
                  <div className="h-8 w-20 bg-blue-700/40 rounded-full" />
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="text-6xl">📚</div>
          <p className="text-xl text-red-400">{error || 'Light Novel tidak ditemukan.'}</p>
          <Link href="/light-novel" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all">
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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
        <div className="relative w-full h-[320px] md:h-[450px] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-40 relative z-10 pb-20">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex-shrink-0"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500" />
                <img
                  src={coverSrc}
                  alt={title}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = fallbackCover)}
                  className="relative w-48 sm:w-56 md:w-64 lg:w-72 rounded-2xl shadow-2xl object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 space-y-6"
            >
              <div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                >
                  {title}
                </motion.h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {novel.genres.map((g, idx) => (
                    <motion.span
                      key={g}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + idx * 0.05 }}
                      className="px-4 py-1.5 bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all"
                    >
                      {g}
                    </motion.span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <motion.button
                    onClick={toggleFavorite}
                    disabled={favLoading || !Number.isFinite(numericId)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                      isFavorite
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-red-500/50'
                        : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:shadow-gray-500/50'
                    } ${favLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <FaHeart className={isFavorite ? 'text-red-200' : 'text-white'} />
                    <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setShareOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-blue-500/50 shadow-lg transition-all"
                  >
                    <FaShareAlt />
                    <span className="hidden sm:inline">Share</span>
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: FaStar, label: 'Score', value: novel.averageScore ? `${novel.averageScore}/100` : 'N/A', color: 'from-yellow-500 to-orange-500' },
                  { icon: FaBook, label: 'Volumes', value: novel.volumes ?? 'N/A', color: 'from-purple-500 to-pink-500' },
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
                    <div className="absolute -inset-0.5 bg-gradient-to-r opacity-50 group-hover:opacity-100 rounded-xl blur transition duration-300" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                    <div className="relative bg-slate-900/90 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                      <stat.icon className={`text-2xl mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                      <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                      <div className="font-bold text-white truncate">{stat.value}</div>
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
            className="mt-12"
          >
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {['info', 'characters', 'staff'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl font-semibold capitalize whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50'
                      : 'bg-slate-800/50 hover:bg-slate-800 text-gray-400'
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
                  className="space-y-6"
                >
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur" />
                    <div className="relative bg-slate-900/70 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/10">
                      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Description</h2>
                      <div className="text-gray-300 leading-relaxed">
                        <div
                          className={`prose prose-invert max-w-none ${expanded ? '' : 'line-clamp-6'}`}
                          dangerouslySetInnerHTML={{ __html: novel.description || 'No description available.' }}
                        />
                        {novel.description && (
                          <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-4 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {expanded ? '▲ Show less' : '▼ Read more'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-slate-900/60 backdrop-blur-sm p-5 rounded-xl border border-white/10">
                          <div className="text-sm text-gray-400 mb-2">{info.label}</div>
                          <div className="text-lg font-bold text-white">{info.value}</div>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {novel.characters.map((char: LightNovelCharacter, idx) => (
                        <motion.div
                          key={char.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ y: -8 }}
                          className="relative group cursor-pointer"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300" />
                          <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={char.image.large}
                                alt={char.name.full}
                                loading="lazy"
                                onError={(e) => (e.currentTarget.src = '/fallback.png')}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-3">
                              <div className="font-semibold text-sm line-clamp-1 mb-1">{char.name.full}</div>
                              {char.role && (
                                <div className="text-xs text-purple-400 font-medium">{char.role}</div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">No character data available</div>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {novel.staff.map((person: LightNovelStaff, idx) => (
                        <motion.div
                          key={person.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ y: -8 }}
                          className="relative group cursor-pointer"
                        >
                         <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300" />
                          <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={person.image.large}
                                alt={person.name.full}
                                loading="lazy"
                                onError={(e) => (e.currentTarget.src = '/fallback.png')}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-3">
                              <div className="font-semibold text-sm line-clamp-1">{person.name.full}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">No staff data available</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Link href="/light-novel" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all">
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
