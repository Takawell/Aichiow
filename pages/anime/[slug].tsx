import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAnimeDetail } from '@/hooks/useAnimeDetail'
import { useGogoAnimeEpisodes } from '@/hooks/useGogoAnimeEpisodes'
import AnimeDetailHeader from '@/components/anime/AnimeDetailHeader'
import AnimeTrailer from '@/components/anime/AnimeTrailer'
import CharacterList from '@/components/character/CharacterList'

export default function AnimeDetailPage() {
  const router = useRouter()
  const { slug } = router.query

  const id = parseInt(slug as string)
  const { anime, isLoading, isError } = useAnimeDetail(id)

  const gogoSlug = anime?.title?.romaji?.toLowerCase().replace(/\s+/g, "-") || ""
  const { episodes, isLoading: loadingEpisodes } = useGogoAnimeEpisodes(gogoSlug)

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

        {/* Tombol tonton episode 1 */}
        {!loadingEpisodes && episodes.length > 0 && (
          <div className="mt-8 text-center">
            <a
              href={`/watch/${episodes[0].id}`}
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition"
            >
              🎬 Tonton Episode 1
            </a>
          </div>
        )}

        {/* Daftar Episode Streaming */}
        {!loadingEpisodes && episodes.length > 0 && (
          <div className="mt-10 px-4">
            <h2 className="text-xl font-semibold mb-4">Daftar Episode</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {episodes.map((ep: any) => (
                <a
                  key={ep.id}
                  href={`/watch/${ep.id}`}
                  className="bg-gray-800 hover:bg-primary/80 text-white px-3 py-2 rounded text-sm text-center"
                >
                  Episode {ep.number}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
