export const TRENDING_ANIME_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC) {
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
        trailer {
          id
          site
        }
      }
    }
  }
`

export const ANIME_DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
      }
      description(asHtml: false)
      coverImage {
        large
      }
      bannerImage
      format
      season
      seasonYear
      averageScore
      popularity
      genres
      episodes
      duration
      nextAiringEpisode {
        airingAt
        episode
      }
      studios(isMain: true) {
        nodes {
          name
        }
      }
      trailer {
        id
        site
      }
      characters(role: MAIN, page: 1, perPage: 10) {
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
          voiceActors(language: JAPANESE) {
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

export const SEARCH_ANIME_QUERY = `
  query ($search: String) {
    Page(perPage: 20) {
      media(search: $search, type: ANIME) {
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
        trailer {
          id
          site
        }
      }
    }
  }
`

export const UPCOMING_ANIME_QUERY = `
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

export const SCHEDULE_ANIME_QUERY = `
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
