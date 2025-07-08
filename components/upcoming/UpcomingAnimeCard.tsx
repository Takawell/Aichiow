import Image from 'next/image'
import { Anime } from '@/types/anime'

export default function UpcomingAnimeCard({ anime }: { anime: Anime }) {
  const title = anime.title.english || anime.title.romaji || 'Untitled'
  const cover = anime.coverImage?.large

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition duration-300">
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
        <h3 className="text-sm font-medium text-white">{title}</h3>
      </div>
    </div>
  )
}
