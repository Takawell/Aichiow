"use client"

import Link from "next/link"
import Image from "next/image"
import { AnimeDetail } from "@/types/anime"
import { useState } from "react"
import { useFavorites } from "@/hooks/useFavorites"
import { Heart, Share2, Calendar, Star, Film, TrendingUp, Tv } from "lucide-react"
import ShareModal from "@/components/shared/ShareModal"
import { motion } from "framer-motion"

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

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : ""
  const coverSrc = anime.coverImage.extraLarge || anime.coverImage.large

  return (
    <section className="relative w-full bg-neutral-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={
            anime.bannerImage ??
            anime.coverImage.extraLarge ??
            "/default-banner.jpg"
          }
          alt={anime.title.romaji || "Anime Banner"}
          fill
          priority
          className="object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-[200px] max-w-[220px]"
        >
          <Image
            src={coverSrc}
            alt={anime.title.romaji}
            width={200}
            height={300}
            className="rounded-2xl shadow-2xl border-2 border-white/10 object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl w-full"
        >
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                {anime.title.english || anime.title.romaji}
              </h1>
              {anime.title.romaji && (
                <p className="text-md text-neutral-400 italic">
                  {anime.title.romaji}
                </p>
              )}
              {anime.title.native && (
                <p className="text-md text-neutral-500">
                  {anime.title.native}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFavorite}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium backdrop-blur-md transition-all ${
                  isFavorite
                    ? "bg-red-500/90 border-red-500 hover:bg-red-600 text-white"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <Heart
                  size={18}
                  className={isFavorite ? "fill-current text-white" : ""}
                />
                <span>{isFavorite ? "Favorited" : "Favorite"}</span>
              </button>

              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-blue-500/80 transition-all backdrop-blur-md"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {anime.genres.slice(0, 6).map((genre) => (
              <Link
                key={genre}
                href={`/anime/genre/${encodeURIComponent(
                  genre.toLowerCase().replace(/\s+/g, "-")
                )}`}
              >
                <span
                  className="cursor-pointer text-[11px] uppercase tracking-wide font-medium px-3 py-1 
                           rounded-full bg-white/10 text-white/80 hover:bg-blue-500/80 hover:text-white 
                           transition backdrop-blur-sm"
                >
                  {genre}
                </span>
              </Link>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8"
          >
            {[
              {
                icon: <Calendar size={18} />,
                label: "Season",
                value: `${anime.season || "-"} ${anime.seasonYear || ""}`,
              },
              {
                icon: <Star size={18} />,
                label: "Score",
                value: anime.averageScore ? `${anime.averageScore}%` : "-",
              },
              {
                icon: <Film size={18} />,
                label: "Studio",
                value: anime.studios?.nodes?.[0]?.name || "-",
              },
              {
                icon: <TrendingUp size={18} />,
                label: "Popularity",
                value: anime.popularity?.toLocaleString() || "-",
              },
              {
                icon: <Tv size={18} />,
                label: "Status",
                value: anime.status || "-",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  {item.icon}
                  <span className="font-semibold text-white">{item.label}</span>
                </div>
                <p className="text-sm text-neutral-300 font-medium text-center">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
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
