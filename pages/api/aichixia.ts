import type { NextApiRequest, NextApiResponse } from "next";
import { chatAichixia } from "@/lib/aichixia";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
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

    const hist = Array.isArray(history) ? [...history] : [];
    hist.push({ role: "user", content: message });

    const result = await chatAichixia(hist, {
      model: selectedModel,
      persona: persona,
    });

    return res.status(200).json({
      type: "text",
      reply: result.reply,
      provider: selectedModel,
    });

  } catch (err: any) {
    console.error("Aichiow -> Aichixia API error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
}
