import Image from 'next/image'
import { Anime } from '@/types/anime'

export default function ScheduleAnimeCard({ anime }: { anime: Anime }) {
  const title = anime.title.english || anime.title.romaji || 'Untitled'
  const cover = anime.coverImage?.large
  const airingAt = anime.nextAiringEpisode?.airingAt
  const episode = anime.nextAiringEpisode?.episode
  const airingDate = airingAt ? new Date(airingAt * 1000) : null
  const localTime = airingDate?.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className="bg-zinc-900 rounded-xl overflow-hidden shadow hover:shadow-xl hover:scale-[1.02] transition duration-300"
      title={`Episode ${episode || '?'} airs at ${airingDate?.toLocaleString() || 'TBA'}`}
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
      <div className="p-3">
        <h4 className="text-sm text-white font-semibold line-clamp-2">{title}</h4>
        <p className="text-xs text-zinc-400 mt-1">
          Ep {episode || '?'} · {localTime || 'TBA'}
        </p>
      </div>
    </div>
  )
}
