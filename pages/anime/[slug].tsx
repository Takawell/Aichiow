// pages/anime/[slug].tsx
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAnimeDetail } from '@/hooks/useAnimeDetail'
import AnimeDetailHeader from '@/components/anime/AnimeDetailHeader'
import AnimeTrailer from '@/components/anime/AnimeTrailer'
import CharacterList from '@/components/character/CharacterList'
import { useEffect, useState } from 'react'

interface Episode {
  title: string
  url: string
}

export default function AnimeDetailPage() {
  const router = useRouter()
  const { slug } = router.query

  const id = parseInt(slug as string)
  const { anime, isLoading, isError } = useAnimeDetail(id)

  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loadingEpisodes, setLoadingEpisodes] = useState(true)

  // Ambil daftar episode dari API Oploverz
  useEffect(() => {
    if (!slug) return
    const fetchEpisodes = async () => {
      try {
        const animeUrl = `https://www.oploverz.now/anime/${slug}/`
        const res = await fetch(`/api/anime/detail?url=${encodeURIComponent(animeUrl)}`)
        const data = await res.json()
        if (Array.isArray(data.episodes)) {
          setEpisodes(data.episodes)
        }
      } catch (err) {
        console.error('Gagal memuat episode:', err)
      } finally {
        setLoadingEpisodes(false)
      }
    }
    fetchEpisodes()
  }, [slug])

  const isEpisodesReady = !loadingEpisodes && episodes.length > 0

  if (isLoading) return <p className="text-center text-white mt-10">Loading...</p>
  if (isError || !anime) return <p className="text-center text-red-500 mt-10">Anime not found.</p>

  return (
    <>
      <Head>
        <title>{anime.title.english || anime.title.romaji} | Aichiow</title>
      </Head>
      <main className="bg-dark text-white pb-20">
        <AnimeDetailHeader anime={anime} />

        {/* Trailer */}
        {anime.trailer?.site === 'youtube' && (
          <AnimeTrailer trailer={anime.trailer} />
        )}

        {/* Daftar Karakter */}
        {Array.isArray(anime.characters?.edges) && anime.characters.edges.length > 0 && (
          <CharacterList characters={anime.characters.edges} />
        )}

        {/* Loading Episode */}
        {loadingEpisodes && <p className="text-center text-white mt-6">Mencari episode...</p>}

        {/* Daftar Episode */}
        {isEpisodesReady && (
          <>
            <div className="mt-8 text-center">
              <a
                href={`/watch/${encodeURIComponent(episodes[0].title)}?src=${encodeURIComponent(episodes[0].url)}`}
                className="inline-block px-6 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition"
              >
                🎬 Tonton Episode 1
              </a>
            </div>

            <div className="mt-10 px-4">
              <h2 className="text-2xl font-semibold mb-6 text-center">Daftar Episode</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {episodes.map((ep, index) => (
                  <a
                    key={index}
                    href={`/watch/${encodeURIComponent(ep.title)}?src=${encodeURIComponent(ep.url)}`}
                    className="bg-gray-800 hover:bg-primary/80 text-white px-3 py-2 rounded-lg text-sm text-center font-medium shadow-md transition transform hover:-translate-y-1"
                  >
                    {ep.title}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}
