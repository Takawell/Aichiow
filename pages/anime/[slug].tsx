// pages/anime/[slug].tsx
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAnimeDetail } from '@/hooks/useAnimeDetail'
import { useQuery } from '@tanstack/react-query'
import { fetchSimilarAnime } from '@/lib/anilist'
import { format, fromUnixTime } from 'date-fns'
import { motion } from 'framer-motion'
import { useState } from 'react'
import AnimeCard from '@/components/anime/AnimeCard'

// Komponen Character Card Carousel
function CharacterCarousel({ characters }: { characters: any[] }) {
  return (
    <section className="mt-14 px-4">
      <h2 className="text-2xl font-bold mb-4">Characters & Voice Actors</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600">
        {characters.map((char) => (
          <div
            key={char.node.id}
            className="flex-shrink-0 w-44 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition"
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
                <p className="text-gray-400 text-xs">
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

  const [showFullDesc, setShowFullDesc] = useState(false)

  if (isLoading) return <p className="text-center text-white mt-10">Loading...</p>
  if (isError || !anime) return <p className="text-center text-red-500 mt-10">Anime not found.</p>

  const statusBadgeColor =
    anime.status === 'RELEASING'
      ? 'bg-green-500'
      : anime.status === 'FINISHED'
      ? 'bg-blue-500'
      : 'bg-gray-500'

  const totalEpisodes = anime.episodes || '?'
  const duration = anime.duration || '?'

  return (
    <>
      <Head>
        <title>{anime.title.english || anime.title.romaji} | Aichiow</title>
      </Head>
      <main className="bg-dark text-white pb-20">
        {/* Hero Section */}
        <section className="relative h-[70vh] w-full overflow-hidden">
          <img
            src={anime.bannerImage || anime.coverImage?.extraLarge}
            alt={anime.title.english || anime.title.romaji}
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col justify-end h-full pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 sm:items-end"
            >
              <img
                src={anime.coverImage?.extraLarge}
                alt={anime.title.english || anime.title.romaji}
                className="w-40 sm:w-56 rounded-xl shadow-xl border-2 border-gray-700"
              />
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl font-extrabold">
                  {anime.title.english || anime.title.romaji}
                </h1>
                <p className="text-gray-300 text-sm italic">
                  {anime.title.native}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {anime.genres?.map((g: string) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-full bg-blue-700 text-xs font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sinopsis & Info Grid */}
        <section className="max-w-6xl mx-auto px-4 mt-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Deskripsi */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {showFullDesc
                  ? anime.description?.replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
                  : anime.description
                  ?.replace(/<\/?[^>]+(>|$)/g, '')
                  .slice(0, 400) + '...'}
              </p>
              {anime.description?.length > 400 && (
                <button
                  className="text-blue-400 mt-2 text-sm hover:underline"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                >
                  {showFullDesc ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg space-y-2">
              <h3 className="text-lg font-semibold mb-3">Information</h3>
              <p><span className="text-gray-400">Status:</span> {anime.status}</p>
              <p><span className="text-gray-400">Episodes:</span> {totalEpisodes}</p>
              <p><span className="text-gray-400">Duration:</span> {duration} min/ep</p>
              {anime.season && (
                <p><span className="text-gray-400">Season:</span> {anime.season} {anime.seasonYear}</p>
              )}
              {anime.studios?.edges?.[0] && (
                <p><span className="text-gray-400">Studio:</span> {anime.studios.edges[0].node.name}</p>
              )}
              <p><span className="text-gray-400">Format:</span> {anime.format}</p>
              {anime.source && <p><span className="text-gray-400">Source:</span> {anime.source}</p>}
            </div>
          </motion.div>
        </section>

        {/* Trailer */}
        {anime.trailer?.site === 'youtube' && (
          <section className="max-w-5xl mx-auto px-4 mt-14">
            <h2 className="text-2xl font-bold mb-4">Trailer</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl">
              <iframe
                src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                title="Anime Trailer"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </section>
        )}

        {/* Characters */}
        {Array.isArray(anime.characters?.edges) && anime.characters.edges.length > 0 && (
          <CharacterCarousel characters={anime.characters.edges} />
        )}

        {/* Next Airing & Episode Info */}
        <section className="max-w-6xl mx-auto px-4 mt-14 text-center">
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
            Total Episodes: {totalEpisodes} | Duration: {duration} min/ep
          </p>
          {anime.nextAiringEpisode && (
            <p className="text-blue-400 text-sm mb-6">
              Next Episode {anime.nextAiringEpisode.episode} airs on{' '}
              {format(fromUnixTime(anime.nextAiringEpisode.airingAt), 'PPpp')}
            </p>
          )}
          <a
            href="/justkidding"
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 
                       text-white font-medium transition shadow-lg hover:shadow-xl"
          >
            View Episodes
          </a>
        </section>

        {/* Similar Anime */}
        <section className="max-w-6xl mx-auto px-4 mt-14">
          <h2 className="text-2xl font-bold mb-4">Similar Anime</h2>
          {loadingSimilar ? (
            <p className="text-center text-gray-400">Loading similar anime...</p>
          ) : similarAnime.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600">
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
