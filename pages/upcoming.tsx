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

      <motion.main
        className="px-4 md:px-10 py-10 text-white max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="flex items-center gap-2 text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AiOutlineCalendar className="text-blue-500 animate-pulse" /> Weekly Schedule
          </motion.h2>

          <motion.div
            className="flex flex-wrap gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {days.map((day, index) => (
              <motion.button
                key={day}
                onClick={() => setSelectedDay(day)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`px-4 py-2 rounded-full border text-sm font-medium shadow-sm transition-all
                  ${selectedDay === day
                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/40'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-600 hover:bg-zinc-700'
                  }`}
              >
                {day}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.p
                className="text-zinc-400"
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                Loading schedule...
              </motion.p>
            ) : filteredSchedule.length === 0 ? (
              <motion.p
                className="text-zinc-500 italic"
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                No anime airing on {selectedDay}
              </motion.p>
            ) : (
              <motion.div
                className="space-y-4"
                key={selectedDay}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                {filteredSchedule.map((anime, i) => {
                  const { airingAt, episode } = anime.nextAiringEpisode || {}
                  const dateText = airingAt
                    ? format(fromUnixTime(airingAt), 'eeee, MMM d • HH:mm', { locale: localeID })
                    : 'Unknown'

                  return (
                    <motion.div
                      key={anime.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Link
                        href={`/anime/${anime.id}`}
                        className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                      >
                        <motion.div whileHover={{ rotate: 1.5, scale: 1.05 }} transition={{ duration: 0.2 }}>
                          <Image
                            src={anime.coverImage.large}
                            alt={anime.title.english || anime.title.romaji}
                            width={60}
                            height={80}
                            className="w-14 h-20 object-cover rounded-md"
                          />
                        </motion.div>

                        <motion.div
                          className="flex flex-col justify-between"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 + 0.3 }}
                        >
                          <h3 className="text-sm font-semibold max-w-[180px] truncate hover:text-blue-400 transition">
                            {anime.title.english || anime.title.romaji}
                          </h3>
                          <p className="flex items-center gap-1 text-zinc-400 text-xs">
                            <FaRegClock className="text-blue-400 animate-pulse" />
                            Episode {episode} • <span className="text-blue-400">{dateText}</span>
                          </p>
                        </motion.div>
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
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="flex items-center gap-2 text-3xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BiMoviePlay className="text-blue-500 animate-pulse" /> Upcoming Anime
          </motion.h1>

          {loading ? (
            <motion.p
              className="text-zinc-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
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
              {upcomingAnime.map((anime, i) => (
                <motion.div
                  key={anime.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    show: { opacity: 1, scale: 1 },
                  }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                >
                  <Link
                    href={`/anime/${anime.id}`}
                    className="group bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl overflow-hidden border border-zinc-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transform transition-all duration-300"
                  >
                    <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                      <Image
                        src={anime.coverImage.large}
                        alt={anime.title.english || anime.title.romaji}
                        width={300}
                        height={400}
                        className="w-full h-48 object-cover group-hover:brightness-110 transition"
                      />
                      <motion.div
                        className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <AiOutlineCalendar /> Soon
                      </motion.div>
                    </motion.div>
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
        </motion.section>
      </motion.main>
    </>
  )
}
