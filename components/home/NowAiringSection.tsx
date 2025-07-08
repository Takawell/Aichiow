// components/home/NowAiringSection.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Anime } from '@/types/anime'

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
          <Link
            key={item.id}
            href={`/anime/${item.id}`}
            className="min-w-[140px] flex-shrink-0 hover:opacity-80 transition"
          >
            <div className="w-[140px] h-[200px] relative rounded-lg overflow-hidden border border-neutral-700">
              <Image
                src={item.coverImage.large}
                alt={item.title.english || item.title.romaji}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-white mt-2 line-clamp-2">
              {item.title.english || item.title.romaji}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
