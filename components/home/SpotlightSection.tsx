'use client'
import { Anime } from '@/types/anime'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface SpotlightSectionProps {
  anime?: Anime[]
}

export default function SpotlightSection({ anime }: SpotlightSectionProps) {
  if (!anime || anime.length === 0) return null

  return (
    <section className="w-full px-4 md:px-10 py-10 relative z-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        🌟 <span className="text-primary">Editor’s Spotlight</span>
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {anime.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1b1b1f] rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.015] transition-all duration-300 group overflow-hidden border border-neutral-800"
          >
            <Link href={`/anime/${item.id}`} className="block w-full h-full">
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src={item.bannerImage || item.coverImage?.large}
                  alt={item.title.romaji || 'Anime'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                  {item.title.english || item.title.romaji}
                </h3>
                <div className="flex flex-wrap gap-1 text-xs text-neutral-400">
                  {item.genres?.slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="bg-neutral-800 px-2 py-0.5 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-neutral-300 line-clamp-2">
                  Score: <span className="text-white">{item.averageScore || 'N/A'}</span>
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
