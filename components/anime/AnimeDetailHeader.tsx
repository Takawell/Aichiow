"use client"

import Link from "next/link"
import Image from "next/image"
import { AnimeDetail } from "@/types/anime"
import { useState } from "react"
import { useFavorites } from "@/hooks/useFavorites"
import { Heart, Share2, Calendar, Star, Film, BarChart3, Tv, Sparkles, TrendingUp, Users, Clock, Zap } from "lucide-react"
import ShareModal from "@/components/shared/ShareModal"

interface Props {
  anime: AnimeDetail
}

export default function AnimeDetailHeader({ anime }: Props) {
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
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
    <section className="relative w-full bg-black text-white overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={
            anime.bannerImage ??
            anime.coverImage.extraLarge ??
            "/default-banner.jpg"
          }
          alt={anime.title.romaji || "Anime Banner"}
          fill
          priority
          className="object-cover opacity-25 blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/90" />
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-sky-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-600/25 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-sky-400/40 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e910_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e910_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          
          <div 
            className="relative group mx-auto lg:mx-0 w-full max-w-[280px] lg:max-w-[320px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-700 animate-pulse" />
            
            <div className="absolute -inset-2 bg-gradient-to-br from-sky-400/50 to-blue-600/50 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-transparent to-blue-600/20 rounded-2xl" />
              
              <Image
                src={coverSrc}
                alt={anime.title.romaji}
                width={320}
                height={480}
                className="relative rounded-2xl shadow-2xl border-2 border-sky-500/40 object-cover w-full transform group-hover:scale-[1.02] transition-all duration-700 group-hover:border-sky-400"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl flex items-end justify-center pb-6">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl border border-sky-500/30 flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold text-sm">{score}%</span>
              </div>

              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl border border-sky-500/30 flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white font-bold text-xs">{anime.status}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <div className="flex-1 bg-gradient-to-br from-sky-500/10 to-blue-600/10 backdrop-blur-sm border border-sky-500/30 rounded-xl p-3 hover:border-sky-400 transition-all duration-300 hover:scale-105">
                <Users className="w-5 h-5 text-sky-400 mb-1" />
                <p className="text-xs text-slate-400">Popularity</p>
                <p className="text-sm font-bold text-white">{(popularity / 1000).toFixed(1)}K</p>
              </div>
              <div className="flex-1 bg-gradient-to-br from-sky-500/10 to-blue-600/10 backdrop-blur-sm border border-sky-500/30 rounded-xl p-3 hover:border-sky-400 transition-all duration-300 hover:scale-105">
                <Tv className="w-5 h-5 text-pink-400 mb-1" />
                <p className="text-xs text-slate-400">Episodes</p>
                <p className="text-sm font-bold text-white">{anime.episodes || "?"}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full space-y-8">
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 to-blue-600 rounded-lg blur-lg opacity-50 animate-pulse" />
                  <Sparkles className="relative w-8 h-8 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-2 bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    {anime.title.english || anime.title.romaji}
                  </h1>
                  {anime.title.romaji && anime.title.english && (
                    <p className="text-base sm:text-lg text-sky-300/80 italic font-light">
                      {anime.title.romaji}
                    </p>
                  )}
                  {anime.title.native && (
                    <p className="text-sm text-slate-500 mt-1">
                      {anime.title.native}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={toggleFavorite}
                  disabled={loading}
                  className={`group relative px-6 py-3.5 rounded-2xl font-bold transition-all duration-500 text-sm sm:text-base overflow-hidden shadow-2xl ${
                    isFavorite
                      ? "bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white hover:shadow-red-500/50"
                      : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-sky-500/50"
                  } hover:scale-110 active:scale-95`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="relative flex items-center gap-2">
                    <Heart
                      size={20}
                      className={
                        isFavorite
                          ? "fill-current text-white animate-pulse"
                          : "text-white group-hover:scale-125 transition-transform duration-300"
                      }
                    />
                    <span>{isFavorite ? "Favorited" : "Add Favorite"}</span>
                  </div>
                </button>

                <button
                  onClick={() => setShareOpen(true)}
                  className="group relative px-6 py-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-sky-500/40 text-white font-bold hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/30 transition-all duration-500 text-sm sm:text-base hover:scale-110 active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="relative flex items-center gap-2">
                    <Share2 size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Share</span>
                  </div>
                </button>

                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 backdrop-blur-sm">
                  <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold text-sm">Trending</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {anime.genres.slice(0, 6).map((genre, idx) => (
                <Link
                  key={genre}
                  href={`/anime/genre/${encodeURIComponent(
                    genre.toLowerCase().replace(/\s+/g, "-")
                  )}`}
                >
                  <span 
                    className="group cursor-pointer text-xs uppercase tracking-widest font-black px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500/20 via-blue-600/20 to-cyan-500/20 backdrop-blur-md border border-sky-400/40 text-sky-200 hover:from-sky-500 hover:via-blue-600 hover:to-cyan-500 hover:text-white hover:scale-110 hover:rotate-2 transition-all duration-300 shadow-lg hover:shadow-sky-500/50 relative overflow-hidden"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative">{genre}</span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative max-w-4xl text-base sm:text-lg text-slate-300 leading-relaxed bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-sky-500/30 shadow-2xl group-hover:border-sky-400/60 transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 rounded-t-2xl" />
                <p className={`${showFullDesc ? "" : "line-clamp-4"} text-slate-200`}>{cleanDesc}</p>
                {cleanDesc.length > 300 && (
                  <button
                    onClick={toggleDesc}
                    className="mt-4 text-sky-400 hover:text-sky-300 font-bold text-sm flex items-center gap-2 group/btn"
                  >
                    <span>{showFullDesc ? "Show Less" : "Read More"}</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              
              <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-sky-500/30 hover:border-sky-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-blue-600/0 group-hover:from-sky-500/10 group-hover:to-blue-600/10 transition-all duration-500" />
                <div className="relative flex items-center gap-3 mb-3">
                  <div className="p-2 bg-sky-500/20 rounded-xl group-hover:bg-sky-500/30 transition-colors">
                    <Calendar size={20} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Season</p>
                    <p className="text-white font-bold">{anime.season} {anime.seasonYear}</p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-sky-500/30 hover:border-yellow-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-orange-600/0 group-hover:from-yellow-500/10 group-hover:to-orange-600/10 transition-all duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 transition-colors">
                      <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Score</p>
                      <p className="text-white font-bold text-yellow-400">{score}%</p>
                    </div>
                  </div>
                  <div className="relative h-3 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 animate-pulse" />
                    <div
                      className="relative h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-full transition-all duration-1000 shadow-lg shadow-yellow-500/50"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-sky-500/30 hover:border-purple-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-600/0 group-hover:from-purple-500/10 group-hover:to-pink-600/10 transition-all duration-500" />
                <div className="relative flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                    <Film size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Studio</p>
                    <p className="text-white font-bold text-purple-300">{anime.studios.nodes[0]?.name || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-sky-500/30 hover:border-green-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 overflow-hidden sm:col-span-2 xl:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-600/0 group-hover:from-green-500/10 group-hover:to-emerald-600/10 transition-all duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                      <BarChart3 size={20} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Popularity</p>
                      <p className="text-white font-bold text-green-400">{anime.popularity?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                  <div className="relative h-3 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 animate-pulse" />
                    <div
                      className="relative h-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 rounded-full transition-all duration-1000 shadow-lg shadow-green-500/50"
                      style={{ width: `${popPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl p-5 rounded-2xl border border-sky-500/30 hover:border-pink-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 overflow-hidden sm:col-span-2">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-600/0 group-hover:from-pink-500/10 group-hover:to-rose-600/10 transition-all duration-500" />
                <div className="relative flex items-center gap-3 mb-3">
                  <div className="p-2 bg-pink-500/20 rounded-xl group-hover:bg-pink-500/30 transition-colors">
                    <Tv size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Status</p>
                    <p className="text-white font-bold text-pink-300">{anime.status || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Duration</p>
                <p className="text-white font-bold text-sm">{anime.duration ? `${anime.duration}m` : "-"}</p>
              </div>
              <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 backdrop-blur-sm border border-sky-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Favorites</p>
                <p className="text-white font-bold text-sm">{(anime.favourites || 0) > 1000 ? `${(anime.favourites / 1000).toFixed(1)}K` : anime.favourites || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                <Tv className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Format</p>
                <p className="text-white font-bold text-sm">{anime.format || "-"}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Trending</p>
                <p className="text-white font-bold text-sm">#{anime.trending || "-"}</p>
              </div>
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

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </section>
  )
}
