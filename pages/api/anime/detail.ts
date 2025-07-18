import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

/**
 * API Endpoint:
 * /api/anime/detail?url=<anime_page_url>
 * 
 * Contoh:
 * /api/anime/detail?url=https://samehadaku.now/anime/solo-leveling/
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Parameter 'url' diperlukan." });
    }

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    const title = $("h1.entry-title").text().trim();
    const thumbnail = $(".entry-content img").first().attr("src") || null;

    // Ambil daftar episode
    const episodes: { title: string; url: string }[] = [];
    $(".eplister ul li a").each((_, el) => {
      const epTitle = $(el).find(".epl-title").text().trim();
      const epUrl = $(el).attr("href") || "";
      if (epTitle && epUrl) {
        episodes.push({ title: epTitle, url: epUrl });
      }
    });

    return res.status(200).json({
      title,
      thumbnail,
      episodes,
      sourcePage: url,
    });
  } catch (err: any) {
    console.error("Scraper error:", err.message);
    return res.status(500).json({ error: "Gagal mengambil data anime." });
  }
}
