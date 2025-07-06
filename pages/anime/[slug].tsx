// pages/anime/[slug].tsx
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAnimeDetail } from '@/hooks/useAnimeDetail'
import AnimeDetailHeader from '@/components/anime/AnimeDetailHeader'
import AnimeTrailer from '@/components/anime/AnimeTrailer'
import CharacterList from '@/components/character/CharacterList'

export default function AnimeDetailPage() {
  const router = useRouter()
  const { slug } = router.query

  const id = parseInt(slug as string)
  const { anime, isLoading, isError } = useAnimeDetail(id)

  if (isLoading) return <p className="text-center text-white mt-10">Loading...</p>
  if (isError || !anime) return <p className="text-center text-red-500 mt-10">Anime not found.</p>

  return (
    <>
      <Head>
        <title>{anime.title.english || anime.title.romaji} | Aichiow</title>
      </Head>
      <main className="bg-dark text-white pb-20">
        <AnimeDetailHeader anime={anime} />
        {anime.trailer?.site === 'youtube' && (
          <AnimeTrailer trailer={anime.trailer} />
        )}
        {Array.isArray(anime.characters?.edges) && anime.characters.edges.length > 0 && (
          <CharacterList characters={anime.characters.edges} />
        )}
      </main>
    </>
  )
}
