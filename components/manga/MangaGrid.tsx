import MangaCard from './MangaCard'

interface MangaGridProps {
  mangaList: any[] // data dari fetchPopularManga
}

export default function MangaGrid({ mangaList }: MangaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      {mangaList.map((manga) => {
        const title = manga.attributes.title?.en || manga.attributes.title?.ja || 'Untitled'
        const cover = manga.relationships.find((rel: any) => rel.type === 'cover_art')
        const coverFileName = cover?.attributes?.fileName || ''

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
