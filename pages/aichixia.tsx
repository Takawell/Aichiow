"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaPaperPlane,
  FaTrash,
  FaUser,
  FaCircle,
  FaChevronDown,
  FaAngry,
  FaSmile,
  FaBriefcase,
  FaHeart,
  FaImage,
  FaTimes,
  FaCopy,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { LuScanLine } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabaseClient";
import { searchAnimeByFile } from "@/lib/traceMoe";
import Head from "next/head";

type Message = {
  role: "user" | "assistant";
  type?: "text" | "anime" | "scan" | "image";
  content: string | any[];
  timestamp: Date;
};

type Persona = "tsundere" | "friendly" | "professional" | "kawaii";

const personaConfig: Record<
  Persona,
  { name: string; description: string; color: string; icon: any }
> = {
  tsundere: {
    name: "Tsundere Mode",
    description: "B-baka! Classic tsundere personality",
    color: "from-pink-500 to-rose-500",
    icon: FaAngry,
  },
  friendly: {
    name: "Friendly Mode",
    description: "Warm and welcoming assistant",
    color: "from-green-500 to-emerald-500",
    icon: FaSmile,
  },
  professional: {
    name: "Professional Mode",
    description: "Formal and efficient helper",
    color: "from-blue-500 to-indigo-500",
    icon: FaBriefcase,
  },
  kawaii: {
    name: "Kawaii Mode",
    description: "Super cute and energetic!",
    color: "from-purple-500 to-pink-500",
    icon: FaHeart,
  },
};

export default function AichixiaModern() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      type: "text",
      content:
        "Hi I'm **Aichixia**, your AI assistant for anime, manga, manhwa, manhua, and light novels. You can chat or upload a screenshot to identify an anime instantly!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [persona, setPersona] = useState<Persona>("tsundere");
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [scanCooldown, setScanCooldown] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

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
    if (scanCooldown > 0) {
      const timer = setTimeout(() => setScanCooldown(scanCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [scanCooldown]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
      }
    };

    const container = chatContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSend = async () => {
    if ((!input.trim() && !pendingImage) || loading) return;

    let newMessages = [...messages];

    if (pendingImage) {
      setScanCooldown(30);
      setShowScanModal(false);

      newMessages.push({
        role: "user",
        type: "image",
        content: pendingImage,
        timestamp: new Date(),
      });
      newMessages.push({
        role: "user",
        type: "text",
        content: "What is this anime?",
        timestamp: new Date(),
      });
    }

    if (input.trim()) {
      newMessages.push({
        role: "user",
        type: "text",
        content: input,
        timestamp: new Date(),
      });
    }

    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setTyping(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      if (pendingImage) {
        const res = await fetch(pendingImage);
        const blob = await res.blob();
        const file = new File([blob], "upload.jpg", { type: "image/jpeg" });
        const scanRes = await searchAnimeByFile(file);

        await new Promise((resolve) => setTimeout(resolve, 500));

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "scan",
            content: scanRes,
            timestamp: new Date(),
          },
        ]);
      } else {
        const res = await fetch("/api/aichixia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: input,
            history: messages.slice(-10).map((m) => ({
              role: m.role,
              content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
            })),
            persona: persona === "tsundere" ? undefined : personaConfig[persona].description,
          }),
        });
        const data = await res.json();

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (data.data && Array.isArray(data.data)) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              type: "anime",
              content: data.data,
              timestamp: new Date(),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              type: "text",
              content: data.reply || "⚠️ No valid response.",
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        type: "text",
        content: "Gomen! Something went wrong... Please try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTyping(false);
      setPendingImage(null);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (confirm("Clear all chat history?")) {
      setMessages([
        {
          role: "assistant",
          type: "text",
          content:
            "Hi I'm **Aichixia**, your AI assistant for anime, manga, manhwa, manhua, and light novels. You can chat or upload a screenshot to identify an anime instantly!",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => setPendingImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyMessage = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const PersonaIcon = personaConfig[persona].icon;

  return (
    <>
      <Head>
        <title>Aichixia | AI Assistant</title>
        <meta
          name="description"
          content="Aichixia is your AI assistant for anime, manga, manhwa, and light novels."
        />
      </Head>

      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <img
                  src="https://aichiow.vercel.app/aichixia.png"
                  alt="Aichixia"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-sky-400 dark:border-sky-500 shadow-md"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                  <FaCircle size={5} className="text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2 truncate">
                  <span className="truncate">Aichixia</span>
                  <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full font-semibold flex-shrink-0">
                    AI
                  </span>
                </h1>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  <FaCircle size={5} className="text-emerald-500 animate-pulse flex-shrink-0" />
                  <span className="truncate">Online • Anime Assistant</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <PersonaIcon className="text-base sm:text-lg" />
                <span className="hidden md:inline">{personaConfig[persona].name.split(" ")[0]}</span>
                <FaChevronDown
                  size={10}
                  className={`transition-transform hidden sm:block ${
                    showPersonaMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showPersonaMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowPersonaMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20 backdrop-blur-xl"
                  >
                    {(Object.keys(personaConfig) as Persona[]).map((p) => {
                      const Icon = personaConfig[p].icon;
                      return (
                        <button
                          key={p}
                          onClick={() => {
                            setPersona(p);
                            setShowPersonaMenu(false);
                          }}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${
                            persona === p ? "bg-sky-50 dark:bg-sky-900/20" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Icon className="text-xl sm:text-2xl flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm truncate">
                                {personaConfig[p].name}
                              </div>
                              <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                                {personaConfig[p].description}
                              </div>
                            </div>
                            {persona === p && (
                              <FaCircle size={6} className="text-sky-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowScanModal(true)}
              disabled={scanCooldown > 0}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 rounded-lg transition-all text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuScanLine className="text-base sm:text-lg" />
              <span className="hidden lg:inline">
                {scanCooldown > 0 ? `${scanCooldown}s` : "Scan"}
              </span>
            </button>

            <button
              onClick={clearChat}
              className="p-1.5 sm:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors flex-shrink-0"
              title="Clear chat"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </header>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4"
        >
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center px-3 sm:px-4"
            >
              <img
                src="https://aichiow.vercel.app/aichixia.png"
                alt="Aichixia"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-sky-400 dark:border-sky-500 shadow-lg mb-4 sm:mb-6 animate-bounce"
              />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3 flex items-center justify-center gap-2">
                Konnichiwa! I'm Aichixia! <FaHeart className="text-pink-500" />
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mb-2">
                Your anime-loving AI assistant. Ask me anything about anime, manga, or upload a
                screenshot to identify anime instantly!
              </p>
              <div className="flex items-center gap-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                <span className="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full font-semibold">
                  {personaConfig[persona].name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-2xl w-full">
                {[
                  { q: "Recommend me some anime", icon: "🎬" },
                  { q: "What's trending right now?", icon: "🔥" },
                  { q: "Tell me about One Piece", icon: "📚" },
                  { q: "Who are you?", icon: "❓" },
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion.q)}
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 rounded-lg transition-all hover:shadow-md text-left group"
                  >
                    <span className="text-xl sm:text-2xl flex-shrink-0">{suggestion.icon}</span>
                    <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                      {suggestion.q}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.slice(1).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2 sm:gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0">
                  <img
                    src="https://aichiow.vercel.app/aichixia.png"
                    alt="Aichixia"
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-sky-400 dark:border-sky-500"
                  />
                </div>
              )}

              <div
                className={`flex flex-col max-w-[80%] sm:max-w-[75%] md:max-w-[70%] ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {msg.type === "image" && typeof msg.content === "string" && (
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-sky-400 dark:border-sky-500 shadow-lg mb-2">
                    <Image src={msg.content} alt="preview" fill className="object-cover" />
                  </div>
                )}

                {msg.type === "text" && (
                  <div className="relative group">
                    <div
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-md ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-tr-sm"
                          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm"
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        className="text-xs sm:text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                      >
                        {msg.content as string}
                      </ReactMarkdown>
                    </div>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyMessage(msg.content as string, idx)}
                        className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        {copiedIndex === idx ? (
                          <FaCheck size={12} className="text-green-500" />
                        ) : (
                          <FaCopy size={12} className="text-slate-500 dark:text-slate-400" />
                        )}
                      </button>
                    )}
                  </div>
                )}

                {msg.type === "scan" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
                    {(msg.content as any[]).map((r, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                      >
                        <div className="relative overflow-hidden aspect-video">
                          <video
                            src={r.video}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            controls
                            playsInline
                            preload="metadata"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base line-clamp-2 mb-2">
                            {r.title?.romaji || r.title?.english || "Unknown"}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            <span className="text-xs px-2.5 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full font-semibold">
                              Ep {r.episode || "?"}
                            </span>
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-sky-500 to-blue-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${r.similarity * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                              {(r.similarity * 100).toFixed(1)}%
                            </span>
                          </div>
                          {r.anilist && (
                            <Link
                              href={`/anime/${r.anilist}`}
                              className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold flex items-center gap-1 group/link"
                            >
                              View Details
                              <span className="group-hover/link:translate-x-1 transition-transform">
                                →
                              </span>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 px-2">
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 dark:text-slate-500">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold border-2 border-white dark:border-slate-800 shadow-md">
                    <FaUser size={12} className="sm:text-sm" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 sm:gap-3 justify-start"
            >
              <img
                src="https://aichiow.vercel.app/aichixia.png"
                alt="Aichixia"
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-sky-400 dark:border-sky-500"
              />
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl rounded-tl-sm shadow-md">
                <div className="flex gap-1 sm:gap-1.5">
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sky-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sky-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sky-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="fixed bottom-24 right-4 sm:right-8 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-10"
            >
              <FaChevronDown size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-3 sm:py-4">
          <div className="max-w-4xl mx-auto">
            {!session ? (
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <FaPaperPlane size={14} />
                <span className="text-sm sm:text-base">Login to access Aichixia</span>
              </Link>
            ) : (
              <div className="flex gap-2 items-stretch">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about anime..."
                  disabled={loading}
                  rows={1}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 focus:border-sky-400 dark:focus:border-sky-500 rounded-xl resize-none outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base max-h-32"
                  style={{
                    minHeight: "46px",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "46px";
                    target.style.height = Math.min(target.scrollHeight, 128) + "px";
                  }}
                />

                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="px-4 sm:px-5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 group flex-shrink-0"
                  style={{
                    minHeight: "46px",
                  }}
                >
                  <span className="hidden sm:inline text-sm md:text-base">Send</span>
                  <FaPaperPlane
                    size={14}
                    className={`${
                      loading ? "animate-pulse" : "group-hover:translate-x-0.5"
                    } transition-transform sm:text-base`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showScanModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScanModal(false)}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                      <LuScanLine className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                        Scan Anime
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Upload a screenshot to identify
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowScanModal(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-slate-600 dark:text-slate-400" />
                  </button>
                </div>

                {!session ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Please login to use anime scan feature
                    </p>
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <FaPaperPlane size={14} />
                      <span>Login Now</span>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all ${
                        dragActive
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                          : "border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-4"
                      >
                        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full">
                          <FaImage className="text-3xl sm:text-4xl text-slate-400 dark:text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            PNG, JPG or GIF (MAX. 10MB)
                          </p>
                        </div>
                      </label>
                    </div>

                    {pendingImage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6"
                      >
                        <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-sky-400 dark:border-sky-500 shadow-lg">
                          <Image src={pendingImage} alt="preview" fill className="object-cover" />
                          <button
                            onClick={() => setPendingImage(null)}
                            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-lg"
                          >
                            <FaTimes className="text-white" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {pendingImage && (
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => {
                            setPendingImage(null);
                            setShowScanModal(false);
                          }}
                          className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSend}
                          disabled={loading}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span>Scanning...</span>
                            </>
                          ) : (
                            <>
                              <LuScanLine />
                              <span>Scan Now</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
