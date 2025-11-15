'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import Head from 'next/head'
import Image from 'next/image'
import { FaGithub, FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export default function MaintenancePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const targetDateRef = useRef(new Date('2025-12-12T12:00:00').getTime())
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const tiltX = useTransform(mouseY, [0, 1], ['-6deg', '6deg'])
  const tiltY = useTransform(mouseX, [0, 1], ['-8deg', '8deg'])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const DPR = Math.max(1, window.devicePixelRatio || 1)
    let width = 0
    let height = 0
    let raf = 0

    const particles: {
      x: number
      y: number
      r: number
      vx: number
      vy: number
      hue: number
      pulse: number
    }[] = []

    function resize() {
      if (!canvas) return
      width = canvas.clientWidth || window.innerWidth
      height = canvas.clientHeight || window.innerHeight
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function spawn(count = Math.max(70, Math.round((window.innerWidth / 1400) * 160))) {
      particles.length = 0
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 1 + Math.random() * 2.4,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          hue: 200 + Math.random() * 120,
          pulse: Math.random() * Math.PI * 2,
        })
      }
    }

    function drawConnections() {
      ctx!.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            const alpha = (1 - d / 110) * 0.12
            ctx!.strokeStyle = `hsla(${(a.hue + b.hue) / 2},85%,65%,${alpha})`
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }
    }

    function render() {
      ctx!.clearRect(0, 0, width, height)
      ctx!.globalCompositeOperation = 'lighter'
      for (let p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.02
        const rr = p.r + Math.sin(p.pulse) * 0.6
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr * 6)
        grad.addColorStop(0, `hsla(${p.hue},90%,70%,0.9)`)
        grad.addColorStop(0.4, `hsla(${p.hue + 20},85%,55%,0.35)`)
        grad.addColorStop(1, `hsla(${p.hue + 60},85%,45%,0)`)
        ctx!.fillStyle = grad
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, rr * 6, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalCompositeOperation = 'source-over'
      drawConnections()
      raf = requestAnimationFrame(render)
    }

    resize()
    spawn()
    render()

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / (rect.width || 1)
      const y = (e.clientY - rect.top) / (rect.height || 1)
      mouseX.set(Math.min(1, Math.max(0, x)))
      mouseY.set(Math.min(1, Math.max(0, y)))
    }

    const onResize = () => {
      resize()
      spawn()
    }

    window.addEventListener('pointermove', onPointer)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
    }
  }, [mouseX, mouseY])

  useEffect(() => {
    const t = targetDateRef.current
    const timer = setInterval(() => {
      const now = Date.now()
      const d = Math.max(0, t - now)
      setTimeLeft({
        days: Math.floor(d / (1000 * 60 * 60 * 24)),
        hours: Math.floor((d / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((d / (1000 * 60)) % 60),
        seconds: Math.floor((d / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100
        const step = 0.5 + Math.random() * 2
        return Math.min(100, +(p + step).toFixed(2))
      })
    }, 500)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <Head>
        <title>Maintenance Mode</title>
        <meta
          name="description"
          content="Aichiow is temporarily under maintenance to bring you a faster, smoother, and more powerful experience for anime, manga, manhwa, and light novel discovery."
        />
        <meta name="theme-color" content="#0ea5e9" />
        <meta property="og:title" content="Aichiow Maintenance" />
        <meta
          property="og:description"
          content="We’re performing essential updates to improve Aichiow’s performance and reliability. Please check back soon!"
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Aichiow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AICHIOW Maintenance" />
        <meta
          name="twitter:description"
          content="Aichiow is upgrading its systems for a better experience. We’ll be back online shortly!"
        />
        <meta name="twitter:image" content="/logo.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 bg-[radial-gradient(circle_at_20%_30%,#0ea5e9_0%,transparent_40%),radial-gradient(circle_at_80%_70%,#7c3aed_0%,transparent_40%)] text-white relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl p-6 md:p-10 rounded-3xl backdrop-blur-2xl border border-white/10 bg-black/30 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Aichiow Logo"
              width={70}
              height={70}
              className="rounded-2xl object-contain"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400">
                AICHIOW
              </h1>
              <p className="text-sm md:text-base text-gray-300">
                We’re improving systems for a smoother experience.
              </p>
            </div>
          </div>
          <div className="sm:flex flex-col items-end hidden">
            <span className="text-xs text-gray-400">Mode</span>
            <span className="mt-1 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-700/40 to-sky-700/30 border border-white/10 text-sm">
              maintenance
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-sm text-gray-300">Estimated Time to Restore</div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              {['days', 'hours', 'minutes', 'seconds'].map((unit, i) => (
                <div key={i} className="flex flex-col items-center w-16 sm:w-20">
                  <div className="font-mono text-3xl sm:text-4xl font-semibold">
                    {String((timeLeft as any)[unit]).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-400">{unit}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-rose-400 transition-all duration-700"
                />
              </div>
              <div className="mt-2 text-xs text-gray-400 text-right">{Math.round(progress)}%</div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              {[
                ['Scope', 'We are currently doing integration and optimization.'],
                ['Impact', 'All services temporarily offline'],
                ['ETA', timeLeft.days > 0 ? `${timeLeft.days} days` : `${timeLeft.hours} hrs`],
              ].map(([title, desc], i) => (
                <div key={i} className="rounded-lg p-3 bg-white/5 border border-white/10 text-gray-300">
                  <div className="font-semibold">{title}</div>
                  <div className="mt-1 text-xs">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl p-6 bg-white/5 border border-white/10 flex flex-col items-center gap-4 text-center">
            <div className="text-sm text-gray-300">Live Updates</div>
            <div className="flex gap-3 flex-wrap justify-center">
              <a href="https://discord.com/takashins." target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-black/40 border border-white/10 hover:scale-110 transition-transform"><FaDiscord className="text-xl" /></a>
              <a href="https://github.com/Takawell/Aichiow" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-black/40 border border-white/10 hover:scale-110 transition-transform"><FaGithub className="text-xl" /></a>
              <a href="https://youtube.com/@Takadevelopment" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-black/40 border border-white/10 hover:scale-110 transition-transform"><FaYoutube className="text-xl" /></a>
              <a href="https://tiktok.com/@putrawangyyy" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-black/40 border border-white/10 hover:scale-110 transition-transform"><FaTiktok className="text-xl" /></a>
              <a href="https://x.com/Takashinn" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-black/40 border border-white/10 hover:scale-110 transition-transform"><FaXTwitter className="text-xl" /></a> 
              <a href="https://instagram.com/putrasenpaiii" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-black/40 border border-white/10 hover:scale-110 transition-transform"><FaInstagram className="text-xl" /></a>
            </div>

            <div className="w-full rounded-md p-3 bg-black/40 border border-white/10 text-sm text-gray-300">
              <div className="font-semibold">Support</div>
              <div className="mt-2 text-xs">Got questions? Hit us up on Discord or any of our socials above.</div>
            </div>

            <div className="w-full text-xs text-gray-500 mt-2">© {new Date().getFullYear()} Aichiow Plus. All Rights Reserved.</div>
          </aside>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <span>This page remains until maintenance completes</span>
          <span>Last checked: {new Date().toLocaleString()}</span>
        </div>
      </motion.main>
    </div>
   </>
  )
}
