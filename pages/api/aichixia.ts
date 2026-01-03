import type { NextApiRequest, NextApiResponse } from "next";
import Aichixia from "@aichixia/sdk";

const client = new Aichixia();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { mode, message, history, persona } = req.body;

    let response;

    if (mode === "deep") {
      response = await client.deepSearch(message, {
        history: history || [],
        persona: persona,
      });
    } else {
      response = await client.chat(message, {
        history: history || [],
        persona: persona,
      });
    }

    return res.status(200).json({
      type: "text",
      reply: response.reply ?? "Huwaa~ something went wrong... can you try again, senpai? 😖💔",
      provider: response.provider,
    });
  } catch (err: any) {
    console.error("Aichiow -> Aichixia API error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
}
