// components/TraceSearch/ImageUpload.tsx

"use client";

import { useRef } from "react";
import { useTraceSearch } from "@/hooks/useTraceSearch";

export default function ImageUpload() {
  const { handleSearch, loading, error, previewUrl, reset } = useTraceSearch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleSearch(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleSearch(file);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto">
      {!previewUrl && (
        <div
          className="w-full h-64 border-4 border-dashed border-blue-500 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <p className="text-lg">Drag & Drop Gambar di sini</p>
          <p className="text-sm text-gray-500">atau klik untuk pilih gambar</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={onFileChange}
      />

      {previewUrl && (
        <div className="relative w-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full rounded-xl shadow-lg border"
          />
          <button
            onClick={reset}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white px-3 py-1 text-sm rounded"
          >
            Ganti Gambar
          </button>
        </div>
      )}

      {loading && (
        <p className="text-blue-500 font-medium animate-pulse">Mencari anime...</p>
      )}

      {error && (
        <p className="text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
