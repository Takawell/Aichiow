'use client'

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaStar } from "react-icons/fa"

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
  const title = manhwa.title.english || manhwa.title.romaji || "Unknown Title"

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      className="group relative w-full"
    >
      <Link
        href={`/manhwa/${manhwa.id}`}
        className="block relative w-full aspect-[2/3] overflow-hidden rounded-2xl border border-sky-400/10 bg-gradient-to-b from-[#0a1625] to-[#07111d] shadow-[0_0_20px_rgba(56,189,248,0.12)] hover:shadow-[0_0_35px_rgba(56,189,248,0.4)] transition-all duration-500 ease-out"
      >
        <Image
          src={manhwa.coverImage.large}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          className="object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-125"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent rounded-2xl opacity-90 group-hover:opacity-60 transition-all duration-700" />

        <div className="absolute inset-0 rounded-2xl ring-1 ring-sky-400/20 group-hover:ring-2 group-hover:ring-sky-400/60 transition-all duration-500" />

        {manhwa.averageScore && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-sky-500/80 text-white shadow-[0_0_10px_rgba(56,189,248,0.8)] backdrop-blur-md"
          >
            <FaStar className="text-yellow-300 drop-shadow" />
            {manhwa.averageScore}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover:opacity-100"
        >
          <span className="px-4 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold rounded-full shadow-[0_0_15px_rgba(56,189,248,0.6)]">
            View Detail
          </span>
        </motion.div>
      </Link>

      <p className="mt-3 text-sm sm:text-base font-semibold text-center text-white/90 group-hover:text-sky-300 group-hover:drop-shadow-[0_0_6px_rgba(56,189,248,0.6)] transition-all duration-500 line-clamp-2 px-1">
        {title}
      </p>
    </motion.div>
  )
}
