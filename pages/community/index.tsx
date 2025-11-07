import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Users, Settings, X } from "lucide-react";

interface Message {
  id: string;
  message: string;
  created_at: string;
  user_id: string | null;
  username: string;
  avatar_url: string;
}

export default function CommunityPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [anonName, setAnonName] = useState("");
  const [anonAvatar, setAnonAvatar] = useState("/default.png");
  const [cooldown, setCooldown] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const randomAvatars = ["/default.png", "/v2.png", "/v3.png", "/v4.png"];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
      else setShowModal(true);
    });

    fetchMessages();

    const channel = supabase
      .channel("community-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
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
      .select("id, user_id, username, avatar_url, message, created_at")
      .order("created_at", { ascending: true });
    setMessages(data || []);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (cooldown) return;
    if (!newMessage.trim()) return;
    if (!user && !anonName) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), 10000);

    const name =
      user?.user_metadata?.full_name ||
      anonName ||
      `Guest-${Math.floor(Math.random() * 1000)}`;

    const avatar =
      user?.user_metadata?.avatar_url ||
      anonAvatar ||
      randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

    const messageContent = newMessage.trim();

    await supabase.from("community_messages").insert({
      user_id: user ? user.id : null,
      username: name,
      avatar_url: avatar,
      message: messageContent,
    });

    if (
      messageContent.toLowerCase().startsWith("@aichixia") ||
      messageContent.toLowerCase().startsWith("/aichixia")
    ) {
      setIsTyping(true);
      await handleAichixiaResponse(messageContent);
      setIsTyping(false);
    }

    setNewMessage("");
    inputRef.current?.focus();
  }

  async function handleAichixiaResponse(prompt: string) {
    try {
      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt.replace(/^(@|\/)aichixia/i, "").trim(),
          history: messages.map((m) => ({
            role: m.user_id ? "user" : "assistant",
            content: m.message,
          })),
        }),
      });

      const data = await res.json();

      let aiReply = "⚠️ Aichixia didn't respond properly.";

      if (data.data && Array.isArray(data.data)) {
        aiReply = data.data
          .map(
            (item: any, i: number) =>
              `**${i + 1}.** [${item.title || "Untitled"}](${item.url || "#"})`
          )
          .join("\n");
      } else if (data.reply) {
        aiReply = data.reply;
      }

      await supabase.from("community_messages").insert({
        user_id: null,
        username: "Aichixia",
        avatar_url: "/aichixia.png",
        message: aiReply,
      });
    } catch (error) {
      await supabase.from("community_messages").insert({
        user_id: null,
        username: "Aichixia",
        avatar_url: "/aichixia.png",
        message: "❌ Error while connecting to Aichixia.",
      });
    }
  }

  function handleAnonConfirm() {
    if (anonName.trim()) setShowModal(false);
  }

  function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.src =
      randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
  }

  const canChat = !!user || !!anonName;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0a0a0c] via-[#0f0f11] to-[#1a1a1f] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      
      <header className="relative flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Image src="/logo.png" alt="Aichiow Logo" width={40} height={40} className="drop-shadow-lg" />
          </motion.div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Community Beta
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <Users className="w-3 h-3" />
              <span>{onlineCount} online</span>
            </div>
          </div>
        </div>
        {!user && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-3 sm:px-4 py-2 rounded-full shadow-lg transition-all"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </motion.button>
        )}
      </header>

      <main className="relative flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => {
            const isMine = msg.user_id === user?.id;
            const safeAvatar =
              msg.avatar_url ||
              randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className={`flex gap-2 sm:gap-3 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {!isMine && (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={safeAvatar}
                    alt={msg.username}
                    className="rounded-full w-8 h-8 sm:w-9 sm:h-9 object-cover ring-2 ring-white/10 shadow-lg"
                    onError={handleImageError}
                  />
                )}

                <div
                  className={`max-w-[80%] sm:max-w-[75%] text-sm flex flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  {!isMine && (
                    <span className="text-xs text-gray-400 mb-1 px-1 font-medium">
                      {msg.username}
                    </span>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-lg break-words whitespace-pre-wrap backdrop-blur-sm ${
                      isMine
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
                        : "bg-white/10 text-gray-100 rounded-bl-sm border border-white/5"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: msg.message
                        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                        .replace(
                          /\[(.*?)\]\((.*?)\)/g,
                          `<a href='$2' class='text-blue-300 underline hover:text-blue-200' target='_blank'>$1</a>`
                        ),
                    }}
                  />
                  <span className="text-[10px] text-gray-500 mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {isMine && (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={
                      user?.user_metadata?.avatar_url ||
                      anonAvatar ||
                      randomAvatars[
                        Math.floor(Math.random() * randomAvatars.length)
                      ]
                    }
                    alt={user?.user_metadata?.full_name || anonName || "You"}
                    className="rounded-full w-8 h-8 sm:w-9 sm:h-9 object-cover ring-2 ring-blue-500/50 shadow-lg"
                    onError={handleImageError}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-center"
          >
            <img
              src="/aichixia.png"
              alt="Aichixia"
              className="rounded-full w-9 h-9 object-cover ring-2 ring-purple-500/50"
            />
            <div className="flex gap-1 bg-white/10 px-4 py-3 rounded-2xl">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-gray-400 rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-gray-400 rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-gray-400 rounded-full"
              />
            </div>
          </motion.div>
        )}
        
        <div ref={bottomRef} />
      </main>

      <form
        onSubmit={sendMessage}
        className="relative flex items-center gap-2 p-3 sm:p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder={
              canChat
                ? cooldown
                  ? "Please wait 10 seconds..."
                  : "Type a message..."
                : "Sign in or guest to chat..."
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!canChat || cooldown}
            className={`w-full text-sm rounded-2xl pl-4 pr-12 py-3 sm:py-3.5 border transition-all backdrop-blur-sm ${
              canChat && !cooldown
                ? "bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                : "bg-white/5 border-white/5 text-gray-500 cursor-not-allowed"
            }`}
          />
          {newMessage && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
            </motion.div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!canChat || cooldown}
          className={`p-3 sm:p-3.5 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
            canChat && !cooldown
              ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              : "bg-white/5 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </form>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-20 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-[#18181b] to-[#1a1a1f] rounded-3xl p-6 sm:p-8 w-full max-w-md text-center border border-white/10 shadow-2xl relative"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <Sparkles className="w-12 h-12 mx-auto text-blue-500" />
              </motion.div>
              
              <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Join as Guest
              </h2>
              <p className="text-sm text-gray-400 mb-6">Choose your identity</p>
              
              <input
                type="text"
                placeholder="Enter your name..."
                value={anonName}
                onChange={(e) => setAnonName(e.target.value)}
                className="w-full p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 mb-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              
              <div className="flex justify-center gap-3 mb-6">
                {randomAvatars.map((src) => (
                  <motion.img
                    key={src}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    src={src}
                    alt="avatar"
                    width={48}
                    height={48}
                    onClick={() => setAnonAvatar(src)}
                    className={`rounded-full w-12 h-12 sm:w-14 sm:h-14 cursor-pointer border-2 transition-all ${
                      anonAvatar === src
                        ? "border-blue-500 ring-4 ring-blue-500/30 scale-110"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    onError={handleImageError}
                  />
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnonConfirm}
                disabled={!anonName.trim()}
                className={`w-full rounded-xl py-3 sm:py-3.5 font-semibold transition-all shadow-lg ${
                  anonName.trim()
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    : "bg-white/5 cursor-not-allowed text-gray-500"
                }`}
              >
                Start Chatting
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
