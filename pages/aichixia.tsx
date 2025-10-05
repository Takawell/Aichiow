"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner, FaImage } from "react-icons/fa";
import { LuScanLine } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabaseClient";
import { searchAnimeByFile } from "@/lib/traceMoe";

interface AnimeData {
  id: number;
  title: string;
  coverImage: string;
  score: number;
  popularity: number;
  url: string;
}

interface Message {
  role: "user" | "assistant";
  type?: "text" | "anime" | "scan";
  content: string | AnimeData[] | any[];
}

export default function AichixiaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      type: "text",
      content:
        "👋 Hi I'm **Aichixia**, your AI assistant for anime, manga, manhwa, manhua, and light novels. You can chat, or scan an anime screenshot to identify it instantly!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanLoading(true);
    setScanResults([]);
    setScanOpen(false);

    try {
      const res = await searchAnimeByFile(file);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "scan",
          content: res,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: "❌ Failed to detect anime from the image.",
        },
      ]);
    } finally {
      setScanLoading(false);
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", type: "text", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((m) => ({
            role: m.role,
            content:
              typeof m.content === "string"
                ? m.content
                : JSON.stringify(m.content),
          })),
        }),
      });

      const data = await res.json();

      if (data.data && Array.isArray(data.data)) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "anime", content: data.data },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: data.reply || "⚠️ No valid response.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: "❌ Error while connecting to Aichixia.",
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
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#050b1b] via-[#0a1228] to-[#050b1b] text-sky-100">
      <div className="w-full max-w-5xl flex flex-col h-screen mx-4 sm:mx-6 lg:mx-8">
        <header className="p-4 border-b border-sky-800 bg-black/20 backdrop-blur-md rounded-b-xl shadow-md flex items-center justify-between sticky top-4 z-20 mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full ring-2 ring-sky-500 overflow-hidden shadow-lg">
              <Image src="/aichixia.png" alt="Aichixia" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
                Aichixia Assistant
              </h1>
              <p className="text-xs sm:text-sm text-sky-300/80 mt-0.5">
                Chat, Explore, or Identify Anime from Screenshot
              </p>
            </div>
          </div>

          <button
            onClick={() => setScanOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 rounded-full font-semibold hover:from-blue-500 hover:to-sky-400 transition-all duration-300 shadow-lg hover:shadow-sky-500/40"
          >
            <LuScanLine className="text-xl" />
            <span className="hidden sm:inline">Scan Image</span>
          </button>
        </header>

        <section className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex flex-col gap-2 ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {msg.type === "text" && (
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm sm:text-base shadow-md ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white"
                      : "bg-[#0b152e]/80 border border-sky-700/40 backdrop-blur-sm"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content as string}
                  </ReactMarkdown>
                </div>
              )}

              {msg.type === "anime" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                  {(msg.content as AnimeData[]).map((anime) => (
                    <Link
                      key={anime.id}
                      href={`/anime/${anime.id}`}
                      className="bg-[#0b1724]/70 border border-sky-700/40 rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] hover:ring-2 hover:ring-sky-500 transition"
                    >
                      <Image
                        src={anime.coverImage}
                        alt={anime.title}
                        width={400}
                        height={600}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="font-bold text-sky-200 text-sm line-clamp-2">
                          {anime.title}
                        </h3>
                        <p className="text-xs text-sky-400 mt-1">
                          ⭐ {anime.score} | 👥 {anime.popularity}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {msg.type === "scan" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {(msg.content as any[]).map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/5 border border-sky-700/30 rounded-xl overflow-hidden shadow-lg hover:border-sky-500/50 transition-all duration-300"
                    >
                      <video
                        src={r.video}
                        className="rounded-t-xl w-full h-40 object-cover"
                        controls
                        muted
                      />
                      <div className="p-3">
                        <h3 className="font-semibold text-sky-200">
                          {r.title?.romaji || r.title?.english || "Unknown Title"}
                        </h3>
                        <p className="text-xs text-sky-400 mt-1">
                          Episode {r.episode || "?"} · {(r.similarity * 100).toFixed(1)}%
                        </p>
                        {r.anilist && (
                          <Link
                            href={`/anime/${r.anilist}`}
                            className="text-xs text-sky-400 hover:text-sky-300 underline mt-2 block"
                          >
                            → View Anime Detail
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sky-300">
              <FaSpinner className="animate-spin" />
              <span>Aichixia is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        <footer className="p-4 bg-gradient-to-t from-[#071026]/60 via-transparent backdrop-blur-sm sticky bottom-4 mx-4 sm:mx-6 lg:mx-8 rounded-xl">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-lg bg-[#041020]/70 border border-sky-700/40 placeholder-sky-300 text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <label className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 p-3 rounded-full cursor-pointer shadow-lg hover:shadow-sky-500/40 transition">
              <FaImage className="text-white text-lg" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 hover:shadow-lg hover:ring-2 hover:ring-sky-400 active:scale-95 transition font-semibold text-white disabled:opacity-60"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
            </button>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {scanOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-b from-[#151518]/90 to-[#0f0f10]/90 rounded-3xl p-8 w-[90%] max-w-md text-center shadow-2xl border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-bold text-sky-300 mb-3">
                Upload Screenshot
              </h2>
              <p className="text-sky-400 text-sm mb-6">
                Aichixia will detect which anime it's from!
              </p>
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.03]">
                <LuScanLine className="text-lg" />
                <span>Choose Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
              <button
                onClick={() => setScanOpen(false)}
                className="mt-6 text-sky-400 hover:text-sky-200 transition text-sm"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
