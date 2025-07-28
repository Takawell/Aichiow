// pages/anime/[slug].tsx
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState } from 'react'
import { useAnimeDetail } from '@/hooks/useAnimeDetail'
import { useQuery } from '@tanstack/react-query'
import { fetchSimilarAnime } from '@/lib/anilist'
import AnimeDetailHeader from '@/components/anime/AnimeDetailHeader'
import AnimeTrailer from '@/components/anime/AnimeTrailer'
import CharacterList from '@/components/character/CharacterList'
import AnimeCard from '@/components/anime/AnimeCard'
import { format, fromUnixTime } from 'date-fns'
import { motion } from 'framer-motion'

export default function AnimeDetailPage() {
  const router = useRouter()
  const { slug } = router.query
  const [showMore, setShowMore] = useState(false)

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

  const totalEpisodes = anime.episodes || null
  const duration = anime.duration || null
  const rating = anime.averageScore || 0
  const cleanDescription = anime.description?.replace(/<\/?[^>]+(>|$)/g, '') || ''
  const shortDesc = cleanDescription.slice(0, 400)

  return (
    <>
      <Head>
        <title>{anime.title.english || anime.title.romaji} | Aichiow</title>
      </Head>

      <main className="bg-dark text-white pb-20">
        {/* HEADER */}
        <AnimeDetailHeader anime={anime} />

        {/* INFO PANEL */}
        <section className="px-6 md:px-12 mt-8">
          {/* Status + Rating */}
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <span className={`px-3 py-1 text-sm rounded-full ${statusBadgeColor}`}>
              {anime.status || 'Unknown'}
            </span>
            {rating > 0 && (
              <span className="px-3 py-1 text-sm rounded-full bg-yellow-500 text-black font-semibold">
                ⭐ {rating}%
              </span>
            )}
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {anime.genres?.map((g) => (
              <span
                key={g}
                className="px-3 py-1 text-xs rounded-full bg-gray-700 hover:bg-gray-600 transition"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Info Detail */}
          <div className="text-sm text-gray-300 space-y-1 mb-6">
            {totalEpisodes && <p>Episodes: {totalEpisodes}</p>}
            {duration && <p>Duration: {duration} min/ep</p>}
            {anime.format && <p>Format: {anime.format}</p>}
            {anime.season && (
              <p>
                Season: {anime.season} {anime.seasonYear}
              </p>
            )}
            {anime.studios?.nodes?.length > 0 && (
              <p>Studio: {anime.studios.nodes.map((s) => s.name).join(', ')}</p>
            )}
            {anime.popularity && <p>Popularity: {anime.popularity.toLocaleString()} users</p>}
            {anime.source && <p>Source: {anime.source}</p>}
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/60 p-4 rounded-lg shadow-md">
            <p className="text-gray-300 text-sm leading-relaxed">
              {showMore || cleanDescription.length <= 400
                ? cleanDescription
                : `${shortDesc}...`}
              {cleanDescription.length > 400 && (
                <button
                  className="ml-2 text-blue-400 hover:underline"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? 'Show Less' : 'Show More'}
                </button>
              )}
            </p>
          </div>
        </section>

        {/* TRAILER */}
        {anime.trailer?.site === 'youtube' && (
          <section className="mt-12 px-6 md:px-12">
            <h2 className="text-xl font-bold mb-4">Trailer</h2>
            <AnimeTrailer trailer={anime.trailer} />
          </section>
        )}

        {/* CHARACTERS */}
        {Array.isArray(anime.characters?.edges) && anime.characters.edges.length > 0 && (
          <section className="mt-12 px-6 md:px-12">
            <h2 className="text-xl font-bold mb-4">Characters & Voice Actors</h2>
            <CharacterList characters={anime.characters.edges} />
          </section>
        )}

        {/* EPISODES */}
        <section className="mt-10 px-4 text-center">
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

          <p className="text-gray-300 text-sm mb-2">
            {totalEpisodes
              ? `Total Episodes: ${totalEpisodes}`
              : 'Total Episodes: ?'}{' '}
            |{' '}
            {duration
              ? `Duration: ${duration} min/ep`
              : 'Duration: ?'}
          </p>

          {anime.nextAiringEpisode && (
            <p className="text-blue-400 text-sm mb-6">
              Next Episode {anime.nextAiringEpisode.episode} airs on{' '}
              {format(fromUnixTime(anime.nextAiringEpisode.airingAt), 'PPpp')}
            </p>
          )}

          <h2 className="text-2xl font-extrabold text-white mb-6">Episodes</h2>
          <div className="flex justify-center">
            <a
              href="/justkidding"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 
                         text-white font-medium transition shadow-lg hover:shadow-xl"
            >
              View Episode List
            </a>
          </div>
        </section>

        {/* SIMILAR ANIME */}
        <section className="mt-10 px-4">
          <h2 className="text-xl font-semibold mb-4">Similar Anime</h2>
          {loadingSimilar ? (
            <p className="text-center text-gray-400">Loading similar anime...</p>
          ) : similarAnime.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {similarAnime.map((anime) => (
                <motion.div
                  key={anime.id}
                  whileHover={{ scale: 1.05 }}
                  className="min-w-[160px]"
                >
                  <AnimeCard anime={anime} />
                </motion.div>
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
