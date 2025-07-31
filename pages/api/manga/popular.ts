import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BASE_URL = 'https://api.mangadex.org'

// Utility untuk filter hanya manga yang punya cover_art
function hasCoverArt(manga: any) {
  return manga.relationships?.some((rel: any) => rel.type === 'cover_art')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 40,
        order: { followedCount: 'desc' },
        contentRating: ['safe', 'suggestive'],
        includes: ['cover_art'],
        hasAvailableChapters: true,
      },
    })

    const mangaList = response.data.data
      .filter(hasCoverArt)
      .map((manga: any) => {
        const cover = manga.relationships.find((rel: any) => rel.type === 'cover_art')
        const fileName = cover?.attributes?.fileName

        return {
          id: manga.id,
          title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
          description: manga.attributes.description.en || '',
          coverUrl: fileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
            : null,
        }
      })

    res.status(200).json(mangaList)
  } catch (error: any) {
    console.error('[API] /api/manga/popular error:', error.message)
    res.status(500).json({ message: 'Failed to fetch popular manga' })
  }
}
