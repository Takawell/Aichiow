'use client'

import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

interface TimeCardProps {
  value: number;
  label: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface MousePosition {
  x: number;
  y: number;
}

const TimeCard: FC<TimeCardProps> = ({ value, label }) => (
  <div className="flex flex-col items-center p-2 sm:p-3 bg-neutral-900/50 rounded-lg min-w-[60px] sm:min-w-[70px]">
    <span className="text-2xl sm:text-3xl font-bold text-sky-300">{value.toString().padStart(2, '0')}</span>
    <span className="text-xs text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
)

export default function MaintenancePage(): JSX.Element {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  const targetDate: Date = new Date('2025-10-20T00:00:00')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  useEffect(() => {
     const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-4 sm:p-6 overflow-hidden text-white font-sans">
      <div
        className="pointer-events-none fixed inset-0 z-0 transition duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />

      <div className="absolute inset-0 z-0">
        <div id="stars-1" />
        <div id="stars-2" />
        <div id="stars-3" />
      </div>

      <style jsx global>{`
        #stars-1, #stars-2, #stars-3 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-repeat: repeat;
          background-size: cover;
          animation: fly 60s linear infinite;
        }
        #stars-1 {
          background-image: url('/stars1.png'); /* Buat gambar png kecil transparan dengan titik putih */
          animation-duration: 60s;
        }
        #stars-2 {
          background-image: url('/stars2.png'); /* Gambar png dengan titik lebih besar */
          animation-duration: 120s;
        }
        #stars-3 {
          background-image: url('/stars3.png'); /* Gambar png dengan titik lebih jarang */
          animation-duration: 180s;
        }
        @keyframes fly {
          from { background-position-y: 0px; }
          to { background-position-y: -1080px; }
        }
      `}</style>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative z-10 text-center max-w-2xl mx-auto p-6 sm:p-10 bg-black/40 backdrop-blur-2xl rounded-3xl border border-neutral-800 shadow-2xl shadow-blue-500/10"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-sky-300 via-blue-400 to-indigo-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        >
          AICHIOW
        </motion.h1>

        <motion.p variants={itemVariants} className="mt-4 text-gray-300 text-base md:text-lg">
          Kami sedang menyempurnakan situs untuk pengalaman yang lebih baik.
        </motion.p>
        <motion.p variants={itemVariants} className="mt-1 text-sm text-gray-500">
          Situs akan segera kembali. Terima kasih atas kesabaran Anda! 🙏
        </motion.p>

        <motion.div variants={itemVariants} className="mt-8 mb-8 flex justify-center gap-2 sm:gap-4 font-mono">
          <TimeCard value={timeLeft.days} label="Days" />
          <TimeCard value={timeLeft.hours} label="Hours" />
          <TimeCard value={timeLeft.minutes} label="Minutes" />
          <TimeCard value={timeLeft.seconds} label="Seconds" />
        </motion.div>
        
        <motion.p variants={itemVariants} className="text-sm text-gray-400">
          Ikuti kami untuk update terbaru:
        </motion.p>

        motion.div variants={itemVariants} className="flex justify-center gap-6 mt-4">
          {[
            { href: 'https://discord.gg/aichinime', icon: FaDiscord, color: 'hover:text-indigo-400' },
            { href: 'https://youtube.com/@Takadevelopment', icon: FaYoutube, color: 'hover:text-red-500' },
            { href: 'https://tiktok.com/@putrawangyyy', icon: FaTiktok, color: 'hover:text-pink-400' },
            { href: 'https://instagram.com/putrasenpaiii', icon: FaInstagram, color: 'hover:text-purple-400' },
          ].map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`text-3xl text-gray-500 transition-colors duration-300 ${social.color}`}
            >
              <social.icon />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
