"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  FaDragon, FaHatWizard, FaHeartbeat, FaMusic, FaRobot, FaBasketballBall,
  FaGhost, FaBook, FaStar, FaLaugh, FaVenusMars, FaBrain, FaSchool,
  FaRunning, FaSatellite, FaMagic, FaMask, FaGuitar, FaQuestionCircle
} from "react-icons/fa"
import { GiKnifeFork, GiLoveMystery, GiCursedStar } from "react-icons/gi"
import { MdOutlineBoy, MdOutlineGirl } from "react-icons/md"

const genres = [
  { name: "Action", icon: <FaDragon /> },
  { name: "Adventure", icon: <FaHatWizard /> },
  { name: "Avant Garde", icon: <FaStar /> },
  { name: "Boys Love", icon: <MdOutlineBoy /> },
  { name: "Comedy", icon: <FaLaugh /> },
  { name: "Drama", icon: <FaBook /> },
  { name: "Ecchi", icon: <FaVenusMars /> },
  { name: "Fantasy", icon: <FaMagic /> },
  { name: "Girls Love", icon: <MdOutlineGirl /> },
  { name: "Gourmet", icon: <GiKnifeFork /> },
  { name: "Horror", icon: <FaGhost /> },
  { name: "Isekai", icon: <GiLoveMystery /> },
  { name: "Mahou Shoujo", icon: <FaHeartbeat /> },
  { name: "Mecha", icon: <FaRobot /> },
  { name: "Music", icon: <FaMusic /> },
  { name: "Mystery", icon: <FaQuestionCircle /> },
  { name: "Psychological", icon: <FaBrain /> },
  { name: "Romance", icon: <GiCursedStar /> },
  { name: "School", icon: <FaSchool /> },
  { name: "Sci-Fi", icon: <FaSatellite /> },
  { name: "Slice of Life", icon: <FaBook /> },
  { name: "Sports", icon: <FaBasketballBall /> },
  { name: "Supernatural", icon: <FaMask /> },
  { name: "Suspense", icon: <GiLoveMystery /> },
  { name: "Thriller", icon: <FaRunning /> },
]

export default function TopGenres() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold text-white mb-5">🎯 Popular Genres</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.name}
            href={`/anime/genre/${genre.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center p-4 bg-neutral-900/70
                         rounded-xl border border-neutral-700 text-white 
                         hover:border-sky-500 hover:shadow-[0_0_12px_rgba(56,189,248,0.4)] 
                         transition-all duration-300"
            >
              <span className="text-2xl mb-2 text-sky-400">{genre.icon}</span>
              <span className="text-sm font-medium">{genre.name}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
