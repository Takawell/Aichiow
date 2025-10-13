import { fetchFromAnilist } from "./anilist"

export async function fetchManhuaList(page = 1, perPage = 20) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: MANGA
          countryOfOrigin: CN
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
            color
          }
          bannerImage
          description(asHtml: false)
          genres
          averageScore
          status
          chapters
          volumes
          startDate {
            year
            month
            day
          }
          countryOfOrigin
          format
          isAdult
        }
      }
    }
  `

  const variables = { page, perPage }
  const data = await fetchFromAnilist(query, variables)
  return data.Page.media
}

export async function fetchManhuaDetail(id: number) {
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
        coverImage {
          large
          color
        }
        bannerImage
        genres
        averageScore
        popularity
        chapters
        volumes
        status
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        countryOfOrigin
        format
        staff(sort: FAVOURITES_DESC, perPage: 5) {
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
          }
        }
        characters(sort: FAVOURITES_DESC, perPage: 10) {
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
          }
        }
      }
    }
  `
  const variables = { id }
  const data = await fetchFromAnilist(query, variables)
  return data.Media
}

export async function searchManhua(search: string, page = 1, perPage = 20) {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: MANGA
          countryOfOrigin: CN
          search: $search
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
          }
          averageScore
          chapters
          genres
          status
        }
      }
    }
  `
  const variables = { search, page, perPage }
  const data = await fetchFromAnilist(query, variables)
  return data.Page.media
}

export async function fetchTopManhua(perPage = 10) {
  const query = `
    query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(
          type: MANGA
          countryOfOrigin: CN
          sort: SCORE_DESC
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          averageScore
          genres
          chapters
        }
      }
    }
  `
  const variables = { perPage }
  const data = await fetchFromAnilist(query, variables)
  return data.Page.media
}

export async function fetchTrendingManhua(perPage = 10) {
  const query = `
    query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(
          type: MANGA
          countryOfOrigin: CN
          sort: TRENDING_DESC
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          averageScore
          genres
        }
      }
    }
  `
  const variables = { perPage }
  const data = await fetchFromAnilist(query, variables)
  return data.Page.media
}
