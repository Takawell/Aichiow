'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getCoverImage } from '@/lib/mangadex'

interface MangaCardProps {
  id: string
  title: string
  coverFileName: string
}

export default function MangaCard({ id, title, coverFileName }: MangaCardProps) {
  return (
    <Link href={`/manga/${id}`} className="group block hover:scale-105 transition-transform duration-300">
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl shadow-lg bg-zinc-900">
        <Image
          src={getCoverImage(id, coverFileName)}
          alt={title}
          fill
          className="object-cover group-hover:opacity-90"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      </div>
      <h3 className="mt-2 text-sm font-semibold text-center text-zinc-100 truncate">{title}</h3>
    </Link>
  )
}
