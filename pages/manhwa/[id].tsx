'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchManhwaDetail } from '@/lib/anilistManhwa'
import { ManhwaDetail } from '@/types/manhwa'
import { useFavorites } from '@/hooks/useFavorites'
import { Heart } from 'lucide-react'
import { FaArrowLeft } from 'react-icons/fa'

export default function ManhwaDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [manhwa, setManhwa] = useState<ManhwaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNotice, setShowNotice] = useState(true)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900 text-white">
        <p className="animate-pulse text-lg">Loading Manhwa Details...</p>
      </div>
    )
  }

  if (!manhwa) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900 text-white">
        <p className="text-lg">Manhwa not found.</p>
      </div>
    )
  }

  return (
    <div className={`bg-neutral-950 min-h-screen text-white relative`}>
      {/* Blur overlay kalau notice aktif */}
      {showNotice && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/40 z-40" />
      )}

      {/* Notifikasi Modal */}
      <AnimatePresence>
        {showNotice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-blue-600/80 to-indigo-800/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center relative">
              <h2 className="text-2xl font-bold text-white drop-shadow mb-3">
                📢 Notice / Pemberitahuan
              </h2>
              <p className="text-gray-100 mb-4 leading-relaxed">
                This Manhwa is only available to read in the{" "}
                <span className="font-semibold text-yellow-300">Manga</span>{" "}
                section. <br />
                <span className="text-sm text-gray-200">
                  (Manhwa ini hanya bisa dibaca di bagian{" "}
                  <span className="font-semibold text-yellow-300">Manga</span>.)
                </span>
              </p>

              <div className="flex justify-center gap-4 mt-5">
                <button
                  onClick={() => setShowNotice(false)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 transition transform hover:scale-105"
                >
                  Close
                </button>
                <Link
                  href="/manga/explore"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition"
                >
                  Go to Manga
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="relative w-full h-[320px] md:h-[460px] overflow-hidden">
        {manhwa.bannerImage ? (
          <Image
            src={manhwa.bannerImage}
            alt={manhwa.title.english || manhwa.title.romaji}
            fill
            priority
            className="object-cover brightness-50"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute bottom-5 left-5 md:bottom-10 md:left-10 z-10 flex items-center gap-5">
          <div className="w-[120px] md:w-[180px] h-[160px] md:h-[240px] relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src={manhwa.coverImage.extraLarge || manhwa.coverImage.large}
              alt={manhwa.title.english || manhwa.title.romaji}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold drop-shadow-lg">
              {manhwa.title.english || manhwa.title.romaji}
            </h1>
            {manhwa.averageScore && (
              <p className="text-blue-400 mt-2 font-medium">
                ⭐ {manhwa.averageScore / 10}/10
              </p>
            )}

            {/* tombol favorite */}
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
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>

            <div className="flex flex-wrap gap-2 mt-3">
              {manhwa.genres?.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-full backdrop-blur-md"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-6">
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {manhwa.description?.replace(/<[^>]+>/g, '')}
        </p>
      </div>

      {/* Characters */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
        <h2 className="text-2xl font-bold mb-4">Characters</h2>
        {manhwa.characters?.edges && manhwa.characters.edges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {manhwa.characters.edges.map((char) => (
              <motion.div
                key={char.node.id}
                whileHover={{ scale: 1.05 }}
                className="bg-neutral-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={char.node.image.large}
                    alt={char.node.name.full}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold">{char.node.name.full}</p>
                  <p className="text-xs text-gray-400">{char.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No character data available.</p>
        )}
      </section>

      {/* Staff */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-10 pb-16">
        <h2 className="text-2xl font-bold mb-4">Staff</h2>
        {manhwa.staff?.edges && manhwa.staff.edges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {manhwa.staff.edges.map((st) => (
              <motion.div
                key={st.node.id}
                whileHover={{ scale: 1.05 }}
                className="bg-neutral-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={st.node.image.large}
                    alt={st.node.name.full}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold">{st.node.name.full}</p>
                  {st.role && <p className="text-xs text-gray-400">{st.role}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No staff data available.</p>
        )}
      </section>

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <Link
          href="/manhwa"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-lg text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl backdrop-blur-md border border-transparent hover:border-blue-400"
        >
          <FaArrowLeft className="mr-2 text-xl transition-all duration-300" />
          Back to Manhwa
        </Link>
      </div>
    </div>
  )
}
