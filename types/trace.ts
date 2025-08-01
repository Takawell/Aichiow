// types/trace.ts

export interface TraceMoeResult {
  anilist: number;
  filename: string;
  episode?: number;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
  title: string;
  title_native: string;
  title_romaji: string;
  title_english: string;
  is_adult: boolean;
}

export interface TraceMoeResponse {
  frameCount: number;
  result: TraceMoeResult[];
}
