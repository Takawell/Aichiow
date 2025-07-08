// components/upcoming/ScheduleSection.tsx
import { Anime } from '@/types/anime'
import { groupByDayName } from '@/utils/time'
import ScheduleAnimeCard from './ScheduleAnimeCard' // ✅ Tambahkan ini

export default function ScheduleSection({ animeList }: { animeList: Anime[] }) {
  const grouped = groupByDayName(animeList)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">📅 Weekly Schedule</h2>
      {Object.entries(grouped).map(([day, list]) => (
        <div key={day} className="mb-10">
          <h3 className={`text-lg font-semibold mb-3 ${day === today ? 'text-blue-400' : 'text-white'}`}>
            {day === today ? '📅 Today' : day}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {list.map((anime) => (
              <ScheduleAnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
