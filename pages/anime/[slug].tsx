// pages/anime/[slug].tsx
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAnimeDetail } from '@/hooks/useAnimeDetail'
import { useQuery } from '@tanstack/react-query'
import { fetchSimilarAnime } from '@/lib/anilist'
import AnimeDetailHeader from '@/components/anime/AnimeDetailHeader'
import AnimeTrailer from '@/components/anime/AnimeTrailer'
import CharacterList from '@/components/character/CharacterList'
import AnimeCard from '@/components/anime/AnimeCard'

export default function AnimeDetailPage() {
  const router = useRouter()
  const { slug } = router.query

  const id = parseInt(slug as string)
  const { anime, isLoading, isError } = useAnimeDetail(id)

  // Fetch Similar Anime
  const { data: similarAnime = [], isLoading: loadingSimilar } = useQuery({
    queryKey: ['similarAnime', id],
    queryFn: () => fetchSimilarAnime(id),
    enabled: !!id,
  })

  if (isLoading) return <p className="text-center text-white mt-10">Loading...</p>
  if (isError || !anime) return <p className="text-center text-red-500 mt-10">Anime not found.</p>

  const statusBadgeColor =
    anime.status === 'RELEASING'
      ? 'bg-green-500'
      : anime.status === 'FINISHED'
      ? 'bg-blue-500'
      : 'bg-gray-500'

  // Tentukan jumlah episode
  const totalEpisodes =
    anime.episodes ||
    (anime.nextAiringEpisode?.episode
      ? anime.nextAiringEpisode.episode - 1
      : null)

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

        {/* Episode Mapping Section */}
        <section className="mt-10 px-4 text-center">
          {/* Badge Status */}
          <div className="mb-4">
            <span
              className={`inline-block px-4 py-1 text-sm font-semibold rounded-full ${statusBadgeColor}`}
            >
              {anime.status === 'RELEASING'
                ? 'Ongoing'
                : anime.status === 'FINISHED'
                ? 'Completed'
                : 'Upcoming'}
            </span>
          </div>

          {/* Info Total Episode + Durasi */}
          <p className="text-gray-300 text-sm mb-6">
            {totalEpisodes
              ? `Total Episodes: ${totalEpisodes}`
              : 'Total Episodes: ?'}{' '}
            |{' '}
            {anime.duration
              ? `Duration: ${anime.duration} min/ep`
              : 'Duration: ?'}
          </p>

          <h2 className="text-2xl font-extrabold text-white mb-6">Episodes</h2>
          {totalEpisodes ? (
            <div className="flex flex-wrap justify-center gap-4">
              {Array.from({ length: totalEpisodes }).map((_, index) => (
                <a
                  key={index}
                  href="/justkidding"
                  className="px-5 py-2 rounded-full text-sm font-semibold
                            bg-gradient-to-r from-purple-600 to-pink-500
                            hover:from-pink-500 hover:to-purple-600
                            transition-all duration-300 transform hover:scale-105
                            shadow-md hover:shadow-pink-500/40"
                >
                  Episode {index + 1}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Total episode belum diketahui.</p>
          )}
        </section>

        {/* Similar Anime Section */}
        <section className="mt-10 px-4">
          <h2 className="text-xl font-semibold mb-4">Similar Anime</h2>
          {loadingSimilar ? (
            <p className="text-center text-gray-400">Loading similar anime...</p>
          ) : similarAnime.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto">
              {similarAnime.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No similar anime found.</p>
          )}
        </section>
      </main>
    </>
  )
}
