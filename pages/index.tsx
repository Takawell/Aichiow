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
      </Head>

      <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0a0a1a] to-[#02010a] text-white overflow-hidden">
        {/* Nebula Glow Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] animate-pulse pointer-events-none"></div>

        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-12 md:pt-28 md:pb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 z-10 max-w-2xl"
          >
            <Image
              src="/logo.png"
              alt="Aichiow Logo"
              width={180}
              height={180}
              className="mx-auto w-32 sm:w-40 md:w-44 hover:scale-110 transition-transform duration-300"
            />

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide 
              bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent 
              drop-shadow-[0_0_25px_rgba(255,0,255,0.6)] animate-text-shine">
              Welcome to Aichiow
            </h1>

            {/* Language Toggle */}
            <div className="relative flex w-44 h-10 bg-gray-800 rounded-full overflow-hidden border border-white/10 mx-auto">
              <div
                className={`absolute top-1 left-1 w-1/2 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 transition-transform duration-300 ease-in-out ${
                  lang === 'EN' ? 'translate-x-[calc(100%-0.5rem)]' : ''
                }`}
              />
              <button
                onClick={() => setLang('ID')}
                className="w-1/2 z-10 text-sm font-semibold text-white"
              >
                ID
              </button>
              <button
                onClick={() => setLang('EN')}
                className="w-1/2 z-10 text-sm font-semibold text-white"
              >
                EN
              </button>
            </div>

            {/* Hero Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={lang + heroTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed px-3"
              >
                {heroTexts[lang][heroTextIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Media Widgets */}
        <section className="relative z-10 max-w-6xl mx-auto px-4">
          <MediaWidgets />
        </section>

        {/* Anime Trending Section */}
        <section className="relative w-full max-w-7xl mx-auto mt-12 px-4 z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
            Latest Anime Trending
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
            {news.map((anime, index) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="overflow-hidden rounded-xl border border-white/10 
                  bg-white/5 backdrop-blur-md shadow-md hover:shadow-blue-500/30 
                  hover:border-blue-400 transition-all"
              >
                <Link href={`/anime/${anime.id}`} className="block">
                  <Image
                    src={anime.coverImage?.large || ''}
                    alt={anime.title?.english || anime.title?.romaji}
                    width={300}
                    height={400}
                    className="w-full aspect-[2/3] object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="bg-black/60 text-xs p-2 text-center truncate">
                    {anime.title?.english || anime.title?.romaji}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative mt-14">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-4"></div>
          <p className="text-center text-sm text-gray-400 py-4">
            © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  )
}
