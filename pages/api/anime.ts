// test for discord bot
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  fetchTrendingAnime,
  fetchOngoingAnime,
  fetchSeasonalAnime,
  fetchTopRatedAnime,
  fetchUpcomingAnime,
  fetchScheduleAnime,
  fetchAnimeDetail,
  fetchNewsAnime,
  fetchSimilarAnime,
  fetchMangaCharacters,
  fetchTrendingAnimePaginated,
} from '@/lib/anilist'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action, id, title, page, perPage } = req.query

  try {
    switch (action) {
      case 'trending': {
        const data = await fetchTrendingAnime()
        return res.status(200).json(data)
      }

      case 'trending-paginated': {
        const currentPage = Number(page) || 1
        const currentPerPage = Number(perPage) || 10
        const data = await fetchTrendingAnimePaginated(currentPage, currentPerPage)
        return res.status(200).json(data)
      }

      case 'ongoing': {
        const data = await fetchOngoingAnime()
        return res.status(200).json(data)
      }

      case 'seasonal': {
        const data = await fetchSeasonalAnime()
        return res.status(200).json(data)
      }

      case 'top-rated': {
        const data = await fetchTopRatedAnime()
        return res.status(200).json(data)
      }

      case 'upcoming': {
        const data = await fetchUpcomingAnime()
        return res.status(200).json(data)
      }

      case 'schedule': {
        const data = await fetchScheduleAnime()
        return res.status(200).json(data)
      }

      case 'detail': {
        if (!id || Array.isArray(id)) {
          return res.status(400).json({ error: 'Missing or invalid anime ID' })
        }
        const data = await fetchAnimeDetail(Number(id))
        return res.status(200).json(data)
      }

      case 'news': {
        const data = await fetchNewsAnime()
        return res.status(200).json(data)
      }

      case 'similar': {
        if (!id || Array.isArray(id)) {
          return res.status(400).json({ error: 'Missing or invalid anime ID' })
        }
        const data = await fetchSimilarAnime(Number(id))
        return res.status(200).json(data)
      }

      case 'characters': {
        if (!title || typeof title !== 'string') {
          return res.status(400).json({ error: 'Missing or invalid anime title' })
        }
        const data = await fetchMangaCharacters(title)
        return res.status(200).json(data)
      }

      default:
        return res.status(400).json({ error: 'Invalid or missing action parameter' })
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', detail: (error as Error).message })
  }
}
