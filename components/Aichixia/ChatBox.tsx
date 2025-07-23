"use client";

import React, { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "bot", text: "⚠️ Gagal memuat jawaban." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto bg-gray-900 rounded-xl shadow-lg p-4">
      <div className="flex-1 overflow-y-auto h-64 mb-4 bg-gray-800 p-3 rounded-lg">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-lg ${
              msg.from === "user" ? "bg-blue-600 text-white ml-auto max-w-[80%]" : "bg-gray-700 text-white mr-auto max-w-[80%]"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm">AichixiA mengetik...</div>}
      </div>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white outline-none"
          placeholder="Ketik pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
