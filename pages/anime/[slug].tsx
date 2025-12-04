import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useAnimeDetail } from "@/hooks/useAnimeDetail";
import { useQuery } from "@tanstack/react-query";
import { fetchSimilarAnime } from "@/lib/anilist";
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
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-600/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-sky-500/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-blue-400/40"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative z-10"
          >
            <Loader2 className="w-20 h-20 text-sky-400" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <motion.p
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
          <p className="text-slate-400 text-sm md:text-base">Please wait while we fetch the data</p>
        </motion.div>

        <motion.div
          className="w-64 md:w-80 h-2 bg-slate-800/50 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-sky-400"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-sky-400/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const MiniLoader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center py-10 md:py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative mb-4"
      >
        <div className="absolute inset-0 rounded-full border-4 border-sky-500/20"></div>
        <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-sky-400" />
      </motion.div>
      <motion.p
        className="text-slate-400 text-sm md:text-base"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default function AnimeDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const id = parseInt(slug as string);

  const { anime, isLoading, isError } = useAnimeDetail(id);
  const { data: similarAnime = [], isLoading: loadingSimilar } = useQuery({
    queryKey: ["similarAnime", id],
    queryFn: () => fetchSimilarAnime(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <ModernLoader text="Loading..." />;
  }

  if (isError || !anime) {
    return <p className="text-center text-red-500 mt-10">Anime not found.</p>;
  }

  const statusBadgeColor =
    anime.status === "RELEASING"
      ? "bg-green-500"
      : anime.status === "FINISHED"
      ? "bg-blue-500"
      : "bg-gray-500";

  const totalEpisodes = anime.episodes || null;
  const duration = anime.duration || null;
  const animeSlug = slugify(anime.title.romaji || anime.title.english || "", { lower: true });

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

        <section className="mt-10 px-4 max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl ${statusBadgeColor} shadow-lg`}
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                {anime.status === "RELEASING"
                  ? "Ongoing"
                  : anime.status === "FINISHED"
                  ? "Completed"
                  : "Schedule"}
              </div>

              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Tv className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-neutral-300">
                  {totalEpisodes ? `${totalEpisodes} Episodes` : "? Episodes"}
                </span>
              </div>

              {duration && (
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-neutral-300">{duration} min/ep</span>
                </div>
              )}
            </div>

            {anime.nextAiringEpisode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-8 overflow-hidden rounded-2xl border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
                <div className="relative backdrop-blur-sm px-6 py-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                        <Calendar className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Next Episode</p>
                        <p className="text-lg font-bold text-white">Episode {anime.nextAiringEpisode.episode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:text-right">
                      <div className="hidden md:block w-px h-10 bg-white/10"></div>
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Airs On</p>
                        <p className="text-sm md:text-base font-semibold text-blue-300">
                          {format(fromUnixTime(anime.nextAiringEpisode.airingAt), "PPpp")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}

            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 text-center">Episodes</h2>

            {totalEpisodes ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: totalEpisodes }).map((_, idx) => {
                  const ep = idx + 1;
                  return (
                    <a
                      key={ep}
                      href={`/watch/soon`}
                      className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-lg border border-white/10 hover:border-blue-400/50 text-center transition shadow-lg"
                    >
                      Episode {ep}
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-neutral-400">Episode list not available</p>
            )}
          </div>
        </section>

        <section className="mt-10 px-4">
          <h2 className="text-xl font-semibold mb-4 text-white">More like this</h2>
          {loadingSimilar ? (
            <MiniLoader text="Finding more anime for you..." />
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
