'use client'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { fetchTrendingAnime } from '@/lib/anilist'
import { useEffect, useState } from 'react'
import { Anime } from '@/types/anime'

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

      <main className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-[#02010a] text-white flex flex-col items-center justify-center px-4">
        {/* Logo + Deskripsi */}
        <div className="text-center space-y-4 mt-20">
          <Image
            src="/logo.png"
            alt="Aichiow Logo"
            width={160}
            height={160}
            className="mx-auto rounded-full border-4 border-white shadow-md"
          />
          <h1 className="text-4xl font-bold tracking-wide">Welcome to Aichiow</h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            A modern anime platform with trending shows, trailers, weekly schedule, and manga reader.
          </p>
          <Link
            href="/home"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition-all duration-300"
          >
            PORTAL ISEKAI →
          </Link>
        </div>

        {/* Anime News */}
        <section className="w-full max-w-6xl mt-20 px-4">
          <h2 className="text-2xl font-semibold mb-4">Latest Anime News</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {news.map((anime) => (
              <Link
                href={`/anime/${anime.id}`}
                key={anime.id}
                className="group overflow-hidden rounded-xl p-[2px] bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 transition-all"
              >
                <div className="rounded-xl overflow-hidden bg-black">
                  <Image
                    src={anime.coverImage?.large || ''}
                    alt={anime.title?.english || anime.title?.romaji}
                    width={300}
                    height={400}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="bg-black/60 text-xs p-2 text-center truncate">
                    {anime.title?.english || anime.title?.romaji}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full text-center py-6 text-sm text-gray-400 mt-20">
          © !Taka
        </footer>
      </main>
    </>
  )
}
