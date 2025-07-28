import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState } from 'react'
import { useAnimeDetail } from '@/hooks/useAnimeDetail'
import { useQuery } from '@tanstack/react-query'
import { fetchSimilarAnime } from '@/lib/anilist'
import { format, fromUnixTime } from 'date-fns'
import AnimeTrailer from '@/components/anime/AnimeTrailer'
import AnimeCard from '@/components/anime/AnimeCard'
import CharacterList from '@/components/character/CharacterList'
import { motion } from 'framer-motion'

// ==========================
// Episode List Component
// ==========================
function EpisodeList({ episodes }: { episodes: number }) {
  const [currentPage, setCurrentPage] = useState(1)
  const episodesPerPage = 10
  const totalPages = Math.ceil(episodes / episodesPerPage)

  const start = (currentPage - 1) * episodesPerPage + 1
  const end = Math.min(start + episodesPerPage - 1, episodes)
  const episodeNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {episodeNumbers.map((ep) => (
          <motion.a
            key={ep}
            href={`/watch/${ep}`}
            className="bg-gray-800 hover:bg-blue-600 text-white rounded-lg p-3 text-center shadow-md transition"
            whileHover={{ scale: 1.05 }}
          >
            Episode {ep}
          </motion.a>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-300 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

// ==========================
// Review & Stats Section
// ==========================
function AnimeStats({
  score,
  popularity,
}: {
  score?: number
  popularity?: number
}) {
  return (
    <section className="mt-12 px-6 md:px-12">
      <h2 className="text-xl font-bold mb-4">Anime Stats</h2>
      <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
        {/* Rating */}
        <div className="mb-3">
          <p className="text-gray-300 text-sm mb-1">Rating</p>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-yellow-500 h-3 rounded-full"
              style={{ width: `${score || 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {score ? `${score}%` : 'No rating'}
          </p>
        </div>
        {/* Popularity */}
        <div>
          <p className="text-gray-300 text-sm mb-1">Popularity</p>
          <p className="text-white text-lg font-semibold">
            {popularity ? `${popularity.toLocaleString()} users` : 'N/A'}
          </p>
        </div>
      </div>
    </section>
  )
}

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

  const [showMore, setShowMore] = useState(false)

  if (isLoading) return <p className="text-center text-white mt-10">Loading...</p>
  if (isError || !anime) return <p className="text-center text-red-500 mt-10">Anime not found.</p>

  const statusBadgeColor =
    anime.status === 'RELEASING'
      ? 'bg-green-500'
      : anime.status === 'FINISHED'
      ? 'bg-blue-500'
      : 'bg-gray-500'

  const totalEpisodes = anime.episodes || 0
  const duration = anime.duration || '?'
  const rating = anime.averageScore || 0
  const cleanDesc = anime.description?.replace(/<\/?[^>]+(>|$)/g, '') || ''
  const shortDesc = cleanDesc.slice(0, 350)

  return (
    <>
      <Head>
        <title>{anime.title.english || anime.title.romaji} | Aichiow</title>
      </Head>
      <main className="bg-dark text-white pb-20">
        {/* Banner */}
        <div className="relative h-[45vh] w-full mb-20">
          {anime.bannerImage && (
            <img
              src={anime.bannerImage}
              alt={anime.title.romaji}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-dark"></div>
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-center drop-shadow-lg">
              {anime.title.english || anime.title.romaji}
            </h1>
          </div>
        </div>

        {/* Info */}
        <section className="flex flex-col md:flex-row gap-6 px-6 md:px-12">
          <div className="flex-shrink-0 w-44 mx-auto md:mx-0">
            <img
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              className="rounded-xl shadow-2xl border-2 border-gray-700"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-sm rounded-full ${statusBadgeColor}`}>
                {anime.status || 'Unknown'}
              </span>
              {rating > 0 && (
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-500 text-black font-semibold">
                  ⭐ {rating}%
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres?.map((g) => (
                <span
                  key={g}
                  className="px-2 py-1 text-xs rounded-full bg-gray-700 hover:bg-gray-600 transition"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-sm mb-2">
              Episodes: {totalEpisodes || '?'} | Duration: {duration} min/ep
            </p>
            {anime.season && (
              <p className="text-gray-300 text-sm mb-2">
                Season: {anime.season} {anime.seasonYear}
              </p>
            )}
            {anime.studios?.nodes?.length > 0 && (
              <p className="text-gray-300 text-sm mb-2">
                Studio: {anime.studios.nodes[0].name}
              </p>
            )}
            {anime.format && (
              <p className="text-gray-300 text-sm mb-2">Format: {anime.format}</p>
            )}

            {anime.nextAiringEpisode && (
              <p className="text-blue-400 text-sm mb-2">
                Next Episode {anime.nextAiringEpisode.episode} airs on{' '}
                {format(fromUnixTime(anime.nextAiringEpisode.airingAt), 'PPpp')}
              </p>
            )}

            {/* Description */}
            <div className="mt-4 text-gray-300 leading-relaxed text-sm">
              {showMore || cleanDesc.length <= 350 ? cleanDesc : `${shortDesc}...`}
              {cleanDesc.length > 350 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="ml-2 text-blue-400 hover:text-blue-500 underline"
                >
                  {showMore ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Trailer */}
        {anime.trailer?.site === 'youtube' && (
          <section className="mt-12 px-6 md:px-12">
            <h2 className="text-xl font-bold mb-4">Trailer</h2>
            <AnimeTrailer trailer={anime.trailer} />
          </section>
        )}

        {/* Stats */}
        <AnimeStats score={anime.averageScore} popularity={anime.popularity} />

        {/* Characters */}
        {Array.isArray(anime.characters?.edges) && anime.characters.edges.length > 0 && (
          <section className="mt-12 px-6 md:px-12">
            <h2 className="text-xl font-bold mb-4">Characters & Voice Actors</h2>
            <CharacterList characters={anime.characters.edges} />
          </section>
        )}

        {/* Episodes */}
        <section className="mt-12 px-6 md:px-12">
          <h2 className="text-2xl font-extrabold text-white mb-6">Episodes</h2>
          {totalEpisodes > 0 ? (
            <EpisodeList episodes={totalEpisodes} />
          ) : (
            <p className="text-gray-400 text-center">No episodes info available.</p>
          )}
        </section>

        {/* Similar Anime */}
        <section className="mt-12 px-6 md:px-12">
          <h2 className="text-xl font-semibold mb-4">Similar Anime</h2>
          {loadingSimilar ? (
            <p className="text-center text-gray-400">Loading similar anime...</p>
          ) : similarAnime.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
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
