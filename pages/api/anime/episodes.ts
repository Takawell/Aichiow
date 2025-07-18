import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as cheerio from 'cheerio'

const BASE_URL = 'https://www.oploverz.now'

// Cari anime di Oploverz berdasarkan title
async function searchAnime(title: string) {
  const searchUrl = `${BASE_URL}/?s=${encodeURIComponent(title)}`
  const { data } = await axios.get(searchUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    },
  })

  const $ = cheerio.load(data)
  const results: { title: string; url: string }[] = []

  $('.result-post .post-title a').each((_, el) => {
    const link = $(el).attr('href')
    const text = $(el).text().trim()
    if (link && text) {
      results.push({ title: text, url: link })
    }
  })

  // Ambil best match pertama
  return results.length > 0 ? results[0].url : null
}

// Ambil daftar episode dari page detail anime Oploverz
async function fetchEpisodes(animeUrl: string) {
  const { data } = await axios.get(animeUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    },
  })

  const $ = cheerio.load(data)
  const episodes: { title: string; url: string }[] = []

  // Cari link di daftar episode
  $('.epslst li a, .listeps li a, .lstepsiode a').each((_, el) => {
    const title = $(el).attr('title') || $(el).text().trim()
    const link = $(el).attr('href')
    if (title && link) {
      episodes.push({ title: title.replace(/\s+/g, ' ').trim(), url: link })
    }
  })

  return episodes.reverse()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title } = req.query

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid title parameter' })
  }

  try {
    const animeUrl = await searchAnime(title)
    if (!animeUrl) {
      return res.status(404).json({ error: 'Anime not found on Oploverz', episodes: [] })
    }

    const episodes = await fetchEpisodes(animeUrl)
    return res.status(200).json({ episodes })
  } catch (error) {
    console.error('Scraper Error:', error)
    return res.status(500).json({ error: 'Failed to fetch anime episodes', episodes: [] })
  }
}
