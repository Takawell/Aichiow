'use client'

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaStar, FaEye } from "react-icons/fa"

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
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 250, damping: 16 }}
      className="group relative flex flex-col w-full"
    >
      <Link
        href={`/manhwa/${manhwa.id}`}
        className="block relative w-full aspect-[2/3] overflow-hidden rounded-3xl border border-sky-400/10 
                   bg-gradient-to-br from-[#08111f] via-[#0b1627] to-[#0f1d30]
                   shadow-[0_0_25px_rgba(56,189,248,0.12)] 
                   hover:shadow-[0_0_45px_rgba(56,189,248,0.35)] 
                   transition-all duration-700 ease-out"
      >
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={manhwa.coverImage.large}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 45vw, (max-width: 1200px) 20vw, 15vw"
            className="object-cover rounded-3xl brightness-[0.95] group-hover:brightness-110 group-hover:saturate-125 transition-all duration-700"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-3xl opacity-95 group-hover:opacity-75 transition-all duration-700" />
        <div className="absolute inset-0 rounded-3xl ring-1 ring-sky-400/20 group-hover:ring-2 group-hover:ring-sky-400/50 transition-all duration-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(56,189,248,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-all duration-1000" />

        {manhwa.averageScore && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl 
                       text-xs font-bold bg-sky-500/80 text-white shadow-[0_0_10px_rgba(56,189,248,0.7)] 
                       backdrop-blur-sm border border-sky-400/30"
          >
            <FaStar className="text-yellow-300 drop-shadow-sm" />
            {manhwa.averageScore}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-center 
                     bg-black/60 backdrop-blur-[2px] rounded-3xl opacity-0 group-hover:opacity-100"
        >
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-2 px-5 py-2 
                       bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 
                       text-white text-sm sm:text-base font-semibold rounded-full 
                       shadow-[0_0_20px_rgba(56,189,248,0.7)] border border-sky-400/30"
          >
            <FaEye className="text-white/90" /> View Details
          </motion.span>
        </motion.div>

        <div className="absolute inset-0 rounded-3xl pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-sky-400/60 to-transparent blur-sm" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1 bg-gradient-to-l from-sky-400/60 to-transparent blur-sm" />
        </div>
      </Link>
      
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-3 text-sm sm:text-base md:text-lg font-semibold text-center 
                   text-white/90 group-hover:text-sky-300 
                   group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] 
                   transition-all duration-500 line-clamp-2 px-1"
      >
        {title}
      </motion.h2>
      <div className="absolute inset-x-0 bottom-1 h-[2px] bg-gradient-to-r from-transparent via-sky-500/30 to-transparent blur-[2px]" />
    </motion.div>
  )
}
