'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Anime } from '@/types/anime'
import { motion } from 'framer-motion'

interface Props {
  anime: Anime[] | undefined
}

export default function NowAiringSection({ anime }: Props) {
  if (!anime) return null

  return (
    <section className="px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">
        📡 Now Airing
      </h2>

      <div className="grid grid-flow-col gap-4 overflow-x-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 snap-x snap-mandatory scroll-smooth">
        {anime.slice(0, 12).map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="snap-start"
          >
            <Link
              href={`/anime/${item.id}`}
              className="group block bg-white/5 border border-white/10 backdrop-blur-md rounded-xl overflow-hidden transition-all duration-300 shadow hover:shadow-indigo-500/30"
            >
              <div className="relative w-full h-[200px]">
                <Image
                  src={item.coverImage.large}
                  alt={item.title.english || item.title.romaji}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
              </div>

              <div className="relative z-20 p-3">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors duration-300">
                  {item.title.english || item.title.romaji}
                </h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.genres?.slice(0, 2).map((genre) => (
                    <span
                      key={genre}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
