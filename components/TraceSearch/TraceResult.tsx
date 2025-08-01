// components/TraceSearch/TraceResult.tsx

"use client";

import { useTraceSearch } from "@/hooks/useTraceSearch";
import Link from "next/link";

export default function TraceResult() {
  const { result, loading } = useTraceSearch();

  if (!result || loading) return null;

  const topResult = result.result[0];
  const similarityPercent = Math.round(topResult.similarity * 100);

  return (
    <div className="mt-6 w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4">Hasil Pencarian</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <img
          src={topResult.image}
          alt="Scene Thumbnail"
          className="w-full md:w-56 rounded-xl border border-white/20 shadow"
        />

        <div className="flex flex-col justify-between flex-1 gap-2">
          <div>
            <h3 className="text-lg font-semibold">
              {topResult.title_english || topResult.title_romaji || topResult.title}
            </h3>
            <p className="text-sm text-gray-300">
              Episode: {topResult.episode ?? "?"} &nbsp;|&nbsp; 
              Waktu: {formatTimestamp(topResult.from)} - {formatTimestamp(topResult.to)}
            </p>
          </div>

          <div className="text-sm text-gray-400">
            Similarity:{" "}
            <span className={`font-bold ${similarityPercent > 85 ? "text-green-400" : "text-yellow-400"}`}>
              {similarityPercent}%
            </span>
          </div>

          <div className="flex gap-3 mt-2">
            <a
              href={topResult.video}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
            >
              Tonton Scene
            </a>
            <Link
              href={`/anime/${topResult.anilist}`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-sm transition"
            >
              Lihat di Aichiow
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimestamp(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
