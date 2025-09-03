'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fetchLightNovelDetail } from '@/lib/anilistLightNovel'
import { LightNovel, LightNovelCharacter, LightNovelStaff } from '@/types/lightNovel'
import { useFavorites } from '@/hooks/useFavorites'
import { Heart } from 'lucide-react'
import { FaArrowLeft } from 'react-icons/fa'

export default function LightNovelDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [novel, setNovel] = useState<LightNovel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const numericId = id ? Number(id) : undefined
  const { isFavorite, toggleFavorite, loading: favLoading } = useFavorites({
    mediaId: numericId,
    mediaType: 'light_novel',
  })

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchLightNovelDetail(Number(id))
      .then((data) => setNovel(data))
      .catch(() => setError('Gagal memuat detail Light Novel.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900 text-white">
        <p className="animate-pulse text-lg">Loading Light Novel...</p>
      </div>
    )
  }

  if (error || !novel) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900 text-red-500">
        <p>{error || 'Light Novel tidak ditemukan.'}</p>
      </div>
    )
  }

  return (
    <div className="bg-neutral-950 min-h-screen text-white relative overflow-hidden">
      <Head>
        <title>{novel.title.english || novel.title.romaji} | Light Novel Detail</title>
        <meta
          name="description"
          content={`Detail tentang Light Novel ${novel.title.english || novel.title.romaji}`}
        />
      </Head>

      {/* Hero Banner */}
      <div className="relative w-full h-[360px] md:h-[480px] overflow-hidden">
        {novel.bannerImage ? (
          <Image
            src={novel.bannerImage}
            alt={novel.title.english || novel.title.romaji}
            fill
            priority
            className="object-cover brightness-50"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>

      {/* Cover + Info */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-8 -mt-24 z-10">
        {/* Cover */}
        <div className="w-[140px] md:w-[200px] aspect-[2/3] relative rounded-lg overflow-hidden shadow-xl border-2 border-white/20">
          <Image
            src={novel.coverImage.extraLarge || novel.coverImage.large}
            alt={novel.title.english || novel.title.romaji}
            fill
            className="object-cover"
          />
        </div>

        {/* Text Info */}
        <div className="mt-6">
          <h1 className="text-2xl md:text-4xl font-bold drop-shadow-lg">
            {novel.title.english || novel.title.romaji}
          </h1>

          {/* Tombol Favorite */}
          <button
            onClick={toggleFavorite}
            disabled={favLoading}
            className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isFavorite
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Heart
              size={18}
              className={isFavorite ? 'fill-current text-white' : 'text-white'}
            />
            {favLoading
              ? 'Processing...'
              : isFavorite
              ? 'Remove from Favorites'
              : 'Add to Favorites'}
          </button>

          {/* Genre */}
          <div className="flex flex-wrap gap-2 mt-3">
            {novel.genres.map((g) => (
              <span
                key={g}
                className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full text-xs shadow-md"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-10">
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
      </div>

      {/* Characters */}
      {novel.characters && novel.characters.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 md:px-8 mt-12">
          <h2 className="text-2xl font-bold mb-4">Characters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {novel.characters.map((char: LightNovelCharacter) => (
              <motion.div
                key={char.id}
                whileHover={{ scale: 1.05 }}
                className="bg-neutral-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={char.image.large}
                    alt={char.name.full}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold">{char.name.full}</p>
                  <p className="text-xs text-gray-400">{char.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Staff */}
      {novel.staff && novel.staff.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 md:px-8 mt-12 pb-16">
          <h2 className="text-2xl font-bold mb-4">Staff</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {novel.staff.map((person: LightNovelStaff) => (
              <motion.div
                key={person.id}
                whileHover={{ scale: 1.05 }}
                className="bg-neutral-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={person.image.large}
                    alt={person.name.full}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold">{person.name.full}</p>
                  {person.role && <p className="text-xs text-gray-400">{person.role}</p>}
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
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-lg text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl backdrop-blur-md"
        >
          <FaArrowLeft className="mr-2 text-xl" />
          Back to Light Novels
        </Link>
      </div>
    </div>
  )
}
