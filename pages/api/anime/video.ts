import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

/**
 * API Endpoint:
 * /api/anime/video?url=<episode_url>
 *
 * Contoh:
 * /api/anime/video?url=https://samehadaku.now/solo-leveling-episode-1/
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;

    // Validasi parameter
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Parameter 'url' diperlukan." });
    }

    // Ambil halaman episode
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });

    // Parse HTML
    const $ = cheerio.load(data);

    // Ambil link iframe video pertama
    const iframeSrc = $("iframe").first().attr("src") || null;

    if (!iframeSrc) {
      return res.status(404).json({ error: "Video tidak ditemukan di halaman episode." });
    }

    // Response
    return res.status(200).json({
      videoUrl: iframeSrc,
      sourcePage: url,
    });
  } catch (err: any) {
    console.error("Scraper error:", err.message);
    return res.status(500).json({ error: "Gagal mengambil data video." });
  }
}
