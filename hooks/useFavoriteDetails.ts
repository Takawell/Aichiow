'use client'

import { useEffect, useState } from 'react'
import { fetchAnimeDetail } from '@/lib/anilist'
import { fetchLightNovelDetail } from '@/lib/anilistLightNovel'
import { fetchManhwaDetail } from '@/lib/anilistManhwa'
import { fetchMangaDetail } from '@/lib/mangadex'
import { FavoriteRow } from '@types/supabase'

export function useFavoriteDetails(favorites: FavoriteRow[]) {
  const [details, setDetails] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setDetails([])
      return
    }

    async function fetchDetails() {
      setLoading(true)
      const results = await Promise.all(
        favorites.map(async (fav) => {
          try {
            switch (fav.media_type) {
              case 'anime':
                return await fetchAnimeDetail(fav.media_id)
              case 'light_novel':
                return await fetchLightNovelDetail(fav.media_id)
              case 'manhwa':
                return await fetchManhwaDetail(fav.media_id)
              case 'manga':
                return await fetchMangaDetail(fav.media_id)
              default:
                return null
            }
          } catch (err) {
            console.error(`Error fetching ${fav.media_type} detail:`, err)
            return null
          }
        })
      )

      setDetails(results.filter(Boolean))
      setLoading(false)
    }

    fetchDetails()
  }, [favorites])

  return { details, loading }
}
