import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAnimeDetail } from '@/hooks/useAnimeDetail'
import { useQuery } from '@tanstack/react-query'
import { fetchSimilarAnime } from '@/lib/anilist'
import AnimeCard from '@/components/anime/AnimeCard'
import { format, fromUnixTime } from 'date-fns'
import { AnimeDetail } from '@/types/anime'

/**
 * ============================
 * Character Carousel Component
 * ============================
 */
function CharacterCarousel({
  characters,
}: {
  characters: AnimeDetail['characters'] | undefined
}) {
  const edges = characters?.edges ?? []
  if (edges.length === 0) return null

  return (
    <section className="mt-16 px-4">
      <h2 className="text-2xl font-bold mb-4">Characters & Voice Actors</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600">
        {edges.map((char) => (
          <div
            key={char.node.name.full}
            className="flex-shrink-0 w-44 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
          >
            <img
              src={char.node.image?.large}
              alt={char.node.name?.full}
              className="w-full h-56 object-cover"
            />
            <div className="p-2 text-center">
              <p className="text-white text-sm font-semibold line-clamp-2">
                {char.node.name.full}
              </p>
              {char.voiceActors?.[0] && (
                <p className="text-gray-400 text-xs mt-1">
                  VA: {char.voiceActors[0].name.full}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * ============================
 * Show/Hide Description
 * ============================
 */
function AnimeDescription({ description }: { description?: string }) {
  const [showMore, setShowMore] = useState(false)
  if (!description) return null

  const toggle = () => setShowMore((prev) => !prev)
  const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, '')

  const shortText = cleanDescription.slice(0, 300)
  const shouldTruncate = cleanDescription.length > 300

  return (
    <div className="mt-6 text-gray-300 text-sm leading-relaxed">
      {showMore || !shouldTruncate ? cleanDescription : `${shortText}...`}
      {shouldTruncate && (
        <button
          onClick={toggle}
          className="ml-2 text-blue-400 hover:text-blue-500 underline"
        >
          {showMore ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}

/**
 * ============================
 * Anime Info Section
 * ============================
 */
function AnimeInfoSection({ anime }: { anime: AnimeDetail }) {
  const statusBadgeColor =
    anime.status === 'RELEASING'
      ? 'bg-green-500'
      : anime.status === 'FINISHED'
      ? 'bg-blue-500'
      : 'bg-gray-500'

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-10 px-4 text-center"
    >
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

      {/* Info */}
      <p className="text-gray-300 text-sm mb-2">
        {anime.episodes ? `Episodes: ${anime.episodes}` : 'Episodes: ?'} |{' '}
        {anime.duration ? `Duration: ${anime.duration} min/ep` : 'Duration: ?'}
      </p>

      {/* Next Airing Info */}
      {anime.nextAiringEpisode && (
        <p className="text-blue-400 text-sm mb-6">
          Next Episode {anime.nextAiringEpisode.episode} airs on{' '}
          {format(fromUnixTime(anime.nextAiringEpisode.airingAt), 'PPpp')}
        </p>
      )}

      {/* Season & Year */}
      {anime.season && (
        <p className="text-gray-300 text-sm mb-2">
          <span className="text-gray-400">Season:</span> {anime.season}{' '}
          {anime.seasonYear}
        </p>
      )}

      {/* Studios */}
      {anime.studios?.nodes?.[0] && (
        <p className="text-gray-300 text-sm mb-2">
          <span className="text-gray-400">Studio:</span>{' '}
          {anime.studios.nodes[0].name}
        </p>
      )}

      {/* Format */}
      {anime.format && (
        <p className="text-gray-300 text-sm mb-2">
          <span className="text-gray-400">Format:</span> {anime.format}
        </p>
      )}

      {/* Source */}
      {anime.source && (
        <p className="text-gray-300 text-sm mb-2">
          <span className="text-gray-400">Source:</span> {anime.source}
        </p>
      )}
    </motion.section>
  )
}

/**
 * ============================
 * Similar Anime Section
 * ============================
 */
function SimilarAnimeSection({
  animeId,
}: {
  animeId: number
}) {
  const { data: similarAnime = [], isLoading } = useQuery({
    queryKey: ['similarAnime', animeId],
    queryFn: () => fetchSimilarAnime(animeId),
    enabled: !!animeId,
  })

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-10 px-4"
    >
      <h2 className="text-xl font-semibold mb-4">Similar Anime</h2>
      {isLoading ? (
        <p className="text-center text-gray-400">Loading similar anime...</p>
      ) : similarAnime.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600">
          {similarAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No similar anime found.</p>
      )}
    </motion.section>
  )
}

/**
 * ============================
 * Main Anime Detail Page
 * ============================
 */
export default function AnimeDetailPage() {
  const router = useRouter()
  const { slug } = router.query
  const id = parseInt(slug as string)

  const { anime, isLoading, isError } = useAnimeDetail(id)

  if (isLoading)
    return (
      <p className="text-center text-white mt-10 animate-pulse">
        Loading anime details...
      </p>
    )
  if (isError || !anime)
    return (
      <p className="text-center text-red-500 mt-10">
        Anime not found.
      </p>
    )

  const banner = anime.bannerImage || anime.coverImage.extraLarge

  return (
    <>
      <Head>
        <title>{anime.title.english || anime.title.romaji} | Aichiow</title>
      </Head>
      <main className="bg-dark text-white pb-20 min-h-screen">
        {/* Background Banner */}
        <div className="relative h-[40vh] w-full">
          {banner && (
            <img
              src={banner}
              alt={anime.title.romaji}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent" />
          <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl font-extrabold"
            >
              {anime.title.english || anime.title.romaji}
            </motion.h1>
          </div>
        </div>

        {/* Cover & Info */}
        <section className="relative z-10 px-4 -mt-20 flex flex-col md:flex-row md:items-end gap-6">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={anime.coverImage.large}
            alt={anime.title.romaji}
            className="w-44 rounded-xl shadow-lg border-2 border-gray-700"
          />
          <div className="flex-1">
            <AnimeInfoSection anime={anime} />
          </div>
        </section>

        {/* Description */}
        <section className="mt-8 px-4">
          <h2 className="text-xl font-bold mb-2">Synopsis</h2>
          <AnimeDescription description={anime.description} />
        </section>

        {/* Characters */}
        <CharacterCarousel characters={anime.characters} />

        {/* Similar Anime */}
        <SimilarAnimeSection animeId={anime.id} />
      </main>
    </>
  )
}
