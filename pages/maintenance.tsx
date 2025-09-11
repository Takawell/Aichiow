'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

export default function MaintenancePage() {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  // Tetapkan targetDate statis supaya countdown tetap walau refresh
  const targetDate = new Date('2025-09-20T12:00:00') // <--- ganti sesuai kebutuhan

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
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-neutral-950 to-black flex items-center justify-center px-6 overflow-hidden text-white">
      
      {/* Floating Particles */}
      {windowSize.width > 0 &&
        Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-blue-500/30 rounded-full blur-xl pointer-events-none"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              scale: Math.random() * 1.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              y: [0, windowSize.height],
              x: [0, windowSize.width],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 20 + Math.random() * 10,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          />
        ))}

      {/* Glassy Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-xl mx-auto p-8 bg-neutral-900/50 backdrop-blur-xl rounded-3xl border border-neutral-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)]"
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

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex justify-center gap-4 text-gray-300 font-mono"
        >
          {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold">{Object.values(timeLeft)[idx]}</span>
              <span className="text-xs md:text-sm">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Loading bar */}
        <motion.div className="mt-6 h-2 w-full bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            style={{ scaleX: progress / 100, originX: 0 }}
            transition={{ ease: 'easeInOut', duration: 0.1 }}
            className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 rounded-full"
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
            {[
              { icon: FaDiscord, link: 'https://discord.gg/aichinime', color: 'text-sky-400' },
              { icon: FaYoutube, link: 'https://youtube.com/@Takadevelopment', color: 'text-red-500' },
              { icon: FaTiktok, link: 'https://tiktok.com/@putrawangyyy', color: 'text-pink-400' },
              { icon: FaInstagram, link: 'https://instagram.com/putrasenpaiii', color: 'text-purple-400' },
            ].map(({ icon: Icon, link, color }, idx) => (
              <Link key={idx} href={link} target="_blank" className="group">
                <Icon className={`text-3xl text-gray-400 group-hover:${color} transition-transform duration-300 hover:scale-125`} />
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
