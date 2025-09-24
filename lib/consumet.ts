const BASE = "https://apiconsumetorg-three-orcin.vercel.app/anime/zoro";

export async function searchZoro(query: string) {
  const res = await fetch(`${BASE}/${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search anime");
  return res.json();
}

export async function getZoroEpisodes(id: string) {
  const res = await fetch(`${BASE}/episodes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch episodes");
  return res.json();
}

export async function getZoroWatch(episodeId: string) {
  const res = await fetch(`${BASE}/watch/${episodeId}`);
  if (!res.ok) throw new Error("Failed to fetch stream");
  return res.json();
}
