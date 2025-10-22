'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { fetchManhwaDetail } from '@/lib/anilistManhwa'
import { ManhwaDetail } from '@/types/manhwa'
import { useFavorites } from '@/hooks/useFavorites'
import { Heart, Share2 } from 'lucide-react'
import { FaArrowLeft } from 'react-icons/fa'
import ShareModal from '@/components/shared/ShareModal'

import {
  searchManga,
  fetchChapters,
  sortChapters,
} from '@/lib/mangadex'

export default function ManhwaDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [manhwa, setManhwa] = useState<ManhwaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [mangaDexId, setMangaDexId] = useState<string | null>(null)
  const [chapters, setChapters] = useState<any[]>([])
  const [loadingChapters, setLoadingChapters] = useState(false)

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

  useEffect(() => {
    if (manhwa) {
      const title =
        manhwa.title.english || manhwa.title.romaji || manhwa.title.native || ''

      if (!title) return 

      setLoadingChapters(true)
      searchManga(title).then((results) => {
        if (results.length > 0) {
          const md = results[0]
          setMangaDexId(md.id)

          fetchChapters(md.id)
            .then((chs) => setChapters(sortChapters(chs)))
            .finally(() => setLoadingChapters(false))
        } else {
          setLoadingChapters(false)
        }
      })
    }
  }, [manhwa])

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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = manhwa.title.english || manhwa.title.romaji || 'Manhwa'

  return (
    <div className="bg-neutral-950 min-h-screen text-white relative overflow-hidden">
      <div className="relative w-full h-[360px] md:h-[480px] overflow-hidden">
        {manhwa.bannerImage ? (
          <Image
            src={manhwa.bannerImage}
            alt={manhwa.title.english || manhwa.title.romaji || 'banner'}
            fill
            priority
            className="object-cover brightness-50"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        <div className="absolute bottom-4 left-4 right-4 md:bottom-10 md:left-10 md:right-auto z-10 flex flex-col md:flex-row items-start md:items-end gap-4">
          <div className="w-[120px] md:w-[180px] aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg shrink-0">
            <Image
              src={manhwa.coverImage.extraLarge || manhwa.coverImage.large}
              alt={manhwa.title.english || manhwa.title.romaji || 'cover'}
              fill
              className="object-cover"
            />
          </div>

          <div className="w-full max-w-full md:max-w-[calc(100vw-240px-6rem)]">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold drop-shadow-lg break-words leading-tight">
              {manhwa.title.english || manhwa.title.romaji}
            </h1>
            {manhwa.averageScore && (
              <p className="text-blue-400 mt-2 font-medium">
                ⭐ {manhwa.averageScore / 10}/10
              </p>
            )}

            {manhwa.genres && manhwa.genres.length > 0 && (
              <div className="hidden md:flex flex-wrap gap-2 mt-3">
                {manhwa.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/manhwa/genre/${encodeURIComponent(genre)}`}
                    className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-3">
              <button
                onClick={toggleFavorite}
                disabled={favLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isFavorite
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Heart
                  size={18}
                  className={isFavorite ? 'fill-current text-white' : 'text-white'}
                />
                {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
              </button>

              <button
                onClick={() => setShowShare(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <Share2 size={18} className="text-white" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        open={showShare}
        setOpen={setShowShare}
        url={shareUrl}
        title={shareTitle}
        thumbnail={manhwa.coverImage.large}
      />

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-6">
        {manhwa.genres && manhwa.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 md:hidden">
            {manhwa.genres.map((genre) => (
              <Link
                key={genre}
                href={`/manhwa/genre/${encodeURIComponent(genre)}`}
                className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
              >
                {genre}
              </Link>
            ))}
          </div>
        )}

        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {manhwa.description?.replace(/<[^>]+>/g, '')}
        </p>
      </div>

      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
        <h2 className="text-2xl font-bold mb-4">Chapters</h2>
        {loadingChapters ? (
          <p className="text-gray-400">Loading chapters...</p>
        ) : chapters.length > 0 ? (
          <div className="flex flex-col gap-2">
            {chapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/read/${ch.id}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex justify-between items-center"
              >
                <span>
                  Chapter {ch.attributes.chapter || '?'}{' '}
                  {ch.attributes.title && `- ${ch.attributes.title}`}
                </span>
                <span className="text-sm text-gray-300">
                  {new Date(ch.attributes.publishAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No chapters found.</p>
        )}
      </section>

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
