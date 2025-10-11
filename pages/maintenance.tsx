'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

export default function MaintenancePage() {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const targetDate = new Date('2025-12-20T12:00:00')

  useEffect(() => {
    const interval = setInterval(() => setProgress(p => Math.min(p + 1, 100)), 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / 1000 / 60) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const DPR = window.devicePixelRatio || 1
    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width * DPR
    canvas.height = height * DPR
    ctx.scale(DPR, DPR)
    const particles: { x: number; y: number; vx: number; vy: number }[] = []
    const particleCount = 80
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      })
    }
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(30,30,50,0.2)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(59,130,246,0.6)'
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.strokeStyle = `rgba(59,130,246,${1 - dist / 120})`
            ctx.lineWidth = 0.4
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      requestAnimationFrame(draw)
    }
    draw()
    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * DPR
      canvas.height = height * DPR
      ctx.scale(DPR, DPR)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-neutral-950 to-black text-white">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-xl mx-auto p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600"
        >
          AICHIOW
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-gray-300 text-lg md:text-xl"
        >
          We’re upgrading your experience.
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-1 text-sm text-gray-400"
        >
          Our site is under maintenance. Stay tuned for the next generation of Aichiow.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex justify-center gap-4 text-gray-300 font-mono"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{timeLeft.days}</span>
            <span className="text-xs">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{timeLeft.hours}</span>
            <span className="text-xs">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{timeLeft.minutes}</span>
            <span className="text-xs">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{timeLeft.seconds}</span>
            <span className="text-xs">Seconds</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ ease: 'easeInOut', duration: 0.1 }}
          className="mt-6 h-2 w-48 mx-auto bg-neutral-800 rounded-full overflow-hidden"
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10"
        >
          <p className="text-sm text-gray-400">Follow us for updates:</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="https://discord.gg/aichinime" target="_blank">
              <FaDiscord className="text-3xl text-gray-400 hover:text-sky-400 transition duration-300" />
            </Link>
            <Link href="https://youtube.com/@Takadevelopment" target="_blank">
              <FaYoutube className="text-3xl text-gray-400 hover:text-red-500 transition duration-300" />
            </Link>
            <Link href="https://tiktok.com/@putrawangyyy" target="_blank">
              <FaTiktok className="text-3xl text-gray-400 hover:text-pink-400 transition duration-300" />
            </Link>
            <Link href="https://instagram.com/putrasenpaiii" target="_blank">
              <FaInstagram className="text-3xl text-gray-400 hover:text-purple-400 transition duration-300" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
