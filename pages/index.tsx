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
  FaChevronDown,
  FaBars,
  FaTimes
} from 'react-icons/fa'

export default function LandingPage() {
  const [heroTextIndex, setHeroTextIndex] = useState(0)
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const heroTexts = {
    EN: [
      'Your gateway to anime, manga, manhwa, and light novels — discover the stories you love, anytime, anywhere.',
      'Where recommendations, reading, and community meet. Trending lists, new releases, and an immersive reading experience.',
      'Dive into endless imagination from classics to the freshest chapters you cant miss.'
    ],
    ID: [
      'Gerbangmu ke anime, manga, manhwa, dan light novel — temukan cerita yang kamu sukai, kapan saja, di mana saja.',
      'Tempat rekomendasi, membaca, dan komunitas berkumpul. Daftar tren, rilisan baru, dan pengalaman membaca yang imersif.',
      'Menyelam dalam imajinasi tanpa batas dari klasik hingga chapter terbaru yang wajib kamu baca.'
    ]
  }

  useEffect(() => {
    setHeroTextIndex(Math.floor(Math.random() * heroTexts[lang].length))
  }, [lang])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const BackgroundDots = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.03),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.08, 0],
            scale: [1, 1.2, 1],
            y: [0, -40, 0]
          }}
          transition={{ repeat: Infinity, duration: 12 + i * 2, delay: i * 1.5 }}
          className="absolute rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(14,165,233,0.15), transparent)`,
            width: 180 + i * 20,
            height: 180 + i * 20,
            left: `${5 + i * 12}%`,
            top: `${8 + i * 8}%`
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
      desc: lang === 'EN' ? 'Trailers, schedules, and trending recommendations for every anime fan.' : 'Trailer, jadwal, dan rekomendasi tren untuk setiap penggemar anime.',
      icon: <FaTv className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'manga',
      title: 'Manga',
      href: '/manga',
      desc: lang === 'EN' ? 'Integrated reader, latest chapters, and a comprehensive collection.' : 'Reader terintegrasi, chapter terbaru, dan koleksi lengkap.',
      icon: <FaBook className="w-6 h-6" />,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'manhwa',
      title: 'Manhwa',
      href: '/manhwa',
      desc: lang === 'EN' ? 'Popular Korean content with organized chapters and smart recommendations.' : 'Konten Korea populer dengan chapter rapi dan rekomendasi pintar.',
      icon: <FaBookOpen className="w-6 h-6" />,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'ln',
      title: 'Light Novel',
      href: '/light-novel',
      desc: lang === 'EN' ? 'Summaries, translations, and recommendations from isekai to slice of life.' : 'Ringkasan, terjemahan, dan rekomendasi dari isekai hingga slice of life.',
      icon: <FaFeatherAlt className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-teal-500'
    }
  ]

  const faqs = [
    {
      q: lang === 'EN' ? 'Is Aichiow free to use?' : 'Apakah Aichiow gratis digunakan?',
      a: lang === 'EN' ? 'Yes, Aichiow is completely free. Some advanced features may require login.' : 'Ya, Aichiow sepenuhnya gratis. Beberapa fitur lanjutan mungkin memerlukan login.'
    },
    {
      q: lang === 'EN' ? 'Do I need an account?' : 'Apakah saya perlu akun?',
      a: lang === 'EN' ? 'You can explore most content without an account, but login unlocks favorites, history, and community features.' : 'Kamu bisa menjelajah sebagian besar konten tanpa akun, tapi login membuka fitur favorit, riwayat, dan komunitas.'
    },
    {
      q: lang === 'EN' ? 'What sources are used?' : 'Sumber apa yang digunakan?',
      a: lang === 'EN' ? 'We integrate AniList for anime data and MangaDex for manga. More sources will be added soon.' : 'Kami mengintegrasikan AniList untuk data anime dan MangaDex untuk manga. Sumber lain segera ditambahkan.'
    }
  ]

  const navLinks = [
    { href: '/home', label: 'ANIME' },
    { href: '/manga', label: 'MANGA' },
    { href: '/manhwa', label: 'MANHWA' },
    { href: '/light-novel', label: 'NOVELS' },
    { href: '/fanart', label: 'FANART' },
    { href: '/explore', label: 'EXPLORE' },
    { href: '/profile', label: 'PROFILE' }
  ]

  return (
    <>
      <Head>
        <title>Aichiow — Anime, Manga, Manhwa & Light Novel Hub</title>
        <meta name="description" content="Aichiow your gateway to anime, manga, manhwa, and light novels." />
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
        <BackgroundDots />

        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrollY > 50 ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <Link href="/home" className="flex items-center gap-2.5 group">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11">
                  <Image src="/logo.png" alt="Aichiow" fill className="rounded-xl object-cover ring-2 ring-white/5 group-hover:ring-sky-500/50 transition-all" />
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">AICHIOW</div>
                  <div className="text-[10px] text-gray-500 -mt-0.5 tracking-wide">ALL IN ONE HUB</div>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-sky-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-16 h-8 flex items-center bg-white/5 rounded-full border border-white/10 hover:border-sky-500/50 transition-colors"
                >
                  <motion.div
                    layout
                    className="absolute top-0.5 w-7 h-7 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 shadow-lg shadow-sky-500/30"
                    animate={{ x: lang === 'EN' ? 2 : 32 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                  <span className="flex-1 text-center text-[10px] font-semibold z-10">EN</span>
                  <span className="flex-1 text-center text-[10px] font-semibold z-10">ID</span>
                </motion.button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/95 backdrop-blur-xl"
            >
              <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl font-bold text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 pt-24 sm:pt-32 pb-12 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="text-center py-8 sm:py-16 lg:py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="space-y-6"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                  <span className="block bg-gradient-to-r from-white via-sky-200 to-white bg-clip-text text-transparent">
                    {lang === 'EN' ? 'The Ultimate Hub' : 'Pusat Utama'}
                  </span>
                  <span className="block mt-2 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 bg-clip-text text-transparent">
                    {lang === 'EN' ? 'Anime · Manga · Manhwa' : 'Anime · Manga · Manhwa'}
                  </span>
                </h1>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={heroTextIndex + lang}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed font-light"
                  >
                    {heroTexts[lang][heroTextIndex]}
                  </motion.p>
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
                  <Link href="/explore" className="group w-full sm:w-auto">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all"
                    >
                      <FaPlayCircle className="w-4 h-4" />
                      <span className="font-semibold text-sm">{lang === 'EN' ? 'Explore Now' : 'Jelajahi Sekarang'}</span>
                    </motion.div>
                  </Link>

                  <Link href="/community" className="w-full sm:w-auto">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
                    >
                      <FaUsers className="w-4 h-4" />
                      <span className="font-medium text-sm">{lang === 'EN' ? 'Community' : 'Komunitas'}</span>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </section>

            <section className="py-12 sm:py-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12"
              >
                {lang === 'EN' ? 'What Aichiow Offers' : 'Apa yang Aichiow Tawarkan'}
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {features.map((f, idx) => (
                  <Link key={f.id} href={f.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="group relative rounded-3xl p-5 sm:p-6 min-h-[200px] flex flex-col bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 backdrop-blur-sm hover:shadow-2xl hover:shadow-sky-500/10 transition-all cursor-pointer overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${f.gradient} mb-4 shadow-lg`}>
                          {f.icon}
                        </div>
                        
                        <h3 className="text-lg sm:text-xl font-bold mb-2">{f.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">{f.desc}</p>
                        
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 group-hover:text-sky-300 transition-colors">
                          <span>{lang === 'EN' ? 'Learn more' : 'Selengkapnya'}</span>
                          <motion.span
                            initial={{ x: 0 }}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            →
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="py-12 sm:py-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12"
              >
                {lang === 'EN' ? 'Meet Aichixia – Your AI Assistant' : 'Kenalan dengan Aichixia – Asisten AI Kamu'}
              </motion.h2>

              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-sm bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm shadow-lg">
                        {lang === 'EN' ? 'Hi Aichixia, recommend me a new anime this season!' : 'Hai Aichixia, rekomendasiin anime baru musim ini dong!'}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-sm bg-white/10 text-gray-200 text-sm shadow-lg">
                        {lang === 'EN' ? 'Sure! How about Sousou no Frieren? It's trending this season with amazing reviews.' : 'Tentu! Gimana kalau Sousou no Frieren? Lagi trending musim ini dengan ulasan keren.'}
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
                    <Link href="/aichixia">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg shadow-sky-500/30 font-semibold text-sm"
                      >
                        {lang === 'EN' ? 'Chat with Aichixia' : 'Ngobrol dengan Aichixia'}
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            <section className="py-12 sm:py-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12"
              >
                {lang === 'EN' ? 'Frequently Asked Questions' : 'Pertanyaan yang Sering Diajukan'}
              </motion.h2>

              <div className="max-w-3xl mx-auto space-y-3">
                {faqs.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <button
                      onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="font-medium text-sm sm:text-base pr-4">{f.q}</span>
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
                        >
                          <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3">
                            {f.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>

            <footer className="py-8 sm:py-12 mt-12 border-t border-white/5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500">
                <div>© {new Date().getFullYear()} Aichiow Plus. All rights reserved.</div>
                <div className="flex items-center gap-6">
                  <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                </div>
              </div>
            </footer>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-0" />
      </main>
    </>
  )
}
