"use client"

import Link from "next/link"
import Image from "next/image"
import { AnimeDetail } from "@/types/anime"
import { useState } from "react"
import { useFavorites } from "@/hooks/useFavorites"
import { Heart, Share2, CalendarDays, Star, Building2, TrendingUp, Tv2 } from "lucide-react"
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
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const coverSrc = anime.coverImage.extraLarge || anime.coverImage.large

  const StatItem = ({
    icon: Icon,
    label,
    value,
    barValue,
  }: {
    icon: any
    label: string
    value: string | number
    barValue?: number
  }) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-blue-400" />
        <span className="text-sm text-neutral-300">{label}</span>
      </div>
      <div className="text-white font-medium text-sm">{value}</div>
      {typeof barValue === "number" && (
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${barValue}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      )}
    </div>
  )

  return (
    <section className="relative w-full bg-neutral-950 text-white overflow-hidden">
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

      <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 p-6 md:p-10">
        <div className="min-w-[180px] max-w-[200px] mx-auto md:mx-0">
          <Image
            src={coverSrc}
            alt={anime.title.romaji}
            width={200}
            height={300}
            className="rounded-xl shadow-2xl border-2 border-white/10 object-cover"
          />
        </div>

        <div className="max-w-4xl w-full flex flex-col">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                {anime.title.english || anime.title.romaji}
              </h1>
              {anime.title.romaji && (
                <p className="text-sm text-neutral-400 italic">
                  {anime.title.romaji}
                </p>
              )}
              {anime.title.native && (
                <p className="text-sm text-neutral-500">{anime.title.native}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                disabled={loading}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border transition text-sm md:text-base ${
                  isFavorite
                    ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <Heart
                  size={18}
                  className={isFavorite ? "fill-current text-white" : "text-white"}
                />
                <span className="hidden sm:inline">
                  {isFavorite ? "Favorited" : "Favorite"}
                </span>
              </button>

              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-blue-500/80 transition text-sm md:text-base"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
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

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatItem
              icon={CalendarDays}
              label="Season"
              value={`${anime.season || "-"} ${anime.seasonYear || ""}`}
            />
            <StatItem
              icon={Star}
              label="Score"
              value={`${anime.averageScore || 0}/100`}
              barValue={anime.averageScore || 0}
            />
            <StatItem
              icon={Building2}
              label="Studio"
              value={anime.studios.nodes[0]?.name || "-"}
            />
            <StatItem
              icon={TrendingUp}
              label="Popularity"
              value={anime.popularity || 0}
              barValue={
                anime.popularity
                  ? Math.min(100, anime.popularity / 1000)
                  : 0
              }
            />
            <StatItem
              icon={Tv2}
              label="Status"
              value={anime.status || "-"}
              barValue={
                anime.status === "FINISHED"
                  ? 100
                  : anime.status === "RELEASING"
                  ? 70
                  : 40
              }
            />
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
