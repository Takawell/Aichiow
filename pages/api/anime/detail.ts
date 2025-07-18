import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL parameter' })
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    })

    const $ = cheerio.load(data)
    const episodes: { title: string; url: string }[] = []

    // Selector ultra-generik
    $('a').each((_, el) => {
      const text = $(el).text().trim()
      const titleAttr = $(el).attr('title') || ''
      const link = $(el).attr('href') || ''

      // Hanya ambil link yang ada kata "Episode" atau angka
      if (
        link &&
        (titleAttr.toLowerCase().includes('episode') ||
         text.toLowerCase().includes('episode') ||
         /\b\d+\b/.test(text))
      ) {
        episodes.push({
          title: text || titleAttr || 'Episode',
          url: link,
        })
      }
    })

    // Hapus duplikat
    const uniqueEpisodes = episodes.filter(
      (ep, index, self) => index === self.findIndex((e) => e.url === ep.url)
    )

    return res.status(200).json({
      episodes: uniqueEpisodes.reverse(),
    })
  } catch (error) {
    console.error('Scraper Error:', error)
    return res.status(500).json({ error: 'Failed to fetch anime details' })
  }
}
