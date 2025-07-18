import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Parameter 'url' diperlukan." });
    }

    // Ambil halaman anime
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "id,en;q=0.9",
      },
    });

    const $ = cheerio.load(data);

    const title = $("h1.entry-title").text().trim();
    const thumbnail = $(".entry-content img").first().attr("src") || null;

    const episodes: { title: string; url: string }[] = [];

    // Cek apakah ada daftar episode
    $(".eplister ul li").each((_, el) => {
      const link = $(el).find("a").attr("href") || "";
      const epTitle = $(el).find(".epl-title").text().trim();
      if (link && epTitle) {
        episodes.push({ title: epTitle, url: link });
      }
    });

    if (episodes.length === 0) {
      return res.status(404).json({ error: "Episode tidak ditemukan. Periksa URL Samehadaku." });
    }

    // Balik urutan agar episode 1 di awal
    episodes.reverse();

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
