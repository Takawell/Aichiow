import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Users, Settings, X, Zap, Brain, Globe, Clock, LogIn, UserPlus, Search, MessageSquare, Activity, Pin, Edit2, Trash2, Copy, Reply, Smile, MoreVertical, Check, Filter, ArrowDown } from "lucide-react";
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
  is_pinned?: boolean;
  replied_to?: string | null;
  edited_at?: string | null;
  reactions?: { [key: string]: string[] };
  is_deleted?: boolean;
}

const EMOJI_LIST = ["❤️", "👍", "😂", "🎉", "🔥", "👏", "😍", "🚀"];

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
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "pinned" | "aichixia">("all");
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const randomAvatars = ["/default.png", "/v2.png", "/v3.png", "/v4.png"];

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
      setShowScrollDown(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

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
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "community_messages" }, (payload) => {
        setMessages((prev) => prev.map((m) => (m.id === payload.new.id ? payload.new as Message : m)));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "community_messages" }, (payload) => {
        setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
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
    const { data } = await supabase
      .from("community_messages")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });
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

    if (editingMessage) {
      await supabase
        .from("community_messages")
        .update({ message: messageContent, edited_at: new Date().toISOString() })
        .eq("id", editingMessage.id);
      setEditingMessage(null);
    } else {
      await supabase.from("community_messages").insert({
        user_id: user ? user.id : null,
        username: name,
        avatar_url: avatar,
        message: messageContent,
        replied_to: replyingTo?.id || null,
        mode: aichixiaMode,
      });

      if (messageContent.toLowerCase().startsWith("@aichixia") || messageContent.toLowerCase().startsWith("/aichixia") || messageContent.toLowerCase().startsWith("/search")) {
        setIsTyping(true);
        await handleAichixiaResponse(messageContent);
        setIsTyping(false);
      }
    }

    setNewMessage("");
    setReplyingTo(null);
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
        body: JSON.stringify({
          message: cleanPrompt,
          history: messages.slice(-10).map((m) => ({
            role: m.user_id ? "user" : "assistant",
            content: typeof m.message === "string" ? m.message : JSON.stringify(m.message),
          })),
          mode: mode,
        }),
      });

      if (!res.ok) throw new Error(`API returned ${res.status}`);

      const data = await res.json();
      let aiReply = "⚠️ Aichixia didn't respond properly.";

      if (data.data && Array.isArray(data.data)) {
        aiReply = data.data.map((item: any, i: number) => `**${i + 1}.** [${item.title || "Untitled"}](${item.url || "#"})`).join("\n");
      } else if (data.reply) {
        aiReply = data.reply;
      }

      await supabase.from("community_messages").insert({
        user_id: null,
        username: "Aichixia",
        avatar_url: "/aichixia.png",
        message: aiReply,
        mode: mode,
      });
    } catch (error) {
      console.error("Aichixia error:", error);
      await supabase.from("community_messages").insert({
        user_id: null,
        username: "Aichixia",
        avatar_url: "/aichixia.png",
        message: `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  async function togglePin(messageId: string, currentPinStatus: boolean) {
    if (!user) return;
    await supabase.from("community_messages").update({ is_pinned: !currentPinStatus }).eq("id", messageId);
  }

  async function deleteMessage(messageId: string) {
    if (!user) return;
    await supabase.from("community_messages").update({ is_deleted: true }).eq("id", messageId);
  }

  async function toggleReaction(messageId: string, emoji: string) {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    const reactions = message.reactions || {};
    const userId = user?.id || anonName || "guest";
    const currentReactors = reactions[emoji] || [];

    let updatedReactions;
    if (currentReactors.includes(userId)) {
      updatedReactions = {
        ...reactions,
        [emoji]: currentReactors.filter((id) => id !== userId),
      };
      if (updatedReactions[emoji].length === 0) delete updatedReactions[emoji];
    } else {
      updatedReactions = {
        ...reactions,
        [emoji]: [...currentReactors, userId],
      };
    }

    await supabase.from("community_messages").update({ reactions: updatedReactions }).eq("id", messageId);
    setShowEmojiPicker(null);
  }

  function copyMessage(text: string) {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  }

  function showToast(message: string) {
    const toast = document.createElement("div");
    toast.className = "fixed top-4 right-4 bg-sky-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
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

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const canChat = !!user || !!anonName;

  const filteredMessages = messages.filter((msg) => {
    if (searchQuery && !msg.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterMode === "pinned" && !msg.is_pinned) return false;
    if (filterMode === "aichixia" && msg.username !== "Aichixia") return false;
    return true;
  });

  const groupedMessages = filteredMessages.reduce((groups, msg, idx) => {
    const prevMsg = filteredMessages[idx - 1];
    const isSameUser = prevMsg && prevMsg.username === msg.username;
    const timeDiff = prevMsg ? new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() : 0;
    const shouldGroup = isSameUser && timeDiff < 60000;

    if (shouldGroup && groups.length > 0) {
      groups[groups.length - 1].messages.push(msg);
    } else {
      groups.push({ username: msg.username, avatar: msg.avatar_url, messages: [msg] });
    }
    return groups;
  }, [] as { username: string; avatar: string; messages: Message[] }[]);

  const pinnedMessages = messages.filter((m) => m.is_pinned);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0a0a0c] via-[#0f0f11] to-[#1a1a1f] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <header className="relative flex items-center justify-between px-3 sm:px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }} className="relative">
            <Image src="/logo.png" alt="Logo" width={36} height={36} className="sm:w-10 sm:h-10 drop-shadow-2xl" />
          </motion.div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Community</h1>
              <span className="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">BETA</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                <span className="text-[10px] text-gray-400 font-medium">{onlineCount}</span>
              </div>
              <div className="w-px h-2 bg-white/10" />
              <div className="flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 text-blue-400" />
                <span className="text-[10px] text-gray-400 font-medium">{messages.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>
        </div>
      </header>

      {pinnedMessages.length > 0 && (
        <div className="relative px-3 sm:px-4 py-2 bg-sky-500/10 border-b border-sky-500/20 backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <Pin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-sky-300 font-semibold mb-0.5">Pinned Message</p>
              <p className="text-xs text-gray-300 truncate">{pinnedMessages[0].message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative px-3 sm:px-4 py-2 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Search messages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-all" />
          </div>
          <div className="flex gap-1">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFilterMode("all")} className={`px-2.5 py-1.5 text-[10px] font-medium rounded-lg transition-all ${filterMode === "all" ? "bg-sky-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>All</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFilterMode("pinned")} className={`px-2.5 py-1.5 text-[10px] font-medium rounded-lg transition-all ${filterMode === "pinned" ? "bg-sky-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
              <Pin className="w-3 h-3" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFilterMode("aichixia")} className={`px-2.5 py-1.5 text-[10px] font-medium rounded-lg transition-all ${filterMode === "aichixia" ? "bg-sky-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>AI</motion.button>
          </div>
        </div>
      </div>

      <main ref={messagesContainerRef} className="relative flex-1 overflow-y-auto px-2 sm:px-3 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {groupedMessages.map((group, groupIdx) => {
            const isMine = group.messages[0].user_id === user?.id;
            return (
              <motion.div key={groupIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className={`flex gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                {!isMine && (
                  <motion.img whileHover={{ scale: 1.1 }} src={group.avatar} alt={group.username} className={`rounded-full w-7 h-7 sm:w-8 sm:h-8 object-cover ring-2 ring-white/10 shadow-lg flex-shrink-0 ${group.username === "Aichixia" ? "cursor-pointer ring-sky-500/50" : ""}`} onClick={() => { if (group.username === "Aichixia") setShowAichixiaProfile(true); }} onError={handleImageError} />
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
                  {!isMine && (
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[10px] text-gray-400 font-medium">{group.username}</span>
                      {group.username === "Aichixia" && group.messages[0].mode && (
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 ${group.messages[0].mode === "deep" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-blue-500/20 text-blue-300 border border-blue-500/30"}`}>
                          {group.messages[0].mode === "deep" ? <Search className="w-2 h-2" /> : <MessageSquare className="w-2 h-2" />}
                          {group.messages[0].mode}
                        </span>
                      )}
                    </div>
                  )}

                  {group.messages.map((msg) => {
                    const repliedMsg = msg.replied_to ? messages.find((m) => m.id === msg.replied_to) : null;
                    return (
                      <div key={msg.id} className="w-full relative group/msg">
                        <motion.div whileHover={{ scale: 1.01 }} className={`px-3 py-2 rounded-2xl shadow-lg break-words backdrop-blur-sm relative ${isMine ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm" : "bg-white/10 text-gray-100 rounded-bl-sm border border-white/5"}`}>
                          {msg.is_pinned && (
                            <div className="absolute -top-1 -left-1">
                              <Pin className="w-3 h-3 text-sky-400" />
                            </div>
                          )}

                          {repliedMsg && (
                            <div className="mb-2 pl-2 border-l-2 border-sky-500/50 bg-black/20 rounded p-1.5">
                              <p className="text-[9px] text-sky-400 font-semibold">{repliedMsg.username}</p>
                              <p className="text-[10px] text-gray-400 truncate">{repliedMsg.message}</p>
                            </div>
                          )}

                          <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm prose-invert max-w-none text-xs [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" components={{
                            p: ({ node, ...props }) => <p {...props} className="mb-1 last:mb-0" />,
                            a: ({ node, ...props }) => <a {...props} className="text-blue-300 underline hover:text-blue-200 transition-colors" target="_blank" rel="noopener noreferrer" />,
                            code: ({ node, inline, ...props }: any) => inline ? <code {...props} className="px-1 py-0.5 rounded bg-black/30 text-cyan-300 font-mono text-[10px]" /> : <code {...props} className="block px-2 py-1.5 my-1 rounded-lg bg-black/40 text-cyan-300 font-mono text-[10px] overflow-x-auto border border-white/10" />,
                          }}>
                            {msg.message}
                          </ReactMarkdown>

                          {msg.edited_at && (
                            <span className="text-[8px] text-gray-400 italic mt-1 block">(edited)</span>
                          )}

                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {Object.entries(msg.reactions).map(([emoji, reactors]) => (
                                <motion.button key={emoji} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleReaction(msg.id, emoji)} className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border transition-all ${reactors.includes(user?.id || anonName || "guest") ? "bg-sky-500/30 border-sky-500/50" : "bg-white/10 border-white/20 hover:bg-white/20"}`}>
                                  <span>{emoji}</span>
                                  <span className="text-[9px] font-medium">{reactors.length}</span>
                                </motion.button>
                              ))}
                            </div>
                          )}

                          <div className="absolute -top-8 right-0 opacity-0 group-hover/msg:opacity-100 transition-opacity flex gap-1">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowEmojiPicker(msg.id)} className="p-1.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-sm hover:bg-black/90 transition-all">
                              <Smile className="w-3 h-3" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setReplyingTo(msg)} className="p-1.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-sm hover:bg-black/90 transition-all">
                              <Reply className="w-3 h-3" />
                            </motion.button>
                            {isMine && (
                              <>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setEditingMessage(msg); setNewMessage(msg.message); inputRef.current?.focus(); }} className="p-1.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-sm hover:bg-black/90 transition-all">
                                  <Edit2 className="w-3 h-3" />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteMessage(msg.id)} className="p-1.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-sm hover:bg-red-500/20 transition-all">
                                  <Trash2 className="w-3 h-3" />
                                </motion.button>
                              </>
                            )}
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => copyMessage(msg.message)} className="p-1.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-sm hover:bg-black/90 transition-all">
                              <Copy className="w-3 h-3" />
                            </motion.button>
                            {user && (
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => togglePin(msg.id, !!msg.is_pinned)} className="p-1.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-sm hover:bg-black/90 transition-all">
                                <Pin className="w-3 h-3" />
                              </motion.button>
                            )}
                          </div>

                          <AnimatePresence>
                            {showEmojiPicker === msg.id && (
                              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -top-12 right-0 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-2 flex gap-1 shadow-2xl z-20">
                                {EMOJI_LIST.map((emoji) => (
                                  <motion.button key={emoji} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => toggleReaction(msg.id, emoji)} className="p-1.5 hover:bg-white/10 rounded-lg transition-all">
                                    <span className="text-base">{emoji}</span>
                                  </motion.button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        <span className="text-[8px] text-gray-500 mt-0.5 px-1 block">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    );
                  })}
                </div>

                {isMine && <img src={user?.user_metadata?.avatar_url || anonAvatar || randomAvatars[0]} alt="You" className="rounded-full w-7 h-7 sm:w-8 sm:h-8 object-cover ring-2 ring-blue-500/50 shadow-lg flex-shrink-0" onError={handleImageError} />}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 items-center">
            <img src="/aichixia.png" alt="Aichixia" className="rounded-full w-7 h-7 object-cover ring-2 ring-sky-500/50" />
            <div className="flex gap-1 bg-white/10 px-3 py-2 rounded-2xl">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </main>

      <AnimatePresence>
        {showScrollDown && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={scrollToBottom} className="fixed bottom-20 right-4 p-2.5 rounded-full bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/30 z-10 transition-all">
            <ArrowDown className="w-4 h-4 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {replyingTo && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="px-3 sm:px-4 py-2 bg-sky-500/10 border-t border-sky-500/20 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-sky-400 font-semibold">Replying to {replyingTo.username}</p>
                <p className="text-xs text-gray-300 truncate">{replyingTo.message}</p>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setReplyingTo(null)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                <X className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingMessage && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="px-3 sm:px-4 py-2 bg-orange-500/10 border-t border-orange-500/20 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-orange-400 font-semibold">Editing message</p>
                <p className="text-xs text-gray-300 truncate">{editingMessage.message}</p>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setEditingMessage(null); setNewMessage(""); }} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                <X className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={sendMessage} className="relative flex items-center gap-2 p-2 sm:p-3 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="relative flex-1">
          <input ref={inputRef} type="text" placeholder={canChat ? (cooldown ? "Wait 10s..." : "Type a message...") : "Sign in to chat..."} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} disabled={!canChat || cooldown} className={`w-full text-xs sm:text-sm rounded-xl pl-3 pr-10 py-2.5 border transition-all backdrop-blur-sm ${canChat && !cooldown ? "bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "bg-white/5 border-white/5 text-gray-500 cursor-not-allowed"}`} />
          {newMessage && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-2.5 top-1/2 -translate-y-1/2"><Sparkles className="w-3.5 h-3.5 text-blue-400" /></motion.div>}
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={!canChat || cooldown} className={`p-2.5 rounded-xl flex items-center justify-center transition-all shadow-lg ${canChat && !cooldown ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" : "bg-white/5 cursor-not-allowed"}`}>
          <Send className="w-4 h-4" />
        </motion.button>
      </form>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-20 p-3 sm:p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-gradient-to-br from-[#18181b] to-[#1a1a1f] rounded-2xl p-5 sm:p-6 w-full max-w-sm text-center border border-white/10 shadow-2xl relative">
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </motion.button>
              <Sparkles className="w-10 h-10 mx-auto text-blue-500 mb-3" />
              <h2 className="text-lg sm:text-xl font-bold mb-1.5 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Join Community</h2>
              <p className="text-xs text-gray-400 mb-4">Choose how to continue</p>
              <div className="space-y-2 mb-4">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push("/auth/login")} className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all shadow-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />Login
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push("/auth/register")} className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all shadow-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />Register
                </motion.button>
              </div>
              <div className="relative flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">or guest</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <input type="text" placeholder="Guest name..." value={anonName} onChange={(e) => setAnonName(e.target.value)} className="w-full p-2.5 text-sm rounded-xl bg-white/5 border border-white/10 mb-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <div className="flex justify-center gap-2 mb-4">
                {randomAvatars.map((src) => (
                  <motion.img key={src} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} src={src} alt="avatar" width={40} height={40} onClick={() => setAnonAvatar(src)} className={`rounded-full w-10 h-10 cursor-pointer border-2 transition-all ${anonAvatar === src ? "border-blue-500 ring-2 ring-blue-500/30 scale-110" : "border-white/10 hover:border-white/30"}`} onError={handleImageError} />
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAnonConfirm} disabled={!anonName.trim()} className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all shadow-lg ${anonName.trim() ? "bg-white/10 hover:bg-white/15 border border-white/20" : "bg-white/5 cursor-not-allowed text-gray-500 border border-white/5"}`}>Continue as Guest</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAichixiaProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setShowAichixiaProfile(false)}>
            <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="bg-gradient-to-br from-[#0a0a12] via-[#0f1419] to-[#0a0a12] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto border-t border-x sm:border border-sky-500/20 shadow-2xl relative scrollbar-thin scrollbar-thumb-white/20">
              <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a12] to-transparent backdrop-blur-xl pb-2 px-4 pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1" />
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setShowAichixiaProfile(false)} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500">
                      <div className="w-full h-full rounded-full bg-[#0a0a12] p-1">
                        <img src="/aichixia.png" alt="Aichixia" className="w-full h-full rounded-full object-cover" />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black mb-1.5 bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Aichixia</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    <span className="text-xs font-semibold bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent">AI Assistant</span>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 space-y-3">
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-3 border border-white/10">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30">
                      <Brain className="w-4 h-4 text-sky-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-0.5 text-xs">About Me</h3>
                      <p className="text-[11px] text-gray-300 leading-relaxed">AI assistant for anime, manga, manhwa & light novels.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-3 border border-white/10">
                  <h3 className="font-bold text-white mb-2 text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />Response Mode
                  </h3>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={toggleAichixiaMode} className={`flex-1 p-2 rounded-lg border-2 transition-all ${aichixiaMode === "normal" ? "bg-blue-500/20 border-blue-500/50" : "bg-white/5 border-white/10"}`}>
                      <MessageSquare className={`w-3.5 h-3.5 mx-auto mb-0.5 ${aichixiaMode === "normal" ? "text-blue-400" : "text-gray-400"}`} />
                      <span className={`text-[10px] font-bold block ${aichixiaMode === "normal" ? "text-blue-300" : "text-gray-400"}`}>Normal</span>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={toggleAichixiaMode} className={`flex-1 p-2 rounded-lg border-2 transition-all ${aichixiaMode === "deep" ? "bg-purple-500/20 border-purple-500/50" : "bg-white/5 border-white/10"}`}>
                      <Search className={`w-3.5 h-3.5 mx-auto mb-0.5 ${aichixiaMode === "deep" ? "text-purple-400" : "text-gray-400"}`} />
                      <span className={`text-[10px] font-bold block ${aichixiaMode === "deep" ? "text-purple-300" : "text-gray-400"}`}>Deep</span>
                    </motion.button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gradient-to-br from-sky-500/10 to-sky-500/5 rounded-xl p-3 border border-sky-500/20">
                    <Clock className="w-4 h-4 text-sky-400 mb-1" />
                    <div className="text-lg font-bold text-white">24/7</div>
                    <div className="text-[9px] text-gray-400">Available</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-3 border border-blue-500/20">
                    <Zap className="w-4 h-4 text-blue-400 mb-1" />
                    <div className="text-lg font-bold text-white">Fast</div>
                    <div className="text-[9px] text-gray-400">Response</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-3 border border-white/10">
                  <h3 className="font-bold text-white mb-2 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />How to Use
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-sky-400">1</span>
                      </div>
                      <p className="text-[10px] text-gray-300">Use <code className="px-1 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[9px]">@aichixia</code></p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-blue-400">2</span>
                      </div>
                      <p className="text-[10px] text-gray-300">Or <code className="px-1 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[9px]">/aichixia</code></p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-purple-400">3</span>
                      </div>
                      <p className="text-[10px] text-gray-300">Use <code className="px-1 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px]">/search</code> for web</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAichixiaProfile(false)} className="rounded-xl py-2.5 text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 transition-all shadow-lg text-white">Chat Here</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => (window.location.href = "/aichixia")} className="rounded-xl py-2.5 text-xs font-bold bg-white/10 hover:bg-white/15 border border-sky-500/30 hover:border-sky-500/50 transition-all shadow-lg text-white">Private</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
