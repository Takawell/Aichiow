// hooks/useSearchAnime.ts
import useSWR from 'swr'
import { fetchFromAnilist } from '@/lib/anilist'
import { SEARCH_ANIME_QUERY } from '@/graphql/queries'
import { Anime } from '@/types/anime'

interface SearchResponse {
  Page: {
    media: Anime[]
  }
}

export function useSearchAnime(search: string) {
  const { data, error, isLoading } = useSWR<SearchResponse>(
    search ? ['SEARCH_ANIME', search] : null,
    () => fetchFromAnilist(SEARCH_ANIME_QUERY, { search }),
  )

  return {
    anime: data?.Page.media ?? [],
    isLoading,
    isError: error,
  }
}
