'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Custom500() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-neutral-950 to-black flex items-center justify-center px-6 overflow-hidden text-white">
      {/* 🔵 Background Glows */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-1/4 w-[500px] h-[500px] bg-red-700/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-24 right-1/4 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-200" />
      </div>

      {/* ✨ Glassy Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-xl mx-auto p-8 bg-neutral-900/50 backdrop-blur-xl rounded-3xl border border-neutral-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)]"
      >
        {/* Chibi Image */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <Image
            src="/error.png"
            alt="Chibi Error"
            width={180}
            height={180}
            className="rounded-full drop-shadow-lg"
            priority
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 drop-shadow-[0_0_10px_rgba(255,100,100,0.6)]"
        >
          500 Error
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-gray-300 text-lg md:text-xl"
        >
          Oops... Server Aichiow lagi error nih 🥲
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-1 text-sm text-gray-400"
        >
          Tim teknikal kami sudah di jalan, tunggu sebentar ya!
        </motion.p>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6"
        >
          <Link href="/">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition text-white font-semibold py-2 px-5 rounded-lg shadow-lg">
              Kembali ke Beranda
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
