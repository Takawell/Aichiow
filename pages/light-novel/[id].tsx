'use client'

import { useEffect, useState } from 'react'
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

  // gunakan useFavorites dengan bentuk objek
  const numericId = Number(id)
  const { isFavorite, toggleFavorite, loading: favLoading } = useFavorites({
    mediaId: Number.isFinite(numericId) ? numericId : undefined,
    mediaType: 'light_novel',
  })

  useEffect(() => {
    if (!id) return
    const loadDetail = async () => {
      try {
        setLoading(true)
        const data = await fetchLightNovelDetail(Number(id))
        setNovel(data)
      } catch (e: any) {
        setError('Gagal memuat detail Light Novel.')
      } finally {
        setLoading(false)
      }
    }
    loadDetail()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading detail...</p>
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

  return (
    <>
      <Head>
        <title>{novel.title.english || novel.title.romaji} | Light Novel Detail</title>
        <meta
          name="description"
          content={`Detail tentang Light Novel ${novel.title.english || novel.title.romaji}`}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        {/* Banner Section */}
        <div className="relative w-full h-[320px] md:h-[450px] overflow-hidden group">
          <img
            src={novel.bannerImage || novel.coverImage.extraLarge}
            alt={novel.title.english || novel.title.romaji}
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

          <div className="absolute bottom-6 left-6 flex items-end gap-6">
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              src={novel.coverImage.extraLarge || novel.coverImage.large}
              alt={novel.title.english || novel.title.romaji}
              className="w-32 md:w-48 rounded-xl shadow-2xl border-2 border-white/10"
            />
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">
                {novel.title.english || novel.title.romaji}
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

              {/* Tombol Favorite */}
              <button
                onClick={toggleFavorite}
                disabled={favLoading || !Number.isFinite(numericId)}
                className={`mt-4 px-4 py-2 rounded-lg shadow-md transition ${
                  isFavorite
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                } ${favLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {favLoading
                  ? 'Processing...'
                  : isFavorite
                  ? '★ Favorited'
                  : '♡ Add to Favorite'}
              </button>
            </div>
          </div>
        </div>

        {/* Detail Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p
              className="text-gray-300 leading-relaxed text-sm md:text-base"
              dangerouslySetInnerHTML={{
                __html: novel.description || 'No description available.',
              }}
            />
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              { label: 'Status', value: novel.status || 'Unknown' },
              { label: 'Format', value: novel.format || 'N/A' },
              {
                label: 'Average Score',
                value: novel.averageScore ? `${novel.averageScore}/100` : 'N/A',
              },
              {
                label: 'Start Date',
                value: novel.startDate
                  ? `${novel.startDate.day}/${novel.startDate.month}/${novel.startDate.year}`
                  : 'N/A',
              },
              {
                label: 'End Date',
                value: novel.endDate
                  ? `${novel.endDate.day}/${novel.endDate.month}/${novel.endDate.year}`
                  : 'N/A',
              },
            ].map((info) => (
              <div
                key={info.label}
                className="bg-gray-800/50 backdrop-blur-md p-4 rounded-lg text-gray-300 hover:bg-gray-700/50 transition"
              >
                <span className="font-semibold text-white">{info.label}: </span>
                {info.value}
              </div>
            ))}
          </motion.div>
        </section>

        {/* Characters Section */}
        {novel.characters && novel.characters.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 md:px-8 mt-12">
            <h2 className="text-2xl font-bold mb-4">Characters</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {novel.characters.map((char: LightNovelCharacter) => (
                <motion.div
                  key={char.id}
                  whileHover={{ scale: 1.05 }}
                  className="relative rounded-lg overflow-hidden group bg-gray-800 shadow-lg"
                >
                  <img
                    src={char.image.large}
                    alt={char.name.full}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute bottom-2 left-2">
                      <h3 className="text-sm font-semibold text-white">{char.name.full}</h3>
                      {char.role && (
                        <p className="text-xs text-gray-300">{char.role}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Staff Section */}
        {novel.staff && novel.staff.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 md:px-8 mt-12">
            <h2 className="text-2xl font-bold mb-4">Staff</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {novel.staff.map((person: LightNovelStaff) => (
                <motion.div
                  key={person.id}
                  whileHover={{ scale: 1.05 }}
                  className="relative rounded-lg overflow-hidden group bg-gray-800 shadow-lg"
                >
                  <img
                    src={person.image.large}
                    alt={person.name.full}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute bottom-2 left-2">
                      <h3 className="text-sm font-semibold text-white">{person.name.full}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
          <Link
            href="/light-novel"
            className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-lg text-white transition shadow-lg"
          >
            ← Back to Light Novels
          </Link>
        </div>
      </div>
    </>
  )
}
