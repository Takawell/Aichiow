import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Menu, X, Users, Smile, Settings, Clock } from "lucide-react";

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
  const [cooldownTime, setCooldownTime] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const randomAvatars = ["/default.png", "/v2.png", "/v3.png", "/v4.png"];
  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "💯", "✨", "👀", "🚀", "💪", "🙏"];

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
      .subscribe();

    const randomUsers = Math.floor(Math.random() * 50) + 10;
    setOnlineUsers(randomUsers);

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown && cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown, cooldownTime]);

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
    setCooldownTime(10);
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
      await handleAichixiaResponse(messageContent);
    }

    setNewMessage("");
    setShowEmojiPicker(false);
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

  function insertEmoji(emoji: string) {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }

  const canChat = !!user || !!anonName;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden relative">
      
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 h-full w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 z-40 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Community Info</h2>
                <button onClick={() => setShowSidebar(false)} className="lg:hidden">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-4 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">Online Users</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">{onlineUsers}</p>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Activity
                  </h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>{messages.length} messages sent</p>
                    <p>AI responses active</p>
                    <p>Real-time updates</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
                  <h3 className="font-semibold mb-3">Quick Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Use @aichixia for AI</li>
                    <li>• Click messages to react</li>
                    <li>• 10s cooldown per msg</li>
                    <li>• Be respectful!</li>
                  </ul>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 w-full max-w-full lg:max-w-5xl mx-auto relative">
        
        <header className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-20 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative">
              <Image src="/logo.png" alt="Aichiow Logo" width={40} height={40} className="rounded-full" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Community Beta
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">{onlineUsers} online</p>
            </div>
          </div>
          {!user && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-blue-500/50"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isMine = msg.user_id === user?.id;
              const safeAvatar =
                msg.avatar_url ||
                randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
              const showAvatar = index === 0 || messages[index - 1].user_id !== msg.user_id;
              const isLastFromUser = index === messages.length - 1 || messages[index + 1].user_id !== msg.user_id;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, type: "spring" }}
                  className={`flex gap-2 lg:gap-3 ${isMine ? "justify-end" : "justify-start"}`}
                  onClick={() => setSelectedMessageId(msg.id)}
                >
                  {!isMine && (
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <motion.img
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          src={safeAvatar}
                          alt={msg.username}
                          className="rounded-full w-8 h-8 lg:w-10 lg:h-10 object-cover ring-2 ring-gray-800"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-8 h-8 lg:w-10 lg:h-10" />
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] text-sm flex flex-col ${
                      isMine ? "items-end" : "items-start"
                    }`}
                  >
                    {!isMine && showAvatar && (
                      <span className="text-xs font-medium text-gray-400 mb-1 px-1">
                        {msg.username}
                      </span>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4 py-2.5 rounded-2xl shadow-lg break-words whitespace-pre-wrap relative group ${
                        isMine
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
                          : "bg-gray-800/90 backdrop-blur-sm text-gray-100 rounded-bl-sm border border-gray-700/50"
                      } ${selectedMessageId === msg.id ? 'ring-2 ring-blue-500' : ''}`}
                      dangerouslySetInnerHTML={{
                        __html: msg.message
                          .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                          .replace(
                            /\[(.*?)\]\((.*?)\)/g,
                            `<a href='$2' class='text-blue-300 underline hover:text-blue-200' target='_blank'>$1</a>`
                          ),
                      }}
                    />
                    {isLastFromUser && (
                      <span className="text-[10px] text-gray-500 mt-1 px-1">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>

                  {isMine && (
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <motion.img
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          src={
                            user?.user_metadata?.avatar_url ||
                            anonAvatar ||
                            randomAvatars[Math.floor(Math.random() * randomAvatars.length)]
                          }
                          alt={user?.user_metadata?.full_name || anonName || "You"}
                          className="rounded-full w-8 h-8 lg:w-10 lg:h-10 object-cover ring-2 ring-blue-600"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-8 h-8 lg:w-10 lg:h-10" />
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 items-center text-gray-500 text-sm"
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
              <span>Someone is typing...</span>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </main>

        <div className="flex items-center gap-2 p-3 lg:p-4 border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-xl relative">
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full left-4 mb-2 bg-gray-800 rounded-2xl p-3 shadow-2xl border border-gray-700 grid grid-cols-6 gap-2 z-50"
              >
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 lg:p-2.5 rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <Smile className="w-5 h-5 text-gray-400" />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={
                canChat
                  ? cooldown
                    ? `Wait ${cooldownTime}s...`
                    : "Type a message..."
                  : "Sign in to chat..."
              }
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onBlur={() => setIsTyping(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && canChat && !cooldown) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              disabled={!canChat || cooldown}
              className={`w-full text-sm rounded-xl px-4 py-3 border transition-all ${
                canChat && !cooldown
                  ? "bg-gray-800/50 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  : "bg-gray-800/30 border-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            />
            {cooldown && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin" />
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: canChat && !cooldown ? 1.05 : 1 }}
            whileTap={{ scale: canChat && !cooldown ? 0.95 : 1 }}
            onClick={(e) => {
              e.preventDefault();
              sendMessage(e);
            }}
            disabled={!canChat || cooldown}
            className={`p-3 rounded-xl flex items-center justify-center transition-all shadow-lg flex-shrink-0 ${
              canChat && !cooldown
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-500/50"
                : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 lg:p-8 w-full max-w-md text-center border border-gray-700 shadow-2xl"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Join Community
                </h2>
                <p className="text-gray-400 text-sm">Choose your identity</p>
              </div>

              <input
                type="text"
                placeholder="Enter your name..."
                value={anonName}
                onChange={(e) => setAnonName(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />

              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Choose your avatar</p>
                <div className="flex justify-center gap-3">
                  {randomAvatars.map((src) => (
                    <motion.img
                      key={src}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      src={src}
                      alt="avatar"
                      width={50}
                      height={50}
                      onClick={() => setAnonAvatar(src)}
                      className={`rounded-full w-12 h-12 lg:w-14 lg:h-14 cursor-pointer border-2 transition-all ${
                        anonAvatar === src
                          ? "border-blue-500 ring-4 ring-blue-500/30 scale-110"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onError={handleImageError}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: anonName.trim() ? 1.02 : 1 }}
                whileTap={{ scale: anonName.trim() ? 0.98 : 1 }}
                onClick={handleAnonConfirm}
                disabled={!anonName.trim()}
                className={`w-full rounded-xl py-3 font-semibold transition-all shadow-lg ${
                  anonName.trim()
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-500/50"
                    : "bg-gray-700 cursor-not-allowed"
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
