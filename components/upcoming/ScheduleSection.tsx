import { formatTime, getWeekday, groupByWeekday } from '@/utils/time'
import { Anime } from '@/types/anime'

export default function ScheduleSection({ animeList }: { animeList: Anime[] }) {
  const grouped = groupByWeekday(animeList)

  const orderedDays = [
    'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold mb-6">📅 Weekly Airing Schedule</h2>
      <div className="space-y-6">
        {orderedDays.map((day) => {
          const animeDay = grouped[day]
          if (!animeDay || animeDay.length === 0) return null

          return (
            <div key={day}>
              <h3 className="text-lg font-semibold mb-2">🗓️ {day}</h3>
              <ul className="space-y-1 pl-4">
                {animeDay.map((anime) => (
                  <li key={anime.id} className="text-sm text-zinc-300">
                    {anime.title.english || anime.title.romaji} (Ep {anime.nextAiringEpisode?.episode}) @ {formatTime(anime.nextAiringEpisode.airingAt)}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
