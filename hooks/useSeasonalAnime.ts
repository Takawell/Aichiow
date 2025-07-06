// hooks/useSeasonalAnime.ts
import { useQuery } from '@tanstack/react-query'
import { Anime } from '@/types/anime'
import { fetchAnimeList } from '@/lib/anilist'

export function useSeasonalAnime() {
  return useQuery<Anime[]>({
    queryKey: ['seasonalAnime'],
    queryFn: async () => {
      const query = `
        query {
          Page(perPage: 12) {
            media(type: ANIME, season: SUMMER, seasonYear: 2025, sort: POPULARITY_DESC) {
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
