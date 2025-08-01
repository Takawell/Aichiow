"use client";

import { useTraceSearch } from "@/hooks/useTraceSearch";
import { useAnimeDetail } from "@/hooks/useAnimeDetail";
import Link from "next/link";

export default function TraceResult() {
  const { result, loading } = useTraceSearch();

  if (!result || loading) return null;

  const topResult = result.result[0];
  const similarityPercent = Math.round(topResult.similarity * 100);

  const { anime, isLoading } = useAnimeDetail(topResult.anilist);

  if (!anime || isLoading) return null;

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl text-white transition-all">
      <h2 className="text-2xl font-bold mb-5">🎯 Hasil Pencarian FIND ANIME</h2>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        {/* Frame Image */}
        <img
          src={topResult.image}
          alt="Scene Thumbnail"
          className="w-full h-auto rounded-xl border border-white/20 shadow"
        />

        {/* Anime Info */}
        <div className="flex flex-col justify-between gap-3">
          {/* Title + Cover */}
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src={anime.coverImage.extraLarge}
              alt={anime.title.romaji}
              className="w-28 h-auto rounded-md shadow border border-white/10"
            />
            <div>
              <h3 className="text-xl font-bold">{anime.title.english || anime.title.romaji}</h3>
              <p className="text-sm text-gray-300">
                Episode: {topResult.episode ?? "?"} &nbsp;|&nbsp;
                {formatTimestamp(topResult.from)} - {formatTimestamp(topResult.to)}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Studio: {anime.studios?.nodes?.[0]?.name || "Unknown"}
              </p>
              <p className="text-sm text-gray-400">
                Format: {anime.format} • {anime.season} {anime.seasonYear}
              </p>
              <p className="text-sm text-gray-400">
                Rating: ⭐ {anime.averageScore ?? "?"}/100
              </p>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mt-2">
            {anime.genres.slice(0, 5).map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs text-white"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Similarity */}
          <div className="text-sm text-gray-300 mt-2">
            Similarity:{" "}
            <span className={`font-semibold ${similarityPercent >= 90 ? "text-green-400" : "text-yellow-400"}`}>
              {similarityPercent}%
            </span>
            {similarityPercent >= 90 && <span className="ml-1">✅ Akurat</span>}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-4">
            <a
              href={topResult.video}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
            >
              🎬 Tonton Scene
            </a>
            <Link
              href={`/anime/${topResult.anilist}`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-sm transition"
            >
              🔎 Detail Aichiow
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
