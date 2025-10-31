'use client'

import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUsers, FaStar, FaGlobe, FaBolt } from 'react-icons/fa'

export default function AboutPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (i: number) => {
    setOpenFAQ(openFAQ === i ? null : i)
  }

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
        <meta name="description" content="About Aichiow Plus." />
      </Head>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-700/30 via-black to-black" />
        <div className="relative z-20 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/home" className="font-bold text-lg text-white">Home</Link>
          <motion.button
            onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
            whileTap={{ scale: 0.9 }}
            className="relative w-20 h-9 flex items-center bg-sky-900 rounded-full px-1 cursor-pointer overflow-hidden border border-sky-700 shadow-md shadow-sky-500/20"
          >
            <motion.div
              layout
              className="absolute top-1 left-1 w-7 h-7 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 shadow-lg"
              animate={{ x: lang === 'EN' ? 0 : 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <span className="flex-1 text-center text-xs text-white">EN</span>
            <span className="flex-1 text-center text-xs text-white">ID</span>
          </motion.button>
        </div>

        <section className="relative z-10 text-center py-16 sm:py-24">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-400 to-sky-300"
          >
            {lang === 'EN' ? 'About Aichiow' : 'Tentang Aichiow'}
          </motion.h1>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
            {lang === 'EN'
              ? 'Discover, explore, and connect with the world of anime, manga, manhwa, and light novels.'
              : 'Temukan, jelajahi, dan terhubung dengan dunia anime, manga, manhwa, dan light novel.'}
          </p>
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
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 bg-gradient-to-b from-sky-800/30 to-transparent rounded-xl border border-sky-700 hover:shadow-lg hover:shadow-sky-500/30"
            >
              <div className="mb-3 text-sky-400">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2 text-white">{f.title}</h3>
              <p className="text-sm text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="relative z-10 max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            {lang === 'EN' ? 'Frequently Asked Questions' : 'Pertanyaan Umum'}
          </h2>
          <div className="space-y-4">
            {faq[lang].map((f, i) => (
              <div
                key={i}
                className="rounded-lg bg-sky-900/20 border border-sky-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-white hover:bg-sky-800/30 transition"
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
          <div className="h-px bg-gradient-to-r from-transparent via-sky-600 to-transparent mb-6" />
          © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
        </footer>
      </main>
    </>
  )
}
