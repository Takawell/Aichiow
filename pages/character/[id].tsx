import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCharacterDetail } from "@/hooks/character/useCharacterDetail";

const TABS = ["About", "Media", "Voice Actors", "Stats"] as const;

export default function CharacterDetailPage() {
  const router = useRouter();
  const { isReady, query } = router;
  const rawId = query.id;
  const id = useMemo(() => {
    if (!rawId) return undefined;
    if (Array.isArray(rawId)) return Number(rawId[0]);
    return Number(rawId);
  }, [rawId]);

  const { data: character, loading, error } = useCharacterDetail(id);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("About");

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] text-gray-400">
        Loading...
      </div>
    );
  }

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] text-gray-300">
        <p>Invalid character id.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
          </div>
        )}

        {error && (
          <div className="py-10 text-center text-red-400">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && character && (
          <>
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="flex-shrink-0 self-center md:self-start">
                <motion.div
                  layoutId={`character-image-${character.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="relative w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl"
                >
                  {character.image?.large ? (
                    <Image
                      src={character.image.large}
                      alt={character.name.full}
                      fill
                      sizes="176px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0b1220] to-[#11141b] flex items-center justify-center text-gray-500">
                      No image
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-y-3">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                      {character.name?.full ?? "Unknown"}
                    </h1>
                    {character.name?.native && (
                      <p className="text-sm text-gray-400 mt-1">{character.name.native}</p>
                    )}
                    {character.name?.alternative?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Also known as:{" "}
                        {character.name.alternative.slice(0, 4).join(", ")}
                        {character.name.alternative.length > 4 ? "..." : ""}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">Favourites</p>
                    <p className="text-lg font-semibold text-blue-400">
                      {character.favourites ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 items-center text-sm text-gray-400">
                  {character.gender && (
                    <span className="px-2 py-1 bg-white/5 rounded-lg">{character.gender}</span>
                  )}
                  {character.age && (
                    <span className="px-2 py-1 bg-white/5 rounded-lg">Age: {character.age}</span>
                  )}
                  {character.bloodType && (
                    <span className="px-2 py-1 bg-white/5 rounded-lg">Blood: {character.bloodType}</span>
                  )}
                  {character.dateOfBirth && character.dateOfBirth.year && (
                    <span className="px-2 py-1 bg-white/5 rounded-lg">
                      Born: {formatDOB(character.dateOfBirth)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 bg-white/5 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition ${
                          activeTab === tab
                            ? "bg-blue-600 text-white shadow"
                            : "text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="px-3 py-2 rounded-lg bg-white/10 text-sm mt-3 sm:mt-0"
                  >
                    Back to top
                  </button>
                </div>

                <div className="min-h-[220px]">
                  <AnimatePresence mode="wait">
                    {activeTab === "About" && (
                      <motion.div
                        key="about"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="prose prose-invert max-w-none text-sm leading-relaxed"
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {character.description?.replace(/<br>/g, "\n") ??
                            "_No description available._"}
                        </ReactMarkdown>
                      </motion.div>
                    )}

                    {activeTab === "Media" && (
                      <motion.div
                        key="media"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <MediaGrid edges={character.media?.edges ?? []} />
                      </motion.div>
                    )}

                    {activeTab === "Voice Actors" && (
                      <motion.div
                        key="va"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <VAList vAs={character.voiceActors ?? []} />
                      </motion.div>
                    )}

                    {activeTab === "Stats" && (
                      <motion.div
                        key="stats"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <StatsPanel character={character} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <aside className="md:col-span-1 bg-white/5 rounded-2xl p-4 sticky top-6 h-fit">
                <div className="text-xs text-gray-400 mb-3">Character Info</div>
                <dl className="text-sm space-y-3">
                  <Info label="Full name" value={character.name.full} />
                  <Info label="Native" value={character.name.native} />
                  <Info label="Gender" value={character.gender} />
                  <Info label="Age" value={character.age} />
                  <Info label="Favourites" value={character.favourites} />
                </dl>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <dt className="text-gray-300">{label}</dt>
      <dd className="font-medium">{value ?? "-"}</dd>
    </div>
  );
}

function MediaGrid({ edges }: { edges: any[] }) {
  if (!edges || edges.length === 0)
    return <p className="text-gray-400">No media found for this character.</p>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {edges.map((edge, i) => {
        const node = edge.node;
        const title =
          node.title?.romaji || node.title?.english || node.title?.native || "Untitled";
        const img = node.coverImage?.large;
        return (
          <motion.a
            key={i}
            href={`/anime/${node.id}`}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group block rounded-xl overflow-hidden bg-[#0b0f14] shadow-md"
          >
            <div className="relative w-full h-44">
              {img ? (
                <Image src={img} alt={title} fill style={{ objectFit: "cover" }} />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
            </div>
            <div className="p-2">
              <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
              {edge.role && <p className="text-xs text-gray-400 mt-1">{edge.role}</p>}
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}

function VAList({ vAs }: { vAs: any[] }) {
  if (!vAs || vAs.length === 0)
    return <p className="text-gray-400">No voice actors listed.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {vAs.map((va) => (
        <motion.div
          key={va.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-2 rounded-lg bg-white/10"
        >
          <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-white/5">
            {va.image?.large ? (
              <Image src={va.image.large} alt={va.name.full} fill style={{ objectFit: "cover" }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">N/A</div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium">{va.name.full}</div>
            {va.name.native && <div className="text-xs text-gray-400">{va.name.native}</div>}
            <div className="text-xs text-gray-400 mt-1">{va.language}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StatsPanel({ character }: { character: any }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Stat title="Gender" value={character.gender ?? "-"} />
      <Stat title="Age" value={character.age ?? "-"} />
      <Stat
        title="Date of Birth"
        value={character.dateOfBirth ? formatDOB(character.dateOfBirth) : "-"}
      />
      <Stat title="Blood Type" value={character.bloodType ?? "-"} />
      <Stat title="Favourites" value={String(character.favourites ?? 0)} />
      <Stat title="Media Appearances" value={String(character.media?.edges?.length ?? 0)} />
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/10">
      <div className="text-xs text-gray-400">{title}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function formatDOB(dob: { year?: number | null; month?: number | null; day?: number | null }) {
  const { year, month, day } = dob;
  if (!year && !month && !day) return "-";
  const y = year ?? "";
  const m = month ? padZero(month) : "";
  const d = day ? padZero(day) : "";
  return [d, m, y].filter(Boolean).join("-");
}

function padZero(n: number) {
  return String(n).padStart(2, "0");
}
