import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchNewsAnime } from '@/lib/anilist'
import { Anime } from '@/types/anime'

export default function LandingPage() {
  const [news, setNews] = useState<Anime[]>([])

  useEffect(() => {
    async function loadNews() {
      const latestNews = await fetchNewsAnime()
      setNews(latestNews)
    }
    loadNews()
  }, [])

  return (
    <>
      <Head>
        <title>Welcome to Aichiow</title>
        <meta
          name="description"
          content="A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader."
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white flex flex-col items-center justify-center px-4 py-16 space-y-10">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Aichiow Logo"
            width={100}
            height={100}
            className="rounded-full border border-white shadow-lg mb-4"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Aichiow</h1>
          <p className="text-lg md:text-xl max-w-2xl text-gray-300">
            A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.
          </p>
        </div>

        <Link
          href="/home"
          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold transition"
        >
          Let&apos;s Go
        </Link>

        <section className="w-full max-w-4xl mt-10">
          <h2 className="text-2xl font-bold mb-4 text-center">📰 Latest Anime News</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {news.map((anime) => (
              <div
                key={anime.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transition transform duration-300"
              >
                <Image
                  src={anime.coverImage?.large || '/placeholder.jpg'}
                  alt={anime.title?.romaji || 'Anime'}
                  width={200}
                  height={300}
                  className="w-full h-auto object-cover"
                />
                <div className="p-2 text-sm text-center">{anime.title?.romaji}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
