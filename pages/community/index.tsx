"use client";

import { useEffect, useState, useRef } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

interface Message {
  id?: string;
  user_id: string | null;
  username: string;
  message: string;
  created_at?: string;
}

export default function CommunityPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    fetchSession();

    const channel = supabase
      .channel("community-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    loadMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMessages = async () => {
    const { data } = await supabase
      .from("community")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageText = input.trim();
    setInput("");

    const newMessage: Message = {
      user_id: session?.user?.id ?? null,
      username: session?.user?.user_metadata?.username || "Guest",
      message: messageText,
    };

    await supabase.from("community").insert([newMessage]);

    if (!messageText.match(/^\/aichixia|^@aichixia/i)) return;

    setLoading(true);

    try {
      const prompt = messageText.replace(/^\/aichixia|^@aichixia/, "").trim();

      const body = JSON.stringify({
        message: prompt,
        history: messages.map((m) => ({
          role:
            m.user_id === null && m.username === "aichixia"
              ? "assistant"
              : "user",
          content: m.message,
        })),
      });

      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const json = await res.json();

      let reply = "⚠️ No valid response.";

      if (json.type === "text" && json.reply) {
        reply = json.reply;
      } else if (json.type === "anime" && Array.isArray(json.anime)) {
        reply =
          `🎬 Aku nemuin ${json.anime.length} anime nih:\n\n` +
          json.anime
            .map(
              (a: any, i: number) =>
                `${i + 1}. ${a.title}\n⭐ Score: ${a.score}\n🔥 Popularity: ${
                  a.popularity
                }\n🔗 ${a.url}\n`
            )
            .join("\n");
      }

      await supabase.from("community").insert([
        {
          user_id: null,
          username: "aichixia",
          message: reply,
        },
      ]);
    } catch (err) {
      console.error("Error from Aichixia:", err);
      await supabase.from("community").insert([
        {
          user_id: null,
          username: "aichixia",
          message: "❌ Aichixia gagal merespons. Coba lagi nanti ya~",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#050b1b] text-sky-100">
      <div className="w-full max-w-3xl flex flex-col h-screen px-4">
        <header className="p-4 bg-black/30 backdrop-blur-md rounded-b-xl border-b border-sky-800 shadow-lg sticky top-0 z-10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
            Aichiow Community
          </h1>
          <p className="text-sm text-sky-400/80">
            Chat with others or mention <span className="text-sky-300">@Aichixia</span> to talk to the AI assistant.
          </p>
        </header>

        <section className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin scrollbar-thumb-sky-700/40 scrollbar-track-transparent">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.user_id === session?.user?.id
                  ? "items-end"
                  : msg.username === "aichixia"
                  ? "items-start"
                  : "items-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] shadow-md text-sm ${
                  msg.username === "aichixia"
                    ? "bg-[#0b152e]/80 border border-sky-700/40 text-sky-100"
                    : msg.user_id === session?.user?.id
                    ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white"
                    : "bg-[#0b182e]/60 border border-sky-700/30 text-sky-200"
                }`}
              >
                <p className="text-xs mb-1 text-sky-400/80">
                  {msg.username || "Unknown"}
                </p>
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sky-400 text-sm">
              <FaSpinner className="animate-spin" />
              <span>Aichixia is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        <footer className="p-3 bg-[#08142a]/70 backdrop-blur-md border-t border-sky-800/40 rounded-t-xl sticky bottom-0">
          {!session ? (
            <p className="text-center text-sky-400">
              🔒 Please login to chat.
            </p>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message or /aichixia ..."
                className="flex-1 px-4 py-3 rounded-lg bg-[#041020]/70 border border-sky-700/40 placeholder-sky-300 text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="p-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 hover:scale-105 transition shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <FaSpinner className="animate-spin text-white" />
                ) : (
                  <FaPaperPlane className="text-white" />
                )}
              </button>
            </div>
          )}
        </footer>
      </div>
    </main>
  );
}
