import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Parameter 'url' diperlukan." });
    }

    // Ambil HTML dari halaman episode
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "id,en;q=0.9",
      },
    });

    const $ = cheerio.load(data);

    // Cari iframe video (Samehadaku biasanya taruh di .entry-content atau player)
    let iframeSrc =
      $("iframe").attr("src") ||
      $("iframe").first().attr("data-src") ||
      null;

    // Cek apakah iframe ditemukan
    if (!iframeSrc) {
      return res.status(404).json({
        error: "Tidak menemukan iframe video di halaman episode.",
      });
    }

    // Normalisasi URL (Samehadaku kadang pakai //domain.com)
    if (iframeSrc.startsWith("//")) {
      iframeSrc = "https:" + iframeSrc;
    }

    return res.status(200).json({ videoUrl: iframeSrc });
  } catch (err: any) {
    console.error("Scraper error:", err.message);
    return res.status(500).json({ error: "Gagal mengambil video." });
  }
}
