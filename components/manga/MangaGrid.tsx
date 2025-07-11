import { getLocalizedTitle, getCoverImage } from '@/lib/mangadex'
import MangaCard from './MangaCard'

interface MangaGridProps {
  mangaList: any[]
}

export default function MangaGrid({ mangaList }: MangaGridProps) {
  if (!mangaList || mangaList.length === 0) {
    return <p className="text-zinc-400">⚠️ No manga to display.</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      {mangaList.map((manga) => {
        const title = getLocalizedTitle(manga.attributes.title)
        const cover = manga.relationships.find((rel: any) => rel.type === 'cover_art')
        const coverFileName = cover?.attributes?.fileName || ''

        if (!coverFileName) return null // penting

        return (
          <MangaCard
            key={manga.id}
            id={manga.id}
            title={title}
            coverFileName={coverFileName}
          />
        )
      })}
    </div>
  )
}
