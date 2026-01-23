import type { NextApiRequest, NextApiResponse } from "next";

const AICHIXIA_ENDPOINT = process.env.AICHIXIA_ENDPOINT;
const AICHIXIA_API_KEY = process.env.AICHIXIA_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!AICHIXIA_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    if (!AICHIXIA_ENDPOINT) {
      return res.status(500).json({ error: "Aichixia endpoint not configured" });
    }

    const { mode, message, history, persona } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const modelMapping: Record<string, string> = {
      deep: "aichixia-thinking",
      normal: "gpt-oss-120b",
    };

    const selectedModel = modelMapping[mode] || modelMapping.normal;

    const messages = [];
    
    if (Array.isArray(history) && history.length > 0) {
      messages.push(...history);
    }
    
    messages.push({
      role: "user",
      content: message,
    });

    const requestBody: any = {
      model: selectedModel,
      messages: messages,
    };

    if (persona) {
      requestBody.persona = persona;
    }

    const response = await fetch(AICHIXIA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AICHIXIA_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "API request failed",
        details: data.error,
      });
    }

    return res.status(200).json({
      type: "text",
      reply: data.choices?.[0]?.message?.content ?? "Huwaa~ something went wrong... can you try again, senpai? 😖💔",
      provider: data.model,
    });

  } catch (err: any) {
    console.error("Aichiow -> Aichixia API error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
}
