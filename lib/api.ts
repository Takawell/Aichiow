import { Anime } from "@/types/anime";

export async function fetchAnimeByGenre(
  genre: string,
  page = 1
): Promise<Anime[]> {
  const query = `
    query ($genre: String, $page: Int) {
      Page(page: $page, perPage: 20) {
        media(
          genre_in: [$genre],
          type: ANIME,
          isAdult: false,
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
  `;

  const variables = {
    genre: genre.replace(/-/g, " "),
    page,
  };

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`[AniList] ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data?.Page?.media || [];
}
