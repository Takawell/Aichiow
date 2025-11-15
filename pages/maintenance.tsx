'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import Head from 'next/head'
import Image from 'next/image'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

export default function MaintenancePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const targetDateRef = useRef(new Date('2025-11-11T12:00:00').getTime())
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
        <title>Aichiow Plus Maintenance Mode</title>
        <meta name="description" content="Aichiow is temporarily under maintenance to bring you a faster, smoother, and more powerful experience for anime, manga, manhwa, and light novel discovery." />
        <meta name="theme-color" content="#0ea5e9" />
        <meta property="og:title" content="Aichiow Maintenance" />
        <meta property="og:description" content="We're performing essential updates to improve Aichiow's performance and reliability. Please check back soon!" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Aichiow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AICHIOW Maintenance" />
        <meta name="twitter:description" content="Aichiow is upgrading its systems for a better experience. We'll be back online shortly!" />
        <meta name="twitter:image" content="/logo.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-60" />
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.15),transparent_50%)]" />

        <motion.main
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-6xl mx-auto"
        >
          <div className="backdrop-blur-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] rounded-3xl lg:rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(14,165,233,0.15)] p-4 sm:p-6 lg:p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 lg:mb-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl lg:rounded-3xl blur-xl opacity-60 animate-pulse" />
                  <Image src="/logo.png" alt="Aichiow Logo" width={60} height={60} className="relative rounded-2xl lg:rounded-3xl object-contain w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border border-white/20" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 tracking-tight">
                    AICHIOW
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-300/90 mt-1 max-w-xs lg:max-w-md">
                    Upgrading to next-gen infrastructure
                  </p>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border border-red-400/30 backdrop-blur-xl"
              >
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400 animate-pulse shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-200">Maintenance</span>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-300">Time Remaining</h2>
                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-300">Live</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6 lg:mb-8">
                    {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit, i) => (
                      <motion.div
                        key={unit}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/[0.1] to-white/[0.02] border border-white/10 backdrop-blur-sm"
                      >
                        <div className="font-mono text-2xl sm:text-3xl lg:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-purple-400 tabular-nums">
                          {String(timeLeft[unit]).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] sm:text-xs lg:text-sm text-gray-400 uppercase tracking-wider mt-1 sm:mt-2 font-medium">{unit}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-mono font-bold text-cyan-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative w-full h-3 sm:h-4 bg-gray-900/50 rounded-full overflow-hidden border border-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
                >
                  {[
                    { title: 'Status', value: 'System Integration', icon: '⚙️' },
                    { title: 'Impact', value: 'All Services', icon: '🔒' },
                    { title: 'ETA', value: timeLeft.days > 0 ? `${timeLeft.days}d ${timeLeft.hours}h` : `${timeLeft.hours}h ${timeLeft.minutes}m`, icon: '⏱️' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.01] border border-white/10 backdrop-blur-sm hover:border-cyan-400/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="text-xs sm:text-sm text-gray-400 font-medium">{item.title}</span>
                      </div>
                      <div className="text-sm sm:text-base lg:text-lg font-bold text-white/90">{item.value}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 sm:space-y-5"
              >
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-300 mb-4 sm:mb-5">Stay Connected</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: FaDiscord, href: 'https://github.com/Takawell/Aichiow', color: 'from-indigo-500 to-purple-600' },
                      { icon: FaYoutube, href: 'https://youtube.com/@Takadevelopment', color: 'from-red-500 to-pink-600' },
                      { icon: FaTiktok, href: 'https://tiktok.com/@putrawangyyy', color: 'from-cyan-400 to-blue-500' },
                      { icon: FaInstagram, href: 'https://instagram.com/putrasenpaiii', color: 'from-pink-500 to-rose-600' },
                    ].map((social, i) => (
                      <motion.a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center justify-center aspect-square rounded-xl sm:rounded-2xl bg-gradient-to-br ${social.color} p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20`}
                      >
                        <social.icon className="text-2xl sm:text-3xl text-white" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.01] border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-300">Support</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Need help? Connect with us on Discord or any social platform above for real-time updates.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5 backdrop-blur-xl text-center">
                  <p className="text-[10px] sm:text-xs text-gray-500">© {new Date().getFullYear()} Aichiow Plus<br/>All Rights Reserved</p>
                </div>
              </motion.aside>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500"
            >
              <span>Auto-refresh enabled • Live status updates</span>
              <span className="hidden sm:inline">Last updated: {new Date().toLocaleTimeString()}</span>
            </motion.div>
          </div>
        </motion.main>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  )
}
