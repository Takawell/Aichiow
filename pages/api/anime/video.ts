import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Parameter 'url' diperlukan." });
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Ambil iframe src
    const iframeSrc = await page.evaluate(() => {
      const iframe = document.querySelector("iframe");
      return iframe ? iframe.getAttribute("src") : null;
    });

    await browser.close();

    if (!iframeSrc) {
      return res.status(404).json({ error: "Tidak menemukan iframe video." });
    }

    return res.status(200).json({ videoUrl: iframeSrc });
  } catch (err: any) {
    console.error("Scraper error:", err.message);
    return res.status(500).json({ error: "Gagal mengambil video." });
  }
}
