import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Anime } from '@/types/anime'
import { fetchUpcomingAnime, fetchScheduleAnime } from '@/lib/anilist'
import Image from 'next/image'
import Link from 'next/link'
import { format, fromUnixTime } from 'date-fns'
import { id as localeID } from 'date-fns/locale'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FaRegClock } from 'react-icons/fa'
import { BiMoviePlay } from 'react-icons/bi'
import { motion, AnimatePresence } from 'framer-motion'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function CardSkeleton({ type }: { type: 'schedule' | 'upcoming' }) {
  if (type === 'schedule') {
    return (
      <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 animate-pulse">
        <div className="w-14 h-20 bg-zinc-700 rounded-md" />
        <div className="flex flex-col gap-2">
          <div className="w-40 h-3 bg-zinc-700 rounded" />
          <div className="w-28 h-3 bg-zinc-700 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-zinc-700" />
      <div className="p-3 space-y-2">
        <div className="w-3/4 h-3 bg-zinc-700 rounded" />
        <div className="w-1/2 h-3 bg-zinc-700 rounded" />
      </div>
    </div>
  )
}

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
      <main className="px-4 md:px-10 py-10 text-white max-w-7xl mx-auto">
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.h2
            className="flex items-center gap-2 text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <AiOutlineCalendar className="text-blue-500" /> Weekly Schedule
          </motion.h2>

          <motion.div
            className="flex flex-wrap gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {days.map((day) => (
              <motion.button
                key={day}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-full border text-sm font-medium shadow-sm
                  ${selectedDay === day
                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-600 hover:bg-zinc-700'
                  } transition-all duration-300`}
              >
                {day}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <CardSkeleton key={i} type="schedule" />
                ))}
              </motion.div>
            ) : filteredSchedule.length === 0 ? (
              <motion.p
                key="empty"
                className="text-zinc-500 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No anime airing on {selectedDay}
              </motion.p>
            ) : (
              <motion.div
                key="data"
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
              >
                {filteredSchedule.map((anime) => {
                  const { airingAt, episode } = anime.nextAiringEpisode || {}
                  const dateText = airingAt
                    ? format(fromUnixTime(airingAt), 'eeee, MMM d • HH:mm', { locale: localeID })
                    : 'Unknown'

                  return (
                    <motion.div
                      key={anime.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <Link
                        href={`/anime/${anime.id}`}
                        className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <Image
                          src={anime.coverImage.large}
                          alt={anime.title.english || anime.title.romaji}
                          width={60}
                          height={80}
                          className="w-14 h-20 object-cover rounded-md"
                        />
                        <div className="flex flex-col justify-between">
                          <h3 className="text-sm font-semibold max-w-[180px] truncate">
                            {anime.title.english || anime.title.romaji}
                          </h3>
                          <p className="flex items-center gap-1 text-zinc-400 text-xs">
                            <FaRegClock className="text-blue-400" />
                            Episode {episode} • <span className="text-blue-400">{dateText}</span>
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        >
          <h1 className="flex items-center gap-2 text-3xl font-extrabold mb-6">
            <BiMoviePlay className="text-blue-500" /> Upcoming Anime
          </h1>

          {loading ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <CardSkeleton key={i} type="upcoming" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {upcomingAnime.map((anime) => (
                <motion.div
                  key={anime.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <Link
                    href={`/anime/${anime.id}`}
                    className="group bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl overflow-hidden border border-zinc-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-[1.03] transition-all duration-300"
                  >
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                      <div className="relative">
                        <Image
                          src={anime.coverImage.large}
                          alt={anime.title.english || anime.title.romaji}
                          width={300}
                          height={400}
                          className="w-full h-48 object-cover group-hover:brightness-110 transition duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                          <AiOutlineCalendar /> Soon
                        </div>
                      </div>
                      <div className="p-3">
                        <h2 className="text-sm font-semibold line-clamp-2">
                          {anime.title.english || anime.title.romaji}
                        </h2>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>
      </main>
    </>
  )
}
