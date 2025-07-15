import Image from 'next/image'
import Link from 'next/link'
import { getCoverImage } from '@/lib/mangadex'
import { cn } from '@/utils/cn'

interface MangaCardProps {
  id: string
  title: string
  coverFileName: string
  chaptersCount?: number
}

export default function MangaCard({
  id,
  title,
  coverFileName,
  chaptersCount
}: MangaCardProps) {
  const fallbackCover = '/default-cover.jpg'

  const imageUrl = coverFileName
    ? getCoverImage(id, coverFileName)
    : fallbackCover

  return (
    <Link
      href={`/manga/${id}`}
      className="group block transition-transform duration-300 hover:scale-105"
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-xl bg-zinc-900 border border-zinc-800 group-hover:border-indigo-500/60 group-hover:shadow-indigo-500/30 transition-all duration-300">
        {/* IMAGE */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 20vw"
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* CHAPTER COUNT */}
        {chaptersCount !== undefined && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 backdrop-blur-md bg-black/50 text-white text-xs rounded-full shadow">
            📖 {chaptersCount} ch
          </div>
        )}
      </div>

      {/* TITLE */}
      <h3 className="mt-2 text-sm font-semibold text-center text-zinc-100 group-hover:text-indigo-400 transition-colors duration-300 truncate">
        {title}
      </h3>
    </Link>
  )
}
