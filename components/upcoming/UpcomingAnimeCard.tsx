import Image from 'next/image'
import { Anime } from '@/types/anime'

export default function UpcomingAnimeCard({ anime }: { anime: Anime }) {
  const title = anime.title.english || anime.title.romaji || 'Untitled'
  const cover = anime.coverImage?.large

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition duration-300 relative group">
      <div className="relative w-full aspect-[3/4]">
        {cover && (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-md shadow-sm">
          Coming Soon
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2">{title}</h3>
      </div>
    </div>
  )
}
