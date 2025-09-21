import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AichixiaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi 🌸 I'm **Aichixia**, your AI assistant for anime, manga, manhwa, manhua, and light novels. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      const reply =
        typeof data.reply === "string"
          ? data.reply
          : "⚠️ No valid response from server.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ An error occurred while processing your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#071029] via-[#0f172a] to-[#071026] text-sky-100">
      <div className="w-full max-w-5xl flex flex-col h-screen mx-4 sm:mx-6 lg:mx-8">
        {/* Header */}
        <header className="p-4 border-b border-sky-800 bg-black/20 backdrop-blur-md rounded-b-xl shadow-md flex items-center gap-4 sticky top-4 z-20 mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full ring-2 ring-sky-500 overflow-hidden shadow-lg">
              <Image src="/aichixia.png" alt="Aichixia" fill style={{ objectFit: "cover" }} />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-blue-500">
                Aichixia Assistant
              </h1>
              <p className="text-xs sm:text-sm text-sky-300/80 mt-0.5">
                Your AI guide for anime, manga, manhwa & light novels
              </p>
            </div>
          </div>
        </header>

        {/* Chat area */}
        <section className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4" style={{ WebkitOverflowScrolling: "touch" }}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="relative w-10 h-10 rounded-full ring-2 ring-sky-600 overflow-hidden shadow-lg">
                    <Image src="/aichixia.png" alt="bot" fill style={{ objectFit: "cover" }} />
                  </div>
                </div>
              )}

              <div
                className={`px-4 py-3 rounded-2xl max-w-[78%] sm:max-w-[72%] md:max-w-[60%] text-sm sm:text-base leading-relaxed shadow-md whitespace-pre-line
                  ${msg.role === "user"
                    ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-br-2xl rounded-tl-2xl"
                    : "bg-gradient-to-br from-[#081122]/80 to-[#0b1724]/60 text-sky-100 border border-sky-700/40 backdrop-blur-sm"}
                `}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="relative w-10 h-10 rounded-full ring-2 ring-sky-500 overflow-hidden shadow">
                    <Image src="/default.png" alt="user" fill style={{ objectFit: "cover" }} />
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sky-300">
              <FaSpinner className="animate-spin" /> <span>Aichixia is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        {/* Input */}
        <footer className="p-4 bg-gradient-to-t from-[#071026]/60 via-transparent backdrop-blur-sm sticky bottom-4 mx-4 sm:mx-6 lg:mx-8 rounded-xl">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 px-4 py-3 rounded-lg bg-[#041020]/70 border border-sky-700/40 placeholder-sky-300 text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 hover:scale-[1.02] active:scale-95 transition shadow-lg disabled:opacity-60"
              title="Send"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
