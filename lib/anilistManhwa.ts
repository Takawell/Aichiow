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

