// pages/upcoming.tsx
'use client'

import { useEffect, useState } from 'react'
import { Anime } from '@/types/anime'
import { fetchUpcomingAnime, fetchScheduleAnime } from '@/lib/anilist'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

export default function UpcomingPage() {
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([])
  const [scheduleAnime, setScheduleAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [upcoming, schedule] = await Promise.all([
          fetchUpcomingAnime(),
          fetchScheduleAnime(),
        ])
        setUpcomingAnime(upcoming)
        setScheduleAnime(schedule)
      } catch (error) {
        console.error('[Upcoming Page Error]', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <main className="px-4 md:px-8 py-10 max-w-7xl mx-auto text-white">
      {/* UPCOMING */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold mb-6">🎬 Upcoming Anime</h1>
        {loading ? (
          <p className="text-zinc-400">Loading upcoming anime...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {upcomingAnime.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.id}`}
                className="bg-zinc-900 rounded-xl overflow-hidden shadow hover:shadow-blue-600/40 transition"
              >
                <Image
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  width={300}
                  height={400}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg truncate">
                    {anime.title.english || anime.title.romaji}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">Coming Soon</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* SCHEDULE */}
      <section>
        <h2 className="text-3xl font-bold mb-6">📅 Weekly Schedule</h2>
        {loading ? (
          <p className="text-zinc-400">Loading schedule...</p>
        ) : (
          <div className="space-y-6">
            {scheduleAnime.map((anime) => {
              const airingTime = anime.nextAiringEpisode?.airingAt
              const airingDate = airingTime
                ? format(new Date(airingTime * 1000), 'eeee, HH:mm')
                : 'TBA'

              return (
                <div
                  key={anime.id}
                  className="flex items-center bg-zinc-800 p-4 rounded-xl shadow hover:shadow-blue-500/30 transition"
                >
                  <Image
                    src={anime.coverImage.large}
                    alt={anime.title.romaji}
                    width={80}
                    height={100}
                    className="rounded-md w-20 h-28 object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold">
                      {anime.title.english || anime.title.romaji}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      Episode {anime.nextAiringEpisode?.episode || '?'} airs on {airingDate}
                    </p>
                  </div>
                  <Link
                    href={`/anime/${anime.id}`}
                    className="text-blue-400 hover:underline text-sm"
                  >
                    Details →
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
