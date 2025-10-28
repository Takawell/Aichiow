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

export async function fetchAnimeDetail(id: number): Promise<any> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
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
        format
        status
        episodes
        duration
        season
        seasonYear
        popularity
        nextAiringEpisode {
          airingAt
          episode
        }
        trailer {
          id
          site
        }
        studios {
          nodes {
            name
          }
        }
        characters(sort: [ROLE, RELEVANCE], perPage: 10) {
          edges {
            role
            node {
              name {
                full
              }
              image {
                large
              }
            }
            voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
        streamingEpisodes {
          title
          url
          site
          thumbnail
        }
      }
    }
  `

  const variables = { id }
  const data = await fetchFromAnilist(query, variables)
  return data?.Media
}

export async function fetchNewsAnime(): Promise<Anime[]> {
  const query = `
    query {
      Page(perPage: 10) {
        media(type: ANIME, sort: UPDATED_AT_DESC) {
          id
          title {
            romaji
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

export async function fetchTrendingAnimePaginated(page = 1, perPage = 20): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
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
        }
      }
    }
  `

  const variables = { page, perPage }
  const data = await fetchFromAnilist(query, variables)
  return data.Page.media
}

export async function fetchSimilarAnime(id: number): Promise<Anime[]> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        recommendations(perPage: 10, sort: RATING_DESC) {
          edges {
            node {
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                genres
                averageScore
              }
            }
          }
        }
      }
    }
  `

  const variables = { id }
  const data = await fetchFromAnilist(query, variables)

  return (
    data?.Media?.recommendations?.edges
      ?.map((e: any) => e.node.mediaRecommendation)
      ?.filter(Boolean) || []
  )
}

export async function fetchAnimeByGenre(
  genre: string,
  page = 1,
  isAdult = false
): Promise<Anime[]> {
  const query = `
    query ($genre: String, $page: Int, $isAdult: Boolean) {
      Page(page: $page, perPage: 20) {
        media(
          genre_in: [$genre],
          type: ANIME,
          isAdult: $isAdult,
          sort: [START_DATE_DESC, POPULARITY_DESC]
        ) {
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
            thumbnail
          }
          nextAiringEpisode {
            airingAt
            episode
          }
          startDate {
            year
            month
            day
          }
          status
        }
      }
    }
  `

  const variables = {
    genre: genre.replace(/-/g, ' '),
    page,
    isAdult
  }

  const data = await fetchFromAnilist(query, variables)
  return data.Page.media || []
}
