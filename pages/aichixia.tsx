"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaPaperPlane, FaSpinner, FaTimes, FaMicrophone, FaRegSmile } from "react-icons/fa";
import { LuScanLine } from "react-icons/lu";
import { FiCheck, FiMoreHorizontal } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";
import { searchAnimeByFile } from "@/lib/traceMoe";

type Role = "user" | "assistant";

interface AnimeData {
  id: number;
  title: string;
  coverImage: string;
  score: number;
  popularity: number;
  url: string;
}

interface Message {
  id?: string;
  role: Role;
  type?: "text" | "anime" | "scan" | "image";
  content: string | AnimeData[] | any[];
  time?: string;
  status?: "sent" | "delivered" | "read";
}

const initialAssistant = [{
  role: "assistant" as Role,
  type: "text",
  content: "Hi I'm **Aichixia**, your AI assistant for anime, manga, manhwa, and light novels. Tap Scan to identify anime from screenshots or chat like in WhatsApp.",
  time: new Date().toISOString(),
}];

const mockChats = [
  { id: "1", name: "Mika", last: "Cek rekomendasi anime", avatar: "/default.png", unread: 2 },
  { id: "2", name: "Otaku Group", last: "New chapter released!", avatar: "/default.png", unread: 0 },
  { id: "3", name: "Dev", last: "Production build ready", avatar: "/default.png", unread: 0 },
];

export default function AichixiaPage() {
  const [messages, setMessages] = useState<Message[]>(initialAssistant);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(mockChats[0].id);
  const [contacts] = useState(mockChats);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    check();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (opts?: { isVoice?: boolean }) => {
    if (!input.trim() && !pendingImage && !opts?.isVoice) return;
    let newMessages = [...messages];
    if (input.trim()) newMessages.push({ role: "user", type: "text", content: input, time: new Date().toISOString(), status: "sent" });
    if (pendingImage) {
      newMessages.push({ role: "user", type: "image", content: pendingImage, time: new Date().toISOString(), status: "sent" });
      newMessages.push({ role: "user", type: "text", content: "Detecting for this image...", time: new Date().toISOString(), status: "sent" });
    }
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      if (pendingImage) {
        const res = await fetch(pendingImage);
        const blob = await res.blob();
        const file = new File([blob], "upload.jpg", { type: "image/jpeg" });
        const scanRes = await searchAnimeByFile(file);
        setMessages((prev) => [...prev, { role: "assistant", type: "scan", content: scanRes, time: new Date().toISOString(), status: "delivered" }]);
      } else {
        const res = await fetch("/api/aichixia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input, history: messages.map((m) => ({ role: m.role, content: typeof m.content === "string" ? m.content : JSON.stringify(m.content) })) }),
        });
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) setMessages((prev) => [...prev, { role: "assistant", type: "anime", content: data.data, time: new Date().toISOString(), status: "delivered" }]);
        else setMessages((prev) => [...prev, { role: "assistant", type: "text", content: data.reply || "⚠️ No valid response.", time: new Date().toISOString(), status: "delivered" }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", type: "text", content: "❌ Error while connecting to Aichixia.", time: new Date().toISOString(), status: "delivered" }]);
    } finally {
      setLoading(false);
      setPendingImage(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <Head>
        <title>Aichixia | Chat</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#030417] via-[#07122a] to-[#020613] text-sky-100 flex items-stretch">
        <div className="w-full max-w-6xl mx-auto flex gap-4 p-4">

          <aside className="hidden md:flex md:flex-col w-96 bg-[#07122a]/60 backdrop-blur-md rounded-2xl p-4 border border-sky-800/40 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-sky-500">
                <Image src="/aichixia.png" alt="logo" fill className="object-cover" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">Aichixia</h2>
                <p className="text-xs text-sky-300/80">AI assistant • Chat & Scan</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input placeholder="Cari chat atau kontak" className="flex-1 px-3 py-2 rounded-lg bg-[#041022]/50 border border-sky-800/30 text-sm placeholder-sky-400 focus:outline-none" />
              <button className="p-2 rounded-lg bg-sky-700/60"><FiMoreHorizontal /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {contacts.map((c) => (
                <button key={c.id} onClick={() => setActiveChat(c.id)} className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#08203a]/30 transition ${activeChat === c.id ? "bg-[#08203a]/40 ring-1 ring-sky-600/30" : ""}`}>
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src={c.avatar} alt={c.name} fill className="object-cover" />
                    {c.unread > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs px-1.5 rounded-full">{c.unread}</span>}
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-sm text-sky-100">{c.name}</h3>
                      <span className="text-xs text-sky-400">Now</span>
                    </div>
                    <p className="text-xs text-sky-300 truncate">{c.last}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => setScanOpen(true)} className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 text-white">Scan</button>
              <Link href="/profile" className="px-3 py-2 rounded-lg bg-[#07122a]/50 border border-sky-800/30">Me</Link>
            </div>
          </aside>

          <section className="flex-1 flex flex-col bg-[#061026]/50 backdrop-blur rounded-2xl border border-sky-800/40 shadow-2xl overflow-hidden">

            <header className="flex items-center justify-between px-4 py-3 border-b border-sky-800/30">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-sky-600">
                  <Image src="/default.png" alt="chat" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{contacts.find((c) => c.id === activeChat)?.name || "Aichixia"}</h3>
                  <p className="text-xs text-sky-400">Terakhir aktif sekarang</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setScanOpen(true)} className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 shadow-md"><LuScanLine /></button>
                <button className="p-2 rounded-full bg-[#07122a]/50 border border-sky-800/30"><FiMoreHorizontal /></button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-sky-700/50">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : "text-left"}`}>

                    {msg.type === "text" && (
                      <div className={`inline-block px-4 py-3 rounded-2xl shadow-md ${msg.role === "user" ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white" : "bg-[#07162b]/70 border border-sky-800/30 text-sky-200"}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content as string}</ReactMarkdown>
                        <div className="mt-1 text-[10px] text-sky-300 flex items-center justify-end gap-2">
                          <span>{formatTime(msg.time)}</span>
                          {msg.role === "user" && (msg.status === "read" ? <FiCheck /> : <FiCheck />)}
                        </div>
                      </div>
                    )}

                    {msg.type === "image" && typeof msg.content === "string" && (
                      <div className="rounded-xl overflow-hidden shadow-lg border border-sky-800/30 w-48 h-48 relative">
                        <Image src={msg.content} alt="img" fill className="object-cover" />
                      </div>
                    )}

                    {msg.type === "scan" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(msg.content as any[]).map((r, idx) => (
                          <div key={idx} className="bg-[#081428]/80 border border-sky-800/30 rounded-xl overflow-hidden shadow-lg">
                            <video src={r.video} controls muted className="w-full aspect-video object-cover" />
                            <div className="p-3">
                              <h4 className="font-semibold text-sm line-clamp-2">{r.title?.romaji || r.title?.english || "Unknown"}</h4>
                              <p className="text-xs text-sky-400 mt-1">Episode {r.episode || "?"} · {(r.similarity * 100).toFixed(1)}%</p>
                              {r.anilist && <Link href={`/anime/${r.anilist}`} className="mt-2 inline-block text-xs text-sky-300 underline">View</Link>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.type === "anime" && Array.isArray(msg.content) && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(msg.content as AnimeData[]).map((a) => (
                          <Link key={a.id} href={a.url} className="rounded-xl overflow-hidden bg-[#091428]/70 border border-sky-800/30 p-2 flex flex-col gap-2 hover:scale-[1.01] transition">
                            <div className="relative w-full h-36 rounded-lg overflow-hidden">
                              <Image src={a.coverImage} alt={a.title} fill className="object-cover" />
                            </div>
                            <div className="text-sm font-semibold line-clamp-2">{a.title}</div>
                            <div className="text-xs text-sky-400">⭐ {a.score} • 🔥 {a.popularity}</div>
                          </Link>
                        ))}
                      </div>
                    )}

                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-sky-300 text-sm"><FaSpinner className="animate-spin" /> <span>Aichixia is thinking...</span></div>
              )}

              <div ref={messagesEndRef} />
            </main>

            <footer className="px-4 py-3 border-t border-sky-800/30 bg-gradient-to-t from-[#041022]/20">
              {!session ? (
                <Link href="/auth/login" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-semibold">
                  <FaPaperPlane /> Login to chat
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => fileRef.current?.click()} className="p-2 rounded-lg bg-[#041022]/60 border border-sky-800/30"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 0 0 2 2h14" /></svg></button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                  <div className="flex-1 relative">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} rows={1} placeholder="Type a message" className="resize-none w-full px-4 py-2 rounded-full bg-[#041022]/60 border border-sky-800/30 focus:outline-none placeholder-sky-400" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2"><FaRegSmile /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    {input.trim() ? (
                      <button onClick={() => sendMessage()} className="p-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 shadow-lg"><FaPaperPlane /></button>
                    ) : (
                      <button onClick={() => sendMessage({ isVoice: true })} className="p-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg"><FaMicrophone /></button>
                    )}
                  </div>
                </div>
              )}
            </footer>

          </section>

        </div>

        <AnimatePresence>
          {scanOpen && (
            <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="bg-[#07122a]/95 rounded-3xl p-8 w-[92%] max-w-md text-center shadow-2xl border border-sky-800/50" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
                <h2 className="text-2xl font-bold text-sky-300 mb-2">Upload Screenshot</h2>
                <p className="text-sky-400 mb-6">Aichixia will detect which anime it's from</p>

                {!session ? (
                  <Link href="/auth/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl">Scan</Link>
                ) : (
                  <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-xl">
                    <LuScanLine /> Choose Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                  </label>
                )}

                {pendingImage && (
                  <div className="mt-6 flex justify-center">
                    <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-sky-800/30">
                      <Image src={pendingImage} alt="preview" fill className="object-cover" />
                      <button onClick={() => setPendingImage(null)} className="absolute top-2 right-2 bg-black/50 rounded-full p-1"><FaTimes /></button>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-center gap-3">
                  <button onClick={() => setScanOpen(false)} className="px-4 py-2 rounded-lg bg-[#081827]/60">Cancel</button>
                  {session && pendingImage && <button onClick={() => { setScanOpen(false); sendMessage(); }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 text-white">Scan</button>}
                </div>

                <button onClick={() => setScanOpen(false)} className="absolute top-4 right-4 text-sky-300"><FaTimes /></button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
