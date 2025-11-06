import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

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
  const bottomRef = useRef<HTMLDivElement>(null);

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
      .subscribe();

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
    if (!newMessage.trim()) return;
    if (!user && !anonName) return; 

    const name =
      user?.user_metadata?.full_name ||
      anonName ||
      `Guest-${Math.floor(Math.random() * 1000)}`;

    const avatar =
      user?.user_metadata?.avatar_url ||
      anonAvatar ||
      randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

    await supabase.from("community_messages").insert({
      user_id: user ? user.id : null,
      username: name,
      avatar_url: avatar,
      message: newMessage.trim(),
    });

    setNewMessage("");
  }

  function handleAnonConfirm() {
    if (anonName.trim()) {
      setShowModal(false);
    }
  }

  function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.src =
      randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
  }

  const canChat = !!user || !!anonName;

  return (
    <div className="flex flex-col h-screen bg-[#0f0f11] text-white overflow-hidden relative">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#121214] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Aichiow Logo" width={36} height={36} />
          <h1 className="text-xl font-bold tracking-wide">Community Beta</h1>
        </div>
        {!user && (
          <button
            onClick={() => setShowModal(true)}
            className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg"
          >
            settings
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((msg) => {
            const isMine = msg.user_id === user?.id;
            const safeAvatar =
              msg.avatar_url ||
              randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {!isMine && (
                  <img
                    src={safeAvatar}
                    alt={msg.username}
                    className="rounded-full w-9 h-9 object-cover"
                    onError={handleImageError}
                  />
                )}

                <div
                  className={`max-w-[75%] text-sm flex flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  {!isMine && (
                    <span className="text-xs text-gray-400 mb-1">
                      {msg.username}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-md ${
                      isMine
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-800 text-gray-100 rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {isMine && (
                  <img
                    src={
                      user?.user_metadata?.avatar_url ||
                      anonAvatar ||
                      randomAvatars[
                        Math.floor(Math.random() * randomAvatars.length)
                      ]
                    }
                    alt={user?.user_metadata?.full_name || anonName || "You"}
                    className="rounded-full w-9 h-9 object-cover"
                    onError={handleImageError}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </main>

      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 p-3 border-t border-gray-800 bg-[#121214]"
      >
        <input
          type="text"
          placeholder={
            canChat ? "Type a message..." : "Sign in or sign in as a guest to continue..."
          }
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!canChat}
          className={`flex-1 text-sm rounded-xl px-4 py-3 border transition-all ${
            canChat
              ? "bg-gray-900 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        />
        <button
          type="submit"
          disabled={!canChat}
          className={`p-3 rounded-xl flex items-center justify-center transition-colors ${
            canChat
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {showModal && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-[#18181b] rounded-2xl p-6 w-80 text-center border border-gray-700 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Sign in as a Guest</h2>
            <input
              type="text"
              placeholder="Enter your name..."
              value={anonName}
              onChange={(e) => setAnonName(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 mb-3 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="flex justify-center gap-3 mb-4">
              {randomAvatars.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="avatar"
                  width={40}
                  height={40}
                  onClick={() => setAnonAvatar(src)}
                  className={`rounded-full w-10 h-10 cursor-pointer border-2 ${
                    anonAvatar === src
                      ? "border-blue-500 scale-110"
                      : "border-transparent"
                  } transition-transform`}
                  onError={handleImageError}
                />
              ))}
            </div>
            <button
              onClick={handleAnonConfirm}
              disabled={!anonName.trim()}
              className={`w-full rounded-lg py-2 font-medium transition-colors ${
                anonName.trim()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              Start Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
