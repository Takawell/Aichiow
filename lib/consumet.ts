// lib/consumet.ts

const BASE_URL = "https://api.consumet.org/anime/gogoanime"

export async function searchAnime(query: string) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error("Failed to search anime")
  const data = await res.json()
  return data.results || []
}

export async function fetchAnimeDetail(slug: string) {
  const res = await fetch(`${BASE_URL}/info/${slug}`)
  if (!res.ok) throw new Error("Failed to fetch anime detail")
  const data = await res.json()
  return data // includes episodes[]
}

export async function fetchEpisodeSources(episodeId: string) {
  try {
    const res = await fetch(`${BASE_URL}/watch/${episodeId}`)
    if (!res.ok) throw new Error("Failed to fetch episode sources")
    const data = await res.json()
    return data // contains .sources, .download, etc.
  } catch (err) {
    console.error("Error fetching episode sources:", err)
    return null
  }
}
