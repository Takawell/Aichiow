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
      whileHover={{ scale: 1.07 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group"
    >
      <Link
        href={`/manhwa/${manhwa.id}`}
        className="block relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-md 
        group-hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] group-hover:border-sky-400 transition-all duration-500"
      >
        <Image
          src={manhwa.coverImage.large}
          alt={manhwa.title.english || manhwa.title.romaji || "Manhwa"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          className="object-cover group-hover:brightness-110 group-hover:saturate-150 transition duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition duration-500"></div>
        <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-2 group-hover:ring-sky-400 group-hover:ring-offset-2 group-hover:ring-offset-black/50 transition"></div>
        
        {manhwa.averageScore && (
          <span className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold bg-sky-600/80 text-white shadow-[0_0_10px_rgba(56,189,248,0.8)]">
            ⭐ {manhwa.averageScore}
          </span>
        )}
      </Link>

      <p className="mt-2 text-sm font-semibold text-center line-clamp-2 text-white group-hover:text-sky-400 transition duration-300">
        {manhwa.title.english || manhwa.title.romaji}
      </p>
    </motion.div>
  )
}
