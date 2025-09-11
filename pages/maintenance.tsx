'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

export default function MaintenancePage() {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  // Ambil target date dari localStorage atau buat baru
  const [targetDate] = useState(() => {
    const saved = localStorage.getItem('MAINTENANCE_END')
    if (saved) return new Date(saved)
    const t = new Date()
    t.setDate(t.getDate() + 10) // countdown 10 hari
    localStorage.setItem('MAINTENANCE_END', t.toISOString())
    return t
  })

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Loading bar
  useEffect(() => {
    const interval = setInterval(() => setProgress(prev => Math.min(prev + 1, 100)), 50)
    return () => clearInterval(interval)
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now
      if (distance < 0) setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      else setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / 1000 / 60) % 60),
        seconds: Math.floor((distance / 1000) % 60)
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center max-w-xl w-full p-8 bg-neutral-900/50 backdrop-blur-xl rounded-3xl border border-neutral-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)]"
        >
          {/* Logo */}
          <motion.h1
            whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
          >
            Aichiow
          </motion.h1>

          {/* Status Text */}
          <p className="mt-4 text-gray-300 text-lg md:text-xl">We’re performing a quick maintenance check.</p>
          <p className="mt-1 text-sm text-gray-400">The site will be back online very soon.</p>

          {/* Countdown */}
          <div className="mt-6 flex justify-center gap-4 text-gray-300 font-mono">
            <div className="flex flex-col items-center"><span className="text-xl md:text-2xl font-bold">{timeLeft.days}</span><span className="text-xs md:text-sm">Days</span></div>
            <div className="flex flex-col items-center"><span className="text-xl md:text-2xl font-bold">{timeLeft.hours}</span><span className="text-xs md:text-sm">Hours</span></div>
            <div className="flex flex-col items-center"><span className="text-xl md:text-2xl font-bold">{timeLeft.minutes}</span><span className="text-xs md:text-sm">Minutes</span></div>
            <div className="flex flex-col items-center"><span className="text-xl md:text-2xl font-bold">{timeLeft.seconds}</span><span className="text-xs md:text-sm">Seconds</span></div>
          </div>

          {/* Loading bar */}
          <div className="mt-6 h-2 w-full bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              style={{ scaleX: progress / 100, originX: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.1 }}
              className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 rounded-full"
            />
          </div>

          {/* Social Links */}
          <div className="mt-10">
            <p className="text-sm text-gray-400">Follow us for updates:</p>
            <div className="flex justify-center gap-6 mt-4">
              <Link href="https://discord.gg/aichinime" target="_blank" className="group">
                <FaDiscord className="text-3xl text-gray-400 group-hover:text-sky-400 transition-transform duration-300 hover:scale-125" />
              </Link>
              <Link href="https://youtube.com/@Takadevelopment" target="_blank" className="group">
                <FaYoutube className="text-3xl text-gray-400 group-hover:text-red-500 transition-transform duration-300 hover:scale-125" />
              </Link>
              <Link href="https://tiktok.com/@putrawangyyy" target="_blank" className="group">
                <FaTiktok className="text-3xl text-gray-400 group-hover:text-pink-400 transition-transform duration-300 hover:scale-125" />
              </Link>
              <Link href="https://instagram.com/putrasenpaiii" target="_blank" className="group">
                <FaInstagram className="text-3xl text-gray-400 group-hover:text-purple-400 transition-transform duration-300 hover:scale-125" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
