'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { FaDiscord, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa'

export default function MaintenancePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const targetDate = useRef(new Date('2025-09-20T12:00:00').getTime())
  const [ready, setReady] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const tiltX = useTransform(mouseY, [0, 1], ['-4deg', '4deg'])
  const tiltY = useTransform(mouseX, [0, 1], ['-6deg', '6deg'])

  useEffect(() => {
    let raf = 0
    let width = 0
    let height = 0
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const particles: {
      x: number
      y: number
      r: number
      vx: number
      vy: number
      alpha: number
      pulse: number
      hue: number
    }[] = []
    const DPR = Math.max(1, window.devicePixelRatio || 1)

    function resize() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function spawn(count = 80) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.6 + Math.random() * 2.6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          alpha: 0.2 + Math.random() * 0.7,
          pulse: Math.random() * Math.PI * 2,
          hue: 190 + Math.random() * 160,
        })
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.02
        const rr = p.r + Math.sin(p.pulse) * 0.6
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr * 6)
        grad.addColorStop(0, `hsla(${p.hue},90%,65%,${0.9 * p.alpha})`)
        grad.addColorStop(0.35, `hsla(${p.hue + 40},85%,55%,${0.35 * p.alpha})`)
        grad.addColorStop(1, `hsla(${p.hue + 60},85%,45%,0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, rr * 6, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
      drawConnections()
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
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.12
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2},80%,60%,${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      draw()
      raf = requestAnimationFrame(animate)
    }

    resize()
    spawn(Math.round((window.innerWidth / 1200) * 100) || 100)
    animate()

    const handlePointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      mouseX.set(x)
      mouseY.set(y)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = p.x - e.clientX + rect.left
        const dy = p.y - e.clientY + rect.top
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          p.vx += (Math.random() - 0.5) * 0.8
          p.vy += (Math.random() - 0.5) * 0.8
        }
      }
    }

    window.addEventListener('pointermove', handlePointer)
    window.addEventListener('resize', resize)

    setReady(true)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('resize', resize)
    }
  }, [mouseX, mouseY])

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100
        const step = 1 + Math.random() * 4
        return Math.min(100, +(p + step).toFixed(2))
      })
      const now = Date.now()
      const d = Math.max(0, targetDate.current - now)
      setTimeLeft({
        days: Math.floor(d / (1000 * 60 * 60 * 24)),
        hours: Math.floor((d / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((d / (1000 * 60)) % 60),
        seconds: Math.floor((d / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-6">
      <div className="absolute inset-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(30,58,138,0.14),_transparent_20%),radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.12),_transparent_18%)] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ perspective: 1200 }}
        className="relative z-10 w-full max-w-5xl p-6 md:p-10 rounded-3xl"
      >
        <motion.div
          style={{ rotateX: tiltX, rotateY: tiltY }}
          className="relative rounded-2xl p-6 md:p-10 bg-gradient-to-r from-[rgba(255,255,255,0.02)] via-[rgba(255,255,255,0.01)] to-[rgba(255,255,255,0.02)] border border-neutral-800/60 backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-black font-extrabold text-2xl md:text-3xl drop-shadow-sm">
                A
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-indigo-400 to-rose-400">
                  AICHIOW
                </h1>
                <div className="mt-1 text-sm text-gray-300">Scheduled maintenance — systems offline</div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-400">Mode</div>
              <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-700/30 to-sky-700/20 border border-neutral-800 text-sm">
                FULL MAINTENANCE
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-2xl p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-neutral-800/60">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="text-sm text-gray-300">Estimated time to restore</div>
                  <div className="mt-4 flex items-end gap-4">
                    <div className="flex flex-col items-center">
                      <div className="font-mono text-3xl md:text-5xl font-semibold">{String(timeLeft.days)}</div>
                      <div className="text-xs text-gray-400">days</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="font-mono text-3xl md:text-5xl font-semibold">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs text-gray-400">hrs</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="font-mono text-3xl md:text-5xl font-semibold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs text-gray-400">min</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="font-mono text-3xl md:text-5xl font-semibold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs text-gray-400">sec</div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64">
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="mt-3 w-full h-3 bg-neutral-800 rounded-full overflow-hidden border border-neutral-800/50">
                    <div
                      style={{
                        width: `${progress}%`,
                        transition: 'width 500ms cubic-bezier(.2,.9,.2,1)',
                      }}
                      className="h-full bg-[linear-gradient(90deg,#38bdf8,#7c3aed,#fb7185)]"
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-400 text-right">{Math.round(progress)}%</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-lg p-3 bg-neutral-900/40 border border-neutral-800/60 text-sm text-gray-300">
                  <div className="font-semibold">Scope</div>
                  <div className="mt-2 text-xs">Infrastructure & data migration</div>
                </div>
                <div className="rounded-lg p-3 bg-neutral-900/40 border border-neutral-800/60 text-sm text-gray-300">
                  <div className="font-semibold">Impact</div>
                  <div className="mt-2 text-xs">All services are temporarily unavailable</div>
                </div>
                <div className="rounded-lg p-3 bg-neutral-900/40 border border-neutral-800/60 text-sm text-gray-300">
                  <div className="font-semibold">ETA</div>
                  <div className="mt-2 text-xs">{timeLeft.days > 0 ? `${timeLeft.days} days` : `${timeLeft.hours} hrs`}</div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="rounded-full w-12 h-12 bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-black font-bold text-lg">
                  ⚙
                </div>
                <div className="text-sm text-gray-300">We are performing critical updates to improve stability and performance. Follow the official channels for live updates.</div>
              </div>
            </div>

            <aside className="rounded-2xl p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.01),transparent)] border border-neutral-800/60 flex flex-col items-center gap-4 text-center">
              <div className="text-sm text-gray-300">Live updates</div>
              <div className="mt-2 flex gap-3">
                <a href="https://discord.gg/aichinime" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-neutral-800/40 hover:scale-105 transition-transform">
                  <FaDiscord className="text-xl" />
                </a>
                <a href="https://youtube.com/@Takadevelopment" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-neutral-800/40 hover:scale-105 transition-transform">
                  <FaYoutube className="text-xl" />
                </a>
                <a href="https://tiktok.com/@putrawangyyy" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-neutral-800/40 hover:scale-105 transition-transform">
                  <FaTiktok className="text-xl" />
                </a>
                <a href="https://instagram.com/putrasenpaiii" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-neutral-800/40 hover:scale-105 transition-transform">
                  <FaInstagram className="text-xl" />
                </a>
              </div>

              <div className="w-full rounded-md p-3 bg-neutral-900/30 border border-neutral-800/60 text-sm text-gray-300">
                <div className="font-semibold">Support</div>
                <div className="mt-2 text-xs">If you're a contributor needing access, use the project's preview branch on GitHub.</div>
              </div>

              <div className="w-full text-xs text-gray-500">© {new Date().getFullYear()} AICHIOW</div>
            </aside>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="text-xs text-gray-400">This page will remain until maintenance completes</div>
            <div className="text-xs text-gray-400">Last checked: {new Date().toLocaleString()}</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
