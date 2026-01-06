import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "GET") {
    const { action, session_id, user_id } = req.query;

    if (action === "list_sessions") {
      try {
        const { data, error } = await supabase
          .from("playground_sessions")
          .select("*")
          .eq("user_id", user_id as string)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        return res.status(200).json({ sessions: data });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (action === "list_messages") {
      try {
        const { data, error } = await supabase
          .from("playground_messages")
          .select("*")
          .eq("session_id", session_id as string)
          .order("created_at", { ascending: true });

        if (error) throw error;
        return res.status(200).json({ messages: data });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(400).json({ error: "Invalid action" });
  }

  if (method === "POST") {
    const { action, user_id, session_id, title, model_type, role, content, model_used, provider, is_image } = req.body;

    if (action === "create_session") {
      try {
        const { data, error } = await supabase
          .from("playground_sessions")
          .insert({
            user_id,
            title: title || "New Chat",
            model_type: model_type || "text",
          })
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json({ session: data });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (action === "create_message") {
      try {
        const { data, error } = await supabase
          .from("playground_messages")
          .insert({
            session_id,
            role,
            content,
            model_used,
            provider,
            is_image: is_image || false,
          })
          .select()
          .single();

        if (error) throw error;

        await supabase
          .from("playground_sessions")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", session_id);

        return res.status(200).json({ message: data });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (action === "update_title") {
      try {
        const { data, error } = await supabase
          .from("playground_sessions")
          .update({ title })
          .eq("id", session_id)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json({ session: data });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (action === "chat") {
      const { model, message, history, prompt, steps } = req.body;

      try {
        let endpoint = "";
        let payload: any = {};

        if (["flux", "phoenix", "lucid"].includes(model)) {
          endpoint = `https://aichixia.vercel.app/api/models/${model}`;
          payload = { prompt, steps: steps || 4 };
        } else {
          endpoint = `https://aichixia.vercel.app/api/models/${model}`;
          payload = { message, history: history || [] };
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get response");
        }

        return res.status(200).json(data);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(400).json({ error: "Invalid action" });
  }

  if (method === "DELETE") {
    const { session_id } = req.body;

    try {
      const { error } = await supabase
        .from("playground_sessions")
        .delete()
        .eq("id", session_id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
