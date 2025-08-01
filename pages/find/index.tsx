import React from "react";
import { useTraceSearch } from "@/hooks/useTraceSearch";
import { useAnimeDetail } from "@/hooks/useAnimeDetail";
import Image from "next/image";

export default function FindAnimePage() {
  const {
    loading,
    result,
    error,
    previewUrl,
    handleSearch,
    reset,
  } = useTraceSearch();

  const firstResult = result?.result?.[0]; // ✅ hasil pertama
  const { anime } = useAnimeDetail(firstResult?.anilist ?? 0); // ✅ fix typescript

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Cari Anime Lewat Gambar</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleSearch(file);
        }}
        className="mb-4"
      />

      {loading && <p>Mencari anime...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {previewUrl && (
        <div className="mb-4">
          <p className="font-semibold">Preview Gambar:</p>
          <Image
            src={previewUrl}
            alt="Preview"
            width={300}
            height={200}
            className="rounded"
          />
        </div>
      )}

      {firstResult && anime && (
        <div className="mt-6 bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">{anime.title.romaji}</h2>
          <p
            className="text-sm text-gray-300"
            dangerouslySetInnerHTML={{ __html: anime.description ?? "" }}
          />
          <div className="mt-2">
            <p>Episode: {firstResult.episode ?? "?"}</p>
            <p>Similarity: {(firstResult.similarity * 100).toFixed(2)}%</p>
            {firstResult.image && (
              <Image
                src={firstResult.image}
                alt="Scene"
                width={400}
                height={250}
                className="rounded mt-2"
              />
            )}
          </div>
        </div>
      )}

      {result && (
        <button
          className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          onClick={reset}
        >
          Reset
        </button>
      )}
    </div>
  );
}
