import useSWR from 'swr'
import { fetchFromAnilist } from '@/lib/anilist'
import { ANIME_DETAIL_QUERY } from '@/graphql/queries'
import { AnimeDetail } from '@/types/anime'

interface AnimeDetailResponse {
  Media: AnimeDetail
}

export function useAnimeDetail(id: number) {
  const { data, error, isLoading } = useSWR<AnimeDetailResponse>(
    id ? ['ANIME_DETAIL', id] : null,
    () => fetchFromAnilist(ANIME_DETAIL_QUERY, { id }),
  )

  return {
    anime: data?.Media,
    isLoading,
    isError: error,
  }
}
