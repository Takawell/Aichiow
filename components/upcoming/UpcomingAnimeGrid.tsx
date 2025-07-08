import UpcomingAnimeCard from './UpcomingAnimeCard'
import { Anime } from '@/types/anime'

export default function UpcomingAnimeGrid({ animeList }: { animeList: Anime[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {animeList.map((anime) => (
        <UpcomingAnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  )
}
