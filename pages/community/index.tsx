import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

export default function CommunityPage() {
  const [messages, setMessages] = useState<any[]>([]);
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
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
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
    setMessages(data || []);
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

      <main className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex mb-3 ${
                msg.user_id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                  msg.user_id === user?.id
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-100 rounded-bl-none"
                }`}
              >
                <p>{msg.message}</p>
                <span className="block text-[10px] text-gray-400 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
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
