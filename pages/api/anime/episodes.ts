// pages/api/anime/episodes.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as cheerio from 'cheerio'

const OPLOVERZ_BASE = 'https://www.oploverz.now'

// Fungsi untuk search anime di Oploverz
async function searchOploverz(title: string) {
  try {
    const searchUrl = `${OPLOVERZ_BASE}/?s=${encodeURIComponent(title)}`
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    })

    const $ = cheerio.load(data)
    const firstResult = $('.bsx a').first()
    const animeUrl = firstResult.attr('href')

    return animeUrl || null
  } catch (err) {
    console.error('Search Oploverz Error:', err)
    return null
  }
}

// Fungsi untuk ambil episode dari halaman detail anime Oploverz
async function scrapeEpisodes(animeUrl: string) {
  try {
    const { data } = await axios.get(animeUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    })

    const $ = cheerio.load(data)
    const episodes: { title: string; url: string }[] = []

    $('.epslst li a, .listeps li a, .lstepsiode a').each((_, el) => {
      const title = $(el).attr('title') || $(el).text().trim()
      const link = $(el).attr('href')

      if (title && link) {
        episodes.push({
          title: title.replace(/\s+/g, ' ').trim(),
          url: link,
        })
      }
    })

    return episodes.reverse() // dari episode 1 ke terbaru
  } catch (error) {
    console.error('Scraper Error:', error)
    return []
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title } = req.query

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid title parameter' })
  }

  try {
    // Step 1: Cari anime di Oploverz
    const animeUrl = await searchOploverz(title)
    if (!animeUrl) {
      return res.status(404).json({ episodes: [], message: 'Anime not found on Oploverz' })
    }

    // Step 2: Scrape daftar episode
    const episodes = await scrapeEpisodes(animeUrl)

    return res.status(200).json({ animeUrl, episodes })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Failed to fetch episodes' })
  }
}
