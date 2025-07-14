// pages/api/manga/section.ts
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

// Ambil file cover
function getCoverFileName(manga: any): string | null {
  const cover = manga.relationships?.find((rel: any) => rel.type === 'cover_art')
  return cover?.attributes?.fileName || null
}

// Ambil judul lokal
function getTitle(manga: any): string {
  const titles = manga.attributes?.title || {}
  return titles.en || Object.values(titles)[0] || 'Untitled'
}

// Validasi cover_art
function hasCoverArt(manga: any) {
  return manga.relationships?.some((rel: any) => rel.type === 'cover_art')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query

  let url = `https://api.mangadex.org/manga?limit=12&includes[]=cover_art&contentRating[]=safe`

  if (type === 'ongoing' || type === 'completed') {
    url += `&status[]=${type}&order[followedCount]=desc`
  } else if (type === 'top_rated') {
    url += `&order[rating]=desc`
  } else if (type === 'latest') {
    url += `&order[latestUploadedChapter]=desc`
  }

  try {
    const response = await axios.get(url)
    const mangas = response.data.data

    const formatted = mangas
      .filter(hasCoverArt)
      .map((manga: any) => ({
        id: manga.id,
        title: getTitle(manga),
        coverFileName: getCoverFileName(manga),
        status: manga.attributes.status,
      }))

    res.status(200).json(formatted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch manga section' })
  }
}
