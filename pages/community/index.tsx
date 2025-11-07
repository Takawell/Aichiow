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

function Avatar(props: { src: string; alt?: string; size?: number; onError?: (e: any) => void }) {
  const { src, alt = "avatar", size = 44, onError } = props;
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-br from-sky-600/30 to-black/30 ring-1 ring-white/6"
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" onError={onError} />
    </div>
  );
}

function TimeLabel({ time }: { time: string }) {
  return <div className="text-[11px] text-gray-400 mt-2">{new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>;
}

function MessageBubble({
  msg,
  isMine,
  safeAvatar,
  userAvatar,
  onImgError,
}: {
  msg: Message;
  isMine: boolean;
  safeAvatar: string;
  userAvatar: string;
  onImgError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className={`flex gap-3 w-full ${isMine ? "justify-end" : "justify-start"}`}
    >
      {!isMine && (
        <div className="flex items-start">
          <Avatar src={safeAvatar} alt={msg.username} size={44} onError={onImgError} />
        </div>
      )}

      <div className={`max-w-[78%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
        {!isMine && <div className="text-xs text-sky-200/70 mb-1 font-medium">{msg.username}</div>}
        <div
          className={`px-5 py-3 rounded-[18px] break-words whitespace-pre-wrap text-sm leading-relaxed shadow-xl ${isMine ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-br-2xl rounded-tr-2xl rounded-tl-xl transform-gpu" : "bg-[#0b0b0d] text-gray-100 border border-gray-800"}`}
          dangerouslySetInnerHTML={{
            __html: msg.message
              .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
              .replace(/\[(.*?)\]\((.*?)\)/g, `<a href='$2' class='underline text-sky-300' target='_blank' rel='noreferrer'>$1</a>`),
          }}
        />
        <TimeLabel time={msg.created_at} />
      </div>

      {isMine && (
        <div className="flex items-start">
          <Avatar src={userAvatar} alt={"you"} size={44} onError={onImgError} />
        </div>
      )}
    </motion.div>
  );
}

export default function CommunityPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [anonName, setAnonName] = useState("");
  const [anonAvatar, setAnonAvatar] = useState("/default.png");
  const [cooldown, setCooldown] = useState(false);
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
    if (cooldown) return;
    if (!newMessage.trim()) return;
    if (!user && !anonName) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), 10000);

    const name =
      user?.user_metadata?.full_name ||
      anonName ||
      `Guest-${Math.floor(Math.random() * 1000)}`;

    const avatar =
      user?.user_metadata?.avatar_url ||
      anonAvatar ||
      randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

    const messageContent = newMessage.trim();

    await supabase.from("community_messages").insert({
      user_id: user ? user.id : null,
      username: name,
      avatar_url: avatar,
      message: messageContent,
    });

    if (
      messageContent.toLowerCase().startsWith("@aichixia") ||
      messageContent.toLowerCase().startsWith("/aichixia")
    ) {
      await handleAichixiaResponse(messageContent);
    }

    setNewMessage("");
  }

  async function handleAichixiaResponse(prompt: string) {
    try {
      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt.replace(/^(@|\/)aichixia/i, "").trim(),
          history: messages.map((m) => ({
            role: m.user_id ? "user" : "assistant",
            content: m.message,
          })),
        }),
      });

      const data = await res.json();

      let aiReply = "⚠️ Aichixia didn’t respond properly.";

      if (data.data && Array.isArray(data.data)) {
        aiReply = data.data
          .map(
            (item: any, i: number) =>
              `**${i + 1}.** [${item.title || "Untitled"}](${item.url || "#"})`
          )
          .join("\n");
      } else if (data.reply) {
        aiReply = data.reply;
      }

      await supabase.from("community_messages").insert({
        user_id: null,
        username: "Aichixia",
        avatar_url: "/aichixia.png",
        message: aiReply,
      });
    } catch (error) {
      await supabase.from("community_messages").insert({
        user_id: null,
        username: "Aichixia",
        avatar_url: "/aichixia.png",
        message: "❌ Error while connecting to Aichixia.",
      });
    }
  }

  function handleAnonConfirm() {
    if (anonName.trim()) setShowModal(false);
  }

  function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.src = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
  }

  const canChat = !!user || !!anonName;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-[#030615] to-[#071022] text-white antialiased">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-black/30 border-b border-sky-900/20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-sky-500 to-blue-700 p-1 shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src="/logo.png" alt="Aichiow Logo" width={34} height={34} />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">Community Beta</h1>
              <p className="text-xs text-sky-200/60">chat together • share • discover</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!user && (
              <button onClick={() => setShowModal(true)} className="px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:scale-[1.02] transition transform shadow-md text-sm">
                settings
              </button>
            )}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-gray-800 flex items-center justify-center text-xs text-gray-300">
              v
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden py-6">
        <div className="max-w-5xl mx-auto px-4 h-full grid rows-[1fr_auto]">
          <div className="h-full overflow-y-auto rounded-2xl p-4" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)" }}>
            <div className="grid gap-4">
              <AnimatePresence initial={false} mode="popLayout">
                {messages.map((msg) => {
                  const isMine = msg.user_id === user?.id;
                  const safeAvatar = msg.avatar_url || randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
                  const userAvatar =
                    user?.user_metadata?.avatar_url || anonAvatar || randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

                  return (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      isMine={isMine}
                      safeAvatar={safeAvatar}
                      userAvatar={userAvatar}
                      onImgError={handleImageError}
                    />
                  );
                })}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          </div>

          <form onSubmit={sendMessage} className="mt-4 rounded-2xl p-4 bg-gradient-to-t from-black/40 to-transparent border border-sky-900/20 backdrop-blur-md flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center shadow-inner hidden sm:flex">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </div>
            </div>

            <input
              type="text"
              placeholder={
                canChat
                  ? cooldown
                    ? "Please wait 10 seconds..."
                    : "Type a message... (try @aichixia or /aichixia)"
                  : "Sign in or guest to chat..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!canChat || cooldown}
              className={`flex-1 text-sm rounded-xl px-4 py-3 border transition-all outline-none ${canChat && !cooldown ? "bg-[#061025] border-sky-700 focus:ring-2 focus:ring-sky-400" : "bg-[#061025] border-gray-800 text-gray-500 cursor-not-allowed"}`}
            />
            <button
              type="submit"
              disabled={!canChat || cooldown}
              className={`p-3 rounded-xl flex items-center justify-center transition-transform ${canChat && !cooldown ? "bg-gradient-to-br from-sky-400 to-blue-600 hover:scale-105 shadow-lg" : "bg-gray-700 cursor-not-allowed"}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[94%] max-w-md p-6 rounded-2xl bg-gradient-to-br from-[#071022] to-[#04060b] border border-sky-900 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 text-center">Sign in as a Guest</h2>
            <input
              type="text"
              placeholder="Enter your name..."
              value={anonName}
              onChange={(e) => setAnonName(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#061025] border border-sky-800 mb-4 outline-none focus:ring-2 focus:ring-sky-400"
            />
            <div className="flex items-center justify-center gap-4 mb-4">
              {randomAvatars.map((src) => (
                <button key={src} onClick={() => setAnonAvatar(src)} className="rounded-full p-0.5" aria-label="select avatar">
                  <img src={src} alt="avatar" width={40} height={40} className={`w-10 h-10 rounded-full cursor-pointer ${anonAvatar === src ? "ring-2 ring-sky-400 scale-105" : ""}`} onError={handleImageError} />
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleAnonConfirm} disabled={!anonName.trim()} className={`w-full rounded-xl py-3 font-semibold ${anonName.trim() ? "bg-gradient-to-r from-sky-400 to-blue-600 hover:scale-[1.02]" : "bg-gray-700 cursor-not-allowed"}`}>
                Start Chat
              </button>
              <button onClick={() => { setShowModal(false); setAnonName(""); setAnonAvatar("/default.png"); }} className="w-full rounded-xl py-3 font-semibold bg-transparent border border-gray-800">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
