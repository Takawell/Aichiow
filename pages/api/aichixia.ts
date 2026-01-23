import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const AICHIXIA_ENDPOINT = process.env.AICHIXIA_ENDPOINT;
const AICHIXIA_API_KEY = process.env.AICHIXIA_API_KEY;

const client = new OpenAI({
  apiKey: AICHIXIA_API_KEY,
  baseURL: AICHIXIA_ENDPOINT,
});

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
      deep: "glm-4.7",
      normal: "gemini-3-flash",
    };

    const selectedModel = modelMapping[mode] || modelMapping.normal;

    const messages: any[] = [];
    
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

    const response = await client.chat.completions.create(requestBody);

    return res.status(200).json({
      type: "text",
      reply: response.choices?.[0]?.message?.content ?? "Huwaa~ something went wrong... can you try again, senpai? 😖💔",
      provider: response.model,
    });

  } catch (err: any) {
    console.error("Aichiow -> Aichixia API error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
}
