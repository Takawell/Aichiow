"use client"

import Link from "next/link"
import Image from "next/image"
import { AnimeDetail } from "@/types/anime"
import { useState } from "react"
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
    <section className="relative w-full bg-neutral-900 text-white">
      <div className="absolute inset-0">
        <Image
          src={
            anime.bannerImage ??
            anime.coverImage.extraLarge ??
            "/background.png"
          }
          alt={anime.title.romaji || "Anime Banner"}
          fill
          priority
          className="object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 p-6 md:p-10">
        <div className="min-w-[180px] max-w-[200px] mx-auto md:mx-0">
          <Image
            src={coverSrc}
            alt={anime.title.romaji}
            width={200}
            height={300}
            className="rounded-xl shadow-2xl border-2 border-white/10 object-cover w-full"
          />
        </div>

        <div className="max-w-4xl w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                {anime.title.english || anime.title.romaji}
              </h1>
              {anime.title.romaji && (
                <p className="text-sm text-neutral-400 italic">
                  {anime.title.romaji}
                </p>
              )}
              {anime.title.native && (
                <p className="text-sm text-neutral-500">
                  {anime.title.native}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={toggleFavorite}
                disabled={loading}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-xl border transition text-sm md:text-base ${
                  isFavorite
                    ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <Heart
                  size={18}
                  className={
                    isFavorite
                      ? "fill-current text-white"
                      : "text-white"
                  }
                />
                <span>{isFavorite ? "Favorited" : "Favorite"}</span>
              </button>

              <button
                onClick={() => setShareOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-blue-500/80 transition text-sm md:text-base"
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
                <span className="cursor-pointer text-[11px] uppercase tracking-wide font-medium px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-blue-500/80 hover:text-white transition">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-400" />
              <p className="text-neutral-300">
                <span className="font-medium text-white">Season:</span>{" "}
                {anime.season} {anime.seasonYear}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={16} className="text-yellow-400" />
                <p className="text-neutral-300 font-medium text-white">
                  Score: {score}%
                </p>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Film size={16} className="text-purple-400" />
              <p className="text-neutral-300">
                <span className="font-medium text-white">Studio:</span>{" "}
                {anime.studios.nodes[0]?.name || "-"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={16} className="text-green-400" />
                <p className="text-neutral-300 font-medium text-white">
                  Popularity: {anime.popularity?.toLocaleString() || 0}
                </p>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 rounded-full transition-all"
                  style={{ width: `${popPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tv size={16} className="text-pink-400" />
              <p className="text-neutral-300">
                <span className="font-medium text-white">Status:</span>{" "}
                {anime.status || "-"}
              </p>
            </div>
          </div>
        </div>
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
