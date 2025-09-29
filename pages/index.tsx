'use client'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFilm, FaBookOpen, FaBook, FaBolt, FaStar, FaUsers, FaPlayCircle } from 'react-icons/fa'
import { GiAncientScroll } from 'react-icons/gi'

export default function LandingPage() {
  const [heroTextIndex, setHeroTextIndex] = useState(0)

  const heroTexts = [
    'Your gateway to anime, manga, manhwa, and light novels — discover the stories you love, anytime, anywhere.',
    'Aichiow: where recommendations, reading, and community meet. Trending lists, new releases, and an immersive reading experience.',
    'Dive into endless imagination — from classics to the freshest chapters you can’t miss.'
  ]

  useEffect(() => {
    setHeroTextIndex(Math.floor(Math.random() * heroTexts.length))
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
      desc: 'Trailers, schedules, and trending recommendations for every anime fan.',
      icon: <FaFilm className="w-8 h-8" />
    },
    {
      id: 'manga',
      title: 'Manga',
      desc: 'Integrated reader, latest chapters, and a comprehensive collection.',
      icon: <FaBookOpen className="w-8 h-8" />
    },
    {
      id: 'manhwa',
      title: 'Manhwa',
      desc: 'Popular Korean content with organized chapters and smart recommendations.',
      icon: <GiAncientScroll className="w-8 h-8" />
    },
    {
      id: 'ln',
      title: 'Light Novel',
      desc: 'Summaries, translations, and recommendations — from isekai to slice of life.',
      icon: <FaBook className="w-8 h-8" />
    }
  ]

  return (
    <>
      <Head>
        <title>Aichiow – Anime, Manga, Manhwa & Light Novel Hub</title>
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

            <nav className="hidden md:flex gap-4 text-sm text-gray-300">
              <Link href="/explore" className="hover:text-white">Explore</Link>
              <Link href="/trending" className="hover:text-white">Trending</Link>
              <Link href="/profile" className="hover:text-white">Profile</Link>
            </nav>
          </div>

          <section className="text-center py-12">
            <motion.h1
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-300"
            >
              The Ultimate Hub for Anime, Manga, Manhwa & Light Novels
            </motion.h1>

            <AnimatePresence mode="wait">
              <motion.p
                key={heroTextIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="mt-6 max-w-2xl mx-auto text-gray-300 px-4 text-lg leading-relaxed"
              >
                {heroTexts[heroTextIndex]}
              </motion.p>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/explore" className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-blue-500 shadow-lg hover:scale-105 transform transition">
                <FaPlayCircle className="w-5 h-5" />
                <span className="font-semibold">Explore Now</span>
              </Link>

              <Link href="/about" className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 text-sm hover:bg-white/5 transition">
                <FaUsers className="w-4 h-4" />
                <span>About Aichiow</span>
              </Link>
            </div>
          </section>

          <section className="mt-14">
            <h3 className="text-2xl font-bold text-center mb-6">What Aichiow Offers</h3>
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
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="md:col-span-2 rounded-2xl p-6 bg-gradient-to-b from-white/3 to-transparent border border-white/6">
              <h4 className="text-xl font-bold mb-3">Why choose Aichiow?</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-pink-400"><FaBolt /></span>
                  <div>
                    <div className="font-semibold">Real-time Updates & Trending</div>
                    <div className="text-sm text-gray-300">Track popular anime and manga with release schedules and trailers.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 text-yellow-400"><FaStar /></span>
                  <div>
                    <div className="font-semibold">Personalized Recommendations</div>
                    <div className="text-sm text-gray-300">Smart suggestions based on genres, ratings, and your favorites.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 text-cyan-400"><FaUsers /></span>
                  <div>
                    <div className="font-semibold">Community & Profile</div>
                    <div className="text-sm text-gray-300">Create profiles, save favorites, and share your collection with friends.</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl p-6 bg-gradient-to-b from-white/3 to-transparent border border-white/6 flex flex-col justify-center">
              <h5 className="text-lg font-bold">Get Started</h5>
              <p className="text-sm text-gray-300 mt-2">Join, explore, and discover your favorite stories. It’s free, fast, and responsive.</p>

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
              <div>© {new Date().getFullYear()} Aichiow. All rights reserved.</div>
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
