'use client'

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

interface ManhwaCardProps {
  manhwa: {
    id: number
    title: {
      english?: string
      romaji?: string
    }
    coverImage: {
      large: string
    }
    averageScore?: number
  }
}

export default function ManhwaCard({ manhwa }: ManhwaCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      className="group relative"
    >
      <Link
        href={`/manhwa/${manhwa.id}`}
        className="block relative w-full aspect-[2/3] overflow-hidden rounded-2xl border border-sky-400/10 bg-gradient-to-b from-sky-950/40 to-sky-900/20 shadow-[0_0_20px_rgba(56,189,248,0.1)] backdrop-blur-md transition-all duration-500 group-hover:border-sky-400/60 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={manhwa.coverImage.large}
            alt={manhwa.title.english || manhwa.title.romaji || "Manhwa"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
            className="object-cover group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-150 transition-all duration-700 ease-out"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-all duration-700 rounded-2xl"></div>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-sky-400/20 group-hover:ring-2 group-hover:ring-sky-400 group-hover:ring-offset-2 group-hover:ring-offset-sky-900/30 transition-all duration-700"></div>

        {manhwa.averageScore && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 left-3 px-2.5 py-1.5 rounded-md text-xs font-bold bg-sky-500/80 text-white shadow-[0_0_10px_rgba(56,189,248,0.8)] backdrop-blur-md"
          >
            ⭐ {manhwa.averageScore}
          </motion.span>
        )}
      </Link>

      <p className="mt-3 text-sm md:text-base font-semibold text-center text-white/90 group-hover:text-sky-300 group-hover:drop-shadow-[0_0_6px_rgba(56,189,248,0.5)] transition-all duration-500 line-clamp-2">
        {manhwa.title.english || manhwa.title.romaji}
      </p>
    </motion.div>
  )
}
