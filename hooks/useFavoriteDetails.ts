'use client'

import { useEffect, useState } from 'react'
import { fetchAnimeDetail } from '@/lib/anilist'
import { fetchLightNovelDetail } from '@/lib/anilistLightNovel'
import { fetchManhwaDetail } from '@/lib/anilistManhwa'
import { fetchMangaDetail } from '@/lib/mangadex'
import { FavoriteRow } from '@types/supabase'

export type FavoriteDetail = {
  id: string
  media_type: FavoriteRow['media_type']
  title: string
  coverImage: string
}

export function useFavoriteDetails(favorites: FavoriteRow[]) {
  const [details, setDetails] = useState<FavoriteDetail[]>([])
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
            let data: any = null
            switch (fav.media_type) {
              case 'anime':
                data = await fetchAnimeDetail(Number(fav.media_id))
                return {
                  id: fav.media_id,
                  media_type: fav.media_type,
                  title: data?.title?.romaji ?? data?.title?.english ?? 'Unknown',
                  coverImage: data?.coverImage?.large ?? '/default.png',
                }
              case 'light_novel':
                data = await fetchLightNovelDetail(Number(fav.media_id))
                return {
                  id: fav.media_id,
                  media_type: fav.media_type,
                  title: data?.title?.romaji ?? data?.title?.english ?? 'Unknown',
                  coverImage: data?.coverImage?.large ?? '/default.png',
                }
              case 'manhwa':
                data = await fetchManhwaDetail(Number(fav.media_id))
                return {
                  id: fav.media_id,
                  media_type: fav.media_type,
                  title: data?.title?.romaji ?? data?.title?.english ?? 'Unknown',
                  coverImage: data?.coverImage?.large ?? '/default.png',
                }
              case 'manga':
                data = await fetchMangaDetail(fav.media_id.toString())
                return {
                  id: fav.media_id,
                  media_type: fav.media_type,
                  title: data?.title ?? 'Unknown',
                  coverImage: data?.coverUrl ?? '/default.png',
                }
              default:
                return null
            }
          } catch (err) {
            console.error(`Error fetching ${fav.media_type} detail:`, err)
            return null
          }
        })
      )

      setDetails(results.filter(Boolean) as FavoriteDetail[])
      setLoading(false)
    }

    fetchDetails()
  }, [favorites])

  return { details, loading }
}
