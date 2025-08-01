
"use client";

import { useRef } from "react";
import { useTraceSearch } from "@/hooks/useTraceSearch";
import { Upload, ImagePlus, X } from "lucide-react";

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
    <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto px-4">
      {!previewUrl && (
        <div
          className="w-full h-64 border-2 border-dashed border-blue-500 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center text-gray-300 hover:text-white transition-all duration-200 ease-in-out cursor-pointer relative group"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <Upload className="w-10 h-10 mb-2 text-blue-400 group-hover:scale-110 transition" />
          <p className="text-lg font-medium">Drag & Drop gambar anime</p>
          <p className="text-sm text-gray-400 group-hover:text-gray-200">atau klik untuk pilih file</p>
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
        <div className="relative w-full group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full rounded-xl shadow-md border border-white/10"
          />
          <button
            onClick={reset}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition"
            title="Ganti Gambar"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {loading && (
        <p className="text-blue-400 font-medium animate-pulse mt-2">Mencari anime...</p>
      )}

      {error && (
        <p className="text-red-500 font-medium mt-2">{error}</p>
      )}
    </div>
  );
}
