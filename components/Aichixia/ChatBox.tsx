import React, { useState } from "react";
import Image from "next/image";
import styles from "./Aichixia.css";

type Message = {
  from: "user" | "bot";
  text: string;
};

const quickReplies = [
  "Anime trending?",
  "Manhwa populer?",
  "Top seasonal anime?",
  "Anime genre fantasy",
  "Rekomendasi manhwa action"
];

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hai! Aku AichixiA ✨. Ada yang bisa kubantu hari ini?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { from: "bot", text: "⚠️ AichixiA error." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    setTimeout(sendMessage, 150);
  };

  return (
    <div className={styles.chatboxContainer}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <Image src="/avatar/aichixia.jpg" alt="AichixiA" width={40} height={40} className={styles.avatar} />
        <div>
          <div className={styles.chatName}>AichixiA</div>
          <div className={styles.chatStatus}>Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.chatMessages}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.chatBubble} ${msg.from === "user" ? styles.user : styles.bot}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className={`${styles.chatBubble} ${styles.bot} ${styles.typing}`}>
            <span></span><span></span><span></span>
          </div>
        )}
      </div>

      {/* Quick Replies */}
      <div className={styles.quickReplies}>
        {quickReplies.map((q, i) => (
          <button key={i} className={styles.quickReplyBtn} onClick={() => handleQuickReply(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Ketik pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Kirim</button>
      </div>
    </div>
  );
};

export default ChatBox;
