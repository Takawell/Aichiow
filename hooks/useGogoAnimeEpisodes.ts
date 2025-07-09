import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useGogoAnimeEpisodes(slug: string | undefined) {
  const shouldFetch = !!slug && slug.trim().length > 0

  const { data, error, isLoading } = useSWR(
    shouldFetch ? `https://api.consumet.org/anime/gogoanime/info/${slug}` : null,
    fetcher
  )

  return {
    episodes: data?.episodes || [],
    isLoading,
    isError: !!error
  }
}
