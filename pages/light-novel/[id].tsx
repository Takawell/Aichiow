'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fetchLightNovelDetail } from '@/lib/anilistLightNovel'
import { LightNovel, LightNovelCharacter, LightNovelStaff } from '@/types/lightNovel'

export default function LightNovelDetail() {
  const router = useRouter()
  const { id } = router.query
  const [novel, setNovel] = useState<LightNovel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={novel.bannerImage || novel.coverImage.extraLarge}
            alt={novel.title.english || novel.title.romaji}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 flex items-end gap-6">
            <img
              src={novel.coverImage.extraLarge || novel.coverImage.large}
              alt={novel.title.english || novel.title.romaji}
              className="w-32 md:w-48 rounded-xl shadow-xl border-2 border-white/10"
            />
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                {novel.title.english || novel.title.romaji}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                {novel.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-1 bg-blue-700 bg-opacity-50 rounded-full text-xs"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detail Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <p
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: novel.description || 'No description available.',
              }}
            />
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-800 rounded-lg p-4">
            <p>
              <span className="font-semibold">Status:</span> {novel.status || 'Unknown'}
            </p>
            <p>
              <span className="font-semibold">Format:</span> {novel.format || 'N/A'}
            </p>
            <p>
              <span className="font-semibold">Average Score:</span>{' '}
              {novel.averageScore ? `${novel.averageScore}/100` : 'N/A'}
            </p>
            <p>
              <span className="font-semibold">Start Date:</span>{' '}
              {novel.startDate
                ? `${novel.startDate.day}/${novel.startDate.month}/${novel.startDate.year}`
                : 'N/A'}
            </p>
            <p>
              <span className="font-semibold">End Date:</span>{' '}
              {novel.endDate
                ? `${novel.endDate.day}/${novel.endDate.month}/${novel.endDate.year}`
                : 'N/A'}
            </p>
          </div>
        </section>

        {/* Characters Section */}
        {novel.characters && novel.characters.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
            <h2 className="text-2xl font-bold mb-4">Characters</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {novel.characters.map((char: LightNovelCharacter) => (
                <motion.div
                  key={char.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-blue-600 transition"
                >
                  <img
                    src={char.image.large}
                    alt={char.name.full}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="text-sm font-semibold">{char.name.full}</h3>
                    {char.role && (
                      <p className="text-xs text-gray-400">{char.role}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Staff Section */}
        {novel.staff && novel.staff.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
            <h2 className="text-2xl font-bold mb-4">Staff</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {novel.staff.map((person: LightNovelStaff) => (
                <motion.div
                  key={person.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-blue-600 transition"
                >
                  <img
                    src={person.image.large}
                    alt={person.name.full}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="text-sm font-semibold">{person.name.full}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <Link
            href="/light-novel"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
          >
            ← Back to Light Novels
          </Link>
        </div>
      </div>
    </>
  )
            }
