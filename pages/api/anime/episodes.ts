import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title } = req.query

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid title parameter' })
  }

  try {
    const searchUrl = `https://www.oploverz.now/?s=${encodeURIComponent(title)}`
    const { data: searchPage } = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    })

    const $search = cheerio.load(searchPage)

    // Ambil anime pertama dari hasil pencarian
    const firstAnimeLink = $search('.result-item h3 a').attr('href')
    const firstAnimeTitle = $search('.result-item h3 a').text().trim()

    if (!firstAnimeLink) {
      return res.status(404).json({ error: 'Anime not found on Oploverz' })
    }

    // Scraping halaman detail anime untuk daftar episode
    const { data: animePage } = await axios.get(firstAnimeLink, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    })

    const $ = cheerio.load(animePage)
    const episodes: { title: string; url: string }[] = []

    $('.epslst li a, .listeps li a, .lstepsiode a').each((_, el) => {
      const epTitle = $(el).attr('title') || $(el).text().trim()
      const epUrl = $(el).attr('href')

      if (epTitle && epUrl) {
        episodes.push({
          title: epTitle.replace(/\s+/g, ' ').trim(),
          url: epUrl,
        })
      }
    })

    return res.status(200).json({
      anime: firstAnimeTitle,
      link: firstAnimeLink,
      episodes: episodes.reverse(),
    })
  } catch (error) {
    console.error('Scraper Error:', error)
    return res.status(500).json({ error: 'Failed to fetch anime episodes' })
  }
}
