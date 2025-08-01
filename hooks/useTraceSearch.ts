// hooks/useTraceSearch.ts

import { useState } from "react";
import { searchAnimeByImage } from "@/lib/traceMoe";
import { TraceMoeResponse } from "@/types/trace";

export function useTraceSearch() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TraceMoeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSearch = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const base64 = await convertToBase64(file);
    if (!base64) {
      setError("Gagal mengubah gambar ke base64.");
      setLoading(false);
      return;
    }

    setPreviewUrl(base64); // tampilkan preview di UI

    const data = await searchAnimeByImage(base64);
    if (!data || data.result.length === 0) {
      setError("Tidak ditemukan hasil yang cocok.");
    } else {
      setResult(data);
    }

    setLoading(false);
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setPreviewUrl(null);
    setLoading(false);
  };

  return {
    loading,
    result,
    error,
    previewUrl,
    handleSearch,
    reset,
  };
}

function convertToBase64(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve(null);
  });
}
