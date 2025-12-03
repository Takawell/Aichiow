export function normalizeTitle(title?: string | null): string {
  if (!title) return "";

  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")  
    .replace(/\s+/g, " ")         
    .trim();
}

export function normalizeMediaTitles(titles: {
  romaji?: string | null;
  english?: string | null;
  native?: string | null;
}) {
  return {
    romaji: normalizeTitle(titles.romaji),
    english: normalizeTitle(titles.english),
    native: normalizeTitle(titles.native),
  };
}
