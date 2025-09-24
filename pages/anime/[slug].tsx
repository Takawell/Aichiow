import { useRouter } from "next/router";
import Head from "next/head";
import { useAnimeDetail } from "@/hooks/useAnimeDetail";
import { useAnimeWithEpisodes, ZoroEpisode } from "@/hooks/anime/useAnimeWithEpisodes";
import { useQuery } from "@tanstack/react-query";
import { fetchSimilarAnime } from "@/lib/anilist";
import AnimeDetailHeader from "@/components/anime/AnimeDetailHeader";
import AnimeTrailer from "@/components/anime/AnimeTrailer";
import CharacterList from "@/components/character/CharacterList";
import AnimeCard from "@/components/anime/AnimeCard";
import { format, fromUnixTime } from "date-fns";
import slugify from "slugify";

export default function AnimeDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const id = parseInt(slug as string);

  const { anime, isLoading, isError } = useAnimeDetail(id);
  const { episodes, isLoading: loadingEpisodes } = useAnimeWithEpisodes(id);

  const { data: similarAnime = [], isLoading: loadingSimilar } = useQuery({
    queryKey: ["similarAnime", id],
    queryFn: () => fetchSimilarAnime(id),
    enabled: !!id,
  });

  if (isLoading) return <p className="text-center text-white mt-10">Loading...</p>;
  if (isError || !anime) return <p className="text-center text-red-500 mt-10">Anime not found.</p>;

  const statusBadgeColor =
    anime.status === "RELEASING"
      ? "bg-green-500"
      : anime.status === "FINISHED"
      ? "bg-blue-500"
      : "bg-gray-500";

  const totalEpisodes = anime.episodes || null;
  const duration = anime.duration || null;

  return (
    <>
      <Head>
        <title>{anime.title.english || anime.title.romaji} | Aichiow</title>
      </Head>
      <main className="bg-dark text-white pb-20">
        <AnimeDetailHeader anime={anime} />
        {anime.trailer?.site === "youtube" && <AnimeTrailer trailer={anime.trailer} />}
        {Array.isArray(anime.characters?.edges) && anime.characters.edges.length > 0 && (
          <CharacterList characters={anime.characters.edges} />
        )}

        <section className="mt-10 px-4 text-center">
          <div className="mb-4">
            <span
              className={`inline-block px-4 py-1 text-sm font-semibold rounded-full ${statusBadgeColor}`}
            >
              {anime.status === "RELEASING"
                ? "Ongoing"
                : anime.status === "FINISHED"
                ? "Completed"
                : "Upcoming"}
            </span>
          </div>

          <p className="text-gray-300 text-sm mb-2">
            {totalEpisodes ? `Total Episodes: ${totalEpisodes}` : "Total Episodes: ?"} |{" "}
            {duration ? `Duration: ${duration} min/ep` : "Duration: ?"}
          </p>

          {anime.nextAiringEpisode && (
            <p className="text-blue-400 text-sm mb-6">
              Next Episode {anime.nextAiringEpisode.episode} airs on{" "}
              {format(fromUnixTime(anime.nextAiringEpisode.airingAt), "PPpp")}
            </p>
          )}

          <h2 className="text-2xl font-extrabold text-white mb-6">Episodes</h2>

          {loadingEpisodes ? (
            <p className="text-gray-400">Loading episodes...</p>
          ) : episodes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {episodes.map((ep: ZoroEpisode) => (
                <a
                  key={ep.id}
                  href={`/watch/${ep.id}`} // PAKAI EPISODE ID ZORO
                  className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg shadow text-center transition"
                >
                  {ep.title || `Episode ${ep.number}`}
                </a>
              ))}
            </div>
          ) : totalEpisodes ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: totalEpisodes }).map((_, idx) => {
                const ep = idx + 1;
                return (
                  <a
                    key={ep}
                    href={`/watch/${ep}`}
                    className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg shadow text-center transition"
                  >
                    Episode {ep}
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">Episode list not available</p>
          )}
        </section>

        <section className="mt-10 px-4">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          {loadingSimilar ? (
            <p className="text-center text-gray-400">Looking for recommendations...</p>
          ) : similarAnime.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto">
              {similarAnime.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No recommendations found.</p>
          )}
        </section>
      </main>
    </>
  );
}
