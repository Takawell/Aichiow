import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Anime } from '@/types/anime'
import { fetchUpcomingAnime, fetchScheduleAnime } from '@/lib/anilist'
import Image from 'next/image'
import Link from 'next/link'
import { format, fromUnixTime } from 'date-fns'
import { id as localeID } from 'date-fns/locale'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function UpcomingPage() {
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([])
  const [scheduleAnime, setScheduleAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), 'EEEE'))

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
      <main className="px-4 md:px-10 py-10 text-white max-w-7xl mx-auto space-y-16">
        {/* WEEKLY SCHEDULE */}
        <section>
          <h2 className="text-3xl font-extrabold mb-6">🗓 Weekly Schedule</h2>

          {/* Day Selector */}
          <div className="flex flex-wrap gap-3 mb-6">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                  selectedDay === day
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent shadow-lg'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-600 hover:bg-zinc-700 hover:border-blue-400'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Carousel Schedule */}
          {loading ? (
            <p className="text-zinc-400">Loading schedule...</p>
          ) : filteredSchedule.length === 0 ? (
            <p className="text-zinc-500 italic">No anime airing on {selectedDay}</p>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-5 min-w-full pb-4">
                {filteredSchedule.map((anime) => {
                  const { airingAt, episode } = anime.nextAiringEpisode || {}
                  const dateText = airingAt
                    ? format(fromUnixTime(airingAt), 'eeee, MMM d • HH:mm', { locale: localeID })
                    : 'Unknown'

                  return (
                    <Link
                      key={anime.id}
                      href={`/anime/${anime.id}`}
                      className="relative w-[180px] shrink-0 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl overflow-hidden transform hover:scale-[1.05] transition-all duration-300 border border-zinc-700 hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-lg"
                    >
                      <Image
                        src={anime.coverImage.large}
                        alt={anime.title.english || anime.title.romaji}
                        width={200}
                        height={280}
                        className="w-full h-52 object-cover"
                      />
                      <div className="p-3 space-y-1">
                        <h3 className="text-sm font-semibold truncate">
                          {anime.title.english || anime.title.romaji}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          Ep {episode} •{' '}
                          <span className="text-blue-400">{dateText}</span>
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* UPCOMING ANIME */}
        <section>
          <h1 className="text-3xl font-extrabold mb-6">🎬 Upcoming Anime</h1>
          {loading ? (
            <p className="text-zinc-400">Loading upcoming anime...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {upcomingAnime.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="group bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl overflow-hidden border border-zinc-700 hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-lg transform hover:scale-[1.03] transition-all duration-300"
                >
                  <div className="relative">
                    <Image
                      src={anime.coverImage.large}
                      alt={anime.title.english || anime.title.romaji}
                      width={300}
                      height={400}
                      className="w-full h-48 object-cover group-hover:brightness-110 transition"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                      Soon
                    </div>
                  </div>
                  <div className="p-3">
                    <h2 className="text-sm font-semibold line-clamp-2">
                      {anime.title.english || anime.title.romaji}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
