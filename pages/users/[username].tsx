import { GetServerSideProps, NextPage } from "next";
import { supabase } from "@/lib/supabaseClient";
import { UserRow, FavoriteRow } from "@/types/supabase";
import { motion } from "framer-motion";

interface HistoryItem {
  id: number;
  user_id: string;
  anime_id: number;
  trailer_id: string;
  trailer_site: string;
  trailer_thumbnail: string | null;
  watched_at: string;
  watch_count: number;
  anime: {
    title_romaji?: string;
    cover_image?: string;
  } | null;
}

interface Props {
  user: UserRow;
  history: HistoryItem[];
  favorites: FavoriteRow[];
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const usernameParam = context.params?.username;
  const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam;

  if (!username) return { notFound: true };

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .ilike("username", username)
    .single();

  if (!userData) return { notFound: true };

  const userId = userData.id;

  const { data: rawHistory } = await supabase
    .from("trailer_watch_history")
    .select(
      `
      id,
      user_id,
      anime_id,
      trailer_id,
      trailer_site,
      trailer_thumbnail,
      watched_at,
      watch_count,
      anime:anime_id (
        title_romaji,
        cover_image
      )
    `
    )
    .eq("user_id", userId)
    .order("watched_at", { ascending: false });

  const history: HistoryItem[] = Array.isArray(rawHistory)
    ? rawHistory.map((it: any) => ({
        id: it.id,
        user_id: it.user_id,
        anime_id: it.anime_id,
        trailer_id: it.trailer_id,
        trailer_site: it.trailer_site,
        trailer_thumbnail: it.trailer_thumbnail ?? null,
        watched_at: it.watched_at,
        watch_count: typeof it.watch_count === "number" ? it.watch_count : 1,
        anime: it.anime
          ? {
              title_romaji: it.anime?.title_romaji ?? "Unknown",
              cover_image: it.anime?.cover_image ?? "/default.png",
            }
          : null,
      }))
    : [];

  const { data: favorites } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId);

  return {
    props: {
      user: userData,
      history: history || [],
      favorites: favorites || [],
    },
  };
};

const fallbackAvatars = ["/default.png", "/v2.png", "/v3.png", "/v4.png"];

const PublicUserPage: NextPage<Props> = ({ user, history, favorites }) => {
  const avatar = user.avatar_url || "/default.png";
  const username = user.username || "Unknown";
  const bio = user.bio || "Anime • Manga • Manhwa • Light Novels";

  const groupedFavs = {
    anime: favorites.filter((f) => f.media_type === "anime"),
    manga: favorites.filter((f) => f.media_type === "manga"),
    manhwa: favorites.filter((f) => f.media_type === "manhwa"),
    light_novel: favorites.filter((f) => f.media_type === "light_novel"),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[-120px] w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-200px] right-[-160px] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 py-8">
        <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-950/90 to-black/80 border border-sky-500/10 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-sky-400 to-blue-500">
                <img
                  src={avatar}
                  alt={username}
                  onError={(e) => {
                    const f = fallbackAvatars[Math.floor(Math.random() * fallbackAvatars.length)];
                    e.currentTarget.src = f;
                  }}
                  className="w-full h-full object-cover rounded-full border-4 border-black/60"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-blue-300">
                  {username}
                </h1>

                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold">
                    Follow
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-300 mt-2">{bio}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="rounded-xl p-4 bg-gradient-to-br from-slate-900/40 to-black/40 border border-sky-500/10">
                  <p className="text-slate-400 text-xs">History</p>
                  <p className="text-xl font-black">{history.length}</p>
                </div>
                <div className="rounded-xl p-4 bg-gradient-to-br from-slate-900/40 to-black/40 border border-blue-500/10">
                  <p className="text-slate-400 text-xs">Favorites</p>
                  <p className="text-xl font-black">{favorites.length}</p>
                </div>
                <div className="rounded-xl p-4 bg-gradient-to-br from-slate-900/40 to-black/40 border border-green-500/10">
                  <p className="text-slate-400 text-xs">Member Since</p>
                  <p className="text-xl font-black">{new Date(user.created_at).getFullYear()}</p>
                </div>
                <div className="rounded-xl p-4 bg-gradient-to-br from-slate-900/40 to-black/40 border border-purple-500/10">
                  <p className="text-slate-400 text-xs">Collections</p>
                  <p className="text-xl font-black">
                    {Object.values(groupedFavs).filter((x) => x.length > 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-10">
          <div className="lg:col-span-8 space-y-6">
            <section className="rounded-2xl p-6 bg-gradient-to-br from-slate-950/90 to-black/80 border border-sky-500/10">
              <h2 className="text-xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-blue-300">
                Watch History
              </h2>

              {history.length === 0 ? (
                <p className="text-slate-400 text-center py-10">No history yet</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900/40 to-black/40"
                    >
                      <img
                        src={item.anime?.cover_image || item.trailer_thumbnail || "/default.png"}
                        onError={(e) => (e.currentTarget.src = "/default.png")}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        <p className="text-sm font-bold truncate">{item.anime?.title_romaji}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(item.watched_at).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl p-6 bg-gradient-to-br from-slate-950/90 to-black/80 border border-sky-500/10">
              <h2 className="text-xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-sky-300">
                Favorites
              </h2>

              {favorites.length === 0 ? (
                <p className="text-slate-400 text-center py-10">No favorites yet</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {favorites.slice(0, 12).map((fav) => (
                    <motion.div
                      key={fav.id}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-xl p-4 bg-gradient-to-br from-slate-900/40 to-black/40 border border-slate-800"
                    >
                      <p className="text-sm font-bold truncate">{`#${fav.media_id}`}</p>
                      <p className="text-xs text-slate-500 mt-1">{fav.media_type}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            {Object.entries(groupedFavs).map(([key, arr]) => (
              <div
                key={key}
                className="rounded-2xl p-6 bg-gradient-to-br from-slate-950/90 to-black/80 border border-sky-500/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold capitalize">{key.replace("_", " ")}</h3>
                  <span className="text-xs text-slate-400">{arr.length}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {arr.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No items</p>
                  ) : (
                    arr.slice(0, 6).map((fav) => (
                      <span
                        key={fav.id}
                        className="px-3 py-1 rounded-lg text-xs bg-gradient-to-r from-sky-500 to-blue-600 text-white max-w-[160px] truncate"
                      >
                        {`#${fav.media_id}`}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PublicUserPage;
