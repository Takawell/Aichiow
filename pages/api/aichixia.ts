import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category, action, id, query, genre } = req.query;

  try {
    let targetUrl = "";
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: { "Content-Type": "application/json" },
    };

    if (action === "chat") {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
      }

      targetUrl = "https://aichixia.vercel.app/api/chat";
      fetchOptions.body = JSON.stringify(req.body);
    } 
    else {
      const url = new URL("https://aichixia.vercel.app/api/aichixia");

      if (category) url.searchParams.append("category", String(category));
      if (action) url.searchParams.append("action", String(action));
      if (id) url.searchParams.append("id", String(id));
      if (query) url.searchParams.append("query", String(query));
      if (genre) url.searchParams.append("genre", String(genre));

      targetUrl = url.toString();
    }

    const response = await fetch(targetUrl, fetchOptions);
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
