import { Anime } from '@/types/anime'
import AnimeCard from 'components/anime/AnimeCard'

interface Props {
  anime: Anime[] | undefined
}

export default function NowAiringSection({ anime }: Props) {
  if (!anime) return null

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold text-white mb-4">📡 Now Airing</h2>
      <div className="flex gap-4 overflow-x-auto scroll-smooth">
        {anime.slice(0, 10).map((item) => (
          <AnimeCard key={item.id} anime={item} />
        ))}
      </div>
    </div>
  )
}
