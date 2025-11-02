import type { NextApiRequest, NextApiResponse } from "next";
import { fetchYouTubeShorts } from "@/utils/fetchYouTubeShorts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const keywords = ["anime shorts", "anime amv", "anime jedag jedug"];
    const results = await Promise.all(
      keywords.map((q) => fetchYouTubeShorts(q, 6))
    );

    const merged = Array.from(
      new Map(results.flat().map((v) => [v.url, v])).values()
    );

    const shuffled = merged.sort(() => Math.random() - 0.5);

    res.status(200).json({
      success: true,
      count: shuffled.length,
      data: shuffled,
    });
  } catch (error) {
    console.error("Feed API Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch anime shorts feed",
    });
  }
}
