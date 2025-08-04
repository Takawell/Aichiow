'use client'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MediaWidgets from '@/components/ui/MediaWidgets'
import { fetchTrendingAnime } from '@/lib/anilist'
import { Anime } from '@/types/anime'

export default function LandingPage() {
  const [lang, setLang] = useState<'ID' | 'EN'>('ID')
  const [heroTextIndex, setHeroTextIndex] = useState(0)
  const [news, setNews] = useState<Anime[]>([])

  const heroTexts = {
    ID: [
      "Gerbang menuju dunia anime, manga, manhwa, dan light novel – temukan kisah trending, rilis terbaru, dan dunia tanpa batas untuk dijelajahi.",
      "Portal terbaik untuk menjelajahi anime, manga, manhwa, dan light novel – mulai dari cerita legendaris hingga petualangan epik masa kini.",
      "Selami dunia penuh imajinasi dari anime, manga, manhwa, dan light novel – tempat semua cerita luar biasa bermula."
    ],
    EN: [
      "Your gateway to the world of anime, manga, manhwa, and light novels – discover trending stories, epic adventures, and endless worlds to explore.",
      "The ultimate portal for anime, manga, manhwa, and light novels – from timeless classics to the hottest new releases.",
      "Dive into a universe of anime, manga, manhwa, and light novels – where every story sparks imagination."
    ]
  }

  useEffect(() => {
    setHeroTextIndex(Math.floor(Math.random() * heroTexts.ID.length))
  }, [])

  useEffect(() => {
    async function load() {
      const data = await fetchTrendingAnime()
      setNews(data)
    }
    load()
  }, [])

  return (
    <>
      <Head>
        <title>AICHIOW – Anime & Manga Portal</title>
        <meta
          name="description"
          content="Aichiow is your Isekai portal to the world of anime and manga – trending anime, trailers, schedules, and manga reader, all in one."
        />
        <meta name="keywords" content="anime, manga, manhwa, light novel, portal, Aichiow" />
        <meta name="author" content="Aichiow Developer Team" />
        <meta property="og:title" content="AICHIOW – Anime & Manga Portal" />
        <meta
          property="og:description"
          content="Your ultimate portal to the world of trending anime and manga. Start your Isekai journey now!"
        />
        <meta property="og:image" content="https://aichiow.vercel.app/logo.png" />
        <meta property="og:url" content="https://aichiow.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0a0a1a] to-[#02010a] text-white overflow-hidden">
        {/* Glow Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-8 md:pt-24 md:pb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 z-10"
          >
            <Image
              src="/logo.png"
              alt="Aichiow Logo"
              width={160}
              height={160}
              className="mx-auto rounded-full border-4 border-white shadow-[0_0_25px_rgba(0,200,255,0.7)] hover:scale-110 transition-transform duration-300"
            />
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,0,255,0.5)] animate-pulse">
              Welcome to Aichiow
            </h1>

            {/* Toggle ID/EN */}
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => setLang('ID')}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  lang === 'ID' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang('EN')}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  lang === 'EN' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                EN
              </button>
            </div>

            {/* Hero Description with animation */}
            <AnimatePresence mode="wait">
              <motion.p
                key={lang + heroTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed px-2"
              >
                {heroTexts[lang][heroTextIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Media Widgets */}
        <section className="relative z-10 max-w-6xl mx-auto">
          <MediaWidgets />
        </section>

        {/* Anime Trending Section */}
        <section className="relative w-full max-w-7xl mx-auto mt-10 px-4 z-10">
          <h2 className="text-3xl font-bold mb-6 text-center">Latest Anime Trending</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {news.map((anime, index) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="overflow-hidden rounded-xl border border-white/10 hover:border-blue-400 shadow-md hover:shadow-blue-400/20 transition-all"
              >
                <Link href={`/anime/${anime.id}`} className="block">
                  <Image
                    src={anime.coverImage?.large || ''}
                    alt={anime.title?.english || anime.title?.romaji}
                    width={300}
                    height={400}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="bg-black/70 text-xs p-2 text-center truncate">
                    {anime.title?.english || anime.title?.romaji}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative mt-10">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-4"></div>
          <p className="text-center text-sm text-gray-400 py-4">
            © {new Date().getFullYear()} AICHIOW TEAM. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  )
}
