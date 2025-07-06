// graphql/queries.ts
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
        bannerImage
        genres
        averageScore
        episodes
        season
        seasonYear
        format
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
      coverImage {
        large
      }
      bannerImage
      description(asHtml: false)
      episodes
      season
      seasonYear
      format
      averageScore
      popularity
      studios {
        nodes {
          name
        }
      }
      trailer {
        id
        site
        thumbnail
      }
      genres
      characters(sort: [ROLE, RELEVANCE], perPage: 8) {
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
            language
          }
        }
      }
    }
  }
`
