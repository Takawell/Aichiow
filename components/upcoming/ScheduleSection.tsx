import { Anime } from '@/types/anime'
import { groupByDayName } from '@/utils/time'
import ScheduleAnimeCard from './ScheduleAnimeCard'

export default function ScheduleSection({ animeList }: { animeList: Anime[] }) {
  const grouped = groupByDayName(animeList)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <section className="text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        📅 <span>Weekly Schedule</span>
      </h2>

      <div className="flex flex-wrap gap-3 mb-10 justify-center sm:justify-start">
        {Object.keys(grouped).map((day) => (
          <div
            key={day}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              day === today ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            {day === today ? '📍 Today' : day}
          </div>
        ))}
      </div>

      {Object.entries(grouped).map(([day, list]) => (
        <div key={day} className="mb-12">
          <h3 className={`text-xl font-semibold mb-4 ${day === today ? 'text-blue-400' : 'text-zinc-200'}`}>
            {day === today ? '🔥 Airing Today' : day}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {list.map((anime) => (
              <ScheduleAnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
