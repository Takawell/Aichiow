import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Users, Settings, X, Zap, Brain, Globe, Clock, LogIn, UserPlus, Search, MessageSquare, Activity } from "lucide-react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  message: string;
  created_at: string;
  user_id: string | null;
  username: string;
  avatar_url: string;
  mode?: "normal" | "deep";
}

export default function CommunityPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [anonName, setAnonName] = useState("");
  const [anonAvatar, setAnonAvatar] = useState("/default.png");
  const [cooldown, setCooldown] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [showAichixiaProfile, setShowAichixiaProfile] = useState(false);
  const [aichixiaMode, setAichixiaMode] = useState<"normal" | "deep">("normal");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const randomAvatars = ["/default.png", "/v2.png", "/v3.png", "/v4.png"];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const savedMode = localStorage.getItem("aichixia-mode") as "normal" | "deep" | null;
    if (savedMode) setAichixiaMode(savedMode);

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
      else setShowModal(true);
    });

    fetchMessages();

    const channel = supabase
      .channel("community-room")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    const { data } = await supabase.from("community_messages").select("id, user_id, username, avatar_url, message, created_at").order("created_at", { ascending: true });
    setMessages(data || []);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (cooldown || !newMessage.trim() || (!user && !anonName)) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), 10000);

    const name = user?.user_metadata?.full_name || anonName || `Guest-${Math.floor(Math.random() * 1000)}`;
    const avatar = user?.user_metadata?.avatar_url || anonAvatar || randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
    const messageContent = newMessage.trim();

    await supabase.from("community_messages").insert({ user_id: user ? user.id : null, username: name, avatar_url: avatar, message: messageContent });

    if (messageContent.toLowerCase().startsWith("@aichixia") || messageContent.toLowerCase().startsWith("/aichixia") || messageContent.toLowerCase().startsWith("/search")) {
      setIsTyping(true);
      await handleAichixiaResponse(messageContent);
      setIsTyping(false);
    }

    setNewMessage("");
    inputRef.current?.focus();
  }

  async function handleAichixiaResponse(prompt: string) {
    try {
      const isSearchCommand = prompt.toLowerCase().startsWith("/search");
      const mode = isSearchCommand ? "deep" : aichixiaMode;
      const cleanPrompt = prompt.replace(/^(@|\/)aichixia/i, "").replace(/^\/search/i, "").trim();

      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, message: cleanPrompt, history: messages.slice(-10).map((m) => ({ role: m.user_id ? "user" : "assistant", content: m.message })) }),
      });

      const data = await res.json();
      let aiReply = "⚠️ Aichixia didn't respond properly.";

      if (data.data && Array.isArray(data.data)) {
        aiReply = data.data.map((item: any, i: number) => `**${i + 1}.** [${item.title || "Untitled"}](${item.url || "#"})`).join("\n");
      } else if (data.reply) {
        aiReply = data.reply;
      }

      await supabase.from("community_messages").insert({ user_id: null, username: "Aichixia", avatar_url: "/aichixia.png", message: aiReply, mode });
    } catch (error) {
      await supabase.from("community_messages").insert({ user_id: null, username: "Aichixia", avatar_url: "/aichixia.png", message: "❌ Error while connecting to Aichixia." });
    }
  }

  function handleAnonConfirm() {
    if (anonName.trim()) setShowModal(false);
  }

  function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.src = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
  }

  function toggleAichixiaMode() {
    const newMode = aichixiaMode === "normal" ? "deep" : "normal";
    setAichixiaMode(newMode);
    localStorage.setItem("aichixia-mode", newMode);
  }

  const canChat = !!user || !!anonName;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0a0a0c] via-[#0f0f11] to-[#1a1a1f] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      
      <header className="relative flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }} className="relative">
            <motion.div animate={{ boxShadow: ["0 0 20px rgba(59, 130, 246, 0.3)", "0 0 40px rgba(59, 130, 246, 0.5)", "0 0 20px rgba(59, 130, 246, 0.3)"] }} transition={{ duration: 2, repeat: Infinity }} className="rounded-full">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="drop-shadow-2xl" />
            </motion.div>
          </motion.div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Community</h1>
              <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-300">BETA</motion.span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5">
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                <span className="text-xs text-gray-400 font-medium">{onlineCount} Online</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-gray-400 font-medium">{messages.length} Messages</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <motion.div whileHover={{ scale: 1.05 }} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
              <img src={user.user_metadata?.avatar_url || randomAvatars[0]} alt="User" className="w-6 h-6 rounded-full object-cover" onError={handleImageError} />
              <span className="text-sm font-medium text-gray-300">{user.user_metadata?.full_name || "User"}</span>
            </motion.div>
          )}
          
          {!user && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="flex items-center gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2.5 rounded-full shadow-lg transition-all font-semibold">
              <Settings className="w-4 h-4" />
              <span>Setup</span>
            </motion.button>
          )}
        </div>
      </header>

      <main className="relative flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => {
            const isMine = msg.user_id === user?.id;
            const safeAvatar = msg.avatar_url || randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: idx * 0.02 }} className={`flex gap-2 sm:gap-3 ${isMine ? "justify-end" : "justify-start"}`}>
                {!isMine && (
                  <motion.img whileHover={{ scale: 1.1 }} src={safeAvatar} alt={msg.username} className={`rounded-full w-8 h-8 sm:w-9 sm:h-9 object-cover ring-2 ring-white/10 shadow-lg ${msg.username === "Aichixia" ? "cursor-pointer ring-sky-500/50" : ""}`} onClick={() => { if (msg.username === "Aichixia") setShowAichixiaProfile(true); }} onError={handleImageError} />
                )}

                <div className={`max-w-[80%] sm:max-w-[75%] text-sm flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  {!isMine && (
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-xs text-gray-400 font-medium">{msg.username}</span>
                      {msg.username === "Aichixia" && msg.mode && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${msg.mode === "deep" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-blue-500/20 text-blue-300 border border-blue-500/30"}`}>
                          {msg.mode === "deep" ? <Search className="w-2.5 h-2.5" /> : <MessageSquare className="w-2.5 h-2.5" />}
                          {msg.mode}
                        </span>
                      )}
                    </div>
                  )}
                  <motion.div whileHover={{ scale: 1.02 }} className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-lg break-words backdrop-blur-sm ${isMine ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm" : "bg-white/10 text-gray-100 rounded-bl-sm border border-white/5"}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" components={{
                      p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                      a: ({ node, ...props }) => <a {...props} className="text-blue-300 underline hover:text-blue-200 transition-colors" target="_blank" rel="noopener noreferrer" />,
                      table: ({ node, ...props }) => <div className="overflow-x-auto my-3 rounded-lg border border-white/10"><table {...props} className="min-w-full border-collapse" /></div>,
                      thead: ({ node, ...props }) => <thead {...props} className="bg-white/10" />,
                      th: ({ node, ...props }) => <th {...props} className="border border-white/10 px-3 py-2 text-left font-semibold text-xs" />,
                      td: ({ node, ...props }) => <td {...props} className="border border-white/10 px-3 py-2 text-xs" />,
                      ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside my-2 space-y-1" />,
                      ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside my-2 space-y-1" />,
                      li: ({ node, ...props }) => <li {...props} className="text-sm" />,
                      code: ({ node, inline, ...props }: any) => inline ? <code {...props} className="px-1.5 py-0.5 rounded bg-black/30 text-cyan-300 font-mono text-xs" /> : <code {...props} className="block px-3 py-2 my-2 rounded-lg bg-black/40 text-cyan-300 font-mono text-xs overflow-x-auto border border-white/10" />,
                      pre: ({ node, ...props }) => <pre {...props} className="my-2 overflow-x-auto" />,
                      blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-4 border-blue-500/50 pl-3 my-2 italic text-gray-300" />,
                      h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold mt-3 mb-2" />,
                      h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold mt-3 mb-2" />,
                      h3: ({ node, ...props }) => <h3 {...props} className="text-base font-bold mt-2 mb-1" />,
                    }}>
                      {msg.message}
                    </ReactMarkdown>
                  </motion.div>
                  <span className="text-[10px] text-gray-500 mt-1 px-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>

                {isMine && <motion.img whileHover={{ scale: 1.1 }} src={user?.user_metadata?.avatar_url || anonAvatar || randomAvatars[Math.floor(Math.random() * randomAvatars.length)]} alt={user?.user_metadata?.full_name || anonName || "You"} className="rounded-full w-8 h-8 sm:w-9 sm:h-9 object-cover ring-2 ring-blue-500/50 shadow-lg" onError={handleImageError} />}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 items-center">
            <img src="/aichixia.png" alt="Aichixia" className="rounded-full w-9 h-9 object-cover ring-2 ring-sky-500/50" />
            <div className="flex gap-1 bg-white/10 px-4 py-3 rounded-2xl">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay }} className="w-2 h-2 bg-gray-400 rounded-full" />
              ))}
            </div>
          </motion.div>
        )}
        
        <div ref={bottomRef} />
      </main>

      <form onSubmit={sendMessage} className="relative flex items-center gap-2 p-3 sm:p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="relative flex-1">
          <input ref={inputRef} type="text" placeholder={canChat ? (cooldown ? "Please wait 10 seconds..." : "Type a message...") : "Sign in or guest to chat..."} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} disabled={!canChat || cooldown} className={`w-full text-sm rounded-2xl pl-4 pr-12 py-3 sm:py-3.5 border transition-all backdrop-blur-sm ${canChat && !cooldown ? "bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "bg-white/5 border-white/5 text-gray-500 cursor-not-allowed"}`} />
          {newMessage && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-1/2 -translate-y-1/2"><Sparkles className="w-4 h-4 text-blue-400" /></motion.div>}
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={!canChat || cooldown} className={`p-3 sm:p-3.5 rounded-2xl flex items-center justify-center transition-all shadow-lg ${canChat && !cooldown ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" : "bg-white/5 cursor-not-allowed"}`}>
          <Send className="w-5 h-5" />
        </motion.button>
      </form>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-20 p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-gradient-to-br from-[#18181b] to-[#1a1a1f] rounded-3xl p-6 sm:p-8 w-full max-w-md text-center border border-white/10 shadow-2xl relative">
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></motion.button>
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mb-4"><Sparkles className="w-12 h-12 mx-auto text-blue-500" /></motion.div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Join the Community</h2>
              <p className="text-sm text-gray-400 mb-6">Choose how you want to continue</p>
              <div className="space-y-3 mb-6">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push('/auth/login')} className="w-full rounded-xl py-3 sm:py-3.5 font-semibold transition-all shadow-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 flex items-center justify-center gap-2"><LogIn className="w-5 h-5" />Login to Account</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push('/auth/register')} className="w-full rounded-xl py-3 sm:py-3.5 font-semibold transition-all shadow-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"><UserPlus className="w-5 h-5" />Create New Account</motion.button>
              </div>
              <div className="relative flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">or continue as</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <input type="text" placeholder="Enter guest name..." value={anonName} onChange={(e) => setAnonName(e.target.value)} className="w-full p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 mb-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <div className="flex justify-center gap-3 mb-6">
                {randomAvatars.map((src) => (
                  <motion.img key={src} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} src={src} alt="avatar" width={48} height={48} onClick={() => setAnonAvatar(src)} className={`rounded-full w-12 h-12 sm:w-14 sm:h-14 cursor-pointer border-2 transition-all ${anonAvatar === src ? "border-blue-500 ring-4 ring-blue-500/30 scale-110" : "border-white/10 hover:border-white/30"}`} onError={handleImageError} />
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAnonConfirm} disabled={!anonName.trim()} className={`w-full rounded-xl py-3 sm:py-3.5 font-semibold transition-all shadow-lg ${anonName.trim() ? "bg-white/10 hover:bg-white/15 border border-white/20" : "bg-white/5 cursor-not-allowed text-gray-500 border border-white/5"}`}>Continue as Guest</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAichixiaProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setShowAichixiaProfile(false)}>
            <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="bg-gradient-to-br from-[#0a0a12] via-[#0f1419] to-[#0a0a12] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-y-auto border-t border-x sm:border border-sky-500/20 shadow-2xl relative scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a12] to-transparent backdrop-blur-xl pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1" />
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setShowAichixiaProfile(false)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><X className="w-5 h-5" /></motion.button>
                </div>

                <div className="text-center mb-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="relative inline-block mb-4">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 opacity-20 blur-2xl scale-110" />
                    <motion.div animate={{ boxShadow: ["0 0 20px rgba(14, 165, 233, 0.4)", "0 0 40px rgba(59, 130, 246, 0.4)", "0 0 20px rgba(6, 182, 212, 0.4)", "0 0 40px rgba(14, 165, 233, 0.4)"] }} transition={{ duration: 3, repeat: Infinity }} className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500">
                      <div className="w-full h-full rounded-full bg-[#0a0a12] p-1.5">
                        <img src="/aichixia.png" alt="Aichixia" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-1 right-1 w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-4 border-[#0a0a12] shadow-lg flex items-center justify-center">
                        <motion.div animate={{ scale: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity }} className="w-2.5 h-2.5 bg-white rounded-full" />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Aichixia</motion.h2>
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30 backdrop-blur-sm">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Sparkles className="w-4 h-4 text-sky-400" /></motion.div>
                    <span className="text-sm font-semibold bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent">AI Assistant</span>
                  </motion.div>
                </div>
              </div>

              <div className="px-4 sm:px-6 pb-6 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30"><Brain className="w-5 h-5 text-sky-400" /></div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1 text-sm">About Me</h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Hi I'm Aichixia, your AI assistant for anime, manga, manhwa, manhua, and light novels.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" />Response Mode</h3>
                  </div>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={toggleAichixiaMode} className={`flex-1 p-3 rounded-xl border-2 transition-all ${aichixiaMode === "normal" ? "bg-blue-500/20 border-blue-500/50" : "bg-white/5 border-white/10 hover:border-white/20"}`}>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <MessageSquare className={`w-4 h-4 ${aichixiaMode === "normal" ? "text-blue-400" : "text-gray-400"}`} />
                        <span className={`text-sm font-bold ${aichixiaMode === "normal" ? "text-blue-300" : "text-gray-400"}`}>Normal</span>
                      </div>
                      <p className="text-xs text-gray-400">Quick responses</p>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={toggleAichixiaMode} className={`flex-1 p-3 rounded-xl border-2 transition-all ${aichixiaMode === "deep" ? "bg-purple-500/20 border-purple-500/50" : "bg-white/5 border-white/10 hover:border-white/20"}`}>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Search className={`w-4 h-4 ${aichixiaMode === "deep" ? "text-purple-400" : "text-gray-400"}`} />
                        <span className={`text-sm font-bold ${aichixiaMode === "deep" ? "text-purple-300" : "text-gray-400"}`}>Deep</span>
                      </div>
                      <p className="text-xs text-gray-400">Web search enabled</p>
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-sky-500/10 to-sky-500/5 rounded-2xl p-4 border border-sky-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-5 h-5 text-sky-400" />
                      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-0.5">24/7</div>
                    <div className="text-xs text-gray-400">Always Available</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-4 border border-blue-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-blue-400"><Sparkles className="w-3 h-3" /></motion.div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-0.5">Fast</div>
                    <div className="text-xs text-gray-400">Quick Response</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-2xl p-4 border border-cyan-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}><Brain className="w-3 h-3 text-cyan-400" /></motion.div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-0.5">Smart</div>
                    <div className="text-xs text-gray-400">AI Powered</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl p-4 border border-emerald-500/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Globe className="w-5 h-5 text-emerald-400" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-0.5">Online</div>
                    <div className="text-xs text-gray-400">Active Now</div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                  <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-sky-400" />How to Use</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-xs font-bold text-sky-400">1</span></div>
                      <div className="flex-1"><p className="text-xs text-gray-300">Mention me with <code className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-xs">@aichixia</code> in your message</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-xs font-bold text-blue-400">2</span></div>
                      <div className="flex-1"><p className="text-xs text-gray-300">Or use command <code className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs">/aichixia</code> followed by your question</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-xs font-bold text-purple-400">3</span></div>
                      <div className="flex-1"><p className="text-xs text-gray-300">Use <code className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-xs">/search</code> for web search (auto deep mode)</p></div>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="grid grid-cols-2 gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAichixiaProfile(false)} className="rounded-2xl py-4 font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 hover:from-sky-700 hover:via-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-sky-500/25 text-white text-sm">Chat Here</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => window.location.href = '/aichixia'} className="rounded-2xl py-4 font-bold bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-sky-500/30 hover:border-sky-500/50 transition-all shadow-lg text-white text-sm">Private Chat</motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
