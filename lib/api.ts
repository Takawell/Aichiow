// lib/api.ts
import { Anime } from '@/types/anime'

export async function fetchAnimeByGenre(genre: string, page = 1): Promise<Anime[]> {
  const query = `
    query ($genre: String, $page: Int) {
      Page(page: $page, perPage: 20) {
        media(genre_in: [$genre], type: ANIME, isAdult: false) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
            color
          }
          bannerImage
          genres
          averageScore
          description
          trailer {
            id
            site
          }
          nextAiringEpisode {
            airingAt
            episode
          }
        }
      }
    }
  `

  const variables = {
    genre: genre.replace(/-/g, ' '),
    page
  }

  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ query, variables })
  })

  const json = await res.json()
  return json.data?.Page?.media || []
}
