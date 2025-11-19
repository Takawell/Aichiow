'use client'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaBookOpen,
  FaBook,
  FaUsers,
  FaPlayCircle,
  FaTv,
  FaFeatherAlt,
  FaChevronDown
} from 'react-icons/fa'

export default function LandingPage() {
  const [heroTextIndex, setHeroTextIndex] = useState(0)
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const heroTexts = {
    EN: [
      'Your gateway to anime, manga, manhwa, and light novels — discover the stories you love, anytime, anywhere.',
      'Aichiow: where recommendations, reading, and community meet. Trending lists, new releases, and an immersive reading experience.',
      'Dive into endless imagination from classics to the freshest chapters you cannot miss.'
    ],
    ID: [
      'Gerbangmu ke anime, manga, manhwa, dan light novel — temukan cerita yang kamu sukai, kapan saja, di mana saja.',
      'Aichiow: tempat rekomendasi, membaca, dan komunitas berkumpul. Daftar tren, rilisan baru, dan pengalaman membaca yang imersif.',
      'Menyelam dalam imajinasi tanpa batas dari klasik hingga chapter terbaru yang wajib kamu baca.'
    ]
  }

  useEffect(() => {
    setHeroTextIndex(Math.floor(Math.random() * heroTexts[lang].length))
  }, [lang])

  const BackgroundDots = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.15, 0],
            y: [0, -40, 0],
            x: [0, 20, -20],
            scale: [0.5, 1, 0.5]
          }}
          transition={{ repeat: Infinity, duration: 10 + i, delay: i * 0.4 }}
          className="absolute rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#0ea5e9' : '#0284c7'}, transparent)`,
            width: 180 + i * 15,
            height: 180 + i * 15,
            left: `${(i * 7) % 100}%`,
            top: `${(i * 9) % 100}%`
          }}
        />
      ))}
    </div>
  )

  const features = [
    {
      id: 'anime',
      title: 'Anime',
      href: '/home',
      desc:
        lang === 'EN'
          ? 'Trailers, schedules, and trending recommendations for every anime fan.'
          : 'Trailer, jadwal, dan rekomendasi tren untuk setiap penggemar anime.',
      icon: <FaTv className="w-7 h-7 sm:w-8 sm:h-8" />
    },
    {
      id: 'manga',
      title: 'Manga',
      href: '/manga',
      desc:
        lang === 'EN'
          ? 'Integrated reader, latest chapters, and a comprehensive collection.'
          : 'Reader terintegrasi, chapter terbaru, dan koleksi lengkap.',
      icon: <FaBook className="w-7 h-7 sm:w-8 sm:h-8" />
    },
    {
      id: 'manhwa',
      title: 'Manhwa',
      href: '/manhwa',
      desc:
        lang === 'EN'
          ? 'Popular Korean content with organized chapters and smart recommendations.'
          : 'Konten Korea populer dengan chapter rapi dan rekomendasi pintar.',
      icon: <FaBookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
    },
    {
      id: 'ln',
      title: 'Light Novel',
      href: '/light-novel',
      desc:
        lang === 'EN'
          ? 'Summaries, translations, and recommendations from isekai to slice of life.'
          : 'Ringkasan, terjemahan, dan rekomendasi dari isekai hingga slice of life.',
      icon: <FaFeatherAlt className="w-7 h-7 sm:w-8 sm:h-8" />
    }
  ]

  const faqs = [
    {
      q: lang === 'EN' ? 'Is Aichiow free to use?' : 'Apakah Aichiow gratis digunakan?',
      a: lang === 'EN'
        ? 'Yes, Aichiow is completely free. Some advanced features may require login.'
        : 'Ya, Aichiow sepenuhnya gratis. Beberapa fitur lanjutan mungkin memerlukan login.'
    },
    {
      q: lang === 'EN' ? 'Do I need an account?' : 'Apakah saya perlu akun?',
      a: lang === 'EN'
        ? 'You can explore most content without an account, but login unlocks favorites, history, and community features.'
        : 'Kamu bisa menjelajah sebagian besar konten tanpa akun, tapi login membuka fitur favorit, riwayat, dan komunitas.'
    },
    {
      q: lang === 'EN' ? 'What sources are used?' : 'Sumber apa yang digunakan?',
      a: lang === 'EN'
        ? 'We integrate AniList for anime data and MangaDex for manga. More sources will be added soon.'
        : 'Kami mengintegrasikan AniList untuk data anime dan MangaDex untuk manga. Sumber lain segera ditambahkan.'
    }
  ]

  return (
    <>
      <Head>
        <title>Aichiow Anime, Manga, Manhwa & Light Novel Hub</title>
        <meta
          name="description"
          content="Aichiow your gateway to anime, manga, manhwa, and light novels."
        />
      </Head>

      <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        <BackgroundDots />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-20 w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between gap-4 mb-8 sm:mb-12"
          >
            <Link href="/home" className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500 blur-lg opacity-50 rounded-lg" />
                <Image
                  src="/logo.png"
                  alt="Aichiow"
                  width={44}
                  height={44}
                  className="relative rounded-lg sm:w-12 sm:h-12"
                />
              </div>
              <div className="leading-tight">
                <div className="font-black text-xl sm:text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-sky-600">
                  AICHIOW
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 -mt-0.5">
                  All you need, right here.
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <nav className="hidden lg:flex gap-5 text-sm font-medium">
                {['ANIME', 'MANGA', 'MANHWA', 'LIGHT NOVEL', 'EXPLORE', 'PROFILE'].map((item) => (
                  <Link
                    key={item}
                    href={item === 'ANIME' ? '/home' : item === 'LIGHT NOVEL' ? '/light-novel' : `/${item.toLowerCase()}`}
                    className="relative text-gray-300 hover:text-white transition group"
                  >
                    <span>{item}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-sky-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </nav>

              <motion.button
                onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
                whileTap={{ scale: 0.95 }}
                className="relative w-16 h-8 sm:w-20 sm:h-9 flex items-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-full px-1 cursor-pointer border border-gray-700 shadow-lg"
              >
                <motion.div
                  layout
                  className="absolute top-1 left-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 shadow-lg shadow-sky-500/50"
                  animate={{ x: lang === 'EN' ? 0 : 40 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
                <span className="flex-1 text-center text-[10px] sm:text-xs font-semibold z-10">EN</span>
                <span className="flex-1 text-center text-[10px] sm:text-xs font-semibold z-10">ID</span>
              </motion.button>
            </div>
          </motion.div>

          <section className="text-center py-8 sm:py-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <motion.h1
                className="leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter"
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {lang === 'EN'
                  ? 'The Ultimate Hub for Anime, Manga, Manhwa & Light Novels'
                  : 'Pusat Utama untuk Anime, Manga, Manhwa & Light Novel'}
              </motion.h1>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.p
                key={heroTextIndex + lang}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="mt-5 sm:mt-7 max-w-3xl mx-auto text-gray-300 px-4 text-sm sm:text-base lg:text-lg leading-relaxed"
              >
                {heroTexts[lang][heroTextIndex]}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-7 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
            >
              <Link
                href="/explore"
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 shadow-lg shadow-sky-500/40 hover:shadow-xl hover:shadow-sky-500/50 hover:scale-105 transform transition-all duration-300 w-full sm:w-auto justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FaPlayCircle className="w-5 h-5 relative z-10" />
                <span className="font-bold relative z-10">
                  {lang === 'EN' ? 'Explore Now' : 'Jelajahi Sekarang'}
                </span>
              </Link>

              <Link
                href="/community"
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full border-2 border-gray-700 hover:border-sky-500 text-sm hover:bg-sky-500/10 transition-all duration-300 w-full sm:w-auto justify-center backdrop-blur-sm"
              >
                <FaUsers className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">{lang === 'EN' ? 'Community' : 'Komunitas'}</span>
              </Link>
            </motion.div>
          </section>

          <section className="mt-12 sm:mt-20 lg:mt-24">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-center mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            >
              {lang === 'EN' ? 'What Aichiow Offers' : 'Apa yang Aichiow Tawarkan'}
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((f, idx) => (
                <Link key={f.id} href={f.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="group relative rounded-3xl p-5 sm:p-6 min-h-[200px] sm:min-h-[220px] flex flex-col bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-md hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/20 transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-sky-600/0 group-hover:from-sky-500/10 group-hover:to-sky-600/5 transition-all duration-500" />
                    
                    <div className="relative flex items-start gap-4 mb-4">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 text-black shadow-lg shadow-sky-500/50"
                      >
                        {f.icon}
                      </motion.div>
                      <div>
                        <div className="font-bold text-lg sm:text-xl">{f.title}</div>
                      </div>
                    </div>

                    <div className="relative text-xs sm:text-sm text-gray-300 line-clamp-3 flex-1 leading-relaxed">{f.desc}</div>

                    <div className="relative mt-4 text-xs sm:text-sm font-semibold text-sky-400 group-hover:text-sky-300 transition flex items-center gap-1">
                      <span>{lang === 'EN' ? 'Learn more' : 'Selengkapnya'}</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16 sm:mt-24">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-center mb-8 sm:mb-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            >
              {lang === 'EN'
                ? 'Meet Aichixia – Your AI Assistant'
                : 'Kenalan dengan Aichixia – Asisten AI Kamu'}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-lg shadow-2xl"
            >
              <div className="space-y-5 text-sm sm:text-base">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg max-w-[85%]">
                    {lang === 'EN'
                      ? 'Hi Aichixia, recommend me a new anime this season!'
                      : 'Hai Aichixia, rekomendasiin anime baru musim ini dong!'}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start gap-3 justify-end"
                >
                  <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/10 backdrop-blur-md text-gray-200 shadow-lg max-w-[85%]">
                    {lang === 'EN'
                      ? 'Sure! How about Sousou no Frieren? It is trending this season with amazing reviews.'
                      : 'Tentu! Gimana kalau Sousou no Frieren? Lagi trending musim ini dengan ulasan keren.'}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex justify-center"
              >
                <Link
                  href="/aichixia"
                  className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg shadow-sky-500/40 hover:shadow-xl hover:shadow-sky-500/60 hover:scale-105 transform transition-all duration-300 font-bold overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{lang === 'EN' ? 'Chat with Aichixia' : 'Ngobrol dengan Aichixia'}</span>
                </Link>
              </motion.div>
            </motion.div>
          </section>

          <section className="mt-16 sm:mt-24">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-center mb-8 sm:mb-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            >
              {lang === 'EN'
                ? 'Frequently Asked Questions'
                : 'Pertanyaan yang Sering Diajukan'}
            </motion.h3>
            <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
              {faqs.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-white/20 overflow-hidden backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left group"
                  >
                    <span className="font-semibold text-sm sm:text-base group-hover:text-sky-400 transition-colors pr-4">{f.q}</span>
                    <motion.span
                      animate={{ rotate: openFAQ === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sky-400 flex-shrink-0"
                    >
                      <FaChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFAQ === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 sm:px-6 pb-4 sm:pb-5 text-gray-300 text-xs sm:text-sm leading-relaxed border-t border-white/10"
                      >
                        <div className="pt-4">{f.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>

          <footer className="mt-16 sm:mt-24 text-xs sm:text-sm text-gray-400">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6 sm:mb-8" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">© {new Date().getFullYear()} Aichiow Plus. All rights reserved.</div>
              <div className="flex items-center gap-4 sm:gap-6">
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </footer>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      </main>
    </>
  )
}
