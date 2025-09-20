import { useState, useRef, useEffect } from "react";
import { FaUser, FaPaperPlane, FaSpinner } from "react-icons/fa";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AichixiaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hai 🌸 Aku **Aichixia**, asisten AI untuk anime, manga, manhwa, manhua, dan light novel.\n\nKamu bisa tanya apa saja, atau gunakan command seperti:\n- `/trending`\n- `/airing`\n- `/search Naruto`\n- `/top-genre action`",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah
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
      let endpoint = "/api/aichixia";
      let fetchOptions: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };

      if (input.startsWith("/")) {
        const parts = input.slice(1).split(" ");
        const command = parts[0].toLowerCase();
        const arg = parts.slice(1).join(" ");

        let url = new URL(endpoint, window.location.origin);

        if (command === "trending") {
          url.searchParams.set("action", "trending");
        } else if (command === "airing") {
          url.searchParams.set("action", "airing");
        } else if (command === "search" && arg) {
          url.searchParams.set("action", "search");
          url.searchParams.set("query", arg);
        } else if (command === "top-genre" && arg) {
          url.searchParams.set("action", "top-genre");
          url.searchParams.set("genre", arg);
        } else {
          url.searchParams.set("action", "chat");
          fetchOptions.body = JSON.stringify({ message: input });
        }

        endpoint = url.toString();
        fetchOptions.method = "GET"; // command selain chat = GET
        fetchOptions.body = undefined;
      } else {
        endpoint += "?action=chat";
        fetchOptions.body = JSON.stringify({ message: input });
      }

      const res = await fetch(endpoint, fetchOptions);
      const data = await res.json();

      // 🔹 Format reply
      let reply = data.reply;

      if (!reply && data.results) {
        reply = `✨ Hasil:\n${data.results
          .slice(0, 5)
          .map(
            (r: any, i: number) =>
              `${i + 1}. ${r.title?.romaji || r.title?.english || r.title}`
          )
          .join("\n")}`;
      }

      const aiMessage: Message = {
        role: "assistant",
        content: reply || "⚠️ Tidak ada jawaban dari server.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Terjadi kesalahan saat memproses pesan.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="w-full max-w-3xl flex flex-col h-screen">
        {/* Header */}
        <header className="p-4 border-b border-sky-700 bg-[#0f172a] shadow-md flex items-center gap-3">
          <Image
            src="/aichixia.png"
            alt="Aichixia"
            width={40}
            height={40}
            className="rounded-full border-2 border-sky-400"
          />
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
            Aichixia Assistant
          </h1>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <Image
                  src="/aichixia.png"
                  alt="Bot Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border border-sky-500 shadow"
                />
              )}
              <div
                className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm sm:text-base leading-relaxed shadow-md whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-br-none"
                    : "bg-slate-800 text-sky-100 border border-sky-700 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <Image
                  src="/default.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border border-sky-400 shadow"
                />
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sky-400 text-sm">
              <FaSpinner className="animate-spin" /> Aichixia mengetik...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <footer className="p-4 border-t border-sky-700 bg-[#0f172a] flex items-center gap-3">
          <input
            type="text"
            placeholder="Ketik pesan atau command seperti /trending, /search Naruto..."
            className="flex-1 p-3 bg-slate-900 text-sky-100 border border-sky-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="p-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl shadow hover:opacity-90 transition disabled:opacity-50"
          >
            <FaPaperPlane />
          </button>
        </footer>
      </div>
    </main>
  );
}
