"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner, FaImage } from "react-icons/fa";
import { X, ScanLine } from "lucide-react";
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
  type?: "text" | "anime" | "scan" | "image";
  content: string | AnimeData[] | any[];
}

export default function AichixiaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      type: "text",
      content:
        "👋 Hi I'm **Aichixia**, your AI assistant for anime, manga, manhwa, and light novels. You can chat or scan an anime screenshot to identify it instantly!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanOpen(false);

    const imgUrl = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      { role: "user", type: "image", content: imgUrl },
    ]);

    try {
      const res = await searchAnimeByFile(file);
      if (res.length === 0) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "text", content: "❌ No anime detected from this image." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "scan", content: res },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "text", content: "⚠️ Failed to scan the image." },
      ]);
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", type: "text", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.map((m) => ({
            role: m.role,
            content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
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
          { role: "assistant", type: "text", content: data.reply || "⚠️ No valid response." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "text", content: "❌ Connection error." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#050b1b] via-[#0a1228] to-[#050b1b] text-sky-100">
      <div className="w-full max-w-5xl flex flex-col h-screen mx-2 sm:mx-6 lg:mx-8">
        <header className="p-4 border-b border-sky-800 bg-black/20 backdrop-blur-md rounded-b-xl shadow-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-sky-500 overflow-hidden shadow-lg">
              <Image src="/aichixia.png" alt="Aichixia" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
                Aichixia Assistant
              </h1>
              <p className="text-xs sm:text-sm text-sky-300/80">Chat, Explore, or Scan Anime</p>
            </div>
          </div>

          <button
            onClick={() => setScanOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 px-3 py-2 rounded-full text-sm sm:text-base font-semibold hover:from-blue-500 hover:to-sky-400 transition-all shadow-lg hover:shadow-sky-500/30"
          >
            <ScanLine className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Scan</span>
          </button>
        </header>

        <section className="flex-1 overflow-y-auto px-3 sm:px-6 py-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {msg.type === "text" && (
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] sm:max-w-[70%] text-sm sm:text-base ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white"
                      : "bg-[#0b152e]/80 border border-sky-700/40"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content as string}
                  </ReactMarkdown>
                </div>
              )}

              {msg.type === "image" && (
                <div className="w-52 sm:w-64 rounded-xl overflow-hidden shadow-lg border border-sky-700/30">
                  <Image
                    src={msg.content as string}
                    alt="uploaded"
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {msg.type === "scan" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {(msg.content as any[]).map((r, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white/5 border border-sky-700/30 rounded-xl overflow-hidden shadow-lg hover:border-sky-500/50 transition"
                    >
                      <video src={r.video} controls muted className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <h3 className="font-semibold text-sky-200">
                          {r.title?.romaji || r.title?.english || "Unknown"}
                        </h3>
                        <p className="text-xs text-sky-400 mt-1">
                          Ep {r.episode || "?"} • {(r.similarity * 100).toFixed(1)}%
                        </p>
                        {r.anilist && (
                          <Link
                            href={`/anime/${r.anilist}`}
                            className="text-xs text-sky-400 underline hover:text-sky-300 mt-2 block"
                          >
                            View on Aichiow →
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

        <footer className="p-4 bg-[#060e1f]/70 backdrop-blur-sm sticky bottom-0 rounded-t-xl border-t border-sky-800">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-lg bg-[#041020]/70 border border-sky-700/40 placeholder-sky-400 text-sky-100 focus:ring-2 focus:ring-sky-500 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <label className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 p-3 rounded-full cursor-pointer shadow-md hover:shadow-sky-500/40 transition">
              <FaImage className="text-white text-lg" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white shadow-md hover:shadow-sky-500/40 transition"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
            </button>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {scanOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gradient-to-b from-[#151518]/90 to-[#0f0f10]/90 rounded-2xl p-8 w-[90%] max-w-md text-center shadow-2xl border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setScanOpen(false)}
                className="absolute top-3 right-3 text-sky-400 hover:text-sky-200 transition"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-bold text-sky-300 mb-3">Upload Screenshot</h2>
              <p className="text-sky-400 text-sm mb-6">
                Aichixia will detect which anime it's from!
              </p>
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl font-semibold transition-all">
                <ScanLine className="text-lg" />
                <span>Choose Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
