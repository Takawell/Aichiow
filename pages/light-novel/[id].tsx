'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaShareAlt, FaBook, FaCalendar, FaStar, FaUsers, FaTimes, FaCopy, FaCheck, FaChevronDown, FaChevronUp, FaArrowLeft, FaSparkles } from 'react-icons/fa'
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
  const [scrollY, setScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const numericId = Number(id)

  const { isFavorite, toggleFavorite, loading: favLoading } = useFavorites({
    mediaId: Number.isFinite(numericId) ? numericId : undefined,
    mediaType: 'light_novel',
  })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!id) return
    setError(null)
    setNovel(null)
    setBannerLoaded(false)
    setImageLoaded(false)

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

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const fallbackBanner = '/fallback.png'
  const fallbackCover = '/fallback.png'

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-sky-950 text-white flex items-center justify-center">
        <div className="w-full max-w-6xl px-4 md:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 md:h-96 bg-gradient-to-r from-sky-900/20 via-gray-800/40 to-sky-900/20 rounded-2xl shimmer" />
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-48 h-72 bg-gradient-to-br from-sky-800/30 to-gray-800/30 rounded-xl shimmer" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gradient-to-r from-sky-700/30 to-gray-700/30 rounded-lg w-3/4 shimmer" />
                <div className="h-4 bg-gray-700/30 rounded w-full shimmer" />
                <div className="h-4 bg-gray-700/30 rounded w-5/6 shimmer" />
                <div className="flex gap-3">
                  <div className="h-10 w-32 bg-sky-700/30 rounded-full shimmer" />
                  <div className="h-10 w-32 bg-sky-700/30 rounded-full shimmer" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gradient-to-br from-sky-900/20 to-gray-800/30 rounded-xl shimmer" />
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .shimmer {
            background: linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.1), transparent);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    )
  }

  if (error || !novel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-black to-sky-950 text-red-400 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl mb-6">{error || 'Light Novel tidak ditemukan.'}</p>
          <Link href="/light-novel" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 rounded-full transition-all">
            <FaArrowLeft /> Kembali
          </Link>
        </motion.div>
      </div>
    )
  }

  const title = novel.title.english || novel.title.romaji
  const bannerSrc = novel.bannerImage || novel.coverImage.extraLarge || fallbackBanner
  const coverSrc = novel.coverImage.extraLarge || novel.coverImage.large || fallbackCover
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaBook },
    { id: 'characters', label: 'Characters', icon: FaUsers, count: novel.characters?.length || 0 },
    { id: 'staff', label: 'Staff', icon: FaStar, count: novel.staff?.length || 0 }
  ]

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

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-sky-950 text-white pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollY > 100 ? 1 : 0 }}
          className="fixed top-4 left-4 z-50"
        >
          <Link href="/light-novel">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-black/60 backdrop-blur-xl rounded-full border border-sky-500/30 text-sky-400 hover:text-sky-300 shadow-lg shadow-sky-500/20"
            >
              <FaArrowLeft className="text-xl" />
            </motion.button>
          </Link>
        </motion.div>

        <div className="relative w-full h-[320px] md:h-[450px] overflow-hidden">
          <motion.img
            src={bannerSrc}
            alt={title}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = fallbackBanner)}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={bannerLoaded ? { scale: 1, opacity: 1 } : { scale: 1.1, opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            onLoad={() => setBannerLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]"
          />
        </div>

        <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
              <img
                src={coverSrc}
                alt={title}
                loading="lazy"
                onError={(e) => (e.currentTarget.src = fallbackCover)}
                onLoad={() => setImageLoaded(true)}
                className="relative w-36 sm:w-48 md:w-64 rounded-xl shadow-2xl border-2 border-sky-500/30 object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-sky-500/20 to-transparent rounded-xl pointer-events-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex-1 space-y-4"
            >
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl md:text-5xl font-black leading-tight mb-2 bg-gradient-to-r from-white via-sky-200 to-white bg-clip-text text-transparent"
                >
                  {title}
                </motion.h1>
                {novel.title.romaji !== title && (
                  <p className="text-sky-300/70 text-sm md:text-base">{novel.title.romaji}</p>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2"
              >
                {novel.genres.map((g, idx) => (
                  <motion.span
                    key={g}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + idx * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-blue-700 rounded-full text-xs font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all cursor-pointer"
                  >
                    {g}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap items-center gap-3"
              >
                <motion.button
                  onClick={toggleFavorite}
                  disabled={favLoading || !Number.isFinite(numericId)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative px-6 py-3 rounded-full font-semibold shadow-lg transition-all flex items-center gap-2 ${
                    isFavorite
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-red-500/40'
                      : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-gray-500/20'
                  } ${favLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <FaHeart className={`text-lg transition-transform group-hover:scale-110 ${isFavorite ? 'text-red-100' : 'text-white'}`} />
                  <span>{isFavorite ? 'Favorited' : 'Add Favorite'}</span>
                  {isFavorite && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"
                    />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setShareOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-6 py-3 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-lg shadow-sky-500/40 font-semibold flex items-center gap-2 transition-all"
                >
                  <FaShareAlt className="text-lg transition-transform group-hover:rotate-12" />
                  <span>Share</span>
                </motion.button>

                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-xl border border-sky-500/20 shadow-lg transition-all"
                >
                  {copied ? <FaCheck className="text-lg text-green-400" /> : <FaCopy className="text-lg text-sky-300" />}
                </motion.button>
              </motion.div>

              {novel.averageScore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-2 text-yellow-400"
                >
                  <FaStar className="text-xl" />
                  <span className="text-2xl font-bold">{novel.averageScore}</span>
                  <span className="text-gray-400 text-sm">/100</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide"
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-lg shadow-sky-500/40'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
                }`}
              >
                <tab.icon className="text-lg" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="px-2 py-0.5 bg-black/40 rounded-full text-xs">{tab.count}</span>
                )}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-sky-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <FaBook className="text-2xl text-sky-400" />
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">Description</h2>
                    </div>
                    <div className="text-gray-300 text-sm md:text-base leading-relaxed">
                      <div
                        className={`prose prose-invert max-w-none ${expanded ? '' : 'line-clamp-6'}`}
                        dangerouslySetInnerHTML={{ __html: novel.description || '<p>No description available.</p>' }}
                      />
                      {novel.description && (
                        <motion.button
                          onClick={() => setExpanded(!expanded)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-4 flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 font-semibold group"
                        >
                          <span>{expanded ? 'Show less' : 'Read more'}</span>
                          {expanded ? <FaChevronUp className="group-hover:-translate-y-1 transition-transform" /> : <FaChevronDown className="group-hover:translate-y-1 transition-transform" />}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {[
                    { label: 'Status', value: novel.status || 'Unknown', icon: FaBook, color: 'from-green-500 to-emerald-600' },
                    { label: 'Start Date', value: novel.startDate ? `${novel.startDate.day}/${novel.startDate.month}/${novel.startDate.year}` : 'N/A', icon: FaCalendar, color: 'from-blue-500 to-sky-600' },
                    { label: 'End Date', value: novel.endDate ? `${novel.endDate.day}/${novel.endDate.month}/${novel.endDate.year}` : 'N/A', icon: FaCalendar, color: 'from-purple-500 to-pink-600' },
                    { label: 'Chapters', value: novel.chapters ?? 'N/A', icon: FaBook, color: 'from-orange-500 to-red-600' },
                    { label: 'Volumes', value: novel.volumes ?? 'N/A', icon: FaBook, color: 'from-cyan-500 to-blue-600' },
                    { label: 'Average Score', value: novel.averageScore ? `${novel.averageScore}/100` : 'N/A', icon: FaStar, color: 'from-yellow-500 to-orange-600' },
                  ].map((info, idx) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      className="group relative"
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${info.color} rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity`} />
                      <div className="relative p-5 rounded-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-sky-500/10 group-hover:border-sky-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${info.color}`}>
                            <info.icon className="text-white" />
                          </div>
                          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{info.label}</div>
                        </div>
                        <div className="text-xl font-bold text-white mt-2">{info.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'characters' && (
              <motion.div
                key="characters"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {novel.characters && novel.characters.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {novel.characters.map((char: LightNovelCharacter, idx) => (
                      <motion.div
                        key={char.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -8 }}
                        className="group relative"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500" />
                        <div className="relative rounded-xl overflow-hidden bg-gray-900/80 backdrop-blur shadow-xl border border-sky-500/20 group-hover:border-sky-500/50 transition-all">
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <img
                              src={char.image.large}
                              alt={char.name.full}
                              loading="lazy"
                              onError={(e) => (e.currentTarget.src = '/fallback.png')}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                            {char.role && (
                              <div className="absolute top-2 right-2 px-2 py-1 bg-sky-600/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                                {char.role}
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="font-semibold text-sm line-clamp-2 group-hover:text-sky-400 transition-colors">{char.name.full}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FaUsers className="text-6xl mx-auto mb-4 opacity-30" />
                    <p>No characters data available</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'staff' && (
              <motion.div
                key="staff"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {novel.staff && novel.staff.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {novel.staff.map((person: LightNovelStaff, idx) => (
                      <motion.div
                        key={person.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -8 }}
                        className="group relative"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500" />
                        <div className="relative rounded-xl overflow-hidden bg-gray-900/80 backdrop-blur shadow-xl border border-sky-500/20 group-hover:border-sky-500/50 transition-all">
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <img
                              src={person.image.large}
                              alt={person.name.full}
                              loading="lazy"
                              onError={(e) => (e.currentTarget.src = '/fallback.png')}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                          </div>
                          <div className="p-3">
                            <div className="font-semibold text-sm line-clamp-2 group-hover:text-sky-400 transition-colors">{person.name.full}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FaStar className="text-6xl mx-auto mb-4 opacity-30" />
                    <p>No staff data available</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="py-12 text-center"
          >
            <Link href="/light-novel">
              <motion.button
                whileHover={{ scale: 1.05, x: -4 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-700 rounded-full text-white font-bold shadow-lg shadow-sky-500/40 hover:shadow-sky-500/60 transition-all"
              >
                <FaArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
                <span>Back to Light Novels</span>
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </div>

      <AnimatePresence>
        {shareOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 z-50"
            >
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-sky-500/30 p-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur-xl opacity-30" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">Share</h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShareOpen(false)}
                      className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                    >
                      <FaTimes className="text-xl text-gray-300" />
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <img src={coverSrc} alt={title} className="w-16 h-20 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-2">{title}</p>
                        <p className="text-xs text-gray-400 mt-1">Light Novel</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-300 outline-none"
                      />
                      <motion.button
                        onClick={handleCopy}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
                      >
                        {copied ? <FaCheck className="text-white" /> : <FaCopy className="text-white" />}
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: 'Twitter', color: 'from-sky-500 to-blue-600', icon: '𝕏' },
                        { name: 'Facebook', color: 'from-blue-600 to-blue-700', icon: 'f' },
                        { name: 'WhatsApp', color: 'from-green-500 to-green-600', icon: '💬' },
                        { name: 'Telegram', color: 'from-sky-400 to-blue-500', icon: '✈️' }
                      ].map((social) => (
                        <motion.button
                          key={social.name}
                          whileHover={{ scale: 1.1, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 bg-gradient-to-br ${social.color} rounded-xl shadow-lg text-white font-bold text-2xl`}
                        >
                          {social.icon}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-6 {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .prose {
          color: rgb(209, 213, 219);
        }
        .prose p {
          margin-bottom: 1em;
        }
        .prose strong {
          color: rgb(243, 244, 246);
          font-weight: 600;
        }
        .prose a {
          color: rgb(56, 189, 248);
          text-decoration: none;
        }
        .prose a:hover {
          color: rgb(125, 211, 252);
        }
        .prose h1, .prose h2, .prose h3 {
          color: rgb(243, 244, 246);
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .prose ul, .prose ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }
        .prose li {
          margin-bottom: 0.25em;
        }
        @media (max-width: 640px) {
          .prose {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </>
  )
}
