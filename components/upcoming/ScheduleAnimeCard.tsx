import { Anime } from '@/types/anime'
import Image from 'next/image'
import Link from 'next/link'

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
    <Link href={`/anime/${anime.id}`}>
      <div
        className="bg-zinc-900 rounded-xl overflow-hidden shadow hover:shadow-lg hover:scale-[1.02] transition duration-300"
        title={`Episode ${episode} airs at ${airingDate?.toLocaleString()}`}
      >
        {/* Cover */}
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

        {/* Detail */}
        <div className="p-2">
          <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2">
            {title}
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Ep {episode} · {localTime}
          </p>
        </div>
      </div>
    </Link>
  )
}
