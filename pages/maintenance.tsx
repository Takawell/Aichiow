'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

export default function MaintenancePage() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-neutral-950 to-black flex items-center justify-center px-6 overflow-hidden text-white">
      {/* 🔵 Background Glows */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-1/4 w-[500px] h-[500px] bg-blue-700/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-24 right-1/4 w-[400px] h-[400px] bg-sky-500/20 rounded-full blur-3xl animate-pulse delay-200" />
      </div>

      {/* ✨ Glassy Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-xl mx-auto p-8 bg-neutral-900/50 backdrop-blur-xl rounded-3xl border border-neutral-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)]"
      >
        {/* Logo */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
        >
          Aichiow
        </motion.h1>

        {/* Status Text */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-gray-300 text-lg md:text-xl"
        >
          We’re performing a quick maintenance check.
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-1 text-sm text-gray-400"
        >
          The site will be back online very soon.
        </motion.p>

        {/* Animated Loading Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 1.2 }}
          className="mt-6 h-2 w-48 mx-auto bg-neutral-700 rounded-full overflow-hidden"
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
            }}
            className="w-1/2 h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600"
          />
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10"
        >
          <p className="text-sm text-gray-400">Follow us for updates:</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="https://discord.gg/aichinime" target="_blank" className="group">
              <FaDiscord className="text-3xl text-gray-400 group-hover:text-sky-400 transition-colors duration-300" />
            </Link>
            <Link href="https://youtube.com/@Takadevelopment" target="_blank" className="group">
              <FaYoutube className="text-3xl text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
            </Link>
            <Link href="https://tiktok.com/@putrawangyyy" target="_blank" className="group">
              <FaTiktok className="text-3xl text-gray-400 group-hover:text-pink-400 transition-colors duration-300" />
            </Link>
            <Link href="https://instagram.com/putrasenpaiii" target="_blank" className="group">
              <FaInstagram className="text-3xl text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
