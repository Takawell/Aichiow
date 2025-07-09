// lib/getGogoSlugFromTitle.ts
export async function getGogoSlugFromTitle(title: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(title)
    const res = await fetch(`https://api.consumet.org/anime/gogoanime/${query}`)
    const data = await res.json()

    if (data?.results?.length > 0) {
      return data.results[0].id
    }

    return null
  } catch (err) {
    console.error("Failed to fetch Gogoanime slug:", err)
    return null
  }
}
