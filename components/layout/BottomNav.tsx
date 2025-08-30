"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { motion, AnimatePresence } from "framer-motion"
import { FaHome, FaCalendarAlt, FaCompass, FaBookOpen } from "react-icons/fa"
import { GiBookshelf } from "react-icons/gi"
import { MdMenuBook } from "react-icons/md"
import { useState } from "react"
import Draggable from "react-draggable"

const navItems = [
  { href: "/home", label: "Home", icon: <FaHome size={22} /> },
  { href: "/upcoming", label: "Schedule", icon: <FaCalendarAlt size={22} /> },
  { href: "/explore", label: "Explore", icon: <FaCompass size={22} /> },
  { href: "/manga", label: "Manga", icon: <FaBookOpen size={22} /> },
  { href: "/manhwa", label: "Manhwa", icon: <MdMenuBook size={22} /> },
  { href: "/light-novel", label: "Light Novel", icon: <GiBookshelf size={22} /> },
]

export default function BottomNav() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true) 

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <Draggable
      axis="xy" 
      handle=".drag-handle" 
    >
      <nav
        className={`fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-lg 
        bg-gradient-to-t from-[#1f1f1f] via-[#2b2b2b] to-[#3a3a3a] backdrop-blur-xl 
        border border-gray-700 rounded-full flex justify-center items-center py-2.5 z-50 
        shadow-lg transition-all duration-500 ${isOpen ? "h-20" : "h-16"}`}
      >
        <motion.div
          className="drag-handle p-3 cursor-pointer absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          onClick={toggleMenu}
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`p-3 rounded-full transition-all duration-300 ${
              isOpen
                ? "bg-sky-500/20 shadow-lg text-sky-400"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            <FaCompass size={22} />
          </div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <div className="flex justify-around items-center w-full mt-10">
              {navItems.map((item) => {
                const isActive =
                  router.pathname === item.href || router.pathname.startsWith(item.href + "/")

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center relative"
                  >
                    <motion.div
                      animate={{
                        y: isActive ? -8 : 0,
                        color: isActive ? "#38bdf8" : "#9ca3af",
                        scale: isActive ? 1.2 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-sky-500/30 shadow-[0_0_18px_rgba(56,189,248,0.7)] text-sky-400"
                          : "hover:bg-white/5"
                      }`}
                    >
                      {item.icon}
                    </motion.div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.3 }}
                          className="text-[12px] font-semibold mt-2 text-sky-400"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </nav>
    </Draggable>
  )
}
