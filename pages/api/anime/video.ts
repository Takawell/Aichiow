import type { NextApiRequest, NextApiResponse } from "next";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Parameter 'url' diperlukan." });
    }

    // Cari executablePath untuk Chrome di Vercel
    const executablePath = await chromium.executablePath;

    // Launch browser dengan konfigurasi Vercel
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath || undefined,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Ambil iframe video
    const iframeSrc = await page.evaluate(() => {
      const iframe = document.querySelector("iframe");
      return iframe ? iframe.getAttribute("src") : null;
    });

    await browser.close();

    if (!iframeSrc) {
      return res.status(404).json({
        error: "Tidak menemukan iframe video di halaman ini.",
      });
    }

    return res.status(200).json({ videoUrl: iframeSrc });
  } catch (err: any) {
    console.error("Scraper error:", err.message);
    return res.status(500).json({ error: "Gagal mengambil video." });
  }
}
