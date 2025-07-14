'use client'

import { useEffect, useState } from 'react'
import {
  fetchPopularManga,
  getMangaByFilter,
  fetchMangaByGenre
} from '@/lib/mangadex'
import { Manga } from '@/types/manga'
import { SearchBar } from '@/components/manga/SearchBar'
import { MangaSection } from '@/components/manga/MangaSection'
import { GenreFilter } from '@/components/manga/GenreFilter'

export default function MangaPage() {
  const [popular, setPopular] = useState<Manga[]>([])
  const [ongoing, setOngoing] = useState<Manga[]>([])
  const [completed, setCompleted] = useState<Manga[]>([])
  const [topRated, setTopRated] = useState<Manga[]>([])
  const [newest, setNewest] = useState<Manga[]>([])
  const [action, setAction] = useState<Manga[]>([])
  const [romance, setRomance] = useState<Manga[]>([])
  const [fantasy, setFantasy] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [
          popularRes,
          ongoingRes,
          completedRes,
          topRatedRes,
          newestRes,
          actionRes,
          romanceRes,
          fantasyRes
        ] = await Promise.all([
          fetchPopularManga(),
          getMangaByFilter({ includedTags: ['ongoing'] }),
          getMangaByFilter({ includedTags: ['completed'] }),
          getMangaByFilter({ includedTags: ['top_rated'] }),
          getMangaByFilter({ includedTags: ['latest'] }),
          fetchMangaByGenre('action'),
          fetchMangaByGenre('romance'),
          fetchMangaByGenre('fantasy')
        ])

        setPopular(popularRes)
        setOngoing(ongoingRes)
        setCompleted(completedRes)
        setTopRated(topRatedRes)
        setNewest(newestRes)
        setAction(actionRes)
        setRomance(romanceRes)
        setFantasy(fantasyRes)
      } catch (err) {
        console.error('Error loading manga:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Explore Manga</h1>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="mb-6">
        <GenreFilter />
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : (
        <>
          <MangaSection title="🔥 Popular Manhwa" layout="horizontal" mangas={popular} />
          <MangaSection title="🌀 Ongoing Series" mangas={ongoing} />
          <MangaSection title="✅ Completed Series" mangas={completed} />
          <MangaSection title="✨ Top Rated" mangas={topRated} />
          <MangaSection title="🆕 Newest Released" mangas={newest} />
          <MangaSection title="⚔️ Action" mangas={action} />
          <MangaSection title="💖 Romance" mangas={romance} />
          <MangaSection title="🧙 Fantasy" mangas={fantasy} />
        </>
      )}
    </main>
  )
}
