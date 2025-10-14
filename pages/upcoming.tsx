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

  const listItem = {
    hidden: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  }

  const stagger = {
    hidden: { transition: { staggerChildren: 0.01 } },
    enter: { transition: { staggerChildren: 0.03 } },
  }

  return (
    <>
      <Head>
        <title>Anime Schedule & Upcoming | Aichiow</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#0b0f16] via-[#07101a] to-[#05060a] text-white px-4 md:px-10 py-12 max-w-7xl mx-auto">
        <div className="backdrop-blur-sm bg-white/3 rounded-2xl p-6 md:p-10 shadow-2xl border border-white/6">

          <section className="mb-12">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-extrabold">
                <span className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-black shadow-md">
                  <AiOutlineCalendar />
                </span>
                Weekly Schedule
              </h2>

              <div className="text-sm text-zinc-400 hidden sm:block">Updated live — curated from Anilist</div>
            </div>

            <motion.div className="flex flex-wrap gap-3 mb-6" initial="hidden" animate="enter" variants={stagger}>
              {days.map((day) => (
                <motion.button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: selectedDay === day ? 1.02 : 1, opacity: 1 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${selectedDay === day
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-transparent shadow-lg'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700'
                    }`}
                >
                  {day.substring(0,3)}
                </motion.button>
              ))}
            </motion.div>

            <div className="">
              {loading ? (
                <div className="grid grid-cols-1 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white/2 to-white/1 border border-white/4 animate-pulse">
                      <div className="w-14 h-20 bg-zinc-700 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/2 bg-zinc-700 rounded" />
                        <div className="h-3 w-1/3 bg-zinc-700 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredSchedule.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-zinc-400 italic"
                >
                  No anime airing on {selectedDay}
                </motion.p>
              ) : (
                <motion.div initial="hidden" animate="enter" variants={stagger} className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {filteredSchedule.map((anime) => {
                      const { airingAt, episode } = anime.nextAiringEpisode || {}
                      const dateText = airingAt
                        ? format(fromUnixTime(airingAt), 'eeee, MMM d • HH:mm', { locale: localeID })
                        : 'Unknown'

                      return (
                        <motion.div
                          key={anime.id}
                          variants={listItem}
                          initial="hidden"
                          animate="enter"
                          exit="exit"
                        >
                          <Link href={`/anime/${anime.id}`}>
                            <motion.a
                              layout
                              whileHover={{ scale: 1.01 }}
                              className="flex items-center gap-4 p-4 bg-gradient-to-r from-zinc-900/80 to-zinc-900/60 rounded-xl border border-zinc-800 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 transition-all"
                            >
                              <div className="relative w-14 h-20 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={anime.coverImage.large}
                                  alt={anime.title.english || anime.title.romaji}
                                  fill
                                  sizes="(max-width: 768px) 56px, 80px"
                                  className="object-cover"
                                />
                              </div>

                              <div className="flex-1 flex flex-col justify-between min-w-0">
                                <h3 className="text-sm font-semibold max-w-[70%] truncate">
                                  {anime.title.english || anime.title.romaji}
                                </h3>
                                <p className="flex items-center gap-2 text-zinc-400 text-xs">
                                  <FaRegClock className="text-blue-400" />
                                  <span>Episode {episode}</span>
                                  <span className="mx-1">•</span>
                                  <span className="text-blue-400 truncate">{dateText}</span>
                                </p>
                              </div>

                              <div className="text-xs text-zinc-400 hidden sm:block">Tap to open</div>
                            </motion.a>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-extrabold">
                <span className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-black shadow-md">
                  <BiMoviePlay />
                </span>
                Upcoming Anime
              </h1>

              <div className="text-sm text-zinc-400">Showing {upcomingAnime.length} titles</div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 p-4 animate-pulse h-60" />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
              >
                {upcomingAnime.map((anime) => (
                  <Link key={anime.id} href={`/anime/${anime.id}`}>
                    <motion.a
                      layout
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.99 }}
                      className="group bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl overflow-hidden border border-zinc-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-600/20 transform transition-all duration-300"
                    >
                      <div className="relative w-full h-48 md:h-56 lg:h-60">
                        <Image
                          src={anime.coverImage.large}
                          alt={anime.title.english || anime.title.romaji}
                          fill
                          sizes="(max-width: 640px) 100vw, 300px"
                          className="object-cover group-hover:brightness-110 transition-all"
                        />

                        <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-black text-xs px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                          <AiOutlineCalendar />
                          <span>Soon</span>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="p-3">
                        <h2 className="text-sm md:text-base font-semibold line-clamp-2">
                          {anime.title.english || anime.title.romaji}
                        </h2>
                      </div>
                    </motion.a>
                  </Link>
                ))}
              </motion.div>
            )}
          </section>

        </div>
      </main>
    </>
  )
}
