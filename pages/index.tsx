'use client'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaFilm,
  FaBookOpen,
  FaBook,
  FaBolt,
  FaStar,
  FaUsers,
  FaPlayCircle,
  FaTv,
  FaFeatherAlt
} from 'react-icons/fa'

export default function LandingPage() {
  const [heroTextIndex, setHeroTextIndex] = useState(0)
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')

  const heroTexts = {
    EN: [
      'Your gateway to anime, manga, manhwa, and light novels — discover the stories you love, anytime, anywhere.',
      'Aichiow: where recommendations, reading, and community meet. Trending lists, new releases, and an immersive reading experience.',
      'Dive into endless imagination — from classics to the freshest chapters you can’t miss.'
    ],
    ID: [
      'Gerbangmu ke anime, manga, manhwa, dan light novel — temukan cerita yang kamu sukai, kapan saja, di mana saja.',
      'Aichiow: tempat rekomendasi, membaca, dan komunitas berkumpul. Daftar tren, rilisan baru, dan pengalaman membaca yang imersif.',
      'Menyelam dalam imajinasi tanpa batas — dari klasik hingga chapter terbaru yang wajib kamu baca.'
    ]
  }

  useEffect(() => {
    setHeroTextIndex(Math.floor(Math.random() * heroTexts[lang].length))
  }, [lang])

  const BackgroundDots = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 0.1, 0],
            y: [0, -30, 0],
            x: [0, 15, -15]
          }}
          transition={{ repeat: Infinity, duration: 9 + i, delay: i * 0.5 }}
          className="absolute bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 rounded-full blur-3xl opacity-10"
          style={{
            width: 200 + i * 12,
            height: 200 + i * 12,
            left: `${i * 8}%`,
            top: `${10 + i * 6}%`
          }}
        />
      ))}
    </div>
  )

  const features = [
    {
      id: 'anime',
      title: 'Anime',
      desc:
        lang === 'EN'
          ? 'Trailers, schedules, and trending recommendations for every anime fan.'
          : 'Trailer, jadwal, dan rekomendasi tren untuk setiap penggemar anime.',
      icon: <FaTv className="w-8 h-8" />
    },
    {
      id: 'manga',
      title: 'Manga',
      desc:
        lang === 'EN'
          ? 'Integrated reader, latest chapters, and a comprehensive collection.'
          : 'Reader terintegrasi, chapter terbaru, dan koleksi lengkap.',
      icon: <FaBook className="w-8 h-8" />
    },
    {
      id: 'manhwa',
      title: 'Manhwa',
      desc:
        lang === 'EN'
          ? 'Popular Korean content with organized chapters and smart recommendations.'
          : 'Konten Korea populer dengan chapter rapi dan rekomendasi pintar.',
      icon: <FaBookOpen className="w-8 h-8" />
    },
    {
      id: 'ln',
      title: 'Light Novel',
      desc:
        lang === 'EN'
          ? 'Summaries, translations, and recommendations — from isekai to slice of life.'
          : 'Ringkasan, terjemahan, dan rekomendasi — dari isekai hingga slice of life.',
      icon: <FaFeatherAlt className="w-8 h-8" />
    }
  ]

  return (
    <>
      <Head>
        <title>Aichiow – Anime, Manga, Manhwa & Light Novel Hub</title>
        <meta
          name="description"
          content="Aichiow — your gateway to anime, manga, manhwa, and light novels."
        />
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        <BackgroundDots />

        <div className="relative z-20 max-w-[90rem] mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-16 lg:py-20">
          <div className="flex items-center justify-between gap-4 mb-10">
            <Link href="/home" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Aichiow"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div className="leading-tight">
                <div className="font-extrabold text-xl sm:text-2xl tracking-tight">
                  AICHIOW
                </div>
                <div className="text-xs sm:text-sm text-gray-400 -mt-1">
                  Anime • Manga • Manhwa • LN
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3 sm:gap-5">
              <nav className="hidden md:flex gap-4 text-sm text-gray-300">
                <Link href="/home" className="hover:text-white">Home</Link>
                <Link href="/manga" className="hover:text-white">Manga</Link>
                <Link href="/manhwa" className="hover:text-white">Manhwa</Link>
                <Link href="/light-novel" className="hover:text-white">Light Novel</Link>
                <Link href="/explore" className="hover:text-white">Explore</Link>
                <Link href="/aichixia" className="hover:text-white">Aichixia</Link>
                <Link href="/profile" className="hover:text-white">Profile</Link>
              </nav>

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

          <section className="text-center py-10 sm:py-14">
            <motion.h1
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-300"
            >
              {lang === 'EN'
                ? 'The Ultimate Hub for Anime, Manga, Manhwa & Light Novels'
                : 'Pusat Utama untuk Anime, Manga, Manhwa & Light Novel'}
            </motion.h1>

            <AnimatePresence mode="wait">
              <motion.p
                key={heroTextIndex + lang}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="mt-6 max-w-2xl mx-auto text-gray-300 px-2 sm:px-4 text-base sm:text-lg leading-relaxed"
              >
                {heroTexts[lang][heroTextIndex]}
              </motion.p>
            </AnimatePresence>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/explore"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-blue-500 shadow-lg hover:scale-105 transform transition w-full sm:w-auto justify-center"
              >
                <FaPlayCircle className="w-5 h-5" />
                <span className="font-semibold">
                  {lang === 'EN' ? 'Explore Now' : 'Jelajahi Sekarang'}
                </span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 text-sm hover:bg-white/5 transition w-full sm:w-auto justify-center"
              >
                <FaUsers className="w-4 h-4" />
                <span>{lang === 'EN' ? 'About Aichiow' : 'Tentang Aichiow'}</span>
              </Link>
            </div>
          </section>

          <section className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-6">
              {lang === 'EN' ? 'What Aichiow Offers' : 'Apa yang Aichiow Tawarkan'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, idx) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className="group relative rounded-2xl p-6 bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-sm hover:shadow-lg hover:shadow-pink-500/20 transition-all"
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
                </motion.div>
              ))}
            </div>
          </section>

          <footer className="mt-20 text-sm text-gray-400">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>© {new Date().getFullYear()} Aichiow. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="hover:text-white">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-white">
                  Privacy
                </Link>
              </div>
            </div>
          </footer>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
      </main>
    </>
  )
}
