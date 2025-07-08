import axios from 'axios'
import { Anime } from '@/types/anime'

const ANILIST_API = 'https://graphql.anilist.co'

export async function fetchFromAnilist(query: string, variables?: Record<string, any>) {
  try {
    const res = await axios.post(
      ANILIST_API,
      { query, variables },
      { headers: { 'Content-Type': 'application/json' } }
    )
    return res.data.data
  } catch (error: any) {
    console.error('Anilist Error:', error.message)
    throw new Error('Failed to fetch from Anilist')
  }
}

export async function fetchTrendingAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
        media(type: ANIME, sort: TRENDING_DESC) {
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
          trailer {
            id
            site
          }
        }
      }
    }
  `
  const data = await fetchFromAnilist(query)
  return data.Page.media
}

export async function fetchOngoingAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
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
          trailer {
            id
            site
          }
        }
      }
    }
  `
  const data = await fetchFromAnilist(query)
  return data.Page.media
}

export async function fetchSeasonalAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
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
          trailer {
            id
            site
          }
        }
      }
    }
  `
  const data = await fetchFromAnilist(query)
  return data.Page.media
}

export async function fetchTopRatedAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
        media(type: ANIME, sort: SCORE_DESC) {
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
          trailer {
            id
            site
          }
        }
      }
    }
  `
  const data = await fetchFromAnilist(query)
  return data.Page.media
}

export async function fetchMangaCharacters(title: string) {
  const query = `
    query ($search: String) {
      Media(search: $search, type: MANGA) {
        characters(sort: [ROLE, RELEVANCE], perPage: 10) {
          edges {
            role
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
            voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
      }
    }
  `

  const variables = { search: title }
  const data = await fetchFromAnilist(query, variables)

  return data?.Media?.characters?.edges || []
}

// ✅ Tambahan: Upcoming Anime
export async function fetchUpcomingAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 20) {
        media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  `
  const data = await fetchFromAnilist(query)
  return data.Page.media
}

// ✅ Tambahan: Schedule Anime Mingguan
export async function fetchScheduleAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 50) {
        media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          nextAiringEpisode {
            airingAt
            episode
          }
        }
      }
    }
  `
  const data = await fetchFromAnilist(query)
  return data.Page.media.filter((m: any) => m.nextAiringEpisode)
}
