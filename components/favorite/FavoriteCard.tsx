'use client'

import Image from 'next/image'
import Link from 'next/link'

type FavoriteCardProps = {
  id: string | number
  title: string
  cover: string
  type: string
}

export default function FavoriteCard({ id, title, cover, type }: FavoriteCardProps) {
  return (
    <Link href={`/${type}/${id}`} className="block">
      <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
        <Image
          src={cover}
          alt={title}
          width={200}
          height={280}
          className="object-cover w-full h-[280px]"
        />
        <div className="p-2 text-center bg-gray-900 text-white">
          <h3 className="text-sm font-medium line-clamp-2">{title}</h3>
          <p className="text-xs opacity-70 uppercase">{type}</p>
        </div>
      </div>
    </Link>
  )
}
