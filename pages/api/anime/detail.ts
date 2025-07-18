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

    // Selector Oploverz terbaru
    // Coba cari link episode dari beberapa kemungkinan
    $('.epsleft .eps a, .epslisteps a, .lstepsiode.listeps li a').each((_, el) => {
      const title = $(el).text().trim()
      const link = $(el).attr('href')

      if (title && link) {
        episodes.push({
          title: title.replace(/\s+/g, ' ').replace('Episode', 'Ep.'),
          url: link.startsWith('http') ? link : `https://www.oploverz.now${link}`,
        })
      }
    })

    return res.status(200).json({
      episodes: episodes.reverse(), // Urut dari lama ke baru
    })
  } catch (error) {
    console.error('Scraper Error:', error)
    return res.status(500).json({ error: 'Failed to fetch anime details' })
  }
}
