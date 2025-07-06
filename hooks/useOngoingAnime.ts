// hooks/useOngoingAnime.ts
import { useQuery } from '@tanstack/react-query'
import { Anime } from '@/types/anime'
import { fetchAnimeList } from '@/lib/anilist'

export function useOngoingAnime() {
  return useQuery<Anime[]>({
    queryKey: ['ongoingAnime'],
    queryFn: async () => {
      const query = `
        query {
          Page(perPage: 12) {
            media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              bannerImage
              genres
              averageScore
              description
              trailer {
                id
                site
              }
            }
          }
        }
      `
      const data = await fetchAnimeList(query)
      return data?.Page?.media ?? []
    },
  })
}
