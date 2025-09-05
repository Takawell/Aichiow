'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fetchLightNovelDetail } from '@/lib/anilistLightNovel'
import { LightNovel, LightNovelCharacter, LightNovelStaff } from '@/types/lightNovel'
import { useFavorites } from '@/hooks/useFavorites'

export default function LightNovelDetail() {
  const router = useRouter()
  const { id } = router.query
  const [novel, setNovel] = useState<LightNovel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [bannerLoaded, setBannerLoaded] = useState(false)
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

    // scroll to top when ID changes (mobile UX)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  // Fallback images
  const fallbackBanner = '/fallback.png'
  const fallbackCover = '/fallback.png'

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <div className="animate-pulse">
            <div className="h-48 md:h-64 bg-gray-800 rounded-lg mb-4" />
            <div className="h-6 bg-gray-700 rounded w-3/5 mb-3" />
            <div className="h-4 bg-gray-700 rounded w-4/5 mb-2" />
            <div className="h-36 bg-gray-800 rounded mt-6" />
          </div>
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

  return (
    <>
      <Head>
        <title>{`${title} | Light Novel Detail`}</title>
        <meta name="description" content={`Detail tentang Light Novel ${title}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white pb-16">
        {/* Banner Section */}
        <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden">
          <motion.img
            src={bannerSrc}
            alt={title}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = fallbackBanner)}
            initial={{ scale: 1.05 }}
            animate={bannerLoaded ? { scale: 1 } : { scale: 1.05 }}
            transition={{ duration: 1.2 }}
            onLoad={() => setBannerLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover transform-gpu transition-transform duration-1000"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="absolute bottom-4 left-4 flex items-end gap-4 md:gap-6">
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              src={coverSrc}
              alt={title}
              loading="lazy"
              onError={(e) => (e.currentTarget.src = fallbackCover)}
              className="w-28 md:w-44 rounded-xl shadow-2xl border-2 border-white/10 object-cover"
            />

            <div className="max-w-xs md:max-w-xl">
              <h1 className="text-2xl md:text-4xl font-extrabold drop-shadow-md leading-tight line-clamp-2">
                {title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {novel.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full text-xs shadow-md"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="mt-3 text-sm text-gray-300">
                <span>{novel.format || 'N/A'}</span>
                <span className="mx-2">•</span>
                <span>{novel.averageScore ? `${novel.averageScore}/100` : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
          {/* Favorite Button above Description */}
          <div className="flex justify-end">
            <button
              onClick={toggleFavorite}
              disabled={favLoading || !Number.isFinite(numericId)}
              aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
              className={`px-5 py-2 rounded-lg shadow-md transition font-medium text-sm flex items-center gap-2 ${
                isFavorite
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700'
              } ${favLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span className="text-lg">{isFavorite ? '★' : '♡'}</span>
              {favLoading ? 'Processing...' : isFavorite ? 'Favorited' : 'Add to Favorite'}
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-gray-800/50 backdrop-blur-md p-5 rounded-xl shadow-lg"
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

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { label: 'Status', value: novel.status || 'Unknown' },
              { label: 'Start Date', value: novel.startDate ? `${novel.startDate.day}/${novel.startDate.month}/${novel.startDate.year}` : 'N/A' },
              { label: 'End Date', value: novel.endDate ? `${novel.endDate.day}/${novel.endDate.month}/${novel.endDate.year}` : 'N/A' },
              { label: 'Chapters', value: novel.chapters ?? 'N/A' },
              { label: 'Volumes', value: novel.volumes ?? 'N/A' },
              { label: 'Average Score', value: novel.averageScore ? `${novel.averageScore}/100` : 'N/A' },
            ].map((info) => (
              <div key={info.label} className="p-4 rounded-lg bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur border border-white/5">
                <div className="text-xs text-gray-400">{info.label}</div>
                <div className="mt-1 font-medium text-white">{info.value}</div>
              </div>
            ))}
          </motion.div>

          {/* Characters */}
          {novel.characters && novel.characters.length > 0 && (
            <section>
              <h3 className="text-xl font-bold mb-4">Characters</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {novel.characters.map((char: LightNovelCharacter) => (
                  <motion.div
                    key={char.id}
                    whileHover={{ scale: 1.03 }}
                    className="relative rounded-lg overflow-hidden group bg-gray-900/40 shadow"
                  >
                    <img
                      src={char.image.large}
                      alt={char.name.full}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = '/fallback.png')}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="p-3">
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
                    className="relative rounded-lg overflow-hidden group bg-gray-900/40 shadow"
                  >
                    <img
                      src={person.image.large}
                      alt={person.name.full}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = '/fallback.png')}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="p-3">
                      <div className="font-medium text-sm line-clamp-1">{person.name.full}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          <div className="py-6">
            <Link href="/light-novel" className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg text-white shadow-md">
              ← Back to Light Novels
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
