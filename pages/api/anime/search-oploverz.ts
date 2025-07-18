import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter' })
  }

  try {
    const searchUrl = `https://www.oploverz.now/?s=${encodeURIComponent(query)}`
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    })

    const $ = cheerio.load(data)
    const results: { title: string; url: string }[] = []

    $('.bsx a').each((_, el) => {
      const title = $(el).attr('title')?.trim() || ''
      const url = $(el).attr('href') || ''
      if (title && url) {
        results.push({ title, url })
      }
    })

    if (results.length === 0) {
      return res.status(404).json({ error: 'No results found' })
    }

    // Ambil hasil pertama (paling relevan)
    return res.status(200).json({ bestMatch: results[0], results })
  } catch (error) {
    console.error('Search Oploverz Error:', error)
    return res.status(500).json({ error: 'Failed to fetch search results' })
  }
}
