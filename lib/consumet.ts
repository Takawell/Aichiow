const BASE = "https://api-aichixia.vercel.app/anime/hianime";

export async function consumetSearch(query: string) {
  const res = await fetch(`${BASE}/${encodeURIComponent(query)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetInfo(id: string) {
  const res = await fetch(`${BASE}/info?id=${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetWatch(episodeId: string) {
  const res = await fetch(`${BASE}/watch/${encodeURIComponent(episodeId)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetAdvancedSearch(params: string) {
  const res = await fetch(`${BASE}/advanced-search?${params}`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetTopAiring() {
  const res = await fetch(`${BASE}/top-airing`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetLatestCompleted() {
  const res = await fetch(`${BASE}/latest-completed`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetRecentlyUpdated() {
  const res = await fetch(`${BASE}/recently-updated`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetRecentlyAdded() {
  const res = await fetch(`${BASE}/recently-added`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetTopUpcoming() {
  const res = await fetch(`${BASE}/top-upcoming`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetStudio(studio: string) {
  const res = await fetch(`${BASE}/studio/${encodeURIComponent(studio)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetGenres() {
  const res = await fetch(`${BASE}/genres`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetGenre(genre: string) {
  const res = await fetch(`${BASE}/genre/${encodeURIComponent(genre)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetSchedule() {
  const res = await fetch(`${BASE}/schedule`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetSpotlight() {
  const res = await fetch(`${BASE}/spotlight`);
  if (!res.ok) return null;
  return res.json();
}

export async function consumetSearchSuggestions(query: string) {
  const res = await fetch(`${BASE}/search-suggestions/${encodeURIComponent(query)}`);
  if (!res.ok) return null;
  return res.json();
}
