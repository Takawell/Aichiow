"use client"
import Link from "next/link"
import { useRouter } from "next/router"
import { motion, AnimatePresence } from "framer-motion"
import { FaHome, FaCalendarAlt, FaCompass, FaBookOpen } from "react-icons/fa"
import { GiBookshelf } from "react-icons/gi"
import { MdMenuBook } from "react-icons/md" // buat Manhwa biar beda icon

const navItems = [
  { href: "/home", label: "Home", icon: <FaHome size={20} /> },
  { href: "/upcoming", label: "Timetable", icon: <FaCalendarAlt size={20} /> },
  { href: "/explore", label: "Explore", icon: <FaCompass size={20} /> },
  { href: "/manga", label: "Manga", icon: <FaBookOpen size={20} /> },
  { href: "/manhwa", label: "Manhwa", icon: <MdMenuBook size={20} /> },
  { href: "/light-novel", label: "LN", icon: <GiBookshelf size={20} /> },
]

export default function BottomNav() {
  const router = useRouter()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-gray-800 flex justify-around items-center py-2 z-50">
      {navItems.map((item) => {
        const isActive =
          router.pathname === item.href || router.pathname.startsWith(item.href + "/")

        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center relative">
            <motion.div
              animate={{
                y: isActive ? -4 : 0,
                color: isActive ? "#38bdf8" : "#d1d5db",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`p-2 rounded-full ${
                isActive ? "bg-sky-500/20" : "bg-transparent"
              }`}
            >
              {item.icon}
            </motion.div>

            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="text-[11px] font-medium mt-1 text-sky-400"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        )
      })}
    </nav>
  )
}
