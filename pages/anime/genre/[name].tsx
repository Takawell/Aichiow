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
      <main className="bg-dark min-h-screen px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          🎬 {genreName} Anime
        </h1>

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : anime.length === 0 ? (
          <p className="text-white">No anime found in this genre.</p>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth">
            {anime.map((item) => (
              <Link
                key={item.id}
                href={`/anime/${item.id}`}
                className="min-w-[140px] flex-shrink-0 hover:opacity-80 transition"
              >
                <div className="w-[140px] h-[200px] relative rounded-lg overflow-hidden border border-neutral-700">
                  <Image
                    src={item.coverImage.large}
                    alt={item.title.english || item.title.romaji}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-white mt-2 line-clamp-2">
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
