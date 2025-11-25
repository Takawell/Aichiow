import { useRouter } from "next/router";
import Head from "next/head";
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
import { Loader2, Play, Clock, Calendar } from "lucide-react";

const ModernLoader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwYjk1ZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0em0wIDI4YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0ek0xNiAzNmMwIDIuMjEgMS43OSA0IDQgNHM0LTEuNzkgNC00LTEuNzktNC00LTQtNCAxLjc5LTQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      <motion.div
        className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
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
            className="absolute w-2 h-2 rounded-full bg-sky-400/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
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
    return <ModernLoader text="Loading Anime Details..." />;
  }

  if (isError || !anime) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-red-950/50 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-red-500/30 max-w-md text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <Play className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Anime Not Found</h2>
          <p className="text-slate-400">The requested anime could not be found or has been removed.</p>
        </motion.div>
      </div>
    );
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
      <main className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white pb-20 min-h-screen">
        <AnimeDetailHeader anime={anime} />
        
        {anime.trailer?.site === "youtube" && <AnimeTrailer trailer={anime.trailer} />}
        
        {Array.isArray(anime.characters?.edges) && anime.characters.edges.length > 0 && (
          <CharacterList characters={anime.characters.edges} />
        )}

        <section className="mt-10 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-sky-500/20">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl ${statusBadgeColor} shadow-lg`}
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                {anime.status === "RELEASING"
                  ? "Ongoing"
                  : anime.status === "FINISHED"
                  ? "Completed"
                  : "Upcoming"}
              </span>

              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                <Play className="w-4 h-4 text-sky-400" />
                <span className="text-sm text-slate-300">
                  {totalEpisodes ? `${totalEpisodes} Episodes` : "? Episodes"}
                </span>
              </div>

              {duration && (
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span className="text-sm text-slate-300">{duration} min/ep</span>
                </div>
              )}
            </div>

            {anime.nextAiringEpisode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 bg-sky-500/20 px-4 py-3 rounded-xl border border-sky-500/30 mb-6"
              >
                <Calendar className="w-4 h-4 text-sky-400" />
                <p className="text-sky-300 text-sm">
                  Next Episode {anime.nextAiringEpisode.episode} airs on{" "}
                  {format(fromUnixTime(anime.nextAiringEpisode.airingAt), "PPpp")}
                </p>
              </motion.div>
            )}

            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 text-center">Episodes</h2>

            {totalEpisodes ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Array.from({ length: totalEpisodes }).map((_, idx) => {
                  const ep = idx + 1;
                  return (
                    <motion.a
                      key={ep}
                      href={`/watch/soon`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.01 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-sky-500/30 hover:to-blue-600/30 text-white p-4 rounded-xl border border-slate-700/50 hover:border-sky-500/50 text-center transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-sky-400" />
                      <span className="font-semibold">Episode {ep}</span>
                    </motion.a>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-slate-400">Episode list not available</p>
            )}
          </div>
        </section>

        <section className="mt-10 px-4 md:px-6 max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white">Maybe you like it</h2>
          {loadingSimilar ? (
            <MiniLoader text="Finding more anime for you..." />
          ) : similarAnime.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-sky-500/50 scrollbar-track-slate-800/50">
              {similarAnime.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">No recommendations found.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
