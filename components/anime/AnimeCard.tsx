'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Anime } from '@/types/anime'
import { motion } from 'framer-motion'

interface Props {
  anime: Anime
}

export default function AnimeCard({ anime }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/anime/${anime.id}`}
        className="group relative block overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg transition-all duration-300"
      >
        {/* COVER */}
        <div className="relative w-full h-[200px]">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.english || anime.title.romaji}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        </div>

        {/* INFO */}
        <div className="relative z-20 p-3 space-y-2">
          <h3
            className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors duration-300"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '140px'
            }}
          >
            {anime.title.english || anime.title.romaji}
          </h3>

          {/* GENRES */}
          <div className="flex flex-wrap gap-1">
            {anime.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 backdrop-blur-md"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* BORDER GLOW */}
        <div className="absolute inset-0 rounded-xl border border-indigo-500/10 group-hover:border-indigo-400/40 pointer-events-none" />
      </Link>
    </motion.div>
  )
}
