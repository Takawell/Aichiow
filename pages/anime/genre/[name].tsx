// pages/anime/genre/[name].tsx
import Head from 'next/head'
import { useAnimeByGenre } from '@/hooks/useAnimeByGenre'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRef } from 'react'

export default function GenreAnimePage() {
  const { anime, loading } = useAnimeByGenre()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { name } = router.query

  const genreName = typeof name === 'string'
    ? decodeURIComponent(name)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : ''

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })

  return (
    <>
      <Head>
        <title>{genreName} Anime — Aichiow</title>
      </Head>
      <main className="bg-gradient-to-b from-black via-[#0a0a0a] to-[#121212] min-h-screen px-4 py-8">
        <h1 className="text-3xl font-extrabold text-white mb-6 tracking-wide animate-fade-in">
          🎬 <span className="text-blue-400 drop-shadow-md">{genreName}</span> Anime
        </h1>

        {loading ? (
          <p className="text-white animate-pulse">Loading...</p>
        ) : anime.length === 0 ? (
          <p className="text-white">No anime found in this genre.</p>
        ) : (
          <div className="relative group">
            {/* Optional Scroll Buttons */}
            <button
              onClick={scrollLeft}
              className="hidden group-hover:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white px-2 py-1 rounded-full hover:bg-blue-600 transition"
            >
              ←
            </button>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 scroll-smooth scrollbar-hide pb-1"
            >
              {anime.map((item) => (
                <Link
                  key={item.id}
                  href={`/anime/${item.id}`}
                  className="min-w-[140px] flex-shrink-0 group/item hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-[140px] h-[200px] relative rounded-xl overflow-hidden border border-neutral-800 shadow-md group-hover/item:shadow-blue-500/30 transition-all">
                    <Image
                      src={item.coverImage.large}
                      alt={item.title.english || item.title.romaji}
                      fill
                      className="object-cover group-hover/item:brightness-110 transition-all"
                    />
                  </div>
                  <p className="text-sm text-white mt-2 line-clamp-2 text-center group-hover/item:text-blue-400 transition">
                    {item.title.english || item.title.romaji}
                  </p>
                </Link>
              ))}
            </div>
            <button
              onClick={scrollRight}
              className="hidden group-hover:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white px-2 py-1 rounded-full hover:bg-blue-600 transition"
            >
              →
            </button>
          </div>
        )}
      </main>
    </>
  )
}
