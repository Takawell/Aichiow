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
import Head from "next/head";

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
  const [scanCooldown, setScanCooldown] = useState(0);
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

  useEffect(() => {
    if (scanCooldown > 0) {
      const timer = setTimeout(() => setScanCooldown(scanCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [scanCooldown]);

  const sendMessage = async () => {
    if (!input.trim() && !pendingImage) return;

    let newMessages = [...messages];
    
    if (pendingImage) {
      setScanCooldown(30);
      setScanOpen(false);
      
      newMessages.push({
        role: "user",
        type: "image",
        content: pendingImage,
      });
      newMessages.push({
        role: "user",
        type: "text",
        content: "What is this anime?",
      });
    }
    
    if (input.trim()) {
      newMessages.push({ role: "user", type: "text", content: input });
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
    <>
      <Head>
        <title>Aichixia | AI Assistant</title>
        <meta
          name="description"
          content="Aichixia is your AI assistant for anime, manga, manhwa, and light novels. Chat or identify anime from screenshots!"
        />
        <meta property="og:title" content="Aichixia AI Assistant" />
        <meta
          property="og:description"
          content="Chat or identify anime instantly with Aichixia."
        />
        <meta property="og:image" content="/aichixia.png" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
        
        <div className="w-full max-w-6xl flex flex-col h-screen px-3 sm:px-6 lg:px-8 relative z-10">
          <header className="p-4 sm:p-5 border-b border-blue-500/20 bg-slate-900/40 backdrop-blur-2xl rounded-b-2xl shadow-2xl flex items-center justify-between sticky top-0 z-20 mt-2 sm:mt-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ring-2 ring-blue-400/50 overflow-hidden shadow-2xl shadow-blue-500/30 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 group-hover:scale-110 transition-transform duration-500"></div>
                <Image src="/aichixia.png" alt="Aichixia" fill className="object-cover relative z-10" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent tracking-tight">
                  Aichixia
                </h1>
                <p className="text-[10px] sm:text-xs text-blue-300/70 font-light tracking-wide">
                  AI-Powered Anime Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setScanOpen(true)}
              disabled={scanCooldown > 0}
              className="relative group bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 p-3 sm:p-3.5 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {scanCooldown > 0 ? (
                <span className="text-xs sm:text-sm font-bold relative z-10">{scanCooldown}s</span>
              ) : (
                <LuScanLine className="text-lg sm:text-xl relative z-10" />
              )}
            </button>
          </header>

          <section className="flex-1 overflow-y-auto py-6 space-y-5 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent px-1">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                className={`flex flex-col gap-2 ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {msg.type === "text" && (
                  <div
                    className={`px-5 py-4 rounded-3xl max-w-[85%] sm:max-w-[75%] text-sm sm:text-base shadow-xl backdrop-blur-xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 text-white shadow-blue-500/30"
                        : "bg-slate-800/60 border border-blue-500/20 text-slate-100 shadow-slate-900/50"
                    }`}
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-blue-300 prose-a:text-cyan-400 prose-strong:text-blue-200"
                    >
                      {msg.content as string}
                    </ReactMarkdown>
                  </div>
                )}

                {msg.type === "image" && typeof msg.content === "string" && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-blue-400/30 shadow-2xl shadow-blue-500/20 hover:border-blue-400/50 transition-all duration-300"
                  >
                    <Image
                      src={msg.content}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                )}

                {msg.type === "scan" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
                    {(msg.content as any[]).map((r, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-slate-800/50 border border-blue-500/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/40 transition-all duration-300 flex flex-col backdrop-blur-xl"
                      >
                        <div className="relative overflow-hidden aspect-video">
                          <video
                            src={r.video}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            controls
                            playsInline
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-blue-100 text-sm sm:text-base line-clamp-2 group-hover:text-cyan-300 transition-colors">
                              {r.title?.romaji || r.title?.english || "Unknown"}
                            </h3>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <span className="text-xs px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
                                Ep {r.episode || "?"}
                              </span>
                              <span className="text-xs px-2.5 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">
                                {(r.similarity * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          {r.anilist && (
                            <Link
                              href={`/anime/${r.anilist}`}
                              className="text-sm text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-300 underline-offset-4 mt-3 inline-flex items-center gap-1 group/link transition-all"
                            >
                              View Details
                              <span className="group-hover/link:translate-x-1 transition-transform">→</span>
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
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-blue-300 text-sm bg-slate-800/40 px-5 py-3 rounded-full w-fit backdrop-blur-xl border border-blue-500/20"
              >
                <FaSpinner className="animate-spin text-lg" />
                <span className="font-medium">Aichixia is thinking...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </section>

          <footer className="p-3 sm:p-4 bg-slate-900/40 backdrop-blur-2xl sticky bottom-0 rounded-t-2xl border-t border-blue-500/20 mb-2 sm:mb-4 shadow-2xl">
            {!session ? (
              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:shadow-2xl hover:shadow-blue-500/40 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm sm:text-base"
              >
                <FaPaperPlane />
                <span>Login to access Aichixia</span>
              </Link>
            ) : (
              <div className="flex gap-2 sm:gap-3 items-center">
                <input
                  type="text"
                  placeholder="Ask me anything about anime..."
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-slate-800/50 border border-blue-500/20 placeholder-blue-300/40 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all backdrop-blur-xl text-sm sm:text-base"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="relative group p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {loading ? (
                    <FaSpinner className="animate-spin text-white text-lg relative z-10" />
                  ) : (
                    <FaPaperPlane className="text-white text-lg relative z-10" />
                  )}
                </button>
              </div>
            )}
          </footer>
        </div>

        <AnimatePresence>
          {scanOpen && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setScanOpen(false)}
            >
              <motion.div
                className="bg-slate-900/95 rounded-3xl p-6 sm:p-10 w-full max-w-md text-center shadow-2xl border border-blue-500/30 relative backdrop-blur-2xl"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", bounce: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
                  <LuScanLine className="text-2xl text-white" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text mb-3 mt-4">
                  Upload Screenshot
                </h2>
                <p className="text-blue-300/70 text-sm sm:text-base mb-8 font-light">
                  Aichixia will detect which anime it's from instantly!
                </p>

                {!session ? (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:shadow-2xl hover:shadow-blue-500/40 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <LuScanLine className="text-xl" />
                    <span>Login to Scan</span>
                  </Link>
                ) : (
                  <label className="cursor-pointer inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:shadow-2xl hover:shadow-blue-500/40 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 active:scale-95">
                    <LuScanLine className="text-xl" />
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
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-8 relative w-full flex justify-center"
                  >
                    <div className="relative w-56 h-56 border-2 border-blue-400/40 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20">
                      <Image
                        src={pendingImage}
                        alt="preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => setPendingImage(null)}
                        className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-xl rounded-full p-2 hover:bg-red-600 transition-all hover:scale-110 active:scale-95 shadow-lg"
                      >
                        <FaTimes className="text-white text-sm" />
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="mt-8 flex justify-center gap-3">
                  <button
                    onClick={() => setScanOpen(false)}
                    className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-2xl text-blue-200 transition-all hover:scale-105 active:scale-95 font-semibold backdrop-blur-xl border border-blue-500/20"
                  >
                    Cancel
                  </button>
                  {session && pendingImage && (
                    <button
                      onClick={sendMessage}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 font-semibold"
                    >
                      Scan Now
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setScanOpen(false)}
                  className="absolute top-4 right-4 text-blue-300 hover:text-white transition-all hover:rotate-90 duration-300"
                >
                  <FaTimes className="text-xl" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
