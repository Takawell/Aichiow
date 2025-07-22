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
import { format, fromUnixTime } from 'date-fns'

export default function AnimeDetailPage() {
  const router = useRouter()
  const { slug } = router.query

  const id = parseInt(slug as string)
  const { anime, isLoading, isError } = useAnimeDetail(id)

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

  // Hitung jumlah episode tayang
  let airedEpisodes = 0
  if (anime.status === 'RELEASING') {
    airedEpisodes = anime.nextAiringEpisode?.episode
      ? anime.nextAiringEpisode.episode - 1
      : anime.episodes || 0
  } else if (anime.status === 'FINISHED') {
    airedEpisodes = anime.episodes || 0
  }

  const totalEpisodes = anime.episodes || '?'
  const duration = anime.duration || '?'

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

        {/* Info Episode */}
        <section className="mt-10 px-4 text-center">
          <div className="mb-4">
            <span className={`inline-block px-4 py-1 text-sm font-semibold rounded-full ${statusBadgeColor}`}>
              {anime.status === 'RELEASING'
                ? 'Ongoing'
                : anime.status === 'FINISHED'
                ? 'Completed'
                : 'Upcoming'}
            </span>
          </div>

          <p className="text-gray-300 text-sm mb-2">
            Total Episodes: {totalEpisodes} | Duration: {duration} min/ep
          </p>

          {anime.nextAiringEpisode && (
            <p className="text-blue-400 text-sm mb-6">
              Next Episode {anime.nextAiringEpisode.episode} airs on{' '}
              {format(fromUnixTime(anime.nextAiringEpisode.airingAt), 'PPpp')}
            </p>
          )}

          <h2 className="text-2xl font-extrabold text-white mb-6">Episodes</h2>

          {anime.status === 'UPCOMING' || airedEpisodes === 0 ? (
            <p className="text-zinc-400 italic">Belum ada episode tayang</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from({ length: airedEpisodes }).map((_, index) => (
                <a
                  key={index}
                  href="/justkidding"
                  className="px-4 py-2 rounded-md text-sm font-medium
                            bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-md"
                >
                  Episode {index + 1}
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Similar Anime */}
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
