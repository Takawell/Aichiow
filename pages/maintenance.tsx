'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

export default function MaintenancePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const targetDateRef = useRef(new Date('2025-09-20T12:00:00').getTime())
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
      if (!canvas || !ctx) return
      width = canvas.clientWidth || window.innerWidth
      height = canvas.clientHeight || window.innerHeight
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function spawn(count = Math.max(60, Math.round((window.innerWidth / 1400) * 140))) {
      particles.length = 0
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.8 + Math.random() * 2.4,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          hue: 190 + Math.random() * 160,
          pulse: Math.random() * Math.PI * 2,
        })
      }
    }

    function drawConnections() {
      ctx.lineWidth = 0.6
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            const alpha = (1 - d / 120) * 0.12
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2},85%,60%,${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }

    function render() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      for (let p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.02
        const rr = p.r + Math.sin(p.pulse) * 0.6
        if (p.x < -30) p.x = width + 30
        if (p.x > width + 30) p.x = -30
        if (p.y < -30) p.y = height + 30
        if (p.y > height + 30) p.y = -30
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr * 6)
        grad.addColorStop(0, `hsla(${p.hue},90%,65%,0.95)`)
        grad.addColorStop(0.35, `hsla(${p.hue + 40},85%,55%,0.35)`)
        grad.addColorStop(1, `hsla(${p.hue + 60},85%,45%,0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, rr * 6, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
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
      for (let p of particles) {
        const dx = p.x - (e.clientX - rect.left)
        const dy = p.y - (e.clientY - rect.top)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          p.vx += (Math.random() - 0.5) * 1.2
          p.vy += (Math.random() - 0.5) * 1.2
        }
      }
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
        const step = 0.5 + Math.random() * 2.5
        return Math.min(100, +(p + step).toFixed(2))
      })
    }, 400)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center p-6 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.06),transparent_18%),radial-gradient(ellipse_at_bottom_right,rgba(124,58,237,0.05),transparent_20%)]" />
      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-4xl p-6 md:p-10 rounded-3xl backdrop-blur-xl border border-neutral-800/60 bg-neutral-900/30 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-black font-extrabold text-2xl md:text-3xl">
              A
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-indigo-400 to-rose-400">AICHIOW</h1>
              <p className="text-sm md:text-base text-gray-300">We’re improving systems to give you a better experience.</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <div className="text-xs text-gray-400">Mode</div>
            <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-700/30 to-sky-700/20 border border-neutral-800 text-sm">FULL MAINTENANCE</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] border border-neutral-800/60">
            <div className="text-sm text-gray-300">Estimated time to restore</div>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div className="flex flex-col items-center">
                <div className="font-mono text-4xl md:text-5xl font-semibold">{String(timeLeft.days)}</div>
                <div className="text-xs text-gray-400">days</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-mono text-4xl md:text-5xl font-semibold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs text-gray-400">hrs</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-mono text-4xl md:text-5xl font-semibold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-gray-400">min</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-mono text-4xl md:text-5xl font-semibold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-gray-400">sec</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden border border-neutral-800/50">
                <div style={{ width: `${progress}%`, transition: 'width 600ms cubic-bezier(.2,.9,.2,1)' }} className="h-full bg-[linear-gradient(90deg,#38bdf8,#7c3aed,#fb7185)]" />
              </div>
              <div className="mt-2 text-xs text-gray-400 text-right">{Math.round(progress)}%</div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-lg p-3 bg-neutral-900/30 border border-neutral-800/50 text-sm text-gray-300">
                <div className="font-semibold">Scope</div>
                <div className="mt-2 text-xs">Infra improvements & migrations</div>
              </div>
              <div className="rounded-lg p-3 bg-neutral-900/30 border border-neutral-800/50 text-sm text-gray-300">
                <div className="font-semibold">Impact</div>
                <div className="mt-2 text-xs">All services temporarily offline</div>
              </div>
              <div className="rounded-lg p-3 bg-neutral-900/30 border border-neutral-800/50 text-sm text-gray-300">
                <div className="font-semibold">ETA</div>
                <div className="mt-2 text-xs">{timeLeft.days > 0 ? `${timeLeft.days} days` : `${timeLeft.hours} hrs`}</div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="rounded-full w-12 h-12 bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-black font-bold text-lg">⚙</div>
              <div className="text-sm text-gray-300">Performing critical updates to improve stability and performance. Follow official channels for live updates.</div>
            </div>
          </div>

          <aside className="rounded-2xl p-6 bg-[rgba(255,255,255,0.02)] border border-neutral-800/60 flex flex-col items-center gap-4 text-center">
            <div className="text-sm text-gray-300">Live updates</div>
            <div className="mt-2 flex gap-3">
              <a href="https://discord.gg/aichinime" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-neutral-900/30 border border-neutral-800/40 hover:scale-105 transition-transform"><FaDiscord className="text-xl" /></a>
              <a href="https://youtube.com/@Takadevelopment" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-neutral-900/30 border border-neutral-800/40 hover:scale-105 transition-transform"><FaYoutube className="text-xl" /></a>
              <a href="https://tiktok.com/@putrawangyyy" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-neutral-900/30 border border-neutral-800/40 hover:scale-105 transition-transform"><FaTiktok className="text-xl" /></a>
              <a href="https://instagram.com/putrasenpaiii" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-neutral-900/30 border border-neutral-800/40 hover:scale-105 transition-transform"><FaInstagram className="text-xl" /></a>
            </div>

            <div className="w-full rounded-md p-3 bg-neutral-900/30 border border-neutral-800/60 text-sm text-gray-300">
              <div className="font-semibold">Support</div>
              <div className="mt-2 text-xs">Contact via Discord or support email for contributors.</div>
            </div>

            <div className="w-full text-xs text-gray-500">© {new Date().getFullYear()} Aichiow Plus. All Rights Reserved.</div>
          </aside>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="text-xs text-gray-400">This page remains until maintenance completes</div>
          <div className="text-xs text-gray-400">Last checked: {new Date().toLocaleString()}</div>
        </div>
      </motion.main>
    </div>
  )
}                        
