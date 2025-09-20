import { useState, useRef, useEffect } from "react";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AichixiaChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hai 👋 Aku **Aichixia**, asisten AI kamu untuk anime, manga, manhwa, dan light novel. Apa yang mau kamu tanyakan?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/aichixia?action=chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const aiMessage: Message = { role: "assistant", content: data.reply || "⚠️ Gagal mendapatkan jawaban." };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Terjadi kesalahan saat memproses pesanmu." }]);
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
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <div className="w-full max-w-3xl flex flex-col h-screen">
        {/* Header */}
        <header className="p-4 border-b border-sky-200 bg-white shadow-md flex items-center gap-3">
          <FaRobot className="text-sky-500 text-2xl" />
          <h1 className="text-xl font-bold text-sky-600">Aichixia Assistant</h1>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-9 h-9 flex items-center justify-center bg-sky-500 text-white rounded-full shadow">
                  <FaRobot />
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm leading-relaxed shadow-md ${
                  msg.role === "user"
                    ? "bg-sky-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-sky-100 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-9 h-9 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full shadow">
                  <FaUser />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <footer className="p-4 border-t border-sky-200 bg-white flex items-center gap-3">
          <input
            type="text"
            placeholder="Tanya apapun tentang anime, manga, manhwa, atau LN..."
            className="flex-1 p-3 border border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="p-3 bg-sky-500 text-white rounded-xl shadow hover:bg-sky-600 transition disabled:opacity-50"
          >
            <FaPaperPlane />
          </button>
        </footer>
      </div>
    </main>
  );
}
