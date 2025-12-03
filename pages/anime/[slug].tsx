import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useAnimeDetail } from "@/hooks/useAnimeDetail";
import { useQuery } from "@tanstack/react-query";
import { fetchSimilarAnime } from "@/lib/anilist";
import { fetchEpisodesFromConsumet } from "@/lib/consumet"; // <— NEW
import AnimeDetailHeader from "@/components/anime/AnimeDetailHeader";
import AnimeTrailer from "@/components/anime/AnimeTrailer";
import CharacterList from "@/components/character/CharacterList";
import AnimeCard from "@/components/anime/AnimeCard";
import { format, fromUnixTime } from "date-fns";
import slugify from "slugify";
import { motion } from "framer-motion";
import { Loader2, Clock, Calendar, Tv } from "lucide-react";

const ModernLoader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      <motion.div
        className="absolute top-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-sky-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-600/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-sky-500/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative z-10"
          >
            <Loader2 className="w-20 h-20 text-sky-400" />
          </motion.div>
        </motion.div>

        <motion.p
          className="text-2xl md:text-3xl font-bold text-white"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
        <p className="text-slate-400">Please wait while we fetch the data</p>
      </div>
    </div>
  );
};

export default function AnimeDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const id = parseInt(slug as string);

  const { anime, isLoading, isError } = useAnimeDetail(id);

  const {
    data: episodes = [],
    isLoading: loadingEpisodes,
  } = useQuery({
    queryKey: ["consumetEpisodes", anime?.title?.romaji],
    queryFn: () => fetchEpisodesFromConsumet(anime?.title?.romaji),
    enabled: !!anime?.title?.romaji,
  });

  const { data: similarAnime = [], isLoading: loadingSimilar } = useQuery({
    queryKey: ["similarAnime", id],
    queryFn: () => fetchSimilarAnime(id),
    enabled: !!id,
  });

  if (isLoading) return <ModernLoader text="Loading..." />;
  if (isError || !anime) return <p className="text-center text-red-500 mt-10">Anime not found.</p>;

  const statusBadgeColor =
    anime.status === "RELEASING"
      ? "bg-green-500"
      : anime.status === "FINISHED"
      ? "bg-blue-500"
      : "bg-gray-500";

  const animeSlug = slugify(anime.title.romaji || anime.title.english || "", { lower: true });

  return (
    <>
      <Head>
        <title>{anime.title.english || anime.title.romaji} | Aichiow</title>
      </Head>

      <main className="bg-dark text-white pb-20">
        <AnimeDetailHeader anime={anime} />

        {anime.trailer?.site === "youtube" && <AnimeTrailer trailer={anime.trailer} />}
        {anime.characters?.edges?.length > 0 && <CharacterList characters={anime.characters.edges} />}

        <section className="mt-10 px-4 max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl ${statusBadgeColor}`}>
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                {anime.status}
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 text-center">Episodes</h2>

            {loadingEpisodes ? (
              <p className="text-center text-neutral-400">Fetching episodes...</p>
            ) : episodes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {episodes.map((ep) => (
                  <a
                    key={ep.id}
                    href={`/watch/${animeSlug}?id=${ep.id}`}
                    className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-lg border border-white/10 hover:border-blue-400/50 text-center transition shadow-lg"
                  >
                    Episode {ep.number}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-400">No streaming episodes available</p>
            )}
          </div>
        </section>

        <section className="mt-10 px-4">
          <h2 className="text-xl font-semibold mb-4 text-white">More like this</h2>

          {loadingSimilar ? (
            <p className="text-center text-neutral-400">Loading recommendations...</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto">
              {similarAnime.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
