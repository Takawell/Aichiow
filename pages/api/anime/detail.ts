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

    // Ambil semua episode dari list
    const episodes: { title: string; url: string }[] = []

    $('.lstepsiode.listeps li').each((_, el) => {
      const title = $(el).find('a').text().trim()
      const link = $(el).find('a').attr('href')

      if (title && link) {
        episodes.push({
          title: title.replace(/\s+/g, ' '), // hapus spasi berlebihan
          url: link,
        })
      }
    })

    return res.status(200).json({
      episodes: episodes.reverse(), // episode lama -> baru
    })
  } catch (error) {
    console.error('Scraper Error:', error)
    return res.status(500).json({ error: 'Failed to fetch anime details' })
  }
}
