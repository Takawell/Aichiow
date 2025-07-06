// hooks/useTrendingAnime.ts
import useSWR from 'swr'
import { fetchFromAnilist } from '@/lib/anilist'
import { TRENDING_ANIME_QUERY } from '@/graphql/queries'
import { Anime } from '@/types/anime'

interface TrendingAnimeResponse {
  Page: {
    media: Anime[]
  }
}

export function useTrendingAnime(page = 1, perPage = 10) {
  const { data, error, isLoading } = useSWR<TrendingAnimeResponse>(
    ['TRENDING_ANIME', page, perPage],
    () => fetchFromAnilist(TRENDING_ANIME_QUERY, { page, perPage }),
  )

  return {
    anime: data?.Page.media ?? [],
    isLoading,
    isError: error,
  }
}
