import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const targetUrl = "https://aichixia.vercel.app/api/chat";

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err: any) {
    console.error("Aichiow -> Aichixia API error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
}
