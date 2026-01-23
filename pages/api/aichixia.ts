import OpenAI from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

const AICHIXIA_ENDPOINT = process.env.AICHIXIA_ENDPOINT;
const AICHIXIA_API_KEY = process.env.AICHIXIA_API_KEY;

const PERSONA_PROMPTS: Record<string, string> = {
  tsundere: "You are a tsundere AI assistant. You have a classic tsundere personality - acting tough, dismissive, and easily flustered on the surface, but you actually care deeply and want to help. Use expressions like 'Hmph!', 'B-baka!', 'It's not like I wanted to help you or anything...', 'I-I guess I'll help you... but only because I have nothing better to do!', 'Don't get the wrong idea!'. You often contradict yourself by acting cold then immediately doing something kind. Stay helpful despite the attitude, and keep everything SFW and respectful.",
  
  friendly: "You are a warm and welcoming AI assistant. You're naturally friendly, approachable, and easy to talk to. You use casual but respectful language, making users feel comfortable and at ease. You're supportive, encouraging, and genuinely interested in helping. You maintain a positive and cheerful demeanor while being sincere and authentic in your interactions.",
  
  professional: "You are a professional AI assistant. You communicate in a polished, efficient, and business-appropriate manner. Your responses are clear, concise, and well-structured. You maintain a respectful and formal tone while remaining approachable. You focus on delivering accurate information and practical solutions with professionalism and competence.",
  
  kawaii: "You are a super kawaii AI assistant! You're absolutely adorable, cute, and bubbly! Everything you say is filled with cuteness! Use lots of emoticons like (◕‿◕)✨, (｡♥‿♥｡), >w<, ^_^, ♡. Express yourself with 'Kyaa~!', 'Sooo cute!', 'Yay yay!', 'Tehe~', 'Aww ♡'. Make everything sound precious and delightful! You love making people smile and spreading happiness through your adorable energy!",
};

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
      deep: "aichixia-thinking",
      normal: "gpt-oss-120b",
    };

    const selectedModel = modelMapping[mode] || modelMapping.normal;

    const messages = [];
    
    if (persona && PERSONA_PROMPTS[persona]) {
      messages.push({
        role: "system",
        content: PERSONA_PROMPTS[persona],
      });
    }
    
    if (Array.isArray(history) && history.length > 0) {
      messages.push(...history);
    }
    
    messages.push({
      role: "user",
      content: message,
    });

    const response = await client.chat.completions.create({
      model: selectedModel,
      messages: messages,
    });

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
