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
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group"
    >
      <Link
        href={`/manhwa/${manhwa.id}`}
        className="block relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-md group-hover:shadow-emerald-500/30 group-hover:border-emerald-500/30 transition-all duration-300"
      >
        {/* Cover */}
        <Image
          src={manhwa.coverImage.large}
          alt={manhwa.title.english || manhwa.title.romaji || "Manhwa"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          className="object-cover group-hover:brightness-110 group-hover:saturate-150 transition duration-300"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition"></div>

        {/* Score badge */}
        {manhwa.averageScore && (
          <span className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold bg-emerald-600/80 text-white shadow-md">
            ⭐ {manhwa.averageScore}
          </span>
        )}
      </Link>

      {/* Title */}
      <p className="mt-2 text-sm font-semibold text-center line-clamp-2 text-white group-hover:text-emerald-400 transition">
        {manhwa.title.english || manhwa.title.romaji}
      </p>
    </motion.div>
  )
}
