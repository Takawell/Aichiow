// components/anime/AnimeDetailHeader.tsx
import Image from 'next/image'
import { AnimeDetail } from '@/types/anime'
import { useState } from 'react'

interface Props {
  anime: AnimeDetail
}

export default function AnimeDetailHeader({ anime }: Props) {
  const [showFullDesc, setShowFullDesc] = useState(false)
  const cleanDesc = anime.description?.replace(/<[^>]+>/g, '') || ''

  const toggleDesc = () => setShowFullDesc((prev) => !prev)

  return (
    <section className="relative w-full bg-neutral-900 text-white">
      {/* Banner Background */}
      <div className="absolute inset-0">
        <Image
          src={anime.bannerImage || anime.coverImage.extraLarge}
          alt={anime.title.romaji}
          fill
          priority
          className="object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 p-6 md:p-10">
        {/* COVER IMAGE */}
        <div className="min-w-[200px] max-w-[220px]">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.romaji}
            width={200}
            height={300}
            className="rounded-xl shadow-2xl border-2 border-white/10 object-cover"
          />
        </div>

        {/* INFO */}
        <div className="max-w-4xl">
          {/* TITLES */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {anime.title.english || anime.title.romaji}
          </h1>
          {anime.title.romaji && (
            <p className="text-md text-neutral-400 italic">{anime.title.romaji}</p>
          )}
          {anime.title.native && (
            <p className="text-md text-neutral-500">{anime.title.native}</p>
          )}

          {/* GENRES */}
          <div className="mt-3 flex flex-wrap gap-2">
            {anime.genres.slice(0, 6).map((genre) => (
              <span
                key={genre}
                className="text-[11px] uppercase tracking-wide font-medium px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* DESCRIPTION with Show More */}
          <div className="mt-4 max-w-2xl text-sm text-neutral-300 leading-relaxed">
            <p className={showFullDesc ? '' : 'line-clamp-5'}>
              {cleanDesc}
            </p>
            {cleanDesc.length > 300 && (
              <button
                onClick={toggleDesc}
                className="mt-2 text-blue-400 hover:underline text-sm"
              >
                {showFullDesc ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-6 text-sm text-neutral-400">
            <p><span className="font-medium text-white">🎞️ Format:</span> {anime.format || '-'}</p>
            <p><span className="font-medium text-white">📅 Season:</span> {anime.season} {anime.seasonYear}</p>
            <p><span className="font-medium text-white">⭐ Score:</span> {anime.averageScore || '-'}</p>
            <p><span className="font-medium text-white">🎬 Studio:</span> {anime.studios.nodes[0]?.name || '-'}</p>
            <p><span className="font-medium text-white">📈 Popularity:</span> {anime.popularity || '-'}</p>
            <p><span className="font-medium text-white">📺 Status:</span> {anime.status || '-'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
