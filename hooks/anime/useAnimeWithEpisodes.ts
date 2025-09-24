import useSWR from "swr";
import { useAnimeDetail } from '@/hooks/useAnimeDetail';
import { searchZoro, getZoroEpisodes } from "@/lib/consumet";

export interface ZoroEpisode {
  id: string;
  number: number;
  title?: string;
  url?: string;
}

export function useAnimeWithEpisodes(id: number) {
  const { anime, isLoading: loadingDetail, isError } = useAnimeDetail(id);

  const { data: zoroData, error: zoroError, isLoading: loadingZoro } = useSWR<
    { zoroId: string; episodes: ZoroEpisode[] } | null
  >(
    anime ? ["zoroSearch", anime.title.romaji || anime.title.english || ""] : null,
    async ([, query]) => {
      if (!query) return null; 
      const search = await searchZoro(query as string);
      if (!search || !search.id) return null;
      const episodes: ZoroEpisode[] = await getZoroEpisodes(search.id);
      return { zoroId: search.id, episodes };
    }
  );

  return {
    anime,
    episodes: zoroData?.episodes || [],
    isLoading: loadingDetail || loadingZoro,
    isError: isError || zoroError,
  };
}
