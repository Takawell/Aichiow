import type { NextApiRequest, NextApiResponse } from "next"
import {
  fetchTrendingAnime,
  fetchOngoingAnime,
  fetchSeasonalAnime,
  fetchTopRatedAnime,
  fetchUpcomingAnime,
  fetchAnimeDetail,
  fetchFromAnilist,
} from "@/lib/anilist"
import {
  fetchManhwaList,
  searchManhwa,
  fetchManhwaDetail,
} from "@/lib/anilistManhwa"

const mockResponses = [
  "Hmm... menarik, tapi AichixiA belum punya jawabannya~",
  "Coba tanya yang lain dong! Misalnya anime populer!",
  "Mungkin kamu bisa cari berdasarkan genre tertentu?",
  "Aku suka genre fantasy, kamu suka apa?"
]

// helper fetch detail anime by title
async function fetchAnimeByTitle(title: string) {
  const query = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
        }
        description
      }
    }
  `
  const data = await fetchFromAnilist(query, { search: title })
  return data?.Media || null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { message } = req.body
  if (!message) return res.status(400).json({ error: "Message is required" })

  const lowerMsg = message.toLowerCase()

  try {
    // === ANIME ===
    if (lowerMsg.includes("anime trending") || lowerMsg.includes("trending anime")) {
      const list = await fetchTrendingAnime()
      const titles = list.slice(0, 5).map(a => a.title.romaji || a.title.english).join(", ")
      return res.status(200).json({ reply: `Anime trending saat ini: ${titles}` })
    }

    if (lowerMsg.includes("ongoing")) {
      const list = await fetchOngoingAnime()
      const titles = list.slice(0, 5).map(a => a.title.romaji || a.title.english).join(", ")
      return res.status(200).json({ reply: `Anime ongoing sekarang: ${titles}` })
    }

    if (lowerMsg.includes("seasonal") || lowerMsg.includes("musim ini")) {
      const list = await fetchSeasonalAnime()
      const titles = list.slice(0, 5).map(a => a.title.romaji || a.title.english).join(", ")
      return res.status(200).json({ reply: `Anime musim ini: ${titles}` })
    }

    if (lowerMsg.includes("top rated") || lowerMsg.includes("rating tinggi")) {
      const list = await fetchTopRatedAnime()
      const titles = list.slice(0, 5).map(a => a.title.romaji || a.title.english).join(", ")
      return res.status(200).json({ reply: `Anime rating tertinggi: ${titles}` })
    }

    if (lowerMsg.includes("upcoming") || lowerMsg.includes("akan rilis")) {
      const list = await fetchUpcomingAnime()
      const titles = list.slice(0, 5).map(a => a.title.romaji || a.title.english).join(", ")
      return res.status(200).json({ reply: `Anime yang akan datang: ${titles}` })
    }

    // === GENRE ANIME ===
    if (lowerMsg.includes("anime genre")) {
      const genre = lowerMsg.split("anime genre")[1]?.trim().split(" ")[0]
      if (genre) {
        const query = `
          query ($genre: String) {
            Page(perPage: 10) {
              media(type: ANIME, genre: $genre, sort: POPULARITY_DESC) {
                title { romaji }
              }
            }
          }
        `
        const data = await fetchFromAnilist(query, { genre })
        const titles = data.Page.media.map((m: any) => m.title.romaji).join(", ")
        return res.status(200).json({ reply: `Anime genre ${genre}: ${titles}` })
      }
    }

    // === CARI DETAIL ANIME ===
    if (lowerMsg.startsWith("anime ")) {
      const title = message.replace(/anime/i, "").trim()
      const data = await fetchAnimeByTitle(title)
      if (data) {
        return res.status(200).json({
          reply: `📺 ${data.title.romaji}\n${data.description?.replace(/<[^>]+>/g, "").slice(0, 300) ?? "No description."}...`
        })
      }
    }

    // === MANHWA ===
    if (lowerMsg.includes("manhwa trending") || lowerMsg.includes("trending manhwa") || lowerMsg.includes("manhwa populer")) {
      const { list } = await fetchManhwaList(1)
      const titles = list.slice(0, 5).map((m: any) => m.title.romaji || m.title.english).join(", ")
      return res.status(200).json({ reply: `Manhwa populer sekarang: ${titles}` })
    }

    if (lowerMsg.includes("manhwa genre")) {
      const genre = lowerMsg.split("manhwa genre")[1]?.trim().split(" ")[0]
      if (genre) {
        const { list } = await fetchManhwaList(1, genre)
        const titles = list.slice(0, 5).map((m: any) => m.title.romaji || m.title.english).join(", ")
        return res.status(200).json({ reply: `Manhwa genre ${genre}: ${titles}` })
      }
    }

    if (lowerMsg.startsWith("manhwa ")) {
      const title = message.replace(/manhwa/i, "").trim()
      const list = await searchManhwa(title)
      const found = list?.[0]
      if (found) {
        return res.status(200).json({
          reply: `📖 ${found.title.romaji}\n${found.description?.replace(/<[^>]+>/g, "").slice(0, 300) ?? "No description."}...`
        })
      }
    }

    // === DEFAULT ===
    const fallback = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    return res.status(200).json({ reply: fallback })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ reply: "⚠️ AichixiA error saat mengambil data." })
  }
}
