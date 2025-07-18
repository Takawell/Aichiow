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

  // Step 1: Cari slug anime di Oploverz lewat search API
  useEffect(() => {
    if (!anime?.title?.romaji) return

    const fetchEpisodes = async () => {
      try {
        // Cari anime di Oploverz
        const searchRes = await fetch(
          `/api/anime/search-oploverz?query=${encodeURIComponent(anime.title.romaji)}`
        )
        const searchData = await searchRes.json()

        if (!searchData.bestMatch?.url) {
          console.error('Slug Oploverz tidak ditemukan')
          setLoadingEpisodes(false)
          return
        }

        // Ambil daftar episode dari link anime
        const res = await fetch(`/api/anime/detail?url=${encodeURIComponent(searchData.bestMatch.url)}`)
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
  }, [anime])

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

        {anime.trailer?.site === 'youtube' && <AnimeTrailer trailer={anime.trailer} />}

        {Array.isArray(anime.characters?.edges) && anime.characters.edges.length > 0 && (
          <CharacterList characters={anime.characters.edges} />
        )}

        {loadingEpisodes && <p className="text-center text-white mt-6">Mencari episode...</p>}

        {isEpisodesReady && (
          <>
            <div className="mt-8 text-center">
              <a
                href={`/watch/${encodeURIComponent(episodes[0].title)}?src=${encodeURIComponent(episodes[0].url)}`}
                className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                🎬 Tonton {episodes[0].title}
              </a>
            </div>

            <div className="mt-10 px-4">
              <h2 className="text-xl font-semibold mb-4">Daftar Episode</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {episodes.map((ep, index) => (
                  <a
                    key={index}
                    href={`/watch/${encodeURIComponent(ep.title)}?src=${encodeURIComponent(ep.url)}`}
                    className="bg-gray-800 hover:bg-primary/80 text-white px-4 py-3 rounded-lg text-sm text-center shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl"
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
