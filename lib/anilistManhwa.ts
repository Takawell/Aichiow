const ANILIST_URL = 'https://graphql.anilist.co'

export async function fetchManhwaList(page = 1, genre?: string) {
  const query = `
    query ($page: Int, $genre: String) {
      Page(page: $page, perPage: 20) {
        media(
          type: MANGA
          sort: TRENDING_DESC
          countryOfOrigin: "KR"
          genre: $genre
        ) {
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
        pageInfo {
          total
          currentPage
          lastPage
        }
      }
    }
  `
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { page, genre } })
  })
  const { data } = await response.json()
  return {
    list: data.Page.media,
    totalPages: data.Page.pageInfo.lastPage
  }
}

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

export async function fetchGenres() {
  const query = `
    query {
      GenreCollection
    }
  `
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  const { data } = await response.json()
  return data.GenreCollection
}

export async function fetchManhwaByGenre(page = 1, genre: string) {
  const query = `
    query ($page: Int, $genre: String) {
      Page(page: $page, perPage: 20) {
        media(
          type: MANGA
          countryOfOrigin: "KR"
          genre: $genre
          sort: POPULARITY_DESC
        ) {
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
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
      }
    }
  `
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { page, genre } })
  })
  const { data } = await response.json()
  return {
    list: data.Page.media,
    pageInfo: data.Page.pageInfo
  }
}
