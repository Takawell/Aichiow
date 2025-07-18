// pages/api/anime/video.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Parameter 'url' diperlukan." });
    }

    // Ambil HTML dari halaman Oploverz
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    // Parsing HTML untuk menemukan iframe video
    const $ = cheerio.load(data);
    const iframe = $("iframe").attr("src");

    if (!iframe) {
      return res.status(404).json({ error: "Video tidak ditemukan di halaman ini." });
    }

    return res.status(200).json({ videoUrl: iframe });
  } catch (err: any) {
    console.error("Scraper error:", err.message);
    return res.status(500).json({ error: "Gagal mengambil video dari Oploverz." });
  }
}
