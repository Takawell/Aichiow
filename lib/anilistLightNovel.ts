const ANILIST_URL = 'https://graphql.anilist.co'

export async function fetchLightNovelList(page = 1, genre?: string) {
  const query = `
    query ($page: Int, $genre: String) {
      Page(page: $page, perPage: 20) {
        media(type: MANGA, format: NOVEL, sort: TRENDING_DESC, genre: $genre) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
            color
          }
          bannerImage
          averageScore
          description(asHtml: false)
          genres
          status
          format
          volumes
          chapters
          popularity
          source
          countryOfOrigin
          startDate { year month day }
          endDate { year month day }
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

export async function searchLightNovel(search: string) {
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 20) {
        media(type: MANGA, format: NOVEL, search: $search) {
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
          status
          format
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

export async function fetchLightNovelDetail(id: number) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: MANGA, format: NOVEL) {
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
          color
        }
        averageScore
        genres
        status
        format
        volumes
        chapters
        popularity
        source
        countryOfOrigin
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
  const media = data.Media

  const characters = (media.characters?.edges || []).map((edge: any) => ({
    id: edge.node.id,
    name: edge.node.name,
    image: edge.node.image,
    role: edge.role
  }))

  const staff = (media.staff?.edges || []).map((edge: any) => ({
    id: edge.node.id,
    name: edge.node.name,
    image: edge.node.image
  }))

  return {
    ...media,
    characters,
    staff
  }
}

export async function fetchLightNovelGenres() {
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
