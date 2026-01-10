import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.AICHIXIA_API_KEY;
const BASE_URL = "https://aichixia.vercel.app/api/v1/chat/completions";

if (!API_KEY) {
  console.error("⚠️  AICHIXIA_API_KEY is not set in environment variables!");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!API_KEY) {
      console.error("❌ API request blocked: AICHIXIA_API_KEY not configured");
      return res.status(500).json({
        error: "API key not configured",
        details: "AICHIXIA_API_KEY environment variable is missing",
      });
    }

    const { mode, message, history, persona } = req.body;

    const modelName = mode === "deep" ? "groq-compound" : "gemini-3-flash";

    const messages = [];
    
    if (persona) {
      messages.push({
        role: "system",
        content: persona,
      });
    }

    if (history && Array.isArray(history)) {
      messages.push(...history);
    }

    messages.push({
      role: "user",
      content: message,
    });

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.8,
        max_tokens: 1080,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ API request failed:", data.error?.message || "Unknown error");
      throw new Error(data.error?.message || "API request failed");
    }

    const reply = data.choices[0]?.message?.content || "Huwaa~ something went wrong... can you try again, senpai? 😖💔";

    return res.status(200).json({
      type: "text",
      reply: reply,
      provider: mode === "deep" ? "compound" : "gemini",
    });
  } catch (err: any) {
    console.error("❌ Aichiow -> Aichixia API error:", err.message);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
}
