'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchManhwaDetail } from '@/lib/anilistManhwa'
import { ManhwaDetail } from '@/types/manhwa'
import { useFavorites } from '@/hooks/useFavorites'
import { Heart, Share2 } from 'lucide-react'
import { FaArrowLeft } from 'react-icons/fa'
import ShareModal from '@/components/shared/ShareModal'

export default function ManhwaDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [manhwa, setManhwa] = useState<ManhwaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCard, setShowCard] = useState(true)
  const [lang, setLang] = useState<'en' | 'id'>('en')
  const [showShare, setShowShare] = useState(false)

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

  // share 
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = manhwa.title.english || manhwa.title.romaji

  return (
    <div className="bg-neutral-950 min-h-screen text-white relative overflow-hidden">
      {/* Hero Banner */}
      <div className="relative w-full h-[280px] sm:h-[340px] md:h-[480px] overflow-hidden">
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

        {/* Content wrapper */}
        <div className="absolute inset-x-4 bottom-[-80px] sm:bottom-[-100px] md:bottom-10 md:left-10 md:right-auto z-10 flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Poster */}
          <div className="w-[120px] sm:w-[150px] md:w-[200px] aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg shrink-0">
            <Image
              src={manhwa.coverImage.extraLarge || manhwa.coverImage.large}
              alt={manhwa.title.english || manhwa.title.romaji}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="w-full md:max-w-[calc(100vw-260px-6rem)]">
            <h1 className="text-2xl md:text-4xl font-bold drop-shadow-lg break-words leading-tight">
              {manhwa.title.english || manhwa.title.romaji}
            </h1>
            {manhwa.averageScore && (
              <p className="text-blue-400 mt-1 font-medium">
                ⭐ {manhwa.averageScore / 10}/10
              </p>
            )}

            {/* Genres */}
            {manhwa.genres && manhwa.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {manhwa.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/manhwa/genre/${encodeURIComponent(genre)}`}
                    className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm transition"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            )}

            {/* Favorite + Share */}
            <div className="flex gap-3 mt-5 md:mt-4">
              <button
                onClick={toggleFavorite}
                disabled={favLoading}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition text-sm sm:text-base ${
                  isFavorite
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Heart
                  size={18}
                  className={isFavorite ? 'fill-current text-white' : 'text-white'}
                />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </button>

              <button
                onClick={() => setShowShare(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm sm:text-base"
              >
                <Share2 size={18} className="text-white" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile so content tidak nabrak */}
      <div className="h-[100px] sm:h-[120px] md:h-0"></div>

      {/* Share Modal */}
      <ShareModal
        open={showShare}
        setOpen={setShowShare}
        url={shareUrl}
        title={shareTitle}
        thumbnail={manhwa.coverImage.large}
      />

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
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-lg text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl backdrop-blur-md"
        >
          <FaArrowLeft className="mr-2 text-xl transition-all duration-300" />
          Back to Manhwa
        </Link>
      </div>
    </div>
  )
}
