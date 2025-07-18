// pages/anime/genre/[name].tsx
import Head from 'next/head'
import { useAnimeByGenre } from '@/hooks/useAnimeByGenre'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function GenreAnimePage() {
  const { anime, loading } = useAnimeByGenre()
  const router = useRouter()
  const { name } = router.query

  const genreName = typeof name === 'string'
    ? decodeURIComponent(name)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : ''

  return (
    <>
      <Head>
        <title>{genreName} Anime — Aichiow</title>
      </Head>
      <main className="min-h-screen px-4 py-10 bg-gradient-to-b from-[#0f0f0f] via-[#121212] to-[#1a1a1a] text-white">
        <h1 className="text-3xl font-extrabold mb-8 tracking-wide animate-fade-in drop-shadow-lg">
          🎬 <span className="text-blue-400">{genreName}</span> Anime
        </h1>

        {loading ? (
          <p className="text-center text-lg animate-pulse">Loading anime...</p>
        ) : anime.length === 0 ? (
          <p className="text-center text-lg">No anime found in this genre.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 animate-fade-in">
            {anime.map((item) => (
              <Link
                key={item.id}
                href={`/anime/${item.id}`}
                className="group transition-all duration-300 hover:scale-[1.03]"
              >
                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-md hover:shadow-blue-500/40 transition-all">
                  <Image
                    src={item.coverImage.large}
                    alt={item.title.english || item.title.romaji}
                    fill
                    className="object-cover group-hover:brightness-110 transition"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-center line-clamp-2 group-hover:text-blue-400 transition">
                  {item.title.english || item.title.romaji}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
