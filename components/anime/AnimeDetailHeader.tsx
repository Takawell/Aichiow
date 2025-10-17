"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { AnimeDetail } from "@/types/anime"
import { useFavorites } from "@/hooks/useFavorites"
import { Heart, Share2, Calendar, Star, Film, BarChart3, Tv } from "lucide-react"
import ShareModal from "@/components/shared/ShareModal"

interface Props {
  anime: AnimeDetail
}

export default function AnimeDetailHeader({ anime }: Props) {
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const cleanDesc = anime.description?.replace(/<[^>]+>/g, "") || ""

  const { isFavorite, toggleFavorite, loading } = useFavorites({
    mediaId: anime.id,
    mediaType: "anime",
  })

  const toggleDesc = () => setShowFullDesc((prev) => !prev)
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const coverSrc = anime.coverImage.extraLarge || anime.coverImage.large

  const score = anime.averageScore || 0
  const popularity = anime.popularity || 0
  const popPercent = Math.min((popularity / 200000) * 100, 100)

  return (
    <section className="relative w-full bg-gradient-to-b from-black via-neutral-900 to-black text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={anime.bannerImage ?? anime.coverImage.extraLarge ?? "/default-banner.jpg"}
          alt={anime.title.romaji || "Anime Banner"}
          fill
          priority
          className="object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full sm:w-auto flex justify-center md:block"
        >
          <div className="relative group">
            <Image
              src={coverSrc}
              alt={anime.title.romaji}
              width={240}
              height={340}
              className="rounded-2xl shadow-2xl border-2 border-white/10 object-cover w-[200px] sm:w-[240px]"
            />
            <div className="absolute inset-0 rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex-1 backdrop-blur-md bg-white/5 p-6 md:p-8 rounded-2xl shadow-lg border border-white/10"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
                {anime.title.english || anime.title.romaji}
              </h1>
              {anime.title.romaji && (
                <p className="text-sm md:text-base text-neutral-400 italic mt-1">
                  {anime.title.romaji}
                </p>
              )}
              {anime.title.native && (
                <p className="text-sm text-neutral-500">{anime.title.native}</p>
              )}
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleFavorite}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                  isFavorite
                    ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <Heart size={18} className={isFavorite ? "fill-white" : ""} />
                <span>{isFavorite ? "Favorited" : "Favorite"}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-blue-500/70 transition text-sm font-medium"
              >
                <Share2 size={18} />
                <span>Share</span>
              </motion.button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {anime.genres.slice(0, 6).map((genre) => (
              <motion.div key={genre} whileHover={{ scale: 1.05 }}>
                <Link
                  href={`/anime/genre/${encodeURIComponent(
                    genre.toLowerCase().replace(/\s+/g, "-")
                  )}`}
                >
                  <span className="cursor-pointer text-[11px] uppercase tracking-wide font-medium px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-blue-500/80 hover:text-white transition">
                    {genre}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 max-w-2xl text-sm text-neutral-300 leading-relaxed">
            <p className={showFullDesc ? "" : "line-clamp-5"}>{cleanDesc}</p>
            {cleanDesc.length > 300 && (
              <button
                onClick={toggleDesc}
                className="mt-2 text-blue-400 hover:underline text-sm"
              >
                {showFullDesc ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8 text-sm">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <Calendar size={18} className="text-blue-400" />
              <div>
                <p className="text-neutral-400">Season</p>
                <p className="font-semibold text-white">
                  {anime.season} {anime.seasonYear}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Star size={18} className="text-yellow-400" />
                <p className="text-white font-semibold">Score</p>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${score}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-yellow-400 rounded-full"
                />
              </div>
              <p className="mt-1 text-xs text-neutral-400">{score}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center gap-2"
            >
              <Film size={18} className="text-purple-400" />
              <div>
                <p className="text-neutral-400">Studio</p>
                <p className="font-semibold text-white">
                  {anime.studios.nodes[0]?.name || "-"}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={18} className="text-green-400" />
                <p className="text-white font-semibold">Popularity</p>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${popPercent}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-green-400 rounded-full"
                />
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                {anime.popularity?.toLocaleString() || 0}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex items-center gap-2"
            >
              <Tv size={18} className="text-pink-400" />
              <div>
                <p className="text-neutral-400">Status</p>
                <p className="font-semibold text-white">{anime.status || "-"}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <ShareModal
        open={shareOpen}
        setOpen={setShareOpen}
        title={anime.title.english || anime.title.romaji}
        url={shareUrl}
        thumbnail={coverSrc}
      />
    </section>
  )
}
