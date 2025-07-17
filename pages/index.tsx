'use client'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
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
        <meta name="description" content="Aichiow is your Isekai portal to the world of anime and manga." />
        <meta property="og:image" content="https://aichiow.vercel.app/logo.png" />
        <meta property="og:url" content="https://aichiow.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="relative min-h-screen bg-gradient-to-br from-black via-[#030712] to-[#0f172a] overflow-hidden">
        {/* Logo & Deskripsi */}
        <div className="flex flex-col items-center justify-center text-center px-4 mt-24 space-y-6 relative z-10">
          <div className="relative p-[6px] rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-border-spin">
            <div className="bg-black rounded-full p-1">
              <Image
                src="/logo.png"
                alt="Aichiow Logo"
                width={160}
                height={160}
                className="rounded-full border-4 border-black"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-wide bg-gradient-to-r from-white via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Welcome to Aichiow
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            Enter the portal to your anime and manga universe – trending shows, trailers, and manga reader await.
          </p>
          <Link
            href="/home"
            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:brightness-110 rounded-xl text-white font-semibold shadow-lg transition-all duration-300"
          >
            ENTER ISEKAI →
          </Link>
        </div>

        {/* Anime News */}
        <section className="w-full max-w-6xl mx-auto mt-20 px-4 relative z-10">
          <h2 className="text-2xl font-semibold mb-4">Latest Anime News</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {news.map((anime) => (
              <Link
                href={`/anime/${anime.id}`}
                key={anime.id}
                className="group overflow-hidden rounded-xl border border-white/10 hover:border-blue-500 transition-all"
              >
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
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full text-center mt-16 mb-8 text-sm text-white/70 relative z-10">
          © AICHIOW TEAM
        </footer>
      </main>
    </>
  )
}
