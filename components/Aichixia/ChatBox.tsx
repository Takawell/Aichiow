import { useState } from "react";
import Image from "next/image";

interface Message {
  from: "user" | "bot";
  text: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user" as const, text: input };
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
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ AichixiA error." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbox-container">
      {/* Header */}
      <div className="chat-header">
        <Image
          src="/avatar/aichixia.jpg"
          alt="AichixiA"
          width={40}
          height={40}
          className="avatar"
        />
        <div>
          <div className="chat-name">AichixiA</div>
          <div className="chat-status">Online</div>
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
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya sesuatu..."
        />
        <button onClick={sendMessage}>Kirim</button>
      </div>
    </div>
  );
}
