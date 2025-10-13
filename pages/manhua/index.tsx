import React, { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { useManhua, useSearchManhua, useTrendingManhua, useTopManhua } from "@/hooks/manhua/useManhua";
import { fetchManhuaDetail } from "@/lib/manhua";
import { Manhua } from "@/types/manhua";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function LoaderSpinner({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="animate-spin border-4 border-neutral-700 border-t-neutral-400 rounded-full"
      role="status"
    />
  );
}

function IconButton({ children, onClick, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md hover:bg-zinc-800 active:scale-95 transition ${className}`}
    >
      {children}
    </button>
  );
}

/* -------------------------
   Main Page Component
   ------------------------- */

export default function ManhuaPage() {
  // core data hooks
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const { manhuaList, loading: loadingList } = useManhua(page, pageSize);
  const { results: searchResults, search, loading: loadingSearch } = useSearchManhua();
  const { trendingManhua, loading: loadingTrending } = useTrendingManhua();
  const { topManhua, loading: loadingTop } = useTopManhua();

  // local UI state
  const [query, setQuery] = useState("");
  const [activeView, setActiveView] = useState<"all" | "trending" | "top" | "search">("all");
  const [selected, setSelected] = useState<Manhua | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<number | null>(null);

  // combine data for current display
  const dataToShow = useMemo(() => {
    if (activeView === "trending") return trendingManhua;
    if (activeView === "top") return topManhua;
    if (activeView === "search") return searchResults;
    return manhuaList;
  }, [activeView, manhuaList, trendingManhua, topManhua, searchResults]);

  // handle search typing (debounced)
  useEffect(() => {
    if (searchTimeout.current) window.clearTimeout(searchTimeout.current);
    if (!query.trim()) {
      if (activeView === "search") setActiveView("all");
      return;
    }

    searchTimeout.current = window.setTimeout(() => {
      search(query);
      setActiveView("search");
    }, 450);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // load detail modal
  const openDetail = async (m: Manhua) => {
    setSelected(m);
    setDetailLoading(true);
    setDetailData(null);
    setError(null);
    try {
      const d = await fetchManhuaDetail(m.id);
      setDetailData(d);
    } catch (err: any) {
      console.error("Detail fetch error", err);
      setError("Failed to load detail");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setDetailData(null);
    setError(null);
  };

  // pagination handlers
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => p + 1);

  // small UX helpers
  const isEmpty = !dataToShow || dataToShow.length === 0;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Manhua
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Explore Chinese comics — curated & powered by AniList.
            </p>
          </div>

          <div className="w-full sm:w-auto flex gap-3 items-center">
            <div className="relative flex-1 sm:flex-none">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search manhua, characters, tags..."
                className="w-full sm:w-96 bg-zinc-900 border border-zinc-800 placeholder:text-neutral-500 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                <FaSearch />
              </div>
            </div>

            <IconButton onClick={() => setActiveView((v) => (v === "all" ? "trending" : "all"))} title="Toggle Trending">
              <FaFilter />
            </IconButton>
          </div>
        </div>

        {/* filter chips */}
        <nav className="mt-4 flex gap-2 flex-wrap">
          <FilterChip
            label="All"
            active={activeView === "all"}
            onClick={() => setActiveView("all")}
          />
          <FilterChip
            label="Trending"
            active={activeView === "trending"}
            onClick={() => setActiveView("trending")}
          />
          <FilterChip
            label="Top Rated"
            active={activeView === "top"}
            onClick={() => setActiveView("top")}
          />
          <FilterChip
            label="Search"
            active={activeView === "search"}
            onClick={() => {
              setActiveView("search");
              if (query.trim()) search(query);
            }}
          />
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto">
        {/* Info row */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-neutral-400">
            {loadingList || loadingTrending || loadingTop || loadingSearch ? (
              <span className="flex items-center gap-2">
                <LoaderSpinner size={18} /> Loading...
              </span>
            ) : isEmpty ? (
              <span>No manhua found.</span>
            ) : (
              <span>{dataToShow.length} items</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <small className="text-xs text-neutral-500 mr-2">Page</small>
            <div className="flex items-center gap-1">
              <IconButton onClick={prevPage} className="hidden sm:inline-flex">
                <FaChevronLeft />
              </IconButton>
              <div className="px-3 py-1 rounded border border-zinc-800 bg-zinc-950 text-sm">
                {page}
              </div>
              <IconButton onClick={nextPage} className="hidden sm:inline-flex">
                <FaChevronRight />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Grid */}
        <section>
          <div
            className="
              grid gap-4
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
            "
          >
            {dataToShow.map((m) => (
              <motion.div
                key={m.id}
                layout
                whileHover={{ scale: 1.02 }}
                className="relative group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800"
                onClick={() => openDetail(m)}
                role="button"
                tabIndex={0}
              >
                <div className="relative w-full h-64 sm:h-72">
                  <Image
                    src={m.coverImage?.large || "/default.png"}
                    alt={m.title.english || m.title.romaji || "Manhua cover"}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {m.title.english || m.title.romaji || m.title.native}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                    <span>{m.chapters ?? "—"} ch</span>
                    <span>{m.averageScore ? `${m.averageScore}%` : "—"}</span>
                  </div>

                  <div className="mt-3 hidden sm:flex items-center gap-2">
                    {m.genres?.slice(0, 3).map((g) => (
                      <span key={g} className="text-xs px-2 py-1 rounded bg-zinc-800">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* overlay info on hover (desktop) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-neutral-500">
            Tip: click a card to view details.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Back to top
            </button>

            <button
              onClick={() => setPage(1)}
              className="px-4 py-2 rounded-md border border-zinc-800"
            >
              Reset page
            </button>

            <div className="sm:hidden">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-md bg-zinc-800"
              >
                Load more
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.98 }}
              className="w-full max-w-5xl bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
            >
              <div className="relative">
                <div className="w-full h-56 md:h-72 relative">
                  <Image
                    src={selected.bannerImage || selected.coverImage?.large || "/default.png"}
                    alt={selected.title.english || selected.title.romaji}
                    layout="fill"
                    objectFit="cover"
                    className="filter brightness-75"
                  />
                </div>

                <button
                  onClick={closeDetail}
                  className="absolute right-4 top-4 p-2 rounded-full bg-black/40 hover:bg-black/30"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="relative w-40 h-56 mx-auto md:mx-0 rounded-lg overflow-hidden border border-zinc-800">
                    <Image
                      src={selected.coverImage?.large || "/default.png"}
                      alt={selected.title.english || selected.title.romaji}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-center md:text-left">
                    {selected.title.english || selected.title.romaji}
                  </h2>
                  <p className="text-sm text-neutral-400 text-center md:text-left">
                    {selected.startDate?.year ? `Started: ${selected.startDate.year}` : "Unknown"}
                  </p>

                  <div className="mt-4 flex gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 rounded bg-zinc-800 text-sm">
                      {selected.format || "Unknown"}
                    </span>
                    <span className="px-3 py-1 rounded bg-zinc-800 text-sm">
                      {selected.countryOfOrigin || "CN"}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-400">{selected.genres?.join(" • ")}</span>
                      </div>
                      <div className="mt-3 text-sm text-neutral-300 leading-relaxed max-h-40 overflow-auto">
                        {detailLoading ? (
                          <div className="flex items-center gap-2"><LoaderSpinner size={18} /> Loading detail...</div>
                        ) : error ? (
                          <div className="text-red-400">{error}</div>
                        ) : detailData?.description ? (
                          <div dangerouslySetInnerHTML={{ __html: detailData.description }} />
                        ) : (
                          <div>{selected.description || "No description available."}</div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-neutral-400">Score</div>
                      <div className="text-2xl font-bold">
                        {selected.averageScore ? `${selected.averageScore}%` : "—"}
                      </div>
                      <div className="text-xs text-neutral-500 mt-2">{selected.chapters ?? "—"} chapters</div>
                    </div>
                  </div>

                  {/* characters & staff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Characters</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {detailData?.characters?.edges?.length ? (
                          detailData.characters.edges.map((e: any) => (
                            <div key={e.node.id} className="w-32 shrink-0">
                              <div className="relative w-32 h-40 rounded-md overflow-hidden border border-zinc-800">
                                <Image
                                  src={e.node.image?.large || "/default.png"}
                                  alt={e.node.name?.full || "Character"}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <div className="text-xs mt-2 text-neutral-300">{e.node.name?.full}</div>
                              <div className="text-[10px] text-neutral-500">{e.role}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-neutral-500">No characters listed.</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Staff</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {detailData?.staff?.edges?.length ? (
                          detailData.staff.edges.map((s: any, i: number) => (
                            <div key={i} className="w-28 shrink-0 text-center">
                              <div className="relative w-28 h-28 rounded-md overflow-hidden border border-zinc-800">
                                <Image
                                  src={s.node.image?.large || "/default.png"}
                                  alt={s.node.name?.full || "Staff"}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <div className="text-xs mt-2 text-neutral-300">{s.node.name?.full}</div>
                              <div className="text-[10px] text-neutral-500">{s.role}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-neutral-500">No staff listed.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="mt-6 flex gap-3">
                    <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500">
                      Add to favorites
                    </button>
                    <button className="px-4 py-2 rounded-md border border-zinc-800">
                      see details
                    </button>
                    <button className="px-4 py-2 rounded-md border border-zinc-800" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                      Scroll to top
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border ${
        active ? "bg-indigo-600 border-indigo-600 text-white" : "border-zinc-800 text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
