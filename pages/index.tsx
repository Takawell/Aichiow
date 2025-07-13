import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchTrendingAnime } from '@/lib/anilist'

export default function LandingPage() {
  const [trending, setTrending] = useState<any[]>([])

  useEffect(() => {
    const getTrending = async () => {
      try {
        const data = await fetchTrendingAnime()
        setTrending(data)
      } catch (err) {
        console.error('Failed to fetch trending anime:', err)
      }
    }

    getTrending()
  }, [])

  return (
    <>
      <Head>
        <title>Aichiow — Watch Anime & Manga</title>
        <meta
          name="description"
          content="A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader."
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-black via-[#0f0f1b] to-[#020202] text-white flex flex-col items-center px-4">
        {/* Logo & Title */}
        <div className="mt-20 mb-10 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Aichiow Logo" width={100} height={100} />
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4">Welcome to Aichiow</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2 max-w-xl">
            A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/home"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-full text-white font-semibold text-lg mb-12"
        >
          Let&apos;s Go
        </Link>

        {/* Trending News Section */}
        <section className="w-full max-w-5xl">
          <h2 className="text-2xl font-semibold mb-4">🔥 Trending Anime</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {trending.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.id}`}
                className="bg-[#1a1a1a] rounded-md overflow-hidden shadow hover:scale-[1.03] transition"
              >
                <Image
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="p-2 text-sm truncate text-center">
                  {anime.title.romaji}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
