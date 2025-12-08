"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner, FaTimes, FaEllipsisV, FaAngry, FaSmile, FaBriefcase, FaHeart, FaMoon, FaSun, FaImage } from "react-icons/fa";
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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      type: "text",
      content:
        "Hi I'm **Aichixia**, your AI assistant for anime, manga, manhwa, manhua, and light novels. You can chat or upload a screenshot via menu to identify an anime instantly!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");
  const [scanOpen, setScanOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [scanCooldown, setScanCooldown] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [persona, setPersona] = useState<Persona>("tsundere");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session?.user) {
        const name = data.session.user.user_metadata?.full_name || 
                     data.session.user.email?.split('@')[0] || 
                     "Friend";
        setUserName(name);
      }
    };
    checkSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          const name = session.user.user_metadata?.full_name || 
                       session.user.email?.split('@')[0] || 
                       "Friend";
          setUserName(name);
        }
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("aichixia-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aichixia-theme", theme);
  }, [theme]);

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

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

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
            persona: persona === "tsundere" ? undefined : personaConfig[persona].description,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPendingImage(reader.result as string);
      reader.readAsDataURL(file);
      setScanOpen(true);
    }
  };

  const PersonaIcon = personaConfig[persona].icon;

  const bgClass = theme === "dark" 
    ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" 
    : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50";
  
  const cardBg = theme === "dark"
    ? "bg-slate-900/80 border-blue-500/20"
    : "bg-white/80 border-blue-300/30";
  
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-blue-300/70" : "text-slate-600";
  const inputBg = theme === "dark" ? "bg-slate-800/50 border-blue-500/20" : "bg-white/50 border-blue-300/30";
  const messageBg = theme === "dark" ? "bg-slate-800/60 border-blue-500/20 text-slate-100" : "bg-white/60 border-blue-300/30 text-slate-900";

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

      <main 
        className={`flex flex-col items-center min-h-screen ${bgClass} ${textPrimary} relative overflow-hidden transition-colors duration-500`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20" : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/10"} via-transparent to-transparent pointer-events-none`}></div>
        <div className={`absolute inset-0 bg-[url('/grid.svg')] ${theme === "dark" ? "opacity-10" : "opacity-5"} pointer-events-none`}></div>
        
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-blue-500/20 backdrop-blur-xl flex items-center justify-center pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-blue-500 to-cyan-500 p-8 rounded-3xl shadow-2xl"
              >
                <FaImage className="text-6xl text-white mb-4 mx-auto" />
                <p className="text-xl font-bold text-white">Drop image to scan anime</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-6xl flex flex-col h-screen px-3 sm:px-6 lg:px-8 relative z-10">
          <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className={`p-4 sm:p-5 border-b ${theme === "dark" ? "border-blue-500/20 bg-slate-900/40" : "border-blue-300/30 bg-white/40"} backdrop-blur-2xl rounded-b-2xl shadow-2xl flex items-center justify-between sticky top-0 z-20 mt-2 sm:mt-4 transition-colors duration-500`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ring-2 ${theme === "dark" ? "ring-blue-400/50" : "ring-blue-500/50"} overflow-hidden shadow-2xl ${theme === "dark" ? "shadow-blue-500/30" : "shadow-blue-400/30"} group transition-all duration-300`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${theme === "dark" ? "from-blue-400/20 to-purple-600/20" : "from-blue-400/30 to-purple-500/30"} group-hover:scale-110 transition-transform duration-500`}></div>
                <Image src="/aichixia.png" alt="Aichixia" fill className="object-cover relative z-10" />
              </motion.div>
              <div>
                <h1 className={`text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r ${theme === "dark" ? "from-blue-300 via-cyan-300 to-blue-400" : "from-blue-600 via-cyan-600 to-blue-700"} bg-clip-text text-transparent tracking-tight`}>
                  Aichixia
                </h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-[10px] sm:text-xs ${textSecondary} font-light tracking-wide flex items-center gap-1.5`}
                >
                  {session && userName && (
                    <span className="font-medium">Hi, {userName}! •</span>
                  )}
                  <PersonaIcon className="text-xs" />
                  {personaConfig[persona].name}
                </motion.p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowThemeMenu(true)}
                className={`relative group bg-gradient-to-br ${theme === "dark" ? "from-blue-500 via-blue-600 to-cyan-500" : "from-blue-400 via-blue-500 to-cyan-400"} p-2.5 sm:p-3 rounded-xl hover:shadow-2xl ${theme === "dark" ? "hover:shadow-blue-500/40" : "hover:shadow-blue-400/40"} transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {theme === "dark" ? <FaMoon className="text-base sm:text-lg relative z-10" /> : <FaSun className="text-base sm:text-lg relative z-10" />}
              </motion.button>
              
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMenu(!showMenu)}
                  className={`relative group bg-gradient-to-br ${theme === "dark" ? "from-blue-500 via-blue-600 to-cyan-500" : "from-blue-400 via-blue-500 to-cyan-400"} p-2.5 sm:p-3 rounded-xl hover:shadow-2xl ${theme === "dark" ? "hover:shadow-blue-500/40" : "hover:shadow-blue-400/40"} transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FaEllipsisV className="text-base sm:text-lg relative z-10" />
                </motion.button>

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
                        className={`absolute right-0 mt-2 w-56 ${cardBg} backdrop-blur-2xl rounded-2xl shadow-2xl border overflow-hidden z-40 transition-colors duration-500`}
                      >
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            setShowMenu(false);
                            setScanOpen(true);
                          }}
                          disabled={scanCooldown > 0}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-500/10 transition-all flex items-center gap-3 border-b ${theme === "dark" ? "border-blue-500/20" : "border-blue-300/30"} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <LuScanLine className="text-xl text-cyan-400" />
                          <div className="flex-1">
                            <div className={`font-semibold ${theme === "dark" ? "text-blue-100" : "text-slate-800"} text-sm`}>Scan Anime</div>
                            {scanCooldown > 0 && (
                              <div className={`text-xs ${textSecondary}`}>Cooldown: {scanCooldown}s</div>
                            )}
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            setShowMenu(false);
                            setShowPersonaMenu(true);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-500/10 transition-all flex items-center gap-3"
                        >
                          <PersonaIcon className="text-xl text-pink-400" />
                          <div className="flex-1">
                            <div className={`font-semibold ${theme === "dark" ? "text-blue-100" : "text-slate-800"} text-sm`}>Change Persona</div>
                            <div className={`text-xs ${textSecondary}`}>{personaConfig[persona].name}</div>
                          </div>
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.header>

          <section className="flex-1 overflow-y-auto py-6 space-y-5 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent px-1">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                  className={`flex flex-col gap-2 ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {msg.type === "text" && (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`px-5 py-4 rounded-3xl max-w-[85%] sm:max-w-[75%] text-sm sm:text-base shadow-xl backdrop-blur-xl transition-all duration-300 ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 text-white shadow-blue-500/30"
                          : `${messageBg} shadow-slate-900/50`
                      }`}
                    >
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        className={`prose ${theme === "dark" ? "prose-invert" : ""} prose-sm sm:prose-base max-w-none prose-headings:text-blue-300 prose-a:text-cyan-400 prose-strong:text-blue-200`}
                      >
                        {msg.content as string}
                      </ReactMarkdown>
                    </motion.div>
                  )}

                  {msg.type === "image" && typeof msg.content === "string" && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 ${theme === "dark" ? "border-blue-400/30 shadow-blue-500/20" : "border-blue-500/30 shadow-blue-400/20"} shadow-2xl hover:border-blue-400/50 transition-all duration-300`}
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
                          whileHover={{ y: -4, scale: 1.02 }}
                          className={`group ${cardBg} backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl ${theme === "dark" ? "hover:shadow-blue-500/20 hover:border-blue-400/40" : "hover:shadow-blue-400/20 hover:border-blue-500/40"} border transition-all duration-300 flex flex-col`}
                        >
                          <div className="relative overflow-hidden aspect-video">
                            <video
                              src={r.video}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              controls
                              playsInline
                              preload="metadata"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${theme === "dark" ? "from-slate-900/80" : "from-white/80"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className={`font-bold ${theme === "dark" ? "text-blue-100 group-hover:text-cyan-300" : "text-slate-800 group-hover:text-blue-600"} text-sm sm:text-base line-clamp-2 transition-colors`}>
                                {r.title?.romaji || r.title?.english || "Unknown"}
                              </h3>
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <span className={`text-xs px-2.5 py-1 ${theme === "dark" ? "bg-blue-500/20 text-blue-300 border-blue-400/30" : "bg-blue-100 text-blue-700 border-blue-300/50"} rounded-full border`}>
                                  Ep {r.episode || "?"}
                                </span>
                                <span className={`text-xs px-2.5 py-1 ${theme === "dark" ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/30" : "bg-cyan-100 text-cyan-700 border-cyan-300/50"} rounded-full border`}>
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
                                <motion.span 
                                  className="group-hover/link:translate-x-1 transition-transform"
                                  whileHover={{ x: 4 }}
                                >
                                  →
                                </motion.span>
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-3 ${textSecondary} text-sm ${cardBg} px-5 py-3 rounded-full w-fit backdrop-blur-xl border transition-colors duration-500`}
              >
                <FaSpinner className="animate-spin text-lg" />
                <span className="font-medium">Aichixia is thinking...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </section>

          <motion.footer 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`p-3 sm:p-4 ${cardBg} backdrop-blur-2xl sticky bottom-0 rounded-t-2xl border-t mb-2 sm:mb-4 shadow-2xl transition-colors duration-500`}
          >
            {!session ? (
              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:shadow-2xl hover:shadow-blue-500/40 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm sm:text-base"
              >
                <FaPaperPlane />
                <span>Login to access Aichixia</span>
              </Link>
            ) : (
              <div className="flex gap-2 sm:gap-3 items-end">
                <textarea
                  ref={textareaRef}
                  placeholder="Ask me anything about anime..."
                  className={`flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl ${inputBg} border ${theme === "dark" ? "placeholder-blue-300/40" : "placeholder-slate-400"} ${textPrimary} focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-blue-400/50 focus:border-blue-400/50" : "focus:ring-blue-500/50 focus:border-blue-500/50"} transition-all backdrop-blur-xl text-sm sm:text-base resize-none max-h-32`}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  rows={1}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group p-3 sm:p-4 rounded-2xl ${theme === "dark" ? "bg-slate-700/50 hover:bg-slate-700" : "bg-slate-200/50 hover:bg-slate-300"} transition-all duration-300`}
                >
                  <FaImage className={`${theme === "dark" ? "text-blue-300" : "text-blue-600"} text-lg`} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={loading || (!input.trim() && !pendingImage)}
                  className="relative group p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {loading ? (
                    <FaSpinner className="animate-spin text-white text-lg relative z-10" />
                  ) : (
                    <FaPaperPlane className="text-white text-lg relative z-10" />
                  )}
                </motion.button>
              </div>
            )}
          </motion.footer>
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
                className={`${cardBg} backdrop-blur-2xl rounded-3xl p-6 sm:p-10 w-full max-w-md text-center shadow-2xl border relative transition-colors duration-500`}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", bounce: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40"
                >
                  <LuScanLine className="text-2xl text-white" />
                </motion.div>

                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r ${theme === "dark" ? "from-blue-300 to-cyan-300" : "from-blue-600 to-cyan-600"} bg-clip-text mb-3 mt-4`}
                >
                  Upload Screenshot
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`${textSecondary} text-sm sm:text-base mb-8 font-light`}
                >
                  Aichixia will detect which anime it's from instantly!
                </motion.p>

                {!session ? (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:shadow-2xl hover:shadow-blue-500/40 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <LuScanLine className="text-xl" />
                    <span>Login to Scan</span>
                  </Link>
                ) : (
                  <motion.label 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:shadow-2xl hover:shadow-blue-500/40 text-white rounded-2xl font-bold transition-all duration-300"
                  >
                    <LuScanLine className="text-xl" />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </motion.label>
                )}

                {pendingImage && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-8 relative w-full flex justify-center"
                  >
                    <div className={`relative w-56 h-56 border-2 ${theme === "dark" ? "border-blue-400/40 shadow-blue-500/20" : "border-blue-500/40 shadow-blue-400/20"} rounded-3xl overflow-hidden shadow-2xl`}>
                      <Image
                        src={pendingImage}
                        alt="preview"
                        fill
                        className="object-cover"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPendingImage(null)}
                        className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-xl rounded-full p-2 hover:bg-red-600 transition-all shadow-lg"
                      >
                        <FaTimes className="text-white text-sm" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                <div className="mt-8 flex justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setScanOpen(false)}
                    className={`px-6 py-3 ${theme === "dark" ? "bg-slate-700/50 hover:bg-slate-700/70 text-blue-200 border-blue-500/20" : "bg-slate-200/50 hover:bg-slate-300/70 text-slate-700 border-blue-300/30"} rounded-2xl transition-all font-semibold backdrop-blur-xl border`}
                  >
                    Cancel
                  </motion.button>
                  {session && pendingImage && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendMessage}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all font-semibold"
                    >
                      Scan Now
                    </motion.button>
                  )}
                </div>

                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setScanOpen(false)}
                  className={`absolute top-4 right-4 ${theme === "dark" ? "text-blue-300 hover:text-white" : "text-blue-600 hover:text-blue-800"} transition-all duration-300`}
                >
                  <FaTimes className="text-xl" />
                </motion.button>
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
                className={`${cardBg} backdrop-blur-2xl rounded-3xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl border relative transition-colors duration-500`}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", bounce: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r ${theme === "dark" ? "from-pink-300 to-purple-300" : "from-pink-600 to-purple-600"} bg-clip-text mb-6`}
                >
                  Choose Persona
                </motion.h2>

                <div className="space-y-3">
                  {(Object.keys(personaConfig) as Persona[]).map((p, idx) => {
                    const Icon = personaConfig[p].icon;
                    return (
                      <motion.button
                        key={p}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setPersona(p);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full px-5 py-4 rounded-2xl text-left hover:bg-blue-500/10 transition-all flex items-center gap-4 border-2 ${
                          persona === p
                            ? `${theme === "dark" ? "border-pink-400/50 bg-pink-500/10" : "border-pink-500/50 bg-pink-100/50"}`
                            : `${theme === "dark" ? "border-blue-500/20" : "border-blue-300/30"}`
                        }`}
                      >
                        <Icon className="text-2xl" />
                        <div className="flex-1">
                          <div className={`font-bold ${theme === "dark" ? "text-blue-100" : "text-slate-800"} text-sm sm:text-base`}>
                            {personaConfig[p].name}
                          </div>
                          <div className={`text-xs ${textSecondary}`}>
                            {personaConfig[p].description}
                          </div>
                        </div>
                        {persona === p && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" 
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setShowPersonaMenu(false)}
                  className={`absolute top-4 right-4 ${theme === "dark" ? "text-blue-300 hover:text-white" : "text-blue-600 hover:text-blue-800"} transition-all duration-300`}
                >
                  <FaTimes className="text-xl" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showThemeMenu && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowThemeMenu(false)}
            >
              <motion.div
                className={`${cardBg} backdrop-blur-2xl rounded-3xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl border relative transition-colors duration-500`}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", bounce: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r ${theme === "dark" ? "from-blue-300 to-cyan-300" : "from-blue-600 to-cyan-600"} bg-clip-text mb-6`}
                >
                  Choose Theme
                </motion.h2>

                <div className="space-y-3">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTheme("dark");
                      setShowThemeMenu(false);
                    }}
                    className={`w-full px-5 py-4 rounded-2xl text-left hover:bg-blue-500/10 transition-all flex items-center gap-4 border-2 ${
                      theme === "dark"
                        ? "border-blue-400/50 bg-blue-500/10"
                        : "border-blue-300/30"
                    }`}
                  >
                    <FaMoon className="text-2xl text-blue-400" />
                    <div className="flex-1">
                      <div className={`font-bold ${theme === "dark" ? "text-blue-100" : "text-slate-800"} text-sm sm:text-base`}>
                        Dark Mode
                      </div>
                      <div className={`text-xs ${textSecondary}`}>
                        Dark theme with blue accents
                      </div>
                    </div>
                    {theme === "dark" && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" 
                      />
                    )}
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTheme("light");
                      setShowThemeMenu(false);
                    }}
                    className={`w-full px-5 py-4 rounded-2xl text-left hover:bg-blue-500/10 transition-all flex items-center gap-4 border-2 ${
                      theme === "light"
                        ? "border-blue-500/50 bg-blue-100/50"
                        : `${theme === "dark" ? "border-blue-500/20" : "border-blue-300/30"}`
                    }`}
                  >
                    <FaSun className="text-2xl text-yellow-500" />
                    <div className="flex-1">
                      <div className={`font-bold ${theme === "dark" ? "text-blue-100" : "text-slate-800"} text-sm sm:text-base`}>
                        Light Mode
                      </div>
                      <div className={`text-xs ${textSecondary}`}>
                        Light theme with blue accents
                      </div>
                    </div>
                    {theme === "light" && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" 
                      />
                    )}
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setShowThemeMenu(false)}
                  className={`absolute top-4 right-4 ${theme === "dark" ? "text-blue-300 hover:text-white" : "text-blue-600 hover:text-blue-800"} transition-all duration-300`}
                >
                  <FaTimes className="text-xl" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
