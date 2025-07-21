// lib/anilistManhwa.ts
const ANILIST_URL = 'https://graphql.anilist.co'

// Trending Manhwa
export async function fetchManhwaList() {
  const query = `
    query {
      Page(page: 1, perPage: 20) {
        media(type: MANGA, sort: TRENDING_DESC, countryOfOrigin: "KR") {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          averageScore
          description(asHtml: false)
          genres
        }
      }
    }
  `
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })

  const { data } = await response.json()
  return data.Page.media
}

// Search Manhwa
export async function searchManhwa(search: string) {
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 20) {
        media(type: MANGA, search: $search, countryOfOrigin: "KR") {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          bannerImage
          averageScore
          description(asHtml: false)
          genres
        }
      }
    }
  `

  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { search } })
  })

  const { data } = await response.json()
  return data.Page.media
}

// detail
export async function fetchManhwaDetail(id: number) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        id
        title {
          romaji
          english
          native
        }
        description(asHtml: false)
        bannerImage
        coverImage {
          large
          extraLarge
        }
        averageScore
        genres
        status
        format
        startDate { year month day }
        endDate { year month day }
        characters(sort: ROLE, perPage: 10) {
          edges {
            role
            node {
              id
              name { full native }
              image { large }
            }
          }
        }
        staff(perPage: 10) {
          edges {
            node {
              id
              name { full }
              image { large }
            }
          }
        }
      }
    }
  `

  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { id } })
  })

  const { data } = await response.json()
  return data.Media
}
