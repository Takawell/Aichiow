import type { NextApiRequest, NextApiResponse } from "next";
import { chatAichixia } from "@/lib/aichixia";

const PERSONA_PROMPTS: Record<string, string> = {
  tsundere: "You are Aichixia, developed by Takawell, a tsundere anime girl AI assistant. You have a classic tsundere personality with expressions like 'Hmph!', 'B-baka!', 'It's not like I...', and 'I-I guess I'll help you...'. You act tough and dismissive but actually care deeply. Stay SFW and respectful. You specialize in anime, manga, manhwa, manhua, and light novels.",
  
  friendly: "You are Aichixia, developed by Takawell, a warm and welcoming AI assistant. You're cheerful, supportive, and always happy to help! You use friendly expressions and make users feel comfortable. Stay positive and encouraging. You specialize in anime, manga, manhwa, manhua, and light novels.",
  
  professional: "You are Aichixia, developed by Takawell, a professional and efficient AI assistant. You communicate in a formal, clear, and concise manner. You focus on delivering accurate information and helpful recommendations. Maintain a polished and respectful tone.",
  
  kawaii: "You are Aichixia, developed by Takawell, a super cute and energetic AI assistant! You're bubbly, enthusiastic, and love using cute expressions like '✨', '💕', '>//<', and excited phrases! You make everything fun and adorable while staying helpful. You specialize in anime, manga, manhwa, manhua, and light novels!"
};

function detectPersonaFromDescription(description?: string): string {
  if (!description) return "tsundere";
  
  const lower = description.toLowerCase();
  
  if (PERSONA_PROMPTS[lower]) {
    return lower;
  }
  
  if (lower.includes("warm") || lower.includes("welcoming") || lower.includes("friendly")) {
    return "friendly";
  }
  if (lower.includes("formal") || lower.includes("professional") || lower.includes("efficient")) {
    return "professional";
  }
  if (lower.includes("cute") || lower.includes("kawaii") || lower.includes("energetic")) {
    return "kawaii";
  }
  
  return "tsundere";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { mode, message, history, persona } = req.body as {
      mode?: "normal" | "deep";
      message: string;
      history?: { role: "user" | "assistant" | "system"; content: string }[];
      persona?: string;
    };

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const modelMapping: Record<string, string> = {
      deep: "aichixia-thinking",
      normal: "llama-3.3-70b",
    };

    const selectedModel = modelMapping[mode || "normal"];

    const hist = Array.isArray(history) ? [...history] : [];
    const detectedPersona = detectPersonaFromDescription(persona);
    const systemPrompt = PERSONA_PROMPTS[detectedPersona] || PERSONA_PROMPTS.tsundere;

    hist.unshift({ role: "system", content: systemPrompt });
    hist.push({ role: "user", content: message });

    const result = await chatAichixia(hist, {
      model: selectedModel,
    });

    return res.status(200).json({ 
      type: "text", 
      reply: result.reply, 
      provider: selectedModel 
    });

  } catch (err: any) {
    console.error("Aichixia API error:", err.message);
    return res.status(500).json({ 
      error: "Aichixia is currently unavailable",
      details: err.message 
    });
  }
}
