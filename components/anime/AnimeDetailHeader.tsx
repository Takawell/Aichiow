"use client"

import Link from "next/link"
import Image from "next/image"
import { AnimeDetail } from "@/types/anime"
import { useState } from "react"
import { useFavorites } from "@/hooks/useFavorites"
import { Heart, Share2 } from "lucide-react"
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

  return (
    <section className="relative w-full bg-neutral-950 text-white">
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
          className="object-cover opacity-40 blur-md"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 p-6 md:p-10">
        <div className="min-w-[200px] max-w-[220px]">
          <Image
            src={coverSrc}
            alt={anime.title.romaji}
            width={200}
            height={300}
            className="rounded-2xl shadow-xl border border-white/10 object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>

        <div className="max-w-4xl w-full">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-md">
                {anime.title.english || anime.title.romaji}
              </h1>
              {anime.title.romaji && (
                <p className="text-lg text-neutral-400 italic">
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
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border text-sm md:text-base font-medium shadow-lg transition ${
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
                <span className="hidden sm:inline">
                  {isFavorite ? "Favorited" : "Favorite"}
                </span>
              </button>

              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-blue-500/80 hover:shadow-lg transition text-sm md:text-base font-medium"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {anime.genres.slice(0, 6).map((genre) => (
              <Link
                key={genre}
                href={`/anime/genre/${encodeURIComponent(
                  genre.toLowerCase().replace(/\s+/g, "-")
                )}`}
              >
                <span className="cursor-pointer text-[11px] uppercase tracking-wide font-medium px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white/90 hover:from-blue-500 hover:to-purple-500 hover:text-white transition shadow-md">
                  {genre}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-5 max-w-2xl text-sm text-neutral-300 leading-relaxed">
            <p className={showFullDesc ? "" : "line-clamp-5"}>
              {cleanDesc}
            </p>
            {cleanDesc.length > 300 && (
              <button
                onClick={toggleDesc}
                className="mt-2 text-blue-400 hover:underline text-sm font-medium"
              >
                {showFullDesc ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-6 text-sm text-neutral-400">
            <p>
              <span className="font-medium text-white">🎞️ Format:</span>{" "}
              {anime.format || "-"}
            </p>
            <p>
              <span className="font-medium text-white">📅 Season:</span>{" "}
              {anime.season} {anime.seasonYear}
            </p>
            <p>
              <span className="font-medium text-white">⭐ Score:</span>{" "}
              {anime.averageScore || "-"}
            </p>
            <p>
              <span className="font-medium text-white">🎬 Studio:</span>{" "}
              {anime.studios.nodes[0]?.name || "-"}
            </p>
            <p>
              <span className="font-medium text-white">📈 Popularity:</span>{" "}
              {anime.popularity || "-"}
            </p>
            <p>
              <span className="font-medium text-white">📺 Status:</span>{" "}
              {anime.status || "-"}
            </p>
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
