// components/upcoming/UpcomingAnimeCard.tsx
import { Anime } from '@/types/anime'
import Image from 'next/image'
import Link from 'next/link'

export default function UpcomingAnimeCard({ anime }: { anime: Anime }) {
  const title = anime.title.english || anime.title.romaji || 'Untitled'
  const cover = anime.coverImage?.large

  return (
    <Link href={`/anime/${anime.id}`}>
      <div className="bg-zinc-900 rounded-xl overflow-hidden shadow hover:shadow-lg hover:scale-[1.02] transition duration-300">
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
          <h3 className="text-sm font-semibold text-white line-clamp-2">{title}</h3>
        </div>
      </div>
    </Link>
  )
}
