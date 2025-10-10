'use client'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUsers, FaStar, FaGlobe, FaBolt } from 'react-icons/fa'

export default function AboutPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i)

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

  return (
    <>
      <Head>
        <title>About Aichiow</title>
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />

        {/* Navbar */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/home" className="font-bold text-lg">Aichiow</Link>
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

        {/* Hero Section */}
        <section className="relative z-10 text-center py-16 sm:py-24">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
          >
            {lang === 'EN' ? 'About Aichiow' : 'Tentang Aichiow'}
          </motion.h1>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
            {lang === 'EN'
              ? 'Discover, explore, and connect with the world of anime, manga, manhwa, and light novels.'
              : 'Temukan, jelajahi, dan terhubung dengan dunia anime, manga, manhwa, dan light novel.'}
          </p>
        </section>

        {/* 🔥 NEW: Interactive Logo Flow Section */}
        <section className="relative z-10 py-24 flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] flex items-center justify-center"
          >
            {/* Center Aichiow logo */}
            <motion.div
              className="absolute z-20 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-600/30 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <Image
                src="/logo.png"
                alt="Aichiow"
                width={100}
                height={100}
                className="object-contain"
              />
            </motion.div>

            {/* Animated circular orbit for logos */}
            {[
              { src: '/default.png', angle: 0 },
              { src: '/default.png', angle: 90 },
              { src: '/default.png', angle: 180 },
              { src: '/default.png', angle: 270 }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/10 shadow-[0_0_25px_rgba(236,72,153,0.3)]"
                style={{
                  transform: `rotate(${item.angle}deg) translateY(-200px) rotate(-${item.angle}deg)`
                }}
                whileHover={{ scale: 1.15, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <Image
                  src={item.src}
                  alt={item.src}
                  width={70}
                  height={70}
                  className="object-contain"
                />
              </motion.div>
            ))}

            {/* Pulse rings for motion effect */}
            {[1, 2, 3].map((r, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-purple-500/20"
                style={{
                  width: `${200 + i * 100}px`,
                  height: `${200 + i * 100}px`
                }}
                animate={{
                  opacity: [0.2, 0.6, 0],
                  scale: [1, 1.2, 1.4]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1.2,
                  ease: 'easeOut'
                }}
              />
            ))}
          </motion.div>
        </section>

        {/* Features Section */}
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
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 bg-gradient-to-b from-white/5 to-transparent rounded-xl border border-white/10 hover:shadow-lg hover:shadow-pink-500/20"
            >
              <div className="mb-3 text-pink-400">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* FAQ Section */}
        <section className="relative z-10 max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            {lang === 'EN' ? 'Frequently Asked Questions' : 'Pertanyaan Umum'}
          </h2>
          <div className="space-y-4">
            {faq[lang].map((f, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/5 border border-white/10 overflow-hidden"
              >
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

        {/* Footer */}
        <footer className="relative z-10 text-center text-sm text-gray-400 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />
          © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
        </footer>
      </main>
    </>
  )
}
