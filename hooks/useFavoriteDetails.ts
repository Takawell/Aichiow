'use client'

import { useEffect, useState } from 'react'
import { fetchAnimeDetail } from '@/lib/anilist'
import { fetchLightNovelDetail } from '@/lib/anilistLightNovel'
import { fetchManhwaDetail } from '@/lib/anilistManhwa'
import { fetchMangaDetail } from '@/lib/mangadex'
import { FavoriteRow } from '@/types/supabase'

export type FavoriteDetail = {
  id: string | number
  title: string
  cover: string
  type: string
}

export function useFavoriteDetails(favorites: FavoriteRow[]) {
  const [details, setDetails] = useState<FavoriteDetail[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setDetails([])
      return
    }

    async function run() {
      setLoading(true)
      try {
        const results = await Promise.all(
          favorites.map(async (fav) => {
            try {
              let data: any
              switch (fav.media_type) {
                case 'anime':
                  data = await fetchAnimeDetail(Number(fav.media_id))
                  return {
                    id: data.id,
                    title: data.title?.romaji ?? data.title?.english ?? 'Untitled',
                    cover: data.coverImage?.large ?? '',
                    type: 'anime',
                  }
                case 'light_novel':
                  data = await fetchLightNovelDetail(Number(fav.media_id))
                  return {
                    id: data.id,
                    title: data.title?.romaji ?? data.title?.english ?? 'Untitled',
                    cover: data.coverImage?.large ?? '',
                    type: 'light-novel',
                  }
                case 'manhwa':
                  data = await fetchManhwaDetail(Number(fav.media_id))
                  return {
                    id: data.id,
                    title: data.title?.romaji ?? data.title?.english ?? 'Untitled',
                    cover: data.coverImage?.large ?? '',
                    type: 'manhwa',
                  }
                case 'manga':
                  data = await fetchMangaDetail(String(fav.media_id))
                  return {
                    id: data.id,
                    title: data.attributes?.title?.en ?? data.attributes?.title?.ja ?? 'Untitled',
                    cover: data.cover ?? '',
                    type: 'manga',
                  }
                default:
                  return null
              }
            } catch (err) {
              console.error(`❌ Error fetching ${fav.media_type} (${fav.media_id}):`, err)
              return null
            }
          })
        )
        setDetails(results.filter(Boolean) as FavoriteDetail[])
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [favorites])

  return { details, loading }
}
