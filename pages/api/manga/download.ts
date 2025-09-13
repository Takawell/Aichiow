import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import JSZip from "jszip";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chapterId } = req.query;

  if (!chapterId || typeof chapterId !== "string") {
    return res.status(400).json({ message: "Chapter ID is required" });
  }

  try {
    const { data } = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
    const baseUrl = data.baseUrl;
    const hash = data.chapter.hash;
    const images: string[] = data.chapter.data;

    const zip = new JSZip();

    for (let i = 0; i < images.length; i++) {
      const imgUrl = `${baseUrl}/data/${hash}/${images[i]}`;
      const imgResponse = await axios.get(imgUrl, { responseType: "arraybuffer" });
      zip.file(`page-${i + 1}.jpg`, imgResponse.data);
    }

    const content = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=chapter-${chapterId}.zip`);
    res.send(content);
  } catch (error: any) {
    console.error("[API] /api/manga/download error:", error.message);
    res.status(500).json({ message: "Failed to download chapter" });
  }
}
