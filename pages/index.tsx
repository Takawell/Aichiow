import Head from 'next/head'
import Image from 'next/image'
import { useTrendingAnime } from '@/hooks'
import { cn } from '@/utils/classnames'
import Link from 'next/link'

export default function LandingPage() {
  const { data: trending, isLoading } = useTrendingAnime()

  return (
    <>
      <Head>
        <title>Aichiow — Welcome</title>
        <meta
          name="description"
          content="A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader."
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-black text-white">
        <section className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="mb-6">
            <Image
              src="/logo.png"
              alt="Aichiow Logo"
              width={120}
              height={120}
              className="rounded-xl border border-white/30 shadow-lg"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Welcome to Aichiow
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
            A modern anime & manga platform with trending shows, trailers, weekly schedule, and manga reader.
          </p>
          <Link
            href="/home"
            className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-lg text-lg font-semibold shadow-md"
          >
            Let's Go
          </Link>
        </section>

        <section className="px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">📢 Trending News from Anime</h2>
          {isLoading ? (
            <p className="text-gray-400">Loading news...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending?.slice(0, 6).map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <div className="bg-white/5 hover:bg-white/10 p-4 rounded-lg cursor-pointer transition-all duration-200">
                    <Image
                      src={anime.coverImage.large}
                      alt={anime.title.romaji}
                      width={300}
                      height={450}
                      className="w-full h-64 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-semibold text-lg">{anime.title.english || anime.title.romaji}</h3>
                    <p className="text-sm text-gray-400">
                      {anime.genres.slice(0, 2).join(', ')} · ⭐ {anime.averageScore}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
