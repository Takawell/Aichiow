'use client'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { fetchTrendingAnime } from '@/lib/anilist'
import { useEffect, useState } from 'react'
import { Anime } from '@/types/anime'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const [news, setNews] = useState<Anime[]>([])

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
        <meta name="keywords" content="anime, manga, streaming, read manga, anime portal, Aichiow" />
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
        {/* Background Soft Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 z-10 mt-20"
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
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              Your ultimate anime and manga portal – discover trending shows, trailers, weekly schedules, and explore a universe of stories.
            </p>
            <Link
              href="/home"
              className="inline-block mt-4 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(255,0,255,0.7)] transition-transform transform hover:scale-110"
            >
              PORTAL ISEKAI →
            </Link>
          </motion.div>
        </section>

        {/* Anime News */}
        <section className="relative w-full max-w-7xl mx-auto mt-16 px-4 z-10">
          <h2 className="text-3xl font-bold mb-6 text-center">Latest Anime News</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {news.map((anime) => (
              <motion.div
                key={anime.id}
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
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
        <footer className="relative mt-16">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-4"></div>
          <p className="text-center text-sm text-gray-400 py-4">
            © {new Date().getFullYear()} AICHIOW TEAM. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  )
}
