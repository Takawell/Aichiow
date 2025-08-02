'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

export default function Error500Page() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-neutral-950 to-black flex items-center justify-center px-6 overflow-hidden text-white">
      {/* Background Glows */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-1/4 w-[500px] h-[500px] bg-red-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-24 right-1/4 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-200" />
      </div>

      {/* Glassy Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-xl mx-auto p-8 bg-neutral-900/50 backdrop-blur-xl rounded-3xl border border-neutral-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)]"
      >
        {/* Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-indigo-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]"
        >
          500 CRASHED
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-gray-300 text-lg md:text-xl"
        >
          System overload. Too much awesome incoming.
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-1 text-sm text-gray-400"
        >
          Please try again in a few minutes or report the issue.
        </motion.p>

        {/* Smooth Loading Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 h-2 w-48 mx-auto bg-neutral-700 rounded-full overflow-hidden relative"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              duration: 2.5,
            }}
            className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-red-400 via-pink-500 to-indigo-500 blur-sm"
          />
        </motion.div>

        {/* Back Home */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-pink-600 to-indigo-600 hover:brightness-110 transition duration-300 text-white font-semibold shadow-lg"
          >
            Back to Safety
          </Link>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10"
        >
          <p className="text-sm text-gray-400">Stay connected with us:</p>
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
