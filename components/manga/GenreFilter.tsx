'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

export const GenreFilter = () => {
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetch("/api/manga/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []))
  }, [])

  return (
    <div className="flex gap-2 overflow-x-auto py-4">
      {genres.map((genre) => (
        <Link
          key={genre.id}
          href={`/manga/genre/${genre.name.toLowerCase()}`}
          className="px-3 py-1 rounded-full bg-muted hover:bg-primary hover:text-white text-sm whitespace-nowrap transition"
        >
          {genre.name}
        </Link>
      ))}
    </div>
  )
}
