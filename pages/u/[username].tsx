import React from "react"
import { GetServerSideProps, NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"
import {
  FaStar,
  FaHistory,
  FaTv,
  FaBook,
  FaDragon,
  FaBookOpen,
  FaUserPlus,
  FaEnvelope,
} from "react-icons/fa"

type UserRow = {
  id: string
  username?: string | null
  bio?: string | null
  avatar_url?: string | null
  created_at?: string | null
}

type TrailerHistoryRow = {
  id: number
  user_id: string
  anime_id: number
  trailer_id: string
  trailer_site: string
  trailer_thumbnail: string | null
  watched_at: string
  watch_count: number
  anime?: {
    title_romaji?: string
    cover_image?: string
  } | null
}

type FavoriteRow = {
  id: number
  user_id: string
  media_id: number
  media_type: string
  media_title?: string | null
  title?: string | null
  created_at?: string | null
}

type Props = {
  user: UserRow
  history: TrailerHistoryRow[]
  favorites: FavoriteRow[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const usernameParam = context.params?.username
  const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam || ""
  if (!username) {
    return { notFound: true }
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, username, bio, avatar_url, created_at")
    .ilike("username", username)
    .limit(1)
    .single()

  if (userError || !userData) {
    return { notFound: true }
  }

  const userId = userData.id as string

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
    .order("watched_at", { ascending: false })
    .limit(24)

  const normalizedHistory: TrailerHistoryRow[] = Array.isArray(rawHistory)
    ? rawHistory.map((it: any) => {
        let animeObj: any = null
        if (it.anime) {
          animeObj = Array.isArray(it.anime) ? it.anime[0] ?? null : it.anime
        }
        return {
          id: it.id,
          user_id: it.user_id,
          anime_id: it.anime_id,
          trailer_id: it.trailer_id,
          trailer_site: it.trailer_site,
          trailer_thumbnail: it.trailer_thumbnail ?? null,
          watched_at: it.watched_at,
          watch_count:
            typeof it.watch_count === "number" ? it.watch_count : Number(it.watch_count) || 1,
          anime: animeObj
            ? {
                title_romaji: animeObj.title_romaji ?? "Unknown",
                cover_image: animeObj.cover_image ?? "/default.png",
              }
            : null,
        }
      })
    : []

  const { data: favData } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(48)

  const favorites: FavoriteRow[] = Array.isArray(favData) ? favData : []

  return {
    props: {
      user: userData,
      history: normalizedHistory,
      favorites,
    },
  }
}

const fallbackAvatars = ["/default.png", "/v2.png", "/v3.png", "/v4.png"]

function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const fallback = fallbackAvatars[Math.floor(Math.random() * fallbackAvatars.length)]
  e.currentTarget.src = fallback
}

const StatCard: React.FC<{ label: string; value: number; accent?: string; icon?: React.ReactNode }> =
  ({ label, value, accent = "from-sky-500 to-blue-500", icon }) => {
    return (
      <div className="relative group rounded-2xl p-3 bg-gradient-to-br from-slate-900/60 to-black/60 border border-sky-500/10">
        <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-10 transition`} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-black/40 to-black/30">
              <div className="text-lg text-sky-300">{icon}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">{label}</div>
              <div className="text-xl font-black text-white">{value}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

const MediaCard: React.FC<{ item: TrailerHistoryRow | FavoriteRow; compact?: boolean }> = ({ item, compact }) => {
  const title =
    "anime" in item && item.anime ? item.anime.title_romaji ?? "Unknown" : (item as any).media_title ?? (item as any).title ?? `#${(item as any).media_id}`
  const img = "anime" in item && item.anime ? item.anime.cover_image : (item as any).trailer_thumbnail ?? "/default.png"
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="group relative rounded-xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900/40 to-black/40 shadow-lg"
    >
      <div className="relative w-full aspect-[3/4]">
        <img src={String(img)} alt={title} onError={handleImageError} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
      </div>
      <div className="p-3">
        <h4 className="text-sm font-bold text-white truncate">{title}</h4>
        {"watched_at" in item && (
          <p className="text-xs text-slate-400 mt-1">{new Date((item as TrailerHistoryRow).watched_at).toLocaleDateString()}</p>
        )}
      </div>
    </motion.div>
  )
}

const PublicProfilePage: NextPage<Props> = ({ user, history, favorites }) => {
  const avatar = user.avatar_url || "/default.png"
  const username = user.username || `user-${user.id.slice(0, 6)}`
  const bio = user.bio || "Anime • Manga • Manhwa • Light Novels"
  const stats = {
    history: history.length,
    favorites: favorites.length,
  }

  const groupedFavorites = {
    anime: favorites.filter((f) => f.media_type === "anime"),
    manga: favorites.filter((f) => f.media_type === "manga"),
    manhwa: favorites.filter((f) => f.media_type === "manhwa"),
    light_novel: favorites.filter((f) => f.media_type === "light_novel"),
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-120px] left-[-80px] w-[520px] h-[520px] rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute right-[-160px] bottom-[-160px] w-[720px] h-[720px] rounded-full bg-blue-600/6 blur-4xl" />
        </div>

        <header className="relative z-10">
          <div className="container mx-auto px-4 py-8 max-w-[1400px]">
            <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-950/90 to-black/80 border border-sky-500/10 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-sky-400 to-blue-500 shadow-2xl">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-black/50">
                      <img src={avatar} alt={username} onError={handleImageError} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-blue-300">
                      {username}
                    </h1>
                    <div className="flex items-center gap-2 ml-auto">
                      <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition">
                        <FaUserPlus />
                        <span className="text-sm">Follow</span>
                      </button>
                      <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-sky-500/20 text-sky-200 hover:bg-white/10 transition">
                        <FaEnvelope />
                        <span className="text-sm">Message</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-2 line-clamp-3">{bio}</p>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard label="History" value={stats.history} icon={<FaHistory />} />
                    <StatCard label="Favorites" value={stats.favorites} icon={<FaStar />} />
                    <StatCard label="Member since" value={new Date(user.created_at || Date.now()).getFullYear()} icon={<FaTv />} />
                    <StatCard label="Collections" value={Object.values(groupedFavorites).filter(Boolean).length} icon={<FaBook />} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10">
          <div className="container mx-auto px-4 py-8 max-w-[1400px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <section className="lg:col-span-8 space-y-6">
                <div className="rounded-2xl p-4 md:p-6 bg-gradient-to-br from-slate-950/90 to-black/80 border border-sky-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300">Watch History</h2>
                    <span className="text-xs text-slate-400">Most recent</span>
                  </div>

                  {history.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-sky-500/10 flex items-center justify-center">
                        <FaHistory className="text-2xl text-sky-300/60" />
                      </div>
                      <p className="mt-4 text-slate-400">No viewing history yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {history.map((h) => (
                        <MediaCard key={String(h.id)} item={h} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl p-4 md:p-6 bg-gradient-to-br from-slate-950/90 to-black/80 border border-sky-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-sky-300">Favorites</h2>
                    <div className="text-xs text-slate-400">Top picks</div>
                  </div>

                  {favorites.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <FaStar className="text-2xl text-blue-300/60" />
                      </div>
                      <p className="mt-4 text-slate-400">No favorites yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {favorites.slice(0, 12).map((f) => (
                        <MediaCard key={String(f.id)} item={f as any} />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <aside className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl p-4 md:p-6 bg-gradient-to-br from-slate-950/90 to-black/80 border border-sky-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300">Collections</h3>
                    <span className="text-xs text-slate-400">{favorites.length}</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: "anime", icon: <FaTv />, label: "Anime" },
                      { key: "manga", icon: <FaBook />, label: "Manga" },
                      { key: "manhwa", icon: <FaDragon />, label: "Manhwa" },
                      { key: "light_novel", icon: <FaBookOpen />, label: "Light Novels" },
                    ].map(({ key, icon, label }) => {
                      const list = favorites.filter((f) => f.media_type === key)
                      return (
                        <div key={key} className="rounded-xl p-3 bg-gradient-to-br from-slate-900/40 to-black/40 border border-slate-800">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-black/40 to-black/30">
                                <div className="text-white">{icon}</div>
                              </div>
                              <div>
                                <div className="text-sm font-bold">{label}</div>
                                <div className="text-xs text-slate-400">{list.length} items</div>
                              </div>
                            </div>
                            <div className="text-xs text-slate-300">View</div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {list.length > 0 ? (
                              list.slice(0, 6).map((fav) => (
                                <Link key={fav.id} href={`/`} className="px-3 py-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 text-white text-xs font-bold truncate max-w-[160px]">
                                  {fav.media_title ?? fav.title ?? `#${fav.media_id}`}
                                </Link>
                              ))
                            ) : (
                              <div className="text-xs text-slate-500 italic">No items</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-2xl p-4 md:p-6 bg-gradient-to-br from-slate-950/90 to-black/80 border border-sky-500/10">
                  <h4 className="text-sm font-bold text-white mb-3">About</h4>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-6">{bio}</p>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PublicProfilePage
