import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

// Ambil nama file cover dari relationships
function getCoverFileName(manga: any): string | null {
  const cover = manga.relationships?.find((rel: any) => rel.type === 'cover_art')
  return cover?.attributes?.fileName || null
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

    const withCovers = mangas.map((manga: any) => ({
      id: manga.id,
      title: manga.attributes.title,
      coverFileName: getCoverFileName(manga),
    }))

    res.status(200).json(withCovers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch manga section' })
  }
}
