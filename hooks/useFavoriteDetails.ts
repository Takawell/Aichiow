'use client'

import { useEffect, useState } from 'react'
import { fetchAnimeDetail } from '@/lib/anilist'
import { fetchLightNovelDetail } from '@/lib/anilistLightNovel'
import { fetchManhwaDetail } from '@/lib/anilistManhwa'
import { fetchMangaDetail } from '@/lib/mangadex'
import { FavoriteRow } from '@/types/supabase'

export function useFavoriteDetails(favorites: FavoriteRow[]) {
  const [details, setDetails] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setDetails([])
      return
    }

    async function run() {
      setLoading(true)
      const results = await Promise.all(
        favorites.map(async (fav) => {
          try {
            switch (fav.media_type) {
              case 'anime':
                // Anilist expects number
                return await fetchAnimeDetail(fav.media_id)
              case 'light_novel':
                // Anilist expects number
                return await fetchLightNovelDetail(fav.media_id)
              case 'manhwa':
                // Anilist expects number
                return await fetchManhwaDetail(fav.media_id)
              case 'manga':
                // Mangadex expects string
                return await fetchMangaDetail(String(fav.media_id))
              default:
                return null
            }
          } catch (e) {
            console.error(`Error fetching ${fav.media_type} (${fav.media_id})`, e)
            return null
          }
        })
      )

      setDetails(results.filter(Boolean) as any[])
      setLoading(false)
    }

    run()
  }, [favorites])

  return { details, loading }
}
