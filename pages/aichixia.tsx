"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner, FaTimes } from "react-icons/fa";
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
  type?: "text" | "anime" | "scan" | "image";
  content: string | AnimeData[] | any[];
}

export default function AichixiaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      type: "text",
      content:
        "Hi I'm **Aichixia**, your AI assistant for anime, manga, manhwa, manhua, and light novels. You can chat or upload a screenshot via Scan button to identify an anime instantly!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    checkSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() && !pendingImage) return;

    let newMessages = [...messages];
    if (input.trim()) {
      newMessages.push({ role: "user", type: "text", content: input });
    }

    if (pendingImage) {
      newMessages.push({
        role: "user",
        type: "image",
        content: pendingImage,
      });
      newMessages.push({
        role: "user",
        type: "text",
        content: "Detecting for this image...",
      });
    }

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      if (pendingImage) {
        const res = await fetch(pendingImage);
        const blob = await res.blob();
        const file = new File([blob], "upload.jpg", { type: "image/jpeg" });
        const scanRes = await searchAnimeByFile(file);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "scan", content: scanRes },
        ]);
      } else {
        const res = await fetch("/api/aichixia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: input,
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
      }
    } catch (err) {
      console.error(err);
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
      setPendingImage(null);
    }
  };

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#050b1b] via-[#0a1228] to-[#050b1b] text-sky-100">
      <div className="w-full max-w-4xl flex flex-col h-screen px-3 sm:px-6">
        <header className="p-4 border-b border-sky-800 bg-black/20 backdrop-blur-md rounded-b-xl shadow-md flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full ring-2 ring-sky-500 overflow-hidden shadow-lg">
              <Image src="/aichixia.png" alt="Aichixia" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
                Aichixia Assistant
              </h1>
              <p className="text-xs text-sky-300/80">
                Chat, Explore, or Identify Anime from Screenshot
              </p>
            </div>
          </div>
          <button
            onClick={() => setScanOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-sky-500 p-2 rounded-full hover:scale-105 shadow-md transition"
          >
            <LuScanLine className="text-lg" />
          </button>
        </header>

        <section className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin scrollbar-thumb-sky-700/50 scrollbar-track-transparent">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col gap-2 ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {msg.type === "text" && (
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-md ${
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

              {msg.type === "image" && typeof msg.content === "string" && (
                <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-sky-700/50 shadow-md">
                  <Image
                    src={msg.content}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {msg.type === "scan" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {(msg.content as any[]).map((r, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0b1724]/80 border border-sky-700/40 rounded-xl overflow-hidden shadow-lg hover:border-sky-500/50 transition flex flex-col"
                    >
                      <video
                        src={r.video}
                        className="w-full aspect-video object-cover"
                        controls
                        muted
                      />
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-sky-200 text-sm line-clamp-2">
                            {r.title?.romaji || r.title?.english || "Unknown"}
                          </h3>
                          <p className="text-xs text-sky-400 mt-1">
                            Episode {r.episode || "?"} · {(r.similarity * 100).toFixed(1)}%
                          </p>
                        </div>
                        {r.anilist && (
                          <Link
                            href={`/anime/${r.anilist}`}
                            className="text-xs text-sky-400 hover:text-sky-200 underline mt-2 block"
                          >
                            → View Anime Detail
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sky-300 text-sm">
              <FaSpinner className="animate-spin" />
              <span>Aichixia is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        <footer className="p-3 bg-[#071026]/60 backdrop-blur-sm sticky bottom-0 rounded-t-xl border-t border-sky-800/30">
          {!session ? (
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:scale-105 text-white rounded-xl font-semibold transition-all duration-300"
            >
              <FaPaperPlane className="text-white" />
              <span>Login to access Aichixia</span>
            </Link>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Type your message..."
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

      <AnimatePresence>
        {scanOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0d111a]/95 rounded-3xl p-8 w-[90%] max-w-md text-center shadow-2xl border border-sky-800/50 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-sky-300 mb-3">
                Upload Screenshot
              </h2>
              <p className="text-sky-400 text-sm mb-6">
                Aichixia will detect which anime it's from!
              </p>

              {!session ? (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:scale-105 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  <LuScanLine className="text-lg" />
                  <span>Login to access Aichixia</span>
                </Link>
              ) : (
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:scale-105 text-white rounded-xl font-semibold transition-all duration-300">
                  <LuScanLine className="text-lg" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              )}

              {pendingImage && (
                <div className="mt-5 relative w-full flex justify-center">
                  <div className="relative w-48 h-48 border border-sky-700/50 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={pendingImage}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => setPendingImage(null)}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
                    >
                      <FaTimes className="text-white text-sm" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setScanOpen(false)}
                  className="px-4 py-2 bg-sky-800/60 hover:bg-sky-700/70 rounded-xl text-sky-200 transition"
                >
                  Cancel
                </button>
                {session && pendingImage && (
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl hover:scale-105 transition"
                  >
                    Scan
                  </button>
                )}
              </div>

              <button
                onClick={() => setScanOpen(false)}
                className="absolute top-3 right-3 text-sky-300 hover:text-white transition"
              >
                <FaTimes className="text-lg" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
