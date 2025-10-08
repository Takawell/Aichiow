'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { Anime } from '@/types/anime'
import { fetchUpcomingAnime, fetchScheduleAnime } from '@/lib/anilist'
import Image from 'next/image'
import Link from 'next/link'
import { format, fromUnixTime } from 'date-fns'
import { id as localeID } from 'date-fns/locale'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FaRegClock } from 'react-icons/fa'
import { BiMoviePlay } from 'react-icons/bi'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function UpcomingPage() {
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([])
  const [scheduleAnime, setScheduleAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>(
    format(new Date(), 'EEEE')
  )

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
        <section>
          <motion.h2
            className="flex items-center gap-2 text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AiOutlineCalendar className="text-blue-500" /> Weekly Schedule
          </motion.h2>

          <motion.div
            className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {days.map((day) => (
              <motion.button
                key={day}
                onClick={() => setSelectedDay(day)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full border text-sm font-medium shadow-sm transition-all duration-200
                  ${
                    selectedDay === day
                      ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-600 hover:bg-zinc-700'
                  }`}
              >
                {day}
              </motion.button>
            ))}
          </motion.div>

          <div className="relative min-h-[150px]">
            {loading ? (
              <motion.p
                className="text-zinc-400 text-center py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Loading schedule...
              </motion.p>
            ) : filteredSchedule.length === 0 ? (
              <motion.p
                className="text-zinc-500 italic text-center py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No anime airing on {selectedDay}
              </motion.p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDay}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {filteredSchedule.map((anime) => {
                    const { airingAt, episode } = anime.nextAiringEpisode || {}
                    const dateText = airingAt
                      ? format(fromUnixTime(airingAt), 'eeee, MMM d • HH:mm', {
                          locale: localeID,
                        })
                      : 'Unknown'

                    return (
                      <Link
                        key={anime.id}
                        href={`/anime/${anime.id}`}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl border border-zinc-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                      >
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Image
                            src={anime.coverImage.large}
                            alt={anime.title.english || anime.title.romaji}
                            width={60}
                            height={80}
                            className="w-14 h-20 object-cover rounded-md"
                          />
                        </motion.div>

                        <div className="flex flex-col justify-between">
                          <h3 className="text-sm font-semibold max-w-[180px] truncate">
                            {anime.title.english || anime.title.romaji}
                          </h3>
                          <p className="flex items-center gap-1 text-zinc-400 text-xs">
                            <FaRegClock className="text-blue-400" />
                            Episode {episode} •{' '}
                            <span className="text-blue-400">{dateText}</span>
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        <section>
          <motion.h1
            className="flex items-center gap-2 text-3xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BiMoviePlay className="text-blue-500" /> Upcoming Anime
          </motion.h1>

          {loading ? (
            <motion.p
              className="text-zinc-400 text-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Loading upcoming anime...
            </motion.p>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 },
                },
              }}
            >
              {upcomingAnime.map((anime) => (
                <motion.div
                  key={anime.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={`/anime/${anime.id}`}
                    className="group bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl overflow-hidden border border-zinc-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-[1.03] transition-all duration-300"
                  >
                    <div className="relative">
                      <Image
                        src={anime.coverImage.large}
                        alt={anime.title.english || anime.title.romaji}
                        width={300}
                        height={400}
                        className="w-full h-48 object-cover group-hover:brightness-110 transition"
                      />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <AiOutlineCalendar /> Soon
                      </div>
                    </div>

                    <div className="p-3">
                      <h2 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-400 transition">
                        {anime.title.english || anime.title.romaji}
                      </h2>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>
    </>
  )
}
