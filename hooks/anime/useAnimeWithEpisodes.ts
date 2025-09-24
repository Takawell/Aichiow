import useSWR from "swr";
import { useAnimeDetail } from "./useAnimeDetail";
import { searchZoro, getZoroEpisodes } from "@/lib/consumet";

export function useAnimeWithEpisodes(id: number) {
  const { anime, isLoading: loadingDetail, isError } = useAnimeDetail(id);

  const { data: zoroData, error: zoroError, isLoading: loadingZoro } = useSWR(
    anime ? ["zoroSearch", anime.title.romaji || anime.title.english] : null,
    async ([, query]) => {
      const search = await searchZoro(query);
      if (!search || !search.id) return null;
      const episodes = await getZoroEpisodes(search.id);
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
