import { Anime } from '@/types/anime'
import { groupByDayName } from '@/utils/time'
import Image from 'next/image'

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
            {list.map((anime) => {
              const title = anime.title.english || anime.title.romaji || 'Untitled'
              const cover = anime.coverImage?.large
              const airingAt = anime.nextAiringEpisode?.airingAt
              const episode = anime.nextAiringEpisode?.episode
              const date = airingAt ? new Date(airingAt * 1000).toLocaleString() : 'Unknown'

              return (
                <div
                  key={anime.id}
                  className="bg-zinc-900 rounded-xl overflow-hidden shadow hover:shadow-xl hover:scale-[1.02] transition duration-300"
                  title={`Episode ${episode} airs at ${date}`}
                >
                  <div className="relative w-full aspect-[3/4]">
                    {cover && (
                      <Image
                        src={cover}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="text-sm text-white font-medium line-clamp-2">{title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">Ep {episode} · {new Date(airingAt * 1000).toLocaleTimeString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
