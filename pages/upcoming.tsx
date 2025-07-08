import { useEffect, useState } from 'react'
import { Anime } from '@/types/anime'
import { fetchUpcomingAnime, fetchScheduleAnime } from '@/lib/anilist'
import UpcomingAnimeGrid from '@/components/upcoming/UpcomingAnimeGrid'
import ScheduleSection from '@/components/upcoming/ScheduleSection'

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
          fetchScheduleAnime()
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
    <main className="px-4 md:px-8 py-10 max-w-6xl mx-auto text-white">
      <section className="mb-14">
        <h1 className="text-3xl font-bold mb-6">🎬 Upcoming Anime</h1>
        {loading ? (
          <p className="text-zinc-400">Loading upcoming anime...</p>
        ) : (
          <UpcomingAnimeGrid animeList={upcomingAnime} />
        )}
      </section>

      {loading ? (
        <p className="text-zinc-400">Loading schedule...</p>
      ) : (
        <ScheduleSection animeList={scheduleAnime} />
      )}
    </main>
  )
}
