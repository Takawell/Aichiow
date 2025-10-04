export interface TraceMoeResult {
  anilist: number;
  filename: string;
  episode?: number;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
  title: {
    native?: string;
    romaji?: string;
    english?: string;
  };
}

export interface TraceMoeResponse {
  frameCount: number;
  result: TraceMoeResult[];
}

export async function searchAnimeByImage(imageUrl: string): Promise<TraceMoeResult[]> {
  try {
    const res = await fetch(`https://api.trace.moe/search?url=${encodeURIComponent(imageUrl)}`);
    if (!res.ok) throw new Error("Failed to fetch trace.moe data");

    const data: TraceMoeResponse = await res.json();
    return data.result || [];
  } catch (err) {
    console.error("[trace.moe] searchAnimeByImage error:", err);
    return [];
  }
}

export async function searchAnimeByFile(file: File): Promise<TraceMoeResult[]> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("https://api.trace.moe/search", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload file to trace.moe");

    const data: TraceMoeResponse = await res.json();
    return data.result || [];
  } catch (err) {
    console.error("[trace.moe] searchAnimeByFile error:", err);
    return [];
  }
}
