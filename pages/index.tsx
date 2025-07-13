// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useTrendingAnime } from '@/hooks'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  const { data: trending, isLoading } = useTrendingAnime()

  return (
    <>
      <Head>
        <title>Aichiow — Anime & Manga Platform</title>
        <meta
          name="description"
          content="A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#0d1a2d] via-[#0a0f1c] to-black text-white font-montserrat">
        {/* HERO Section */}
        <div className="flex flex-col items-center justify-center text-center px-4 pt-24">
          {/* Logo dengan border */}
          <div className="border-2 border-white/20 shadow-xl bg-white/5 backdrop-blur-md p-6 rounded-2xl">
            <Image
              src="/logo.png"
              alt="Aichiow Logo"
              width={120}
              height={120}
              className="rounded-lg"
            />
          </div>

          {/* Title & Deskripsi */}
          <h1 className="text-4xl md:text-5xl font-bold mt-6">
            Welcome to <span className="text-blue-400">Aichiow</span>
          </h1>
          <p className="mt-4 max-w-xl text-gray-300 text-sm md:text-base">
            A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.
          </p>

          {/* Tombol Let's Go */}
          <Link href="/home">
            <a className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition duration-300 shadow-lg">
              Let's Go →
            </a>
          </Link>
        </div>

        {/* News Section (dari trending) */}
        <section className="mt-16 px-6 md:px-16">
          <h2 className="text-2xl font-semibold text-white mb-6">📰 Anime News</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading ? (
              <p>Loading anime news...</p>
            ) : (
              trending?.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <a className="group bg-white/5 hover:bg-white/10 p-2 rounded-lg shadow transition-all">
                    <Image
                      src={anime.coverImage.large}
                      alt={anime.title.romaji}
                      width={300}
                      height={400}
                      className="rounded-md object-cover"
                    />
                    <p className="mt-2 text-sm text-white group-hover:text-blue-400 transition line-clamp-2">
                      {anime.title.english || anime.title.romaji}
                    </p>
                  </a>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  )
}
