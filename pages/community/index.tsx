import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

interface Message {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export default function CommunityPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetchMessages();

    const channel = supabase
      .channel("community-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community" },
        async (payload) => {
          const newMsg = payload.new as Message;

          const { data: profile } = await supabase
            .from("auth.users")
            .select("user_metadata")
            .eq("id", newMsg.user_id)
            .single();

          if (profile) {
            newMsg.user = {
              full_name: profile.user_metadata?.full_name || "Anonymous",
              avatar_url:
                profile.user_metadata?.avatar_url || "/default.png",
            };
          }

          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    const { data } = await supabase
      .from("community")
      .select("id, message, created_at, user_id")
      .order("created_at", { ascending: true });

    if (!data) return;

    const usersData: Record<string, any> = {};
    for (const msg of data) {
      if (!usersData[msg.user_id]) {
        const { data: profile } = await supabase
          .from("auth.users")
          .select("user_metadata")
          .eq("id", msg.user_id)
          .single();
        usersData[msg.user_id] = profile?.user_metadata || {};
      }
    }

    const enriched = data.map((msg) => ({
      ...msg,
      user: {
        full_name: usersData[msg.user_id]?.full_name || "Anonymous",
        avatar_url: usersData[msg.user_id]?.avatar_url || "/default.png",
      },
    }));

    setMessages(enriched);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    await supabase.from("community").insert({
      user_id: user.id,
      message: newMessage.trim(),
    });

    setNewMessage("");
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f11] text-white overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#121214] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Aichiow Logo" width={36} height={36} />
          <h1 className="text-xl font-bold tracking-wide">
            Aichiow Community
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((msg) => {
            const isMine = msg.user_id === user?.id;
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
                  <Image
                    src={msg.user?.avatar_url || "/default.png"}
                    alt={msg.user?.full_name || "User"}
                    width={36}
                    height={36}
                    className="rounded-full w-9 h-9 object-cover"
                  />
                )}
                <div
                  className={`max-w-[75%] text-sm flex flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  {!isMine && (
                    <span className="text-xs text-gray-400 mb-1">
                      {msg.user?.full_name || "Anonymous"}
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
                  <Image
                    src={
                      user?.user_metadata?.avatar_url || "/default.png"
                    }
                    alt={user?.user_metadata?.full_name || "You"}
                    width={36}
                    height={36}
                    className="rounded-full w-9 h-9 object-cover"
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
          placeholder="Ketik pesan..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors p-3 rounded-xl flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
