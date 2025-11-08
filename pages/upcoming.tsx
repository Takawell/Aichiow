import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Anime } from '@/types/anime'
import { fetchUpcomingAnime, fetchScheduleAnime } from '@/lib/anilist'
import Image from 'next/image'
import Link from 'next/link'
import { format, fromUnixTime } from 'date-fns'
import { id as localeID } from 'date-fns/locale'
import { AiOutlineCalendar, AiOutlineClose } from 'react-icons/ai'
import { FaRegClock, FaStar } from 'react-icons/fa'
import { BiMoviePlay } from 'react-icons/bi'
import { MdOutlineViewList } from 'react-icons/md'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function CardSkeleton({ type }: { type: 'schedule' | 'upcoming' }) {
  if (type === 'schedule') {
    return (
      <div className="relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-zinc-800/90 rounded-2xl border border-zinc-700/50 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-sky-600/5 animate-pulse" />
        <div className="relative w-12 h-16 sm:w-14 sm:h-20 bg-gradient-to-br from-zinc-700 to-zinc-600 rounded-xl shadow-lg" />
        <div className="relative flex flex-col gap-2 flex-1">
          <div className="w-full max-w-[200px] h-4 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full" />
          <div className="w-2/3 max-w-[140px] h-3 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="group relative bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800 rounded-2xl border border-zinc-700/50 overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-sky-600/10 to-sky-700/10 animate-pulse" />
      <div className="relative w-full h-56 sm:h-64 bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-700" />
      <div className="relative p-3 sm:p-4 space-y-3">
        <div className="w-4/5 h-4 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full" />
        <div className="w-3/5 h-3 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full" />
      </div>
    </div>
  )
}

function AnimeModal({ anime, onClose }: { anime: Anime | null; onClose: () => void }) {
  useEffect(() => {
    if (anime) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [anime])

  if (!anime) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800 rounded-3xl border border-zinc-700/50 shadow-2xl overflow-hidden animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full border border-zinc-700/50 hover:border-sky-500/50 transition-all duration-300 group"
        >
          <AiOutlineClose className="text-white group-hover:text-sky-400 transition-colors" size={24} />
        </button>

        <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <Image
              src={anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large}
              alt={anime.title.english || anime.title.romaji}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Image
                src={anime.coverImage.extraLarge || anime.coverImage.large}
                alt={anime.title.english || anime.title.romaji}
                width={150}
                height={220}
                className="w-28 h-40 sm:w-36 sm:h-52 object-cover rounded-2xl shadow-2xl border-2 border-zinc-700/50"
              />
              <div className="flex flex-col justify-end gap-2 flex-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg line-clamp-2">
                  {anime.title.english || anime.title.romaji}
                </h2>
                {anime.title.romaji !== anime.title.english && (
                  <p className="text-sm sm:text-base text-zinc-300 drop-shadow-md">
                    {anime.title.romaji}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-wrap gap-3">
              {anime.averageScore && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/20 to-amber-700/20 border border-amber-600/30 rounded-full">
                  <FaStar className="text-amber-400" />
                  <span className="text-sm font-bold text-amber-400">{anime.averageScore / 10}</span>
                </div>
              )}
              {anime.format && (
                <div className="px-4 py-2 bg-sky-600/20 border border-sky-600/30 rounded-full text-sm font-bold text-sky-400">
                  {anime.format}
                </div>
              )}
              {anime.status && (
                <div className="px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-full text-sm font-bold text-green-400">
                  {anime.status}
                </div>
              )}
              {anime.episodes && (
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-600/30 rounded-full">
                  <MdOutlineViewList className="text-purple-400" />
                  <span className="text-sm font-bold text-purple-400">{anime.episodes} Episodes</span>
                </div>
              )}
            </div>

            {anime.nextAiringEpisode && (
              <div className="p-4 bg-gradient-to-r from-sky-600/10 to-sky-700/10 border border-sky-600/30 rounded-2xl">
                <p className="flex items-center gap-2 text-sky-400 font-bold">
                  <FaRegClock />
                  Next Episode {anime.nextAiringEpisode.episode}
                  <span className="text-zinc-300">•</span>
                  <span className="text-zinc-300 font-medium">
                    {format(fromUnixTime(anime.nextAiringEpisode.airingAt), 'eeee, MMM d • HH:mm', { locale: localeID })}
                  </span>
                </p>
              </div>
            )}

            {anime.genres && anime.genres.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-xs font-medium text-zinc-300 hover:border-sky-500/50 hover:text-sky-400 transition-all"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {anime.description && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Synopsis</h3>
                <p 
                  className="text-sm sm:text-base text-zinc-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: anime.description.replace(/<br\s*\/?>/gi, '<br />').replace(/<i>/g, '<em>').replace(/<\/i>/g, '</em>') 
                  }}
                />
              </div>
            )}

            {(anime.season || anime.seasonYear) && (
              <div>
                <h3 className="text-sm font-bold text-zinc-400 mb-2">Season</h3>
                <p className="text-white font-medium">
                  {anime.season} {anime.seasonYear}
                </p>
              </div>
            )}

            <Link
              href={`/anime/${anime.id}`}
              className="block w-full py-4 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 rounded-2xl text-center font-bold text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all duration-300 transform hover:scale-[1.02]"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(39, 39, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(14, 165, 233, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(14, 165, 233, 0.7);
        }
      `}</style>
    </div>
  )
}

export default function UpcomingPage() {
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([])
  const [scheduleAnime, setScheduleAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), 'EEEE'))
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [upcoming, schedule] = await Promise.all([
          fetchUpcomingAnime(),
          fetchScheduleAnime(),
        ])
        setUpcomingAnime(upcoming)
        setScheduleAnime(schedule)
      } catch (err) {
        console.error('[Upcoming Error]', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredSchedule = scheduleAnime.filter((anime) => {
    const airingTime = anime.nextAiringEpisode?.airingAt
    if (!airingTime) return false
    const airingDay = format(fromUnixTime(airingTime), 'EEEE')
    return airingDay === selectedDay
  })

  return (
    <>
      <Head>
        <title>Anime Schedule & Upcoming | Aichiow</title>
      </Head>
      <main className="min-h-screen bg-black px-4 sm:px-6 md:px-10 py-8 sm:py-12 text-white">
        <div className="max-w-7xl mx-auto">
          <section className="mb-12 sm:mb-16">
            <div className="relative inline-block mb-6 sm:mb-8">
              <h2 className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
                <AiOutlineCalendar className="text-sky-500 drop-shadow-lg" size={32} /> 
                <span>Weekly Schedule</span>
              </h2>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-sky-500/50 to-sky-600/50 rounded-full blur-sm" />
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`group relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 transform hover:scale-105 overflow-hidden
                    ${selectedDay === day
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-xl shadow-sky-500/40'
                      : 'bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 hover:bg-zinc-700/50 hover:border-zinc-600'
                    }`}
                >
                  <span className="relative z-10">{day}</span>
                  {selectedDay === day && (
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-600 opacity-30 blur-xl animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-3 sm:space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <CardSkeleton key={i} type="schedule" />
                ))}
              </div>
            ) : filteredSchedule.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="inline-block p-4 sm:p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
                  <p className="text-zinc-400 text-sm sm:text-base">No anime airing on {selectedDay}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredSchedule.map((anime) => {
                  const { airingAt, episode } = anime.nextAiringEpisode || {}
                  const dateText = airingAt
                    ? format(fromUnixTime(airingAt), 'eeee, MMM d • HH:mm', { locale: localeID })
                    : 'Unknown'

                  return (
                    <button
                      key={anime.id}
                      onClick={() => setSelectedAnime(anime)}
                      className="w-full group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-zinc-800/90 rounded-2xl border border-zinc-700/50 hover:border-sky-500/50 backdrop-blur-sm overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 to-sky-600/0 group-hover:from-sky-500/10 group-hover:to-sky-600/10 transition-all duration-500" />
                      <div className="relative">
                        <Image
                          src={anime.coverImage.large}
                          alt={anime.title.english || anime.title.romaji}
                          width={60}
                          height={80}
                          className="w-12 h-16 sm:w-16 sm:h-24 object-cover rounded-xl shadow-xl border border-zinc-700/50 group-hover:border-sky-500/50 transition-all duration-300"
                        />
                      </div>
                      <div className="relative flex flex-col justify-center gap-1.5 sm:gap-2 flex-1 min-w-0 text-left">
                        <h3 className="text-sm sm:text-base font-bold text-white truncate">
                          {anime.title.english || anime.title.romaji}
                        </h3>
                        <p className="flex items-center gap-1.5 text-zinc-400 text-xs sm:text-sm flex-wrap">
                          <FaRegClock className="text-sky-400 flex-shrink-0" />
                          <span className="font-semibold">Episode {episode}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-sky-400 font-medium">{dateText}</span>
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          <section>
            <div className="relative inline-block mb-6 sm:mb-8">
              <h1 className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
                <BiMoviePlay className="text-sky-500 drop-shadow-lg" size={32} /> 
                <span>Upcoming Anime</span>
              </h1>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-sky-500/50 to-sky-600/50 rounded-full blur-sm" />
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <CardSkeleton key={i} type="upcoming" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {upcomingAnime.map((anime) => (
                  <button
                    key={anime.id}
                    onClick={() => setSelectedAnime(anime)}
                    className="w-full group relative bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800 rounded-2xl overflow-hidden border border-zinc-700/50 hover:border-sky-500/50 backdrop-blur-sm transform hover:scale-[1.05] transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-sky-600/0 group-hover:from-sky-500/20 group-hover:to-sky-600/20 transition-all duration-500 z-10 pointer-events-none" />
                    <div className="relative overflow-hidden">
                      <Image
                        src={anime.coverImage.large}
                        alt={anime.title.english || anime.title.romaji}
                        width={300}
                        height={400}
                        className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-sky-600 to-sky-700 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 font-bold shadow-lg backdrop-blur-sm">
                        <AiOutlineCalendar className="flex-shrink-0" /> 
                        <span>Soon</span>
                      </div>
                    </div>
                    <div className="relative p-3 sm:p-4">
                      <h2 className="text-xs sm:text-sm font-bold line-clamp-2 text-white group-hover:text-sky-300 transition-colors text-left">
                        {anime.title.english || anime.title.romaji}
                      </h2>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <AnimeModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
    </>
  )
}
