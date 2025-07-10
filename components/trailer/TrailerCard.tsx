import { Anime } from '@/types/anime'

interface Props {
  anime: Anime
}

export default function TrailerCard({ anime }: Props) {
  if (!anime.trailer || anime.trailer.site !== 'youtube') return null

  const url = `https://www.youtube.com/embed/${anime.trailer.id}`

  return (
    <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-lg">
      <div className="aspect-[16/9]">
        <iframe
          src={url}
          title={anime.title.romaji}
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">
          {anime.title.english || anime.title.romaji}
        </h3>
        <p className="text-sm text-neutral-400">
          {anime.genres?.slice(0, 2).join(', ')}
        </p>
      </div>
    </div>
  )
}

