import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabaseClient";

interface AnimeData {
  id: number;
  title: string;
  coverImage: string;
  score: number;
  popularity: number;
  url: string;
}

interface Message {
  role: "user" | "assistant";
  type?: "text" | "anime";
  content: string | AnimeData[];
}

export default function AichixiaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      type: "text",
      content:
        "Hi I'm **Aichixia**, your AI assistant for anime, manga, manhwa, manhua, and light novels. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", type: "text", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((m) => ({
            role: m.role,
            content:
              typeof m.content === "string"
                ? m.content
                : JSON.stringify(m.content),
          })),
        }),
      });

      const data = await res.json();

      if (data.data && Array.isArray(data.data)) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "anime", content: data.data },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: data.reply || "⚠️ No valid response.",
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: "❌ An error occurred while processing your request.",
        },
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
        <header className="p-4 border-b border-sky-800 bg-black/20 backdrop-blur-md rounded-b-xl shadow-md flex items-center gap-4 sticky top-4 z-20 mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full ring-2 ring-sky-500 overflow-hidden shadow-lg">
              <Image
                src="/aichixia.png"
                alt="Aichixia"
                fill
                style={{ objectFit: "cover" }}
              />
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

        <section
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex flex-col gap-2 ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 mb-1">
                  <div className="relative w-10 h-10 rounded-full ring-2 ring-sky-600 overflow-hidden shadow-lg">
                    <Image
                      src="/aichixia.png"
                      alt="bot"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}

              {msg.type === "text" && (
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[78%] sm:max-w-[72%] md:max-w-[60%] text-sm sm:text-base leading-relaxed shadow-md
                    ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-br-2xl rounded-tl-2xl"
                        : "bg-gradient-to-br from-[#081122]/80 to-[#0b1724]/60 text-sky-100 border border-sky-700/40 backdrop-blur-sm"
                    }
                  `}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ src, alt }) => {
                        if (src?.startsWith("https://s4.anilist.co/")) {
                          const animeId = alt?.match(/^\d+$/) ? alt : null;
                          return animeId ? (
                            <Link href={`/anime/${animeId}`}>
                              <Image
                                src={src}
                                alt={alt || "anime"}
                                width={400}
                                height={300}
                                className="rounded-lg my-2 cursor-pointer hover:opacity-90 transition"
                              />
                            </Link>
                          ) : (
                            <Image
                              src={src}
                              alt={alt || "image"}
                              width={400}
                              height={300}
                              className="rounded-lg my-2"
                            />
                          );
                        }
                        return (
                          <Image
                            src={src || "/default.png"}
                            alt={alt || "image"}
                            width={400}
                            height={300}
                            className="rounded-lg my-2"
                          />
                        );
                      },
                      a: ({ href, children }) => {
                        if (href?.startsWith("https://anilist.co/anime/")) {
                          const idMatch = href.match(/anime\/(\d+)/);
                          const animeId = idMatch ? idMatch[1] : null;
                          return animeId ? (
                            <Link href={`/anime/${animeId}`}>
                              <span className="text-sky-400 underline hover:text-sky-300 cursor-pointer">
                                {children}
                              </span>
                            </Link>
                          ) : (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-400 underline hover:text-sky-300"
                            >
                              {children}
                            </a>
                          );
                        }
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-400 underline hover:text-sky-300"
                          >
                            {children}
                          </a>
                        );
                      },
                    }}
                  >
                    {msg.content as string}
                  </ReactMarkdown>
                </div>
              )}

              {msg.type === "anime" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                  {(msg.content as AnimeData[]).map((anime) => (
                    <Link
                      key={anime.id}
                      href={`/anime/${anime.id}`}
                      className="bg-[#0b1724]/70 border border-sky-700/40 rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] hover:ring-2 hover:ring-sky-500 transition"
                    >
                      <Image
                        src={anime.coverImage}
                        alt={anime.title}
                        width={400}
                        height={600}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="font-bold text-sky-200 text-sm line-clamp-2">
                          {anime.title}
                        </h3>
                        <p className="text-xs text-sky-400 mt-1">
                          ⭐ {anime.score} | 👥 {anime.popularity}
                        </p>
                        <span className="text-xs text-sky-300 underline mt-2 block">
                          See more
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {msg.role === "user" && (
                <div className="flex-shrink-0 mt-1">
                  <div className="relative w-10 h-10 rounded-full ring-2 ring-sky-500 overflow-hidden shadow">
                    <Image
                      src="/default.png"
                      alt="user"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sky-300">
              <FaSpinner className="animate-spin" />{" "}
              <span>Aichixia is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        <footer className="p-4 bg-gradient-to-t from-[#071026]/60 via-transparent backdrop-blur-sm sticky bottom-4 mx-4 sm:mx-6 lg:mx-8 rounded-xl">
          {session ? (
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
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 hover:shadow-lg hover:ring-2 hover:ring-sky-400 active:scale-95 transition font-semibold text-white disabled:opacity-60"
                title="Send"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane />
                )}
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(56,189,248,0.7)" }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      y: [0, -5, 0],
                      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } 
                    }}
                    className="relative inline-flex items-center justify-center px-8 py-3 rounded-full 
                               bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600
                               text-white font-bold shadow-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🚀 Sign in to use Aichixia
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-sky-400/40 to-blue-400/40 blur-xl animate-pulse"></span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          )}
        </footer>
      </div>
    </main>
  );
}
