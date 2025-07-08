import { Anime } from '@/types/anime'
import UpcomingAnimeCard from './UpcomingAnimeCard'

export default function UpcomingAnimeGrid({ animeList }: { animeList: Anime[] }) {
  if (!animeList || animeList.length === 0) {
    return <p className="text-zinc-500">No upcoming anime found.</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {animeList.map((anime) => (
        <UpcomingAnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  )
}
