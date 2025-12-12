import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { mode, ...bodyData } = req.body;

    const targetUrl = mode === "deep" 
      ? "https://aichixia.vercel.app/api/models/compound"
      : "https://aichixia.vercel.app/api/chat";

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    return res.status(response.status).json({
      type: "text",
      reply: data.reply ?? "Huwaa~ something went wrong... can you try again, senpai? 😖💔",
      provider: data.provider,
    });
  } catch (err: any) {
    console.error("Aichiow -> Aichixia API error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
}
