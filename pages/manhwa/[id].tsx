'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { fetchManhwaDetail } from '@/lib/anilistManhwa'
import { Manhwa } from '@/types/manhwa'

export default function ManhwaDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const [manhwa, setManhwa] = useState<Manhwa | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const loadDetail = async () => {
      try {
        const data = await fetchManhwaDetail(Number(id))
        setManhwa(data)
      } catch (e: any) {
        setError('Gagal memuat detail manhwa.')
      } finally {
        setLoading(false)
      }
    }
    loadDetail()
  }, [id])

  if (loading) {
    return <p className="text-center text-gray-300 mt-10">Memuat detail...</p>
  }

  if (error || !manhwa) {
    return <p className="text-center text-red-500 mt-10">{error || 'Detail tidak ditemukan.'}</p>
  }

  return (
    <>
      <Head>
        <title>{manhwa.title.english || manhwa.title.romaji} | Aichiow</title>
        <meta name="description" content={manhwa.description?.slice(0, 160)} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
        {/* Banner */}
        <div className="relative w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[450px]">
          {manhwa.bannerImage ? (
            <Image
              src={manhwa.bannerImage}
              alt={manhwa.title.romaji}
              fill
              className="object-cover brightness-75"
            />
          ) : (
            <div className="w-full h-full bg-gray-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 -mt-24 relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover */}
            <div className="w-44 md:w-60 flex-shrink-0">
              <Image
                src={manhwa.coverImage.extraLarge || manhwa.coverImage.large}
                alt={manhwa.title.romaji}
                width={300}
                height={450}
                className="rounded-lg shadow-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-400">
                {manhwa.title.english || manhwa.title.romaji}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                {manhwa.averageScore && (
                  <span className="px-2 py-1 bg-white/10 rounded-md">
                    ⭐ {manhwa.averageScore / 10}/10
                  </span>
                )}
                {manhwa.status && (
                  <span className="px-2 py-1 bg-white/10 rounded-md">
                    {manhwa.status}
                  </span>
                )}
                {manhwa.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs"
                  >
                    {g}
                  </span>
                ))}
              </div>
              {manhwa.description && (
                <p className="text-gray-200 text-sm md:text-base max-w-2xl">
                  {manhwa.description.replace(/<[^>]+>/g, '')}
                </p>
              )}
            </div>
          </div>

          {/* Characters */}
          {manhwa.characters && manhwa.characters.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Karakter</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {manhwa.characters.slice(0, 6).map((char) => (
                  <motion.div
                    key={char.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <Image
                      src={char.image.large}
                      alt={char.name.full}
                      width={200}
                      height={300}
                      className="object-cover w-full h-44"
                    />
                    <div className="p-2 text-center">
                      <p className="text-xs font-semibold truncate">
                        {char.name.full}
                      </p>
                      <p className="text-xs text-gray-400">{char.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Staff */}
          {manhwa.staff && manhwa.staff.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Staff</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {manhwa.staff.slice(0, 6).map((st) => (
                  <motion.div
                    key={st.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <Image
                      src={st.image.large}
                      alt={st.name.full}
                      width={200}
                      height={300}
                      className="object-cover w-full h-44"
                    />
                    <div className="p-2 text-center">
                      <p className="text-xs font-semibold truncate">
                        {st.name.full}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
                    }
