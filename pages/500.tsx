'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaDiscord,
  FaYoutube,
  FaTiktok,
  FaInstagram,
  FaSpinner,
  FaBug,
  FaCopy,
  FaChevronDown,
  FaChevronUp,
  FaHome,
} from 'react-icons/fa'

type ReportForm = {
  name: string
  email: string
  message: string
}

export default function Error500Page(): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reportState, setReportState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [report, setReport] = useState<ReportForm>({ name: '', email: '', message: '' })
  const [errorId] = useState(() => 'ERR-' + Math.random().toString(36).slice(2, 9).toUpperCase())
  const [glowToggle, setGlowToggle] = useState(true)
  const detailsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'r') handleRetry()
      if (e.key.toLowerCase() === 'd') setDetailsOpen((s) => !s)
      if (e.key.toLowerCase() === 'c') setReportOpen(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(t)
  }, [copied])

  async function handleRetry() {
    if (loading) return
    setLoading(true)
    setGlowToggle(false)
    try {
      await new Promise((res) => setTimeout(res, 1400 + Math.random() * 1400))
      if (Math.random() > 0.3) {
        window.location.href = '/'
      } else {
        setGlowToggle(true)
        setLoading(false)
      }
    } catch {
      setGlowToggle(true)
      setLoading(false)
    }
  }

  function handleCopyDetails() {
    const details = generateTechnicalDetails()
    navigator.clipboard.writeText(details).then(() => setCopied(true)).catch(() => setCopied(false))
  }

  function generateTechnicalDetails() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    const ts = new Date().toISOString()
    return `ErrorId: ${errorId}
Timestamp: ${ts}
Path: ${typeof window !== 'undefined' ? window.location.pathname : '/500'}
UserAgent: ${ua}
Message: Internal Server Error
Server: core-01
Trace: at internal.service.ts:182
--end--`
  }

  async function submitReport(e?: React.FormEvent) {
    e?.preventDefault()
    setReportState('sending')
    try {
      await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1200))
      if (Math.random() < 0.85) {
        setReportState('sent')
        setReport({ name: '', email: '', message: '' })
        setTimeout(() => setReportOpen(false), 900)
      } else {
        throw new Error('Failed')
      }
    } catch {
      setReportState('error')
      setTimeout(() => setReportState('idle'), 2000)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex items-center justify-center px-6 py-12 overflow-hidden">
      <InteractiveBackground active={glowToggle} />
      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'circOut' }}
        className="relative z-20 max-w-3xl w-full mx-auto"
        aria-labelledby="err500-title"
      >
        <div className="rounded-3xl p-6 md:p-10 bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-md border border-neutral-800 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-full md:w-48">
              <motion.div
                initial={{ rotate: -6, opacity: 0 }}
                animate={{ rotate: [-6, 6, -3, 0], opacity: 1 }}
                transition={{ duration: 1.6, times: [0, 0.4, 0.8, 1], repeat: Infinity, repeatDelay: 3 }}
                className="relative rounded-2xl p-6 md:p-8 text-center"
              >
                <h1
                  id="err500-title"
                  className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-indigo-500 drop-shadow-[0_12px_40px_rgba(99,102,241,0.06)]"
                >
                  500
                </h1>
                <GlitchTag />
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.h2
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12 }}
                className="text-2xl md:text-3xl font-semibold"
              >
                Oops internal server overload.
              </motion.h2>
              <motion.p
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.18 }}
                className="mt-2 text-sm md:text-base text-gray-300 leading-relaxed"
              >
                Something went wrong. Please retry, go home, or send us a report.
              </motion.p>
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  onClick={handleRetry}
                  className={`inline-flex items-center justify-center gap-3 px-4 py-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                    loading
                      ? 'bg-gradient-to-r from-pink-500 to-indigo-500 shadow-[0_8px_30px_rgba(99,102,241,0.12)] animate-pulse'
                      : 'bg-gradient-to-r from-pink-600 to-indigo-600 hover:brightness-110'
                  }`}
                  aria-pressed={loading}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaBug />}
                  <span className="font-medium">{loading ? 'Retrying...' : 'Retry'}</span>
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/60 hover:bg-neutral-800/80 transition text-sm"
                >
                  <FaHome />
                  <span>Back to Safety</span>
                </Link>
                <button
                  onClick={() => setReportOpen(true)}
                  className="ml-auto sm:ml-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-700 text-sm hover:border-pink-500 transition"
                >
                  <FaBug />
                  <span>Report</span>
                </button>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
                <div className="text-xs text-gray-400">
                  Press <kbd className="px-2 py-1 rounded bg-neutral-800 text-white">R</kbd> to retry, <kbd className="px-2 py-1 rounded bg-neutral-800 text-white">D</kbd> for details, <kbd className="px-2 py-1 rounded bg-neutral-800 text-white">C</kbd> to report.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setDetailsOpen((s) => !s)
                      setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
                    }}
                    className="inline-flex items-center gap-2 text-sm text-gray-300 rounded px-3 py-1 hover:bg-neutral-800/40"
                    aria-expanded={detailsOpen}
                    aria-controls="tech-details"
                  >
                    <span>{detailsOpen ? 'Hide' : 'Show'} details</span>
                    {detailsOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  <button
                    onClick={handleCopyDetails}
                    className="inline-flex items-center gap-2 text-sm text-gray-300 rounded px-3 py-1 hover:bg-neutral-800/40"
                  >
                    <FaCopy />
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <AnimatePresence initial={false}>
                {detailsOpen && (
                  <motion.div
                    id="tech-details"
                    ref={detailsRef}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden mt-4 rounded-lg bg-neutral-900/40 border border-neutral-800 p-3 text-xs text-gray-300"
                  >
                    <pre className="whitespace-pre-wrap break-all select-text leading-tight">
                      {generateTechnicalDetails()}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-6 border-t border-neutral-800/60 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>Stay connected:</span>
              <SocialLinks />
            </div>
            <div className="text-xs text-gray-500 text-right">
              <span>Aichiow Plus. All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </motion.main>
      <AnimatePresence>
        {reportOpen && (
          <ReportModal
            onClose={() => {
              setReportOpen(false)
              setReportState('idle')
            }}
            state={reportState}
            report={report}
            setReport={setReport}
            onSubmit={submitReport}
            errorId={errorId}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function InteractiveBackground({ active = true }: { active?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#050017] via-[#081226] to-[#030006] mix-blend-normal" />
        <motion.div
          initial={{ opacity: 0.12 }}
          animate={{ opacity: 0.22 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_30%)]"
        />
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -left-20 w-[900px] h-[900px] bg-gradient-to-r from-[#ff7ab6]/20 to-[#8b5cf6]/12 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ rotate: 45 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-tr from-[#06b6d4]/10 to-[#7c3aed]/08 rounded-full blur-2xl"
        />
      </motion.div>

      <Particles count={26} active={active} />
      <GradientWave />
    </div>
  )
}

function Particles({ count = 20, active = true }: { count?: number; active?: boolean }) {
  const arr = Array.from({ length: count })
  return (
    <div className="absolute inset-0 -z-20">
      {arr.map((_, i) => {
        const size = 6 + (i % 6)
        const left = `${Math.floor((i * 73) % 100)}%`
        const top = `${Math.floor((i * 47 + 13) % 100)}%`
        const delay = (i % 7) * 0.6
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0, scale: 1 }}
            animate={{
              opacity: active ? [0.02, 0.18, 0.02] : 0.06,
              y: active ? [0, -18 - (i % 8), 0] : 0,
              scale: active ? [1, 1.12, 1] : 1,
            }}
            transition={{
              delay,
              duration: 8 + (i % 5),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: size,
              height: size,
              left,
              top,
              position: 'absolute',
              borderRadius: 9999,
            }}
            className="bg-white/6"
          />
        )
      })}
    </div>
  )
}

function GradientWave() {
  return (
    <>
      <div className="absolute inset-x-0 -bottom-36 h-72 opacity-40 blur-3xl" aria-hidden>
        <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#ff7ab6" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <path fill="url(#g1)" d="M0,128L48,138.7C96,149,192,171,288,160C384,149,480,107,576,117.3C672,128,768,192,864,202.7C960,213,1056,171,1152,160C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </>
  )
}

function SocialLinks() {
  const socials = [
    { href: 'https://discord.gg/aichinime', icon: FaDiscord },
    { href: 'https://youtube.com/@Takadevelopment', icon: FaYoutube },
    { href: 'https://tiktok.com/@putrawangyyy', icon: FaTiktok },
    { href: 'https://instagram.com/putrasenpaiii', icon: FaInstagram },
  ]
  return (
    <div className="flex items-center gap-3">
      {socials.map((s, i) => {
        const Icon = s.icon
        return (
          <a key={i} href={s.href} target="_blank" rel="noreferrer" className="group inline-flex p-2 rounded hover:bg-neutral-800/40 transition">
            <Icon className="text-lg text-gray-300 group-hover:text-white transition" />
          </a>
        )
      })}
    </div>
  )
}

function GlitchTag() {
  return (
    <div className="mt-1 flex items-center justify-center">
      <div className="relative inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-black/40 border border-neutral-800">
        <span className="relative z-10">Internal error</span>
        <span className="absolute -left-0 top-0 w-full h-full z-0 mix-blend-screen opacity-20 animate-[glitch1_1.6s_infinite] bg-gradient-to-r from-pink-400 to-indigo-400" />
      </div>
      <style jsx>{`
        @keyframes glitch1 {
          0% { transform: translateX(0) skewX(0deg); opacity: 0.22; }
          10% { transform: translateX(-6px) skewX(-6deg); opacity: 0.34; }
          20% { transform: translateX(6px) skewX(6deg); opacity: 0.12; }
          30% { transform: translateX(-2px) skewX(-2deg); opacity: 0.22; }
          100% { transform: translateX(0) skewX(0deg); opacity: 0.18; }
        }
      `}</style>
    </div>
  )
}

function ReportModal({
  onClose,
  state,
  report,
  setReport,
  onSubmit,
  errorId,
}: {
  onClose: () => void
  state: 'idle' | 'sending' | 'sent' | 'error'
  report: ReportForm
  setReport: (r: ReportForm) => void
  onSubmit: (e?: React.FormEvent) => Promise<void>
  errorId: string
}) {
  const modalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div ref={modalRef} className="w-full max-w-md rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 p-6">
          <h3 className="text-lg font-semibold mb-3">Report this issue</h3>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label htmlFor="rname" className="block text-sm mb-1">Name</label>
              <input
                id="rname"
                value={report.name}
                onChange={(e) => setReport({ ...report, name: e.target.value })}
                required
                className="w-full rounded-md bg-neutral-800/50 border border-neutral-700 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="remail" className="block text-sm mb-1">Email</label>
              <input
                id="remail"
                type="email"
                value={report.email}
                onChange={(e) => setReport({ ...report, email: e.target.value })}
                required
                className="w-full rounded-md bg-neutral-800/50 border border-neutral-700 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="rmsg" className="block text-sm mb-1">Message</label>
              <textarea
                id="rmsg"
                rows={4}
                value={report.message}
                onChange={(e) => setReport({ ...report, message: e.target.value })}
                required
                className="w-full rounded-md bg-neutral-800/50 border border-neutral-700 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none resize-none"
              />
            </div>
            <div className="text-xs text-gray-400">
              Error ID: <span className="text-gray-300">{errorId}</span>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm bg-neutral-800/60 hover:bg-neutral-800/80">
                Cancel
              </button>
              <button
                type="submit"
                disabled={state === 'sending'}
                className="px-4 py-2 rounded-md text-sm bg-gradient-to-r from-pink-600 to-indigo-600 hover:brightness-110"
              >
                {state === 'sending' ? 'Sending...' : state === 'sent' ? 'Sent!' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  )
}
