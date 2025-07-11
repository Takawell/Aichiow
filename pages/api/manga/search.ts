// pages/api/manga/search.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

function hasCoverArt(manga: any) {
  return manga.relationships?.some((rel: any) => rel.type === 'cover_art')
}

function matchesQuery(manga: any, query: string) {
  const lowered = query.toLowerCase().trim()
  const titles = [
    ...Object.values(manga.attributes.title || {}),
    ...manga.attributes.altTitles.flatMap((alt: any) => Object.values(alt)),
  ]

  return titles.some((title) =>
    typeof title === 'string' && title.toLowerCase().includes(lowered)
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ message: 'Query is required' })
  }

  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        title: q,
        limit: 50,
        includes: ['cover_art'],
        contentRating: ['safe', 'suggestive'],
      },
    })

    const result = response.data.data.filter(
      (manga: any) => hasCoverArt(manga) && matchesQuery(manga, q)
    )

    res.status(200).json(result)
  } catch (error: any) {
    console.error('[API] /api/manga/search error:', error.message)
    res.status(500).json({ message: 'Failed to search manga' })
  }
}
