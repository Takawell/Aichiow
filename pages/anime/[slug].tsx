import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAnimeDetail } from '@/hooks/useAnimeDetail'
import { useQuery } from '@tanstack/react-query'
import { fetchSimilarAnime } from '@/lib/anilist'
import AnimeTrailer from '@/components/anime/AnimeTrailer'
import CharacterList from '@/components/character/CharacterList'
import AnimeCard from '@/components/anime/AnimeCard'
import { format, fromUnixTime } from 'date-fns'
import { useState } from 'react'

export default function AnimeDetailPage() {
  const router = useRouter()
  const { slug } = router.query
  const [showFullDescription, setShowFullDescription] = useState(false)

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

  const totalEpisodes = anime.episodes || null
  const duration = anime.duration || null

  const toggleDescription = () => setShowFullDescription((prev) => !prev)
  const cleanDescription = anime.description
    ? anime.description.replace(/<[^>]+>/g, '')
    : ''
  const shortDescription = cleanDescription.slice(0, 300)

  return (
    <>
      <Head>
        <title>{anime.title.english || anime.title.romaji} | Aichiow</title>
      </Head>
      <main className="bg-dark text-white pb-20">
        {/* Background Cover */}
        {anime.bannerImage && (
          <div
            className="relative w-full h-[260px] md:h-[320px] bg-cover bg-center"
            style={{ backgroundImage: `url(${anime.bannerImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
          </div>
        )}

        {/* Anime Info Section */}
        <section className="relative max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-4 -mt-20">
          {/* Cover Image */}
          {anime.coverImage?.large && (
            <div className="flex-shrink-0 w-[180px] md:w-[240px] rounded-xl overflow-hidden shadow-xl border-2 border-gray-700 bg-gray-900">
              <img
                src={anime.coverImage.large}
                alt={anime.title.english || anime.title.romaji}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Text Info */}
          <div className="flex-1 mt-6 md:mt-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              {anime.title.english || anime.title.romaji}
            </h1>
            {anime.title.romaji && (
              <p className="text-gray-400 italic mb-4 text-sm md:text-base">
                {anime.title.romaji}
              </p>
            )}

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres?.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-xs bg-blue-600 rounded-full text-white"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Description */}
            {anime.description && (
              <div className="text-gray-300 text-sm leading-relaxed mb-4">
                {showFullDescription ? cleanDescription : `${shortDescription}...`}
                {cleanDescription.length > 300 && (
                  <button
                    onClick={toggleDescription}
                    className="ml-2 text-blue-400 hover:underline"
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            )}

            {/* Extra Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm text-gray-400">
              <p>🎞️ <span className="text-white">{anime.format || '-'}</span></p>
              <p>📅 Season: <span className="text-white">{anime.season || '-'} {anime.seasonYear || ''}</span></p>
              <p>⭐ Score: <span className="text-white">{anime.averageScore || '-'}</span></p>
              <p>🎬 Studio: <span className="text-white">{anime.studios?.nodes?.[0]?.name || '-'}</span></p>
              <p>📈 Popularity: <span className="text-white">{anime.popularity || '-'}</span></p>
              <p>📺 Status: <span className="text-white">{anime.status || '-'}</span></p>
            </div>
          </div>
        </section>

        {/* Trailer */}
        {anime.trailer?.site === 'youtube' && (
          <AnimeTrailer trailer={anime.trailer} />
        )}

        {/* Characters */}
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
          <p className="text-gray-300 text-sm mb-2">
            {totalEpisodes
              ? `Total Episodes: ${totalEpisodes}`
              : 'Total Episodes: ?'}{' '}
            |{' '}
            {duration
              ? `Duration: ${duration} min/ep`
              : 'Duration: ?'}
          </p>

          {/* Next Airing Info */}
          {anime.nextAiringEpisode && (
            <p className="text-blue-400 text-sm mb-6">
              Next Episode {anime.nextAiringEpisode.episode} airs on{' '}
              {format(fromUnixTime(anime.nextAiringEpisode.airingAt), 'PPpp')}
            </p>
          )}

          <h2 className="text-2xl font-extrabold text-white mb-6">Episodes</h2>

          {/* Tombol Lihat Episode */}
          <div className="flex justify-center">
            <a
              href="/justkidding"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 
                         text-white font-medium transition shadow-lg hover:shadow-xl"
            >
              List Episode
            </a>
          </div>
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
