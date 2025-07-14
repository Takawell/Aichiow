'use client'

import { Manga } from "@/types/manga"
import MangaCard from "./MangaCard"

interface Props {
  title: string
  mangas: Manga[]
  icon?: string
}

export const MangaSection = ({ title, mangas, icon }: Props) => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mangas.map((manga) => (
          <MangaCard
            key={manga.id}
            id={manga.id}
            title={manga.title}
            coverFileName={manga.coverFileName}
          />
        ))}
      </div>
    </section>
  )
}
