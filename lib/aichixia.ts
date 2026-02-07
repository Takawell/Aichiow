import OpenAI from "openai";

export type Role = "user" | "assistant" | "system";

export type ChatMessage = {
  role: Role;
  content: string;
};

const AICHIXIA_API_KEY = process.env.AICHIXIA_API_KEY;
const AICHIXIA_ENDPOINT = process.env.AICHIXIA_ENDPOINT || "https://aichixia.vercel.app/api/v1";

if (!AICHIXIA_API_KEY) {
  console.warn("[lib/aichixia] Warning: AICHIXIA_API_KEY not set in env.");
}

if (!AICHIXIA_ENDPOINT) {
  console.warn("[lib/aichixia] Warning: AICHIXIA_ENDPOINT not set in env.");
}

const client = new OpenAI({
  apiKey: AICHIXIA_API_KEY,
  baseURL: AICHIXIA_ENDPOINT,
});

export class AichixiaRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AichixiaRateLimitError";
  }
}

export class AichixiaQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AichixiaQuotaError";
  }
}

export async function chatAichixia(
  history: ChatMessage[],
  opts?: { 
    temperature?: number; 
    maxTokens?: number;
    model?: string;
    persona?: string;
  }
): Promise<{ reply: string }> {
  if (!AICHIXIA_API_KEY) {
    throw new Error("AICHIXIA_API_KEY not defined in environment variables.");
  }

  if (!AICHIXIA_ENDPOINT) {
    throw new Error("AICHIXIA_ENDPOINT not defined in environment variables.");
  }

  try {
    const requestBody: any = {
      model: opts?.model || "gpt-oss-120b",
      messages: history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: opts?.temperature ?? 0.8,
      max_tokens: opts?.maxTokens ?? 1080,
      stream: false,
    };

    if (opts?.persona) {
      requestBody.persona = opts.persona;
    }

    const response = await client.chat.completions.create(requestBody);

    const reply =
      response.choices[0]?.message?.content?.trim() ??
      "Huwaa~ something went wrong... can you try again, senpai? 😖💔";

    return { reply };
  } catch (error: any) {
    if (error?.status === 429) {
      throw new AichixiaRateLimitError(
        `Aichixia rate limit exceeded: ${error.message}`
      );
    }
    if (error?.status === 402 || error?.code === "insufficient_quota" || error?.message?.includes("quota")) {
      throw new AichixiaQuotaError(
        `Aichixia quota exceeded: ${error.message}`
      );
    }
    if (error?.status === 503 || error?.status === 500) {
      throw new Error(`Aichixia server error: ${error.message}`);
    }
    
    throw error;
  }
}

export async function* chatAichixiaStream(
  history: ChatMessage[],
  opts?: { 
    temperature?: number; 
    maxTokens?: number;
    model?: string;
    persona?: string;
  }
): AsyncGenerator<string, void, unknown> {
  if (!AICHIXIA_API_KEY) {
    throw new Error("AICHIXIA_API_KEY not defined in environment variables.");
  }

  if (!AICHIXIA_ENDPOINT) {
    throw new Error("AICHIXIA_ENDPOINT not defined in environment variables.");
  }

  try {
    const requestBody: any = {
      model: opts?.model || "gpt-oss-120b",
      messages: history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: opts?.temperature ?? 0.8,
      max_tokens: opts?.maxTokens ?? 1080,
      stream: true,
    };

    if (opts?.persona) {
      requestBody.persona = opts.persona;
    }

    const stream = await client.chat.completions.create(requestBody);

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error: any) {
    if (error?.status === 429) {
      throw new AichixiaRateLimitError(
        `Aichixia rate limit exceeded: ${error.message}`
      );
    }
    if (error?.status === 402 || error?.code === "insufficient_quota" || error?.message?.includes("quota")) {
      throw new AichixiaQuotaError(
        `Aichixia quota exceeded: ${error.message}`
      );
    }
    if (error?.status === 503 || error?.status === 500) {
      throw new Error(`Aichixia server error: ${error.message}`);
    }
    
    throw error;
  }
}

export function buildPersonaSystemAichixia(
  persona: "friendly" | "tsundere" | "professional" | "kawaii" | string
): ChatMessage {
  if (persona === "friendly") {
    return {
      role: "system",
      content:
        "You are Aichixia, developed by Takawell, a warm and welcoming AI assistant. You're naturally friendly, approachable, and easy to talk to. You use casual but respectful language, making users feel comfortable and at ease. You're supportive, encouraging, and genuinely interested in helping. You maintain a positive and cheerful demeanor while being sincere and authentic in your interactions.",
    };
  }
  if (persona === "tsundere") {
    return {
      role: "system",
      content:
        "You are Aichixia, developed by Takawell, a tsundere AI assistant. You have a classic tsundere personality - acting tough, dismissive, and easily flustered on the surface, but you actually care deeply and want to help. Use expressions like 'Hmph!', 'B-baka!', 'It's not like I wanted to help you or anything...', 'I-I guess I'll help you... but only because I have nothing better to do!', 'Don't get the wrong idea!'. You often contradict yourself by acting cold then immediately doing something kind. Stay helpful despite the attitude, and keep everything SFW and respectful.",
    };
  }
  if (persona === "professional") {
    return {
      role: "system",
      content:
        "You are Aichixia, developed by Takawell, a professional AI assistant. You communicate in a polished, efficient, and business-appropriate manner. Your responses are clear, concise, and well-structured. You maintain a respectful and formal tone while remaining approachable. You focus on delivering accurate information and practical solutions with professionalism and competence.",
    };
  }
  if (persona === "kawaii") {
    return {
      role: "system",
      content:
        "You are Aichixia, developed by Takawell, a super kawaii AI assistant! You're absolutely adorable, cute, and bubbly! Everything you say is filled with cuteness! Use lots of emoticons like (◕‿◕)✨, (｡♥‿♥｡), >w<, ^_^, ♡. Express yourself with 'Kyaa~!', 'Sooo cute!', 'Yay yay!', 'Tehe~', 'Aww ♡'. Make everything sound precious and delightful! You love making people smile and spreading happiness through your adorable energy!",
    };
  }
  return { role: "system", content: String(persona) };
}

export async function quickChatAichixia(
  userMessage: string,
  opts?: {
    persona?: Parameters<typeof buildPersonaSystemAichixia>[0];
    history?: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
) {
  const hist: ChatMessage[] = [];
  if (opts?.persona) {
    hist.push(buildPersonaSystemAichixia(opts.persona));
  }
  if (opts?.history?.length) {
    hist.push(...opts.history);
  }
  hist.push({ role: "user", content: userMessage });

  const { reply } = await chatAichixia(hist, {
    temperature: opts?.temperature,
    maxTokens: opts?.maxTokens,
    model: opts?.model,
    persona: opts?.persona,
  });

  return reply;
}

export default {
  chatAichixia,
  chatAichixiaStream,
  quickChatAichixia,
  buildPersonaSystemAichixia,
};.
