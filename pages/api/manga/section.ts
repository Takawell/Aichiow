import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

function hasCoverArt(manga: any) {
  return manga.relationships?.some((rel: any) => rel.type === 'cover_art')
}

function getCoverFileName(manga: any) {
  const cover = manga.relationships?.find((rel: any) => rel.type === 'cover_art')
  return cover?.attributes?.fileName || null
}

function getStatus(manga: any) {
  return manga.attributes?.status || 'unknown'
}

function getTitle(manga: any) {
  const title = manga.attributes?.title || {}
  return (
    title.en ||
    title.ja ||
    title['en-us'] ||
    Object.values(title)[0] ||
    'Untitled'
  )
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

    const filtered = mangas.filter(hasCoverArt).map((manga: any) => ({
      id: manga.id,
      title: getTitle(manga),
      coverFileName: getCoverFileName(manga),
      status: getStatus(manga), 
    }))

    res.status(200).json(filtered)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch manga section' })
  }
}
