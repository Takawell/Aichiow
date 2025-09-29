'use client'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFilm, FaBookOpen, FaBook, FaBolt, FaStar, FaUsers, FaPlayCircle } from 'react-icons/fa'
import { GiScroll } from 'react-icons/gi'

export default function LandingPage() {
  const [lang, setLang] = useState<'ID' | 'EN'>('ID')
  const [heroTextIndex, setHeroTextIndex] = useState(0)

  const heroTexts = {
    ID: [
      'Gerbang ke dunia anime, manga, manhwa, dan light novel — temukan cerita yang kamu cinta, kapan pun dan di mana pun.',
      'Aichiow: Tempat rekomendasi, pembaca, dan komunitas berkumpul. Trending, rilis terbaru, dan pengalaman baca nyata ada di sini.',
      'Selami dunia penuh imajinasi — dari serial legendaris hingga chapter terbaru yang nggak boleh ketinggalan.'
    ],
    EN: [
      'Your gateway to anime, manga, manhwa, and light novels — discover the stories you love, anytime, anywhere.',
      'Aichiow: where recommendations, reading, and community meet. Trending lists, new releases, and an immersive reading experience.',
      'Dive into endless imagination — from classics to the freshest chapters you can’t miss.'
    ]
  }

  useEffect(() => {
    setHeroTextIndex(Math.floor(Math.random() * heroTexts.ID.length))
  }, [])

  const BackgroundDots = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.08, 0], y: [0, -20, 0], x: [0, 10, -10] }}
          transition={{ repeat: Infinity, duration: 8 + i, delay: i * 0.4 }}
          className="absolute bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 rounded-full blur-3xl opacity-10"
          style={{ width: 200 + i * 12, height: 200 + i * 12, left: `${i * 8}%`, top: `${10 + i * 7}%` }}
        />
      ))}
    </div>
  )

  const features = [
    {
      id: 'anime',
      title: 'Anime',
      desc: 'Trailer, schedule, dan rekomendasi trending untuk semua penggemar anime.',
      icon: <FaFilm className="w-8 h-8" />
    },
    {
      id: 'manga',
      title: 'Manga',
      desc: 'Reader terintegrasi, chapter terbaru, dan koleksi komprehensif.',
      icon: <FaBookOpen className="w-8 h-8" />
    },
    {
      id: 'manhwa',
      title: 'Manhwa',
      desc: 'Konten Korea populer dengan pembagian chapter yang rapi dan rekomendasi.',
      icon: <GiScroll className="w-8 h-8" />
    },
    {
      id: 'ln',
      title: 'Light Novel',
      desc: 'Sinopsis, terjemahan, dan rekomendasi—mulai dari isekai sampai slice of life.',
      icon: <FaBook className="w-8 h-8" />
    }
  ]

  return (
    <>
      <Head>
        <title>AICHIOW – Portal Anime, Manga, Manhwa & LN</title>
        <meta name="description" content="Aichiow — your gateway to anime, manga, manhwa, and light novels." />
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        <BackgroundDots />

        <div className="relative z-20 max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Aichiow" width={48} height={48} className="rounded-lg" />
              <div className="leading-tight">
                <div className="font-extrabold text-xl tracking-tight">AICHIOW</div>
                <div className="text-xs text-gray-400 -mt-1">Anime • Manga • Manhwa • LN</div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-4 text-sm text-gray-300">
                <Link href="/explore" className="hover:text-white">Explore</Link>
                <Link href="/trending" className="hover:text-white">Trending</Link>
                <Link href="/profile" className="hover:text-white">Profile</Link>
              </nav>

              <div className="relative flex w-44 h-10 bg-gray-900/60 rounded-full overflow-hidden border border-white/10">
                <div className={`absolute top-1 left-1 w-1/2 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 transition-transform duration-300 ${lang === 'EN' ? 'translate-x-[calc(100%-0.5rem)]' : ''}`} />
                <button onClick={() => setLang('ID')} className="w-1/2 z-10 text-sm font-medium">ID</button>
                <button onClick={() => setLang('EN')} className="w-1/2 z-10 text-sm font-medium">EN</button>
              </div>
            </div>
          </div>

          <section className="text-center py-12">
            <motion.h1
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-300"
            >
              Portal untuk Anime, Manga, Manhwa & Light Novel
            </motion.h1>

            <AnimatePresence mode="wait">
              <motion.p
                key={lang + heroTextIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="mt-6 max-w-2xl mx-auto text-gray-300 px-4 text-lg leading-relaxed"
              >
                {heroTexts[lang][heroTextIndex]}
              </motion.p>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/explore" className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-blue-500 shadow-lg hover:scale-105 transform transition">
                <FaPlayCircle className="w-5 h-5" />
                <span className="font-semibold">Jelajahi Sekarang</span>
              </Link>

              <Link href="/about" className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 text-sm hover:bg-white/5 transition">
                <FaUsers className="w-4 h-4" />
                <span>Kenali Aichiow</span>
              </Link>
            </div>

            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mx-auto mt-6 w-[260px] h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded"
            />
          </section>

          <section className="mt-14">
            <h3 className="text-2xl font-bold text-center mb-6">Apa yang Aichiow Tawarkan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, idx) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className="group relative rounded-2xl p-6 bg-gradient-to-b from-white/3 to-transparent border border-white/6 backdrop-blur-sm hover:shadow-lg hover:shadow-pink-500/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500 to-blue-500 text-black shadow-md">
                      {f.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{f.title}</div>
                      <div className="text-sm text-gray-300 mt-1">{f.desc}</div>
                    </div>
                  </div>

                  <motion.div
                    className="absolute -right-6 -top-6 opacity-0 group-hover:opacity-100"
                    initial={{ rotate: -12 }}
                    whileHover={{ rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                    aria-hidden
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-blue-400 blur-xl opacity-30" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="md:col-span-2 rounded-2xl p-6 bg-gradient-to-b from-white/3 to-transparent border border-white/6">
              <h4 className="text-xl font-bold mb-3">Kenapa pilih Aichiow?</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-pink-400"><FaBolt /></span>
                  <div>
                    <div className="font-semibold">Update real-time & Trending</div>
                    <div className="text-sm text-gray-300">Pantau anime dan manga yang lagi naik daun, lengkap dengan jadwal rilis dan trailer.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 text-yellow-400"><FaStar /></span>
                  <div>
                    <div className="font-semibold">Rekomendasi personal</div>
                    <div className="text-sm text-gray-300">Sistem rekomendasi berdasarkan genre, rating, dan histori favoritmu.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 text-cyan-400"><FaUsers /></span>
                  <div>
                    <div className="font-semibold">Community & Profile</div>
                    <div className="text-sm text-gray-300">Buat profil, simpan favorites, dan share koleksimu ke teman.</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-6 bg-gradient-to-b from-white/3 to-transparent border border-white/6 flex flex-col justify-center">
              <h5 className="text-lg font-bold">Start Now</h5>
              <p className="text-sm text-gray-300 mt-2">Join, explore, and discover your favorite stories. It's free, responsive, and fast.</p>

              <div className="mt-4 flex gap-3">
                <Link href="/auth/register" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-blue-500 font-semibold">
                  Create an account
                </Link>
                <Link href="/explore" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/10">
                  Explore
                </Link>
              </div>
            </div>
          </section>

          <footer className="mt-16 text-sm text-gray-400">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>© {new Date().getFullYear()} Aichiow Plus. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="hover:text-white">Terms</Link>
                <Link href="/privacy" className="hover:text-white">Privacy</Link>
              </div>
            </div>
          </footer>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
      </main>
    </>
  )
}
