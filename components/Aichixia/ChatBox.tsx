"use client";
import { useState, useEffect, useRef } from "react";
import QuickReplies from "./QuickReplies";
import Image from "next/image";

type Message = {
  from: "user" | "bot";
  text: string;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hai! Aku AichixiA ✨. Ada yang bisa kubantu hari ini?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: Message = { from: "user", text: input };
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
      const botMessage: Message = { from: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ AichixiA error, coba lagi nanti ya." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleQuickReply = (text: string) => {
    setInput(text);
    setTimeout(sendMessage, 100);
  };

  return (
    <div className="chatbox-container">
      {/* Header */}
      <div className="chat-header">
        <Image src="/avatar/aichixia.png" alt="AichixiA Avatar" width={40} height={40} className="avatar" />
        <div>
          <h2 className="chat-name">AichixiA</h2>
          <span className="chat-status">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble bot typing">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <QuickReplies onReply={handleQuickReply} />

      {/* Input */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Kirim</button>
      </div>
    </div>
  );
}
