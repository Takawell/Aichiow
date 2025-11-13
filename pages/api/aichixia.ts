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

    if (Array.isArray(data.anime)) {
      return res.status(200).json({
        type: "anime",
        anime: data.anime.map((a: any) => ({
          id: a.id ?? Math.random(),
          title: a.title ?? "Untitled",
          coverImage: a.coverImage ?? "/default.png",
          score: a.averageScore ?? 0,
          popularity: a.popularity ?? 0,
          url: a.url ?? "#",
        })),
      });
    }

    const cuteReplies = [
      "Huwaa~ something went wrong... can you try again, senpai? 😖💔",
      "Eeehh~ my brain just went poof! Please try again~ 🥺💞",
      "Mouu~ I made a tiny oopsie... can you send that again? 😣👉🏻👈🏻",
      "Ahh~ my circuits got tangled... let me fix it real quick~ 💫💦",
      "Uwuu~ system-chan tripped again... so embarrassing~ 😭💗",
      "Oh nooo~ error-tan appeared! I’ll fix it fast, promise! 💻🔥",
      "Ehehe~ I glitched for a sec, sorry senpai~ 😅💕",
      "Nyaa~ data vanished into the void... can you resend it? 🐾😿",
      "Gomen~ I think I broke something again... forgive me~ 🥹💔",
      "Aahh~ something went *boop*! Lemme try again, okay~? 😭✨",
    ];

    const randomReply =
      cuteReplies[Math.floor(Math.random() * cuteReplies.length)];

    return res.status(response.status).json({
      type: "text",
      reply: data.reply ?? randomReply,
    });
  } catch (err: any) {
    console.error("Aichiow -> Aichixia API error:", err);
    const cuteErrorFallbacks = [
      "Huwaa~ the connection went kaboom... please try again~ 😭💞",
      "Aahh~ even my servers are sleepy today... give me a moment, senpai~ 😴💗",
      "Eeehh~ something’s off... I’ll fix it soon, promise! 🥺✨",
    ];
    const randomError =
      cuteErrorFallbacks[Math.floor(Math.random() * cuteErrorFallbacks.length)];

    return res.status(500).json({
      error: "Internal Server Error",
      reply: randomError,
    });
  }
}
