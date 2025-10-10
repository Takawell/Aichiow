'use client'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion'
import { FaUsers, FaStar, FaGlobe, FaBolt } from 'react-icons/fa'

export default function AboutPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [focused, setFocused] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inView = useInView(containerRef, { once: false, margin: '-120px' })
  const controls = useAnimation()
  const [orbitSpeed, setOrbitSpeed] = useState(20)
  const [showConnectors, setShowConnectors] = useState(true)

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1 })
    } else {
      controls.start({ opacity: 0 })
    }
  }, [inView, controls])

  const logos = useMemo(
    () => [
      { id: 0, src: '/default.png', name: 'anime' },
      { id: 1, src: '/default.png', name: 'manga' },
      { id: 2, src: '/default.png', name: 'manhwa' },
      { id: 3, src: '/default.png', name: 'novel' }
    ],
    []
  )

  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocused(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const faq = {
    EN: [
      {
        q: 'What is Aichiow?',
        a: 'Aichiow is your hub for anime, manga, manhwa, and light novels. We combine discovery, recommendations, and community into one platform.'
      },
      {
        q: 'Is Aichiow free?',
        a: 'Yes! Aichiow is free to explore. Premium features may come in the future to enhance your experience.'
      },
      {
        q: 'Where does the content come from?',
        a: 'We integrate trusted APIs like Anilist and MangaDex, providing real-time updates and content.'
      }
    ],
    ID: [
      {
        q: 'Apa itu Aichiow?',
        a: 'Aichiow adalah pusat untuk anime, manga, manhwa, dan light novel. Kami menggabungkan penemuan, rekomendasi, dan komunitas dalam satu platform.'
      },
      {
        q: 'Apakah Aichiow gratis?',
        a: 'Ya! Aichiow gratis untuk dijelajahi. Fitur premium mungkin hadir di masa depan untuk pengalaman lebih baik.'
      },
      {
        q: 'Dari mana kontennya berasal?',
        a: 'Kami mengintegrasikan API terpercaya seperti Anilist dan MangaDex, menghadirkan update dan konten real-time.'
      }
    ]
  }

  const connectorPath = (cx: number, cy: number, tx: number, ty: number) => {
    const dx = tx - cx
    const dy = ty - cy
    const q1x = cx + dx * 0.28
    const q1y = cy + dy * 0.05
    const q2x = cx + dx * 0.72
    const q2y = cy + dy * 0.95
    return `M ${cx} ${cy} C ${q1x} ${q1y} ${q2x} ${q2y} ${tx} ${ty}`
  }

  const positionsForSize = (w: number) => {
    if (w < 480) {
      return {
        center: { x: 50, y: 50 },
        topLeft: { x: 28, y: 22 },
        topRight: { x: 72, y: 22 },
        bottomLeft: { x: 35, y: 78 },
        bottomRight: { x: 65, y: 78 }
      }
    }
    if (w < 900) {
      return {
        center: { x: 50, y: 50 },
        topLeft: { x: 30, y: 20 },
        topRight: { x: 70, y: 20 },
        bottomLeft: { x: 36, y: 82 },
        bottomRight: { x: 64, y: 82 }
      }
    }
    return {
      center: { x: 50, y: 50 },
      topLeft: { x: 28, y: 18 },
      topRight: { x: 72, y: 18 },
      bottomLeft: { x: 36, y: 82 },
      bottomRight: { x: 64, y: 82 }
    }
  }

  return (
    <>
      <Head>
        <title>About Aichiow</title>
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#07020a] via-[#080317] to-black -z-10" />

        <div className="relative z-20 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/home" className="font-bold text-lg">Aichiow</Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setOrbitSpeed((s) => Math.max(6, s - 2))}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs"
                aria-label="slower"
              >
                -
              </motion.button>
              <div className="text-xs text-gray-300 px-3 py-1 rounded-md bg-white/3 border border-white/10">
                {orbitSpeed}s
              </div>
              <motion.button
                onClick={() => setOrbitSpeed((s) => Math.min(60, s + 2))}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs"
                aria-label="faster"
              >
                +
              </motion.button>
            </div>

            <motion.button
              onClick={() => setShowConnectors((v) => !v)}
              whileTap={{ scale: 0.95 }}
              className="relative w-20 h-9 flex items-center bg-gray-800 rounded-full px-1 cursor-pointer overflow-hidden border border-gray-700"
              aria-pressed={showConnectors}
            >
              <motion.div
                layout
                className="absolute top-1 left-1 w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"
                animate={{ x: showConnectors ? 0 : 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              <span className="flex-1 text-center text-xs">ON</span>
              <span className="flex-1 text-center text-xs">OFF</span>
            </motion.button>

            <motion.button
              onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
              whileTap={{ scale: 0.9 }}
              className="relative w-20 h-9 flex items-center bg-gray-800 rounded-full px-1 cursor-pointer overflow-hidden border border-gray-700"
            >
              <motion.div
                layout
                className="absolute top-1 left-1 w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"
                animate={{ x: lang === 'EN' ? 0 : 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              <span className="flex-1 text-center text-xs">EN</span>
              <span className="flex-1 text-center text-xs">ID</span>
            </motion.button>
          </div>
        </div>

        <section className="relative z-10 text-center py-12 sm:py-16">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
          >
            {lang === 'EN' ? 'About Aichiow' : 'Tentang Aichiow'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 text-gray-300 max-w-2xl mx-auto"
          >
            {lang === 'EN'
              ? 'Discover, explore, and connect with the world of anime, manga, manhwa, and light novels.'
              : 'Temukan, jelajahi, dan terhubung dengan dunia anime, manga, manhwa, dan light novel.'}
          </motion.p>
        </section>

        <section ref={containerRef} className="relative z-10 py-12 sm:py-20 flex items-center justify-center">
          <div className="relative w-[320px] h-[320px] sm:w-[580px] sm:h-[420px] md:w-[720px] md:h-[520px] lg:w-[820px] lg:h-[560px]">
            <svg viewBox="0 0 1000 700" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="gradA" x1="0" x2="1">
                  <stop offset="0" stopColor="#ff7ab6" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="12" result="b" />
                  <feBlend in="SourceGraphic" in2="b" mode="normal" />
                </filter>
              </defs>

              <motion.g
                initial={{ opacity: 0 }}
                animate={controls}
                transform="translate(0,0)"
              >
                <motion.circle
                  cx="500"
                  cy="350"
                  r="180"
                  fill="none"
                  stroke="url(#gradA)"
                  strokeWidth="0.8"
                  strokeOpacity="0.08"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                />

                {showConnectors &&
                  logos.map((l, i) => {
                    const posMap = [
                      { x: 280, y: 120 },
                      { x: 720, y: 120 },
                      { x: 280, y: 580 },
                      { x: 720, y: 580 }
                    ]
                    const { x: tx, y: ty } = posMap[i]
                    return (
                      <motion.path
                        key={i}
                        d={connectorPath(500, 350, tx, ty)}
                        fill="none"
                        stroke="rgba(124,58,237,0.22)"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeDasharray="8 10"
                        animate={{ strokeDashoffset: [0, -120] }}
                        transition={{ duration: 6 + i * 0.9, repeat: Infinity, ease: 'linear' }}
                      />
                    )
                  })}
              </motion.g>
            </svg>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-white/6 to-transparent border border-white/10 flex items-center justify-center backdrop-blur-md"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center"
                >
                  <Image src="/aichiow.png" alt="Aichiow" width={144} height={144} className="object-contain" />
                </motion.div>
              </motion.div>
            </div>

            {logos.map((l, i) => {
              const posMap = [
                { xPct: 28, yPct: 18 },
                { xPct: 72, yPct: 18 },
                { xPct: 28, yPct: 82 },
                { xPct: 72, yPct: 82 }
              ]
              const container = { width: 1000, height: 700 }
              const px = (posMap[i].xPct / 100) * container.width
              const py = (posMap[i].yPct / 100) * container.height
              const delay = (i / logos.length) * 0.6
              return (
                <motion.div
                  key={l.id}
                  role="button"
                  tabIndex={0}
                  onFocus={() => setFocused(l.id)}
                  onBlur={() => setFocused(null)}
                  onMouseEnter={() => setFocused(l.id)}
                  onMouseLeave={() => setFocused(null)}
                  onClick={() => setFocused(focused === l.id ? null : l.id)}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.7, delay }}
                  className="absolute z-50"
                  style={{
                    left: `calc(${posMap[i].xPct}% - 40px)`,
                    top: `calc(${posMap[i].yPct}% - 40px)`
                  }}
                >
                  <motion.div
                    animate={{
                      y: focused === l.id ? -10 : 0,
                      scale: focused === l.id ? 1.18 : 1,
                      boxShadow:
                        focused === l.id ? '0 18px 40px rgba(124,58,237,0.35)' : '0 10px 24px rgba(0,0,0,0.4)'
                    }}
                    transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-white/6 to-transparent border border-white/10"
                  >
                    <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] md:w-[84px] md:h-[84px] rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
                      <Image src={l.src} alt={l.name} width={72} height={72} className="object-contain" />
                    </motion.div>

                    <AnimatePresence>
                      {focused === l.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: -60 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.22 }}
                          className="absolute left-1/2 -translate-x-1/2 top-0 flex items-center gap-2 pointer-events-none"
                          aria-hidden
                        >
                          <svg width="110" height="44" viewBox="0 0 110 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-lg">
                            <path d="M8 36C8 26 28 12 55 12C82 12 102 26 102 36" stroke="url(#gradA)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="w-28 px-3 py-1 rounded-lg bg-gradient-to-br from-white/6 to-transparent border border-white/10 text-xs text-center text-gray-200"
                          >
                            {l.name.toUpperCase()}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )
            })}

            <motion.div
              initial={{ opacity: 0.06 }}
              animate={{ opacity: [0.06, 0.6, 0.06] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
              style={{ width: 520, height: 520 }}
            />
          </div>
        </section>

        <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <FaStar className="w-8 h-8" />,
              title: lang === 'EN' ? 'Curated Content' : 'Konten Kurasi',
              desc:
                lang === 'EN'
                  ? 'Handpicked recommendations, trending charts, and seasonal picks.'
                  : 'Rekomendasi pilihan, daftar tren, dan rilisan musiman.'
            },
            {
              icon: <FaUsers className="w-8 h-8" />,
              title: lang === 'EN' ? 'Community Driven' : 'Didorong Komunitas',
              desc:
                lang === 'EN'
                  ? 'Engage with fans, share lists, and connect with like-minded people.'
                  : 'Terlibat dengan penggemar, bagikan daftar, dan terhubung dengan orang-orang sefrekuensi.'
            },
            {
              icon: <FaBolt className="w-8 h-8" />,
              title: lang === 'EN' ? 'Fast Updates' : 'Update Cepat',
              desc:
                lang === 'EN'
                  ? 'Real-time updates powered by trusted APIs like Anilist & MangaDex.'
                  : 'Update real-time dari API terpercaya seperti Anilist & MangaDex.'
            },
            {
              icon: <FaGlobe className="w-8 h-8" />,
              title: lang === 'EN' ? 'Global Access' : 'Akses Global',
              desc:
                lang === 'EN'
                  ? 'Access your favorite content anytime, anywhere in the world.'
                  : 'Akses konten favoritmu kapan saja, di mana saja.'
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="p-6 bg-gradient-to-b from-white/5 to-transparent rounded-xl border border-white/10 hover:shadow-lg hover:shadow-pink-500/20"
            >
              <div className="mb-3 text-pink-400">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="relative z-10 max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            {lang === 'EN' ? 'Frequently Asked Questions' : 'Pertanyaan Umum'}
          </h2>
          <div className="space-y-4">
            {faq[lang].map((f, i) => (
              <div key={i} className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left font-medium hover:bg-white/10 transition"
                >
                  <span>{f.q}</span>
                  <span>{openFAQ === i ? '-' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openFAQ === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 text-gray-300 text-sm"
                    >
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <footer className="relative z-10 text-center text-sm text-gray-400 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />
          © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
        </footer>
      </main>
    </>
  )
}
