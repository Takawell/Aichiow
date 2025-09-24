import { useQuery } from "@tanstack/react-query";
import { fetchAnimeEpisodes } from "@/lib/anilist"; 
import { useAnimeDetail } from "@/hooks/useAnimeDetail";

export interface AnimeEpisode {
  id: number;
  number: number;
  title?: string;
  description?: string;
  airingAt?: number;
}

export function useAnimeEpisodes(id: number) {
  const { anime } = useAnimeDetail(id);

  const { data: episodes = [], isLoading, isError } = useQuery(
    ["animeEpisodes", id],
    () => fetchAnimeEpisodes(id),
    {
      enabled: !!anime,
    }
  );

  return { episodes, isLoading, isError };
}
