"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner, FaTimes, FaEllipsisV, FaAngry, FaSmile, FaBriefcase, FaHeart, FaComments, FaSearch, FaUpload, FaLock } from "react-icons/fa";
import { LuScanLine, LuSparkles } from "react-icons/lu";
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
  type?: "text" | "anime" | "scan" | "image" | "ai-scan";
  content: string | AnimeData[] | any[];
}

type Persona = "tsundere" | "friendly" | "professional" | "kawaii";

const personaConfig: Record<
  Persona,
  { name: string; description: string; icon: any; color: string }
> = {
  tsundere: {
    name: "Tsundere",
    description: "B-baka! Classic tsundere personality",
    icon: FaAngry,
    color: "from-pink-500 to-rose-500",
  },
  friendly: {
    name: "Friendly",
    description: "Warm and welcoming assistant",
    icon: FaSmile,
    color: "from-green-500 to-emerald-500",
  },
  professional: {
    name: "Professional",
    description: "Formal and efficient helper",
    icon: FaBriefcase,
    color: "from-blue-500 to-indigo-500",
  },
  kawaii: {
    name: "Kawaii",
    description: "Super cute and energetic!",
    icon: FaHeart,
    color: "from-purple-500 to-pink-500",
  },
};

export default function AichixiaPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [scanPrompt, setScanPrompt] = useState("");
  const [scanCooldown, setScanCooldown] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [persona, setPersona] = useState<Persona>("tsundere");
  const [mode, setMode] = useState<"normal" | "deep">("normal");
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
        content: scanPrompt || "What is this anime?",
      });
    }
    
    if (input.trim() && !pendingImage) {
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

        const userQuestion = scanPrompt || "What is this anime?";
        const aiPrompt = `User asked: "${userQuestion}"

I scanned an anime screenshot and here are the results:
${scanRes.map((r: any, i: number) => 
  `${i + 1}. ${r.title?.romaji || r.title?.english || "Unknown"} - Episode ${r.episode || "?"} (${(r.similarity * 100).toFixed(1)}% match)`
).join('\n')}

Please answer the user's question about this anime in an engaging way! Include interesting details, plot summary, and why it's worth watching. Be enthusiastic and helpful!`;

        const aiRes = await fetch("/api/aichixia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: aiPrompt,
            history: [],
            persona: persona === "tsundere" ? undefined : personaConfig[persona].description,
            mode: mode,
          }),
        });
        
        const aiData = await aiRes.json();
        
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "ai-scan",
            content: aiData.reply || "I found the anime, but I'm having trouble explaining it right now! 💫",
          },
        ]);
        
        setScanPrompt("");
      } else {
        const res = await fetch("/api/aichixia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: input,
            history: messages
              .filter(m => m.type === "text" || m.type === "ai-scan")
              .map((m) => ({
                role: m.role,
                content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
              })),
            persona: persona === "tsundere" ? undefined : personaConfig[persona].description,
            mode: mode,
          }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: data.reply || "Huwaa~ something went wrong... can you try again, senpai? 😖💔",
          },
        ]);
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

  const getUserName = () => {
    if (!session) return null;
    const userMetadata = session.user.user_metadata || {};
    return userMetadata.full_name || userMetadata.name || null;
  };

  const PersonaIcon = personaConfig[persona].icon;

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
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ring-2 ring-blue-400/50 overflow-hidden shadow-2xl shadow-blue-500/30 group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 group-hover:scale-110 transition-transform duration-500"></div>
                <Image src="/aichixia.png" alt="Aichixia" fill className="object-cover relative z-10" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent tracking-tight truncate">
                  Aichixia
                </h1>
                <p className="text-[10px] sm:text-xs text-blue-300/70 font-light tracking-wide flex items-center gap-1.5 truncate">
                  <PersonaIcon className="text-xs flex-shrink-0" />
                  <span className="truncate">{personaConfig[persona].name} · {mode === "normal" ? "Normal" : "Deep"} Mode</span>
                </p>
              </div>
            </div>

            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="relative group bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 p-3 sm:p-3.5 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <FaEllipsisV className="text-lg sm:text-xl relative z-10" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <motion.div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setShowMenu(false)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ type: "spring", bounce: 0.3 }}
                      className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-blue-500/30 overflow-hidden z-40"
                    >
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowModeMenu(true);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-500/10 transition-all flex items-center gap-3 border-b border-blue-500/20"
                      >
                        {mode === "normal" ? (
                          <FaComments className="text-xl text-cyan-400" />
                        ) : (
                          <FaSearch className="text-xl text-purple-400" />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-blue-100 text-sm">Change Mode</div>
                          <div className="text-xs text-blue-300/70">{mode === "normal" ? "Normal Chat" : "Deep Search"}</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setScanOpen(true);
                        }}
                        disabled={scanCooldown > 0}
                        className="w-full px-4 py-3 text-left hover:bg-blue-500/10 transition-all flex items-center gap-3 border-b border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LuScanLine className="text-xl text-cyan-400" />
                        <div className="flex-1">
                          <div className="font-semibold text-blue-100 text-sm">Scan Anime</div>
                          {scanCooldown > 0 && (
                            <div className="text-xs text-blue-300/70">Cooldown: {scanCooldown}s</div>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowPersonaMenu(true);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-500/10 transition-all flex items-center gap-3"
                      >
                        <PersonaIcon className="text-xl text-cyan-400" />
                        <div className="flex-1">
                          <div className="font-semibold text-blue-100 text-sm">Change Persona</div>
                          <div className="text-xs text-blue-300/70">{personaConfig[persona].name}</div>
                        </div>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </header>

          <section className="flex-1 overflow-y-auto py-6 space-y-5 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent px-1">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-3 sm:px-4">
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  src="/aichixia.png"
                  alt="Aichixia"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-400 shadow-2xl shadow-blue-500/30 mb-4 sm:mb-6"
                />
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-100 mb-2 sm:mb-3 flex items-center justify-center gap-2 flex-wrap"
                >
                  {getUserName() ? `Konnichiwa! ${getUserName()}` : "Konnichiwa!"} I'm Aichixia! <FaHeart className="text-pink-500 animate-pulse" />
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm sm:text-base text-blue-300/70 max-w-md mb-4 sm:mb-6"
                >
                  Your AI assistant for anime, manga, manhwa, manhua, and light novels. Chat or upload a screenshot to identify an anime instantly!
                </motion.p>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-2xl w-full"
                >
                  {[
                    { q: "Who are you?", icon: "❓" },
                    { q: "Recommend me some anime", icon: "💗" },
                    { q: "What's trending right now?", icon: "🔥" },
                    { q: "Tell me about Manhwa", icon: "📚" },
                  ].map((suggestion, i) => (
                    <motion.button
                      key={i}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setInput(suggestion.q)}
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800/50 border-2 border-blue-500/20 hover:border-blue-400/50 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-500/20 text-left group backdrop-blur-xl"
                    >
                      <span className="text-xl sm:text-2xl flex-shrink-0">{suggestion.icon}</span>
                      <span className="text-xs sm:text-sm font-medium text-blue-200 group-hover:text-cyan-300 transition-colors">
                        {suggestion.q}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            )}

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
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`px-5 py-4 rounded-3xl max-w-[85%] sm:max-w-[75%] text-sm sm:text-base shadow-xl backdrop-blur-xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 text-white shadow-blue-500/30"
                        : "bg-slate-800/60 border border-blue-500/20 text-slate-100 shadow-slate-900/50"
                    }`}
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-blue-300 prose-a:text-cyan-400 prose-strong:text-blue-200 prose-code:text-cyan-300"
                    >
                      {msg.content as string}
                    </ReactMarkdown>
                  </motion.div>
                )}

                {msg.type === "ai-scan" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-[95%] sm:max-w-[85%] bg-gradient-to-br from-blue-900/40 via-cyan-900/40 to-slate-900/40 border-2 border-blue-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-500/20">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <LuSparkles className="text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-200 text-sm sm:text-base">AI Analysis</h3>
                        <p className="text-xs text-blue-300/60">Powered by Aichixia</p>
                      </div>
                    </div>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-blue-300 prose-a:text-cyan-400 prose-strong:text-blue-200 prose-code:text-cyan-300"
                    >
                      {msg.content as string}
                    </ReactMarkdown>
                  </motion.div>
                )}

                {msg.type === "image" && typeof msg.content === "string" && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-blue-400/30 shadow-2xl shadow-blue-500/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer"
                  >
                    <Image
                      src={msg.content}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <span className="text-white text-xs font-semibold px-3 py-1 bg-blue-500/80 rounded-full backdrop-blur-sm">
                        Scanned Image
                      </span>
                    </div>
                  </motion.div>
                )}

                {msg.type === "scan" && (
                  <div className="w-full">
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 mb-4 px-4"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <LuScanLine className="text-white text-lg" />
                      </div>
                      <span className="text-cyan-300 font-semibold text-sm">Scan Results</span>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
                      {(msg.content as any[]).map((r, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02 }}
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
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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
          {showModeMenu && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModeMenu(false)}
            >
              <motion.div
                className="bg-slate-900/95 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-blue-500/30 relative backdrop-blur-2xl"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", bounce: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
                  <FaComments className="text-2xl text-white" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text mb-6 mt-4">
                  Choose Mode
                </h2>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setMode("normal");
                      setShowModeMenu(false);
                    }}
                    className={`w-full px-5 py-5 rounded-2xl text-left hover:bg-blue-500/10 transition-all duration-300 flex items-start gap-4 border-2 backdrop-blur-xl ${
                      mode === "normal"
                        ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                        : "border-blue-500/20 hover:border-blue-400/40"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      mode === "normal" 
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30" 
                        : "bg-slate-800/50"
                    }`}>
                      <FaComments className="text-2xl text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-blue-100 text-base sm:text-lg mb-1">
                        Normal Mode
                      </div>
                      <div className="text-xs sm:text-sm text-blue-300/70 leading-relaxed">
                        Perfect for casual chatting and quick conversations about anime, manga, and light novels.
                      </div>
                    </div>
                    {mode === "normal" && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50 mt-2" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setMode("deep");
                      setShowModeMenu(false);
                    }}
                    className={`w-full px-5 py-5 rounded-2xl text-left hover:bg-blue-500/10 transition-all duration-300 flex items-start gap-4 border-2 backdrop-blur-xl ${
                      mode === "deep"
                        ? "border-purple-400/50 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                        : "border-blue-500/20 hover:border-purple-400/40"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      mode === "deep" 
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30" 
                        : "bg-slate-800/50"
                    }`}>
                      <FaSearch className="text-2xl text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-blue-100 text-base sm:text-lg mb-1">
                        Deep Mode
                      </div>
                      <div className="text-xs sm:text-sm text-blue-300/70 leading-relaxed">
                        Advanced mode with web search capabilities for in-depth research and comprehensive answers.
                      </div>
                    </div>
                    {mode === "deep" && (
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-lg shadow-purple-400/50 mt-2" />
                    )}
                  </motion.button>
                </div>

                <button
                  onClick={() => setShowModeMenu(false)}
                  className="absolute top-4 right-4 text-blue-300 hover:text-white transition-all hover:rotate-90 duration-300"
                >
                  <FaTimes className="text-xl" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {scanOpen && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-3 sm:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setScanOpen(false);
                setPendingImage(null);
                setScanPrompt("");
              }}
            >
              <motion.div
                className="bg-slate-900/95 rounded-3xl w-full max-w-lg shadow-2xl border border-blue-500/30 relative backdrop-blur-2xl max-h-[90vh] overflow-hidden flex flex-col"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", bounce: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-blue-500/20">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                      <LuScanLine className="text-base sm:text-lg text-white" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-blue-200 truncate">
                        Scan Anime
                      </h2>
                      <p className="text-[10px] sm:text-xs text-blue-300/70 truncate">
                        Upload & ask anything
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setScanOpen(false);
                      setPendingImage(null);
                      setScanPrompt("");
                    }}
                    className="text-blue-300 hover:text-white transition-all hover:rotate-90 duration-300 p-2 flex-shrink-0"
                  >
                    <FaTimes className="text-lg sm:text-xl" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin scrollbar-thumb-blue-500/30">
                  {!session ? (
                    <div className="text-center py-8">
                      <Link
                        href="/auth/login"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:shadow-2xl hover:shadow-blue-500/40 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        <LuScanLine className="text-xl" />
                        <span>Login to Scan</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs sm:text-sm font-semibold text-blue-200 flex items-center gap-2">
                            <FaUpload className="text-cyan-400" />
                            Upload Screenshot
                          </label>
                          {pendingImage && (
                            <span className="text-[10px] sm:text-xs text-cyan-400 font-medium px-2 py-0.5 bg-cyan-500/10 rounded-full border border-cyan-400/30">
                              ✓ Uploaded
                            </span>
                          )}
                        </div>
                        <label className={`block relative border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                          pendingImage 
                            ? 'border-cyan-400/50 bg-cyan-500/5 p-2' 
                            : 'border-blue-500/30 bg-slate-800/30 hover:border-blue-400/50 hover:bg-slate-800/50 p-4 sm:p-5'
                        }`}>
                          {pendingImage ? (
                            <div className="relative w-full rounded-xl overflow-hidden">
                              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <Image
                                  src={pendingImage}
                                  alt="preview"
                                  fill
                                  className="object-cover rounded-xl"
                                />
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setPendingImage(null);
                                }}
                                className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm rounded-full p-1.5 hover:bg-red-600 transition-all hover:scale-110 active:scale-95 shadow-lg z-10"
                              >
                                <FaTimes className="text-white text-xs" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center py-3">
                              <FaUpload className="text-2xl sm:text-3xl text-blue-400 mx-auto mb-2" />
                              <p className="text-blue-200 font-medium text-xs sm:text-sm mb-0.5">Click to upload</p>
                              <p className="text-blue-300/60 text-[10px] sm:text-xs">PNG, JPG, WEBP up to 10MB</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block mb-2 text-xs sm:text-sm font-semibold text-blue-200 flex items-center gap-2">
                          <FaComments className="text-cyan-400" />
                          Your Question
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g., What anime is this?"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-800/50 border border-blue-500/20 placeholder-blue-300/40 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all backdrop-blur-xl pr-10"
                            value={scanPrompt}
                            onChange={(e) => setScanPrompt(e.target.value)}
                            disabled={!pendingImage}
                          />
                          {!pendingImage && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <FaLock className="text-blue-400/40 text-sm" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-blue-300/50 mt-1.5 flex items-center gap-1.5">
                          {pendingImage ? (
                            <>
                              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                              Type your question or leave empty
                            </>
                          ) : (
                            <>
                              <FaLock className="text-blue-400/40" />
                              Upload image first
                            </>
                          )}
                        </p>
                      </div>

                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-3">
                        <h4 className="text-[10px] sm:text-xs font-semibold text-blue-200 mb-2 flex items-center gap-1.5">
                          <LuSparkles className="text-cyan-400" />
                          Examples
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "What anime?",
                            "Who's this?",
                            "Episode?",
                            "About this"
                          ].map((example, idx) => (
                            <button
                              key={idx}
                              onClick={() => setScanPrompt(example)}
                              disabled={!pendingImage}
                              className="text-[10px] sm:text-xs px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                              {example}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-1">
                        <button
                          onClick={() => {
                            setScanOpen(false);
                            setPendingImage(null);
                            setScanPrompt("");
                          }}
                          className="w-full sm:flex-1 px-5 py-2.5 sm:py-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-2xl text-blue-200 transition-all hover:scale-105 active:scale-95 font-semibold backdrop-blur-xl border border-blue-500/20 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={sendMessage}
                          disabled={!pendingImage || loading}
                          className="w-full sm:flex-1 px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm"
                        >
                          {loading ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Scanning...
                            </>
                          ) : !pendingImage ? (
                            <>
                              <FaLock />
                              Upload First
                            </>
                          ) : (
                            <>
                              <LuScanLine />
                              Scan Now
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPersonaMenu && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPersonaMenu(false)}
            >
              <motion.div
                className="bg-slate-900/95 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-blue-500/30 relative backdrop-blur-2xl"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", bounce: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
                  <FaHeart className="text-2xl text-white" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text mb-6 mt-4">
                  Choose Persona
                </h2>

                <div className="space-y-3">
                  {(Object.keys(personaConfig) as Persona[]).map((p) => {
                    const Icon = personaConfig[p].icon;
                    return (
                      <motion.button
                        key={p}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setPersona(p);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full px-5 py-4 rounded-2xl text-left hover:bg-blue-500/10 transition-all duration-300 flex items-center gap-4 border-2 backdrop-blur-xl ${
                          persona === p
                            ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                            : "border-blue-500/20 hover:border-blue-400/40"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          persona === p 
                            ? "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30" 
                            : "bg-slate-800/50"
                        }`}>
                          <Icon className="text-xl text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-blue-100 text-sm sm:text-base">
                            {personaConfig[p].name}
                          </div>
                          <div className="text-xs text-blue-300/70">
                            {personaConfig[p].description}
                          </div>
                        </div>
                        {persona === p && (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowPersonaMenu(false)}
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
