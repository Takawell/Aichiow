'use client'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuScanLine, LuSparkles } from 'react-icons/lu'
import { BsEmojiHeartEyesFill } from 'react-icons/bs'
import { FaBookOpen, FaBook, FaUsers, FaPlayCircle, FaTv, FaFeatherAlt, FaChevronDown, FaBars, FaTimes, FaComments, FaSearch } from 'react-icons/fa'

export default function LandingPage() {
  const [heroTextIndex, setHeroTextIndex] = useState(0)
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const heroTexts = {
    EN: [
      'Your gateway to anime, manga, manhwa, and light novels — discover the stories you love.',
      'Where recommendations, reading, and community meet. Trending lists and immersive reading.',
      'Dive into endless imagination from classics to the freshest chapters.'
    ],
    ID: [
      'Gerbangmu ke anime, manga, manhwa, dan light novel — temukan cerita favoritmu.',
      'Tempat rekomendasi, membaca, dan komunitas berkumpul. Daftar tren dan pengalaman imersif.',
      'Menyelam dalam imajinasi tanpa batas dari klasik hingga chapter terbaru.'
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.04),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
    </div>
  )

  const features = [
    {
      id: 'anime',
      title: 'Anime',
      href: '/home',
      desc: lang === 'EN' ? 'Trailers, schedules & trending.' : 'Trailer, jadwal & tren.',
      icon: <FaTv className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'text-purple-400'
    },
    {
      id: 'manga',
      title: 'Manga',
      href: '/manga',
      desc: lang === 'EN' ? 'Reader & latest chapters.' : 'Reader & chapter terbaru.',
      icon: <FaBook className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'text-cyan-400'
    },
    {
      id: 'manhwa',
      title: 'Manhwa',
      href: '/manhwa',
      desc: lang === 'EN' ? 'Korean content & recommendations.' : 'Konten Korea & rekomendasi.',
      icon: <FaBookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'text-orange-400'
    },
    {
      id: 'ln',
      title: 'Light Novel',
      href: '/light-novel',
      desc: lang === 'EN' ? 'Summaries & translations.' : 'Ringkasan & terjemahan.',
      icon: <FaFeatherAlt className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'text-emerald-400'
    }
  ]

  const aichixiaFeatures = [
    {
      icon: <LuScanLine className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: lang === 'EN' ? 'Anime Scanner' : 'Scan Anime',
      desc: lang === 'EN' ? 'Upload screenshots to identify series, episode, and timestamp instantly.' : 'Upload screenshot untuk identifikasi series, episode, dan timestamp.',
      color: 'text-cyan-400'
    },
    {
      icon: <BsEmojiHeartEyesFill className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: lang === 'EN' ? 'AI Personality' : 'Kepribadian AI',
      desc: lang === 'EN' ? 'Choose from Tsundere, Friendly, Professional, or Kawaii persona.' : 'Pilih persona Tsundere, Friendly, Professional, atau Kawaii.',
      color: 'text-pink-400'
    },
    {
      icon: <FaSearch className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: lang === 'EN' ? 'Deep Mode' : 'Mode Mendalam',
      desc: lang === 'EN' ? 'Advanced search with web capabilities for comprehensive research.' : 'Pencarian lanjutan dengan web untuk riset komprehensif.',
      color: 'text-orange-400'
    },
    {
      icon: <FaComments className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: lang === 'EN' ? 'Smart Chat' : 'Chat Pintar',
      desc: lang === 'EN' ? 'Natural conversations with context about anime and manga.' : 'Percakapan natural dengan konteks anime dan manga.',
      color: 'text-emerald-400'
    }
  ]

  const faqs = [
    {
      q: lang === 'EN' ? 'Is Aichiow free to use?' : 'Apakah Aichiow gratis?',
      a: lang === 'EN' ? 'Yes, completely free. Some features may require login.' : 'Ya, sepenuhnya gratis. Beberapa fitur mungkin perlu login.'
    },
    {
      q: lang === 'EN' ? 'Do I need an account?' : 'Apakah saya perlu akun?',
      a: lang === 'EN' ? 'You can explore without an account, but login unlocks favorites, history, and community.' : 'Bisa jelajah tanpa akun, tapi login membuka favorit, riwayat, dan komunitas.'
    },
    {
      q: lang === 'EN' ? 'What sources are used?' : 'Sumber apa yang digunakan?',
      a: lang === 'EN' ? 'We integrate AniList for anime and MangaDex for manga. More coming soon.' : 'Kami pakai AniList untuk anime dan MangaDex untuk manga. Lebih banyak segera hadir.'
    }
  ]

  const navLinks = [
    { href: '/home', label: 'ANIME' },
    { href: '/manga', label: 'MANGA' },
    { href: '/manhwa', label: 'MANHWA' },
    { href: '/light-novel', label: 'NOVELS' },
    { href: '/fanart', label: 'FANART' },
    { href: '/explore', label: 'EXPLORE' }
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
            scrollY > 30 ? 'bg-black/70 backdrop-blur-2xl border-b border-white/[0.08]' : 'bg-transparent'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Link href="/home" className="flex items-center gap-2 group">
                <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                  <Image 
                    src="/logo.png" 
                    alt="Aichiow" 
                    fill 
                    className="rounded-lg object-cover ring-1 ring-white/10 group-hover:ring-sky-500/40 transition-all duration-300" 
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-sm tracking-tight text-white">AICHIOW</div>
                  <div className="text-[9px] text-gray-500 -mt-0.5 tracking-wider">ALL IN ONE</div>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1.5 text-[11px] font-medium text-gray-400 hover:text-white transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-sky-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <motion.button
                  onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
                  className="relative h-7 px-1 flex items-center bg-white/5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-sky-600/20"
                    initial={false}
                    animate={{
                      x: lang === 'EN' ? '0%' : '100%'
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                  <div className="relative flex items-center">
                    <motion.span
                      className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full transition-all duration-300 ${
                        lang === 'EN' ? 'text-white bg-sky-500' : 'text-gray-400'
                      }`}
                      animate={{
                        scale: lang === 'EN' ? 1 : 0.9
                      }}
                    >
                      EN
                    </motion.span>
                    <motion.span
                      className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full transition-all duration-300 ${
                        lang === 'ID' ? 'text-white bg-sky-500' : 'text-gray-400'
                      }`}
                      animate={{
                        scale: lang === 'ID' ? 1 : 0.9
                      }}
                    >
                      ID
                    </motion.span>
                  </div>
                </motion.button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {mobileMenuOpen ? <FaTimes className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
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
              transition={{ type: 'spring', damping: 35, stiffness: 350 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/95 backdrop-blur-2xl"
            >
              <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xl font-bold text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 pt-20 sm:pt-24 pb-8 sm:pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <section className="text-center py-12 sm:py-20 lg:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-5"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                  <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                    {lang === 'EN' ? 'The Ultimate Hub' : 'Pusat Utama'}
                  </span>
                  <span className="block mt-1.5 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 bg-clip-text text-transparent">
                    {lang === 'EN' ? 'ACGN Collective' : 'Kolektif ACGN'}
                  </span>
                </h1>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={heroTextIndex + lang}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-xl mx-auto text-sm sm:text-base text-gray-400 leading-relaxed font-light px-4"
                  >
                    {heroTexts[lang][heroTextIndex]}
                  </motion.p>
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-3">
                  <Link href="/explore" className="group w-full sm:w-auto">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all text-sm font-medium"
                    >
                      <FaPlayCircle className="w-3.5 h-3.5" />
                      <span>{lang === 'EN' ? 'Explore Now' : 'Jelajahi Sekarang'}</span>
                    </motion.div>
                  </Link>

                  <Link href="/community" className="w-full sm:w-auto">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium"
                    >
                      <FaUsers className="w-3.5 h-3.5" />
                      <span>{lang === 'EN' ? 'Community' : 'Komunitas'}</span>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </section>

            <section className="py-8 sm:py-16">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-10"
              >
                {lang === 'EN' ? 'What Aichiow Offers' : 'Apa yang Aichiow Tawarkan'}
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {features.map((f, idx) => (
                  <Link key={f.id} href={f.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="group relative rounded-2xl p-4 sm:p-5 min-h-[140px] flex flex-col bg-white/[0.02] border border-white/[0.08] hover:border-white/15 hover:bg-white/[0.04] backdrop-blur-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className={f.color}>{f.icon}</span>
                        <h3 className="text-base sm:text-lg font-bold text-white">{f.title}</h3>
                      </div>
                      
                      <p className="text-xs text-gray-400 leading-relaxed mb-3 flex-grow">{f.desc}</p>
                      
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 group-hover:text-sky-300 transition-colors">
                        <span>{lang === 'EN' ? 'Learn more' : 'Selengkapnya'}</span>
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          →
                        </motion.span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="py-8 sm:py-16">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-6 sm:mb-10"
              >
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                  {lang === 'EN' ? 'Meet Aichixia' : 'Kenalan dengan Aichixia'}
                </h2>
                <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                  {lang === 'EN' 
                    ? 'Your intelligent AI assistant powered by advanced technology for all your anime needs' 
                    : 'Asisten AI cerdas berbasis teknologi canggih untuk semua kebutuhan anime kamu'}
                </p>
              </motion.div>

              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6">
                  {aichixiaFeatures.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -3 }}
                      className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 sm:p-5 hover:bg-white/[0.04] hover:border-white/15 transition-all backdrop-blur-sm group"
                    >
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className={feature.color}>{feature.icon}</span>
                        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-sky-300 transition-colors">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
                >
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] px-3.5 py-2.5 rounded-xl rounded-bl-sm bg-sky-500 text-white text-xs sm:text-sm shadow-md">
                        {lang === 'EN' ? 'Hi Aichixia, recommend me a new anime!' : 'Hai Aichixia, rekomendasiin anime baru dong!'}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[85%] px-3.5 py-2.5 rounded-xl rounded-br-sm bg-white/10 text-gray-200 text-xs sm:text-sm shadow-md">
                        {lang === 'EN' ? 'Sure! How about Sousou no Frieren? Its trending with great reviews.' : 'Tentu! Gimana kalau Sousou no Frieren? Lagi trending dengan ulasan keren.'}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 }}
                    className="mt-6 flex justify-center"
                  >
                    <Link href="/aichixia">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/25 font-medium text-sm transition-all flex items-center gap-2"
                      >
                        <LuSparkles className="w-4 h-4" />
                        <span>{lang === 'EN' ? 'Chat with Aichixia' : 'Ngobrol dengan Aichixia'}</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            <section className="py-8 sm:py-16">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-10"
              >
                {lang === 'EN' ? 'FAQ' : 'Pertanyaan Umum'}
              </motion.h2>

              <div className="max-w-2xl mx-auto space-y-2">
                {faqs.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-white/[0.08] overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                  >
                    <button
                      onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <span className="font-medium text-xs sm:text-sm pr-3">{f.q}</span>
                      <motion.span
                        animate={{ rotate: openFAQ === i ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-sky-400 flex-shrink-0"
                      >
                        <FaChevronDown className="w-3 h-3" />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {openFAQ === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-4 pb-3 text-gray-400 text-xs sm:text-sm leading-relaxed border-t border-white/[0.08] pt-2.5">
                            {f.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>

            <footer className="py-6 sm:py-8 mt-8 border-t border-white/[0.08]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
                <div>© {new Date().getFullYear()} Aichiow Plus. All rights reserved.</div>
                <div className="flex items-center gap-5">
                  <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                </div>
              </div>
            </footer>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-0" />
      </main>
    </>
  )
}
