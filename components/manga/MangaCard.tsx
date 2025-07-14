import Image from 'next/image'
import Link from 'next/link'
import { getCoverImage } from '@/lib/mangadex'
import { cn } from '@/lib/utils' // optional helper

interface MangaCardProps {
  id: string
  title: string
  coverFileName: string
  status?: 'ongoing' | 'completed'
  chaptersCount?: number
}

export default function MangaCard({
  id,
  title,
  coverFileName,
  status = 'ongoing',
  chaptersCount
}: MangaCardProps) {
  const fallbackCover = '/default-cover.jpg'

  const imageUrl = coverFileName
    ? getCoverImage(id, coverFileName)
    : fallbackCover

  const statusColor =
    status === 'completed' ? 'bg-green-600' : 'bg-yellow-500'

  return (
    <Link
      href={`/manga/${id}`}
      className="group block hover:scale-[1.03] transition-transform duration-300"
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl shadow-md bg-zinc-900">
        {/* IMAGE */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:opacity-90 transition duration-300"
          sizes="(max-width: 768px) 50vw, 20vw"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

        {/* STATUS BADGE */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 text-xs text-white rounded-full ${statusColor}`}>
          {status === 'completed' ? '✅ Completed' : '🌀 Ongoing'}
        </div>

        {/* CHAPTER COUNT */}
        {chaptersCount !== undefined && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full">
            📖 {chaptersCount} ch
          </div>
        )}
      </div>

      {/* TITLE */}
      <h3 className="mt-2 text-sm font-semibold text-center text-zinc-100 truncate">
        {title}
      </h3>
    </Link>
  )
}
