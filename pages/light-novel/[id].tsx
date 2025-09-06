'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaHeart, FaShareAlt } from 'react-icons/fa'
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-sm px-6">
          <div className="h-48 bg-gray-800 rounded-lg" />
          <div className="h-6 bg-gray-700 rounded w-3/5" />
          <div className="h-4 bg-gray-700 rounded w-4/5" />
          <div className="h-20 bg-gray-800 rounded" />
        </div>
      </div>
    )
  }

  if (error || !novel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        <p>{error || 'Light Novel tidak ditemukan.'}</p>
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

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        {/* Banner */}
        <div className="relative w-full h-60 sm:h-72 md:h-[420px] overflow-hidden">
          <motion.img
            src={bannerSrc}
            alt={title}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = fallbackBanner)}
            initial={{ scale: 1.05 }}
            animate={bannerLoaded ? { scale: 1 } : { scale: 1.05 }}
            transition={{ duration: 1.2 }}
            onLoad={() => setBannerLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Cover + Info */}
        <section className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <motion.img
              src={coverSrc}
              alt={title}
              loading="lazy"
              onError={(e) => (e.currentTarget.src = fallbackCover)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-32 sm:w-40 md:w-52 rounded-xl shadow-2xl border border-white/10 mx-auto md:mx-0"
            />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">{title}</h1>

              {/* Genres */}
              <div className="flex gap-2 mt-3 overflow-x-auto md:flex-wrap scrollbar-hide justify-center md:justify-start">
                {novel.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full text-xs shadow-md whitespace-nowrap"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:justify-center md:justify-start">
                <motion.button
                  onClick={toggleFavorite}
                  disabled={favLoading || !Number.isFinite(numericId)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white text-sm sm:text-base w-full sm:w-auto ${
                    isFavorite
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
                  } ${favLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <FaHeart className="text-lg" />
                  {favLoading ? 'Processing...' : isFavorite ? 'Favorited' : 'Add to Favorite'}
                </motion.button>

                <motion.button
                  onClick={() => setShareOpen(true)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white text-sm sm:text-base w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                >
                  <FaShareAlt className="text-lg" />
                  Share
                </motion.button>
              </div>

              <p className="mt-3 text-gray-300 text-sm md:text-base">
                {novel.format || 'N/A'} • {novel.averageScore ? `${novel.averageScore}/100` : 'N/A'}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-8">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-gray-800/50 backdrop-blur-md p-5 md:p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <div className="text-gray-300 text-sm md:text-base leading-relaxed">
              <p
                className={`${expanded ? '' : 'line-clamp-4'} prose prose-invert max-w-none`}
                dangerouslySetInnerHTML={{ __html: novel.description || 'No description available.' }}
              />
              {novel.description && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          </motion.div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Status', value: novel.status || 'Unknown' },
              { label: 'Start Date', value: novel.startDate ? `${novel.startDate.day}/${novel.startDate.month}/${novel.startDate.year}` : 'N/A' },
              { label: 'End Date', value: novel.endDate ? `${novel.endDate.day}/${novel.endDate.month}/${novel.endDate.year}` : 'N/A' },
              { label: 'Chapters', value: novel.chapters ?? 'N/A' },
              { label: 'Volumes', value: novel.volumes ?? 'N/A' },
              { label: 'Average Score', value: novel.averageScore ? `${novel.averageScore}/100` : 'N/A' },
            ].map((info) => (
              <div key={info.label} className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-white/5">
                <div className="text-xs text-gray-400">{info.label}</div>
                <div className="mt-1 font-medium">{info.value}</div>
              </div>
            ))}
          </div>

          {/* Characters */}
          {novel.characters && novel.characters.length > 0 && (
            <section>
              <h3 className="text-xl font-bold mb-4">Characters</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {novel.characters.map((char: LightNovelCharacter) => (
                  <motion.div
                    key={char.id}
                    whileHover={{ scale: 1.03 }}
                    className="rounded-lg overflow-hidden bg-gray-900/40 shadow"
                  >
                    <img
                      src={char.image.large}
                      alt={char.name.full}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = '/fallback.png')}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2">
                      <div className="font-medium text-sm line-clamp-1">{char.name.full}</div>
                      {char.role && <div className="text-xs text-gray-400">{char.role}</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Staff */}
          {novel.staff && novel.staff.length > 0 && (
            <section>
              <h3 className="text-xl font-bold mb-4">Staff</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {novel.staff.map((person: LightNovelStaff) => (
                  <motion.div
                    key={person.id}
                    whileHover={{ scale: 1.03 }}
                    className="rounded-lg overflow-hidden bg-gray-900/40 shadow"
                  >
                    <img
                      src={person.image.large}
                      alt={person.name.full}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = '/fallback.png')}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2">
                      <div className="font-medium text-sm line-clamp-1">{person.name.full}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          <div className="text-center">
            <Link
              href="/light-novel"
              className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg text-white shadow-md"
            >
              ← Back to Light Novels
            </Link>
          </div>
        </section>
      </div>

      {/* Share Modal */}
      <ShareModal open={shareOpen} setOpen={setShareOpen} title={title} url={shareUrl} thumbnail={coverSrc} />
    </>
  )
}
