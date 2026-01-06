"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner, FaTimes, FaPlus, FaTrash, FaBars, FaChevronDown, FaCog } from "react-icons/fa";
import { SiOpenai, SiGooglegemini, SiAnthropic, SiMeta, SiAlibabacloud, SiDigikeyelectronics, SiFlux, SiXiaomi, SiMaze, SiMatternet } from "react-icons/si";
import { GiSpermWhale, GiPowerLightning, GiBlackHoleBolas, GiClover, GiPaintBrush } from "react-icons/gi";
import { TbSquareLetterZ, TbLetterM } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabaseClient";

type Model = {
  id: string;
  name: string;
  icon: any;
  color: string;
  type: "text" | "image";
  endpoint: string;
};

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  model_used?: string;
  provider?: string;
  is_image?: boolean;
  created_at?: string;
  cachedImage?: string;
};

type Session = {
  id: string;
  title: string;
  model_type: string;
  created_at: string;
  updated_at: string;
};

const models: Model[] = [
  { id: "kimi", name: "Kimi K2", icon: SiDigikeyelectronics, color: "from-blue-500 to-black-500", type: "text", endpoint: "kimi" },
  { id: "glm", name: "GLM 4.6", icon: TbSquareLetterZ, color: "from-[#1835D4] to-[#010B24]", type: "text", endpoint: "glm" },
  { id: "mistral", name: "Mistral 3.1", icon: TbLetterM, color: "from-[#FF4F00] to-[#FF9000]", type: "text", endpoint: "mistral" },
  { id: "gpt4mini", name: "GPT-4 Mini", icon: SiOpenai, color: "from-green-500 to-emerald-500", type: "text", endpoint: "openai" },
  { id: "qwen3", name: "Qwen3 235B", icon: SiMatternet, color: "from-purple-500 to-pink-500", type: "text", endpoint: "qwen3" },
  { id: "minimax", name: "MiniMax M2.1", icon: SiMaze, color: "from-cyan-500 to-blue-500", type: "text", endpoint: "minimax" },
  { id: "llama", name: "Llama 3.3 70B", icon: SiMeta, color: "from-orange-500 to-red-500", type: "text", endpoint: "llama" },
  { id: "gptoss", name: "GPT-OSS 120B", icon: SiOpenai, color: "from-pink-500 to-rose-500", type: "text", endpoint: "gptoss" },
  { id: "gemini", name: "Gemini 3 Flash", icon: SiGooglegemini, color: "from-indigo-500 to-purple-500", type: "text", endpoint: "gemini" },
  { id: "mimo", name: "MiMo V2 Flash", icon: SiXiaomi, color: "from-blue-500 to-purple-500", type: "text", endpoint: "mimo" },
  { id: "deepseek-v", name: "DeepSeek V3.1", icon: GiSpermWhale, color: "from-cyan-500 to-blue-500", type: "text", endpoint: "deepseek-v" },
  { id: "deepseek", name: "DeepSeek V3.2", icon: GiSpermWhale, color: "from-cyan-500 to-blue-500", type: "text", endpoint: "deepseek" },
  { id: "compound", name: "Groq Compound", icon: GiPowerLightning, color: "from-orange-500 to-blue-500", type: "text", endpoint: "compound" },
  { id: "claude", name: "Claude Haiku 4.5", icon: SiAnthropic, color: "from-orange-500 to-purple-500", type: "text", endpoint: "claude" },
  { id: "qwen", name: "Qwen3 Coder 480B", icon: SiAlibabacloud, color: "from-purple-500 to-pink-500", type: "text", endpoint: "qwen" },
  { id: "cohere", name: "Cohere Command A", icon: GiClover, color: "from-emerald-500 to-purple-500", type: "text", endpoint: "cohere" },
  { id: "flux", name: "Flux 2", icon: SiFlux, color: "from-purple-500 to-pink-500", type: "image", endpoint: "flux" },
  { id: "phoenix", name: "Phoenix 1.0", icon: GiPowerLightning, color: "from-orange-500 to-yellow-500", type: "image", endpoint: "phoenix" },
  { id: "lucid", name: "Lucid Origin", icon: GiPaintBrush, color: "from-teal-500 to-cyan-500", type: "image", endpoint: "lucid" },
];

export default function PlaygroundPage() {
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [steps, setSteps] = useState(4);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        if (data.session) {
          await loadSessions(data.session.user.id);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      } finally {
        setSessionLoading(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSessions = async (userId: string) => {
    try {
      const res = await fetch(`/api/playground?action=list_sessions&user_id=${userId}`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/playground?action=list_messages&session_id=${sessionId}`);
      const data = await res.json();
      const msgs = data.messages || [];
      
      const msgsWithImages = msgs.map((msg: Message) => {
        if (msg.is_image && msg.id) {
          const cachedImage = localStorage.getItem(`img_${msg.id}`);
          return { ...msg, cachedImage: cachedImage || undefined };
        }
        return msg;
      });
      
      setMessages(msgsWithImages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const createSession = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_session",
          user_id: session.user.id,
          model_type: selectedModel.type,
        }),
      });
      const data = await res.json();
      setCurrentSession(data.session);
      setMessages([]);
      loadSessions(session.user.id);
      setShowSidebar(false);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm("Delete this chat?")) return;
    try {
      await fetch("/api/playground", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
      loadSessions(session.user.id);
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const selectSession = (sess: Session) => {
    setCurrentSession(sess);
    loadMessages(sess.id);
    setShowSidebar(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !currentSession) return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_message",
          session_id: currentSession.id,
          role: "user",
          content: userMsg.content,
          is_image: false,
        }),
      });

      const history = messages
        .filter(m => !m.is_image)
        .map(m => ({ role: m.role, content: m.content }));

      const chatRes = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          model: selectedModel.endpoint,
          message: selectedModel.type === "text" ? userMsg.content : undefined,
          prompt: selectedModel.type === "image" ? userMsg.content : undefined,
          history: selectedModel.type === "text" ? history : undefined,
          steps: selectedModel.type === "image" ? steps : undefined,
        }),
      });
      const chatData = await chatRes.json();

      if (!chatRes.ok) {
        throw new Error(chatData.error || "Failed to get response");
      }

      const aiMsg: Message = {
        role: "assistant",
        content: selectedModel.type === "image" ? userMsg.content : chatData.reply,
        model_used: selectedModel.id,
        provider: chatData.provider,
        is_image: selectedModel.type === "image",
      };

      const aiMsgRes = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_message",
          session_id: currentSession.id,
          role: "assistant",
          content: aiMsg.content,
          model_used: aiMsg.model_used,
          provider: aiMsg.provider,
          is_image: aiMsg.is_image,
        }),
      });
      const aiMsgData = await aiMsgRes.json();

      if (selectedModel.type === "image" && chatData.imageBase64) {
        localStorage.setItem(`img_${aiMsgData.message.id}`, chatData.imageBase64);
        aiMsg.id = aiMsgData.message.id;
        aiMsg.cachedImage = chatData.imageBase64;
      }

      setMessages((prev) => [...prev, aiMsg]);

      if (messages.length === 0) {
        const title = userMsg.content.slice(0, 50) + (userMsg.content.length > 50 ? "..." : "");
        await fetch("/api/playground", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_title",
            session_id: currentSession.id,
            title,
          }),
        });
        loadSessions(session.user.id);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Error: " + error.message,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getUserName = () => {
    if (!session) return "Senpai";
    const userMetadata = session.user.user_metadata || {};
    return userMetadata.full_name || userMetadata.name || "Senpai";
  };

  const ModelIcon = selectedModel.icon;

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
          >
            <FaSpinner className="text-3xl text-white animate-spin" />
          </motion.div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center px-4">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src="/aichixia.png"
            alt="Aichixia"
            className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500 shadow-2xl mb-6"
          />
          <h2 className="text-2xl font-bold text-blue-100 mb-4">Aichixia Playground</h2>
          <p className="text-slate-400 mb-8 max-w-md">Please login to access the playground and test multiple AI models.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed lg:relative inset-y-0 left-0 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 z-50 flex flex-col"
            >
              <div className="p-4 border-b border-slate-800">
                <button
                  onClick={createSession}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  <FaPlus />
                  New Chat
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {sessions.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <p className="text-sm text-slate-500">No chats yet</p>
                    <p className="text-xs text-slate-600 mt-1">Create a new chat to start</p>
                  </div>
                ) : (
                  sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        currentSession?.id === sess.id
                          ? "bg-blue-500/20 border border-blue-500/30"
                          : "hover:bg-slate-800/50"
                      }`}
                    >
                      <div
                        onClick={() => selectSession(sess)}
                        className="flex-1 min-w-0"
                      >
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {sess.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(sess.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteSession(sess.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all"
                      >
                        <FaTrash className="text-xs text-red-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <FaBars className="text-lg" />
            </button>

            <div className="flex items-center gap-2">
              <img
                src="/aichixia.png"
                alt="Aichixia"
                className="w-8 h-8 rounded-full border-2 border-blue-500"
              />
              <div>
                <h1 className="text-sm font-bold text-slate-200">Aichixia Playground</h1>
                <p className="text-xs text-slate-500">Multi-Model Testing</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
              >
                <ModelIcon className="text-base" />
                <span className="text-sm font-medium hidden sm:inline">{selectedModel.name}</span>
                <FaChevronDown className="text-xs" />
              </button>

              {showModelMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowModelMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto bg-slate-900 rounded-xl border border-slate-800 shadow-2xl z-40">
                    <div className="p-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-slate-400 px-2">TEXT MODELS</p>
                    </div>
                    {models.filter(m => m.type === "text").map((model) => {
                      const Icon = model.icon;
                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model);
                            setShowModelMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 transition-all ${
                            selectedModel.id === model.id ? "bg-blue-500/10" : ""
                          }`}
                        >
                          <Icon className="text-lg" />
                          <span className="text-sm font-medium">{model.name}</span>
                        </button>
                      );
                    })}
                    <div className="p-2 border-b border-slate-800 mt-2">
                      <p className="text-xs font-semibold text-slate-400 px-2">IMAGE MODELS</p>
                    </div>
                    {models.filter(m => m.type === "image").map((model) => {
                      const Icon = model.icon;
                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model);
                            setShowModelMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 transition-all ${
                            selectedModel.id === model.id ? "bg-blue-500/10" : ""
                          }`}
                        >
                          <Icon className="text-lg" />
                          <span className="text-sm font-medium">{model.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {selectedModel.type === "image" && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <FaCog className="text-lg" />
              </button>
            )}
          </div>
        </header>

        {showSettings && selectedModel.type === "image" && (
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <label className="text-sm font-medium text-slate-300">Steps:</label>
              <input
                type="range"
                min="1"
                max="50"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-semibold text-blue-400 w-8">{steps}</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src="/aichixia.png"
                  alt="Aichixia"
                  className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-2xl mb-6"
                />
                <h2 className="text-2xl font-bold text-blue-100 mb-3">
                  Konnichiwa! {getUserName()}! 👋
                </h2>
                <p className="text-sm text-slate-400 max-w-md mb-6">
                  Welcome to Aichixia Playground! Test multiple AI models in one place. Select a model and start chatting!
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-slate-800 text-slate-200 border border-slate-700"
                  }`}
                >
                  {msg.is_image ? (
                    msg.cachedImage ? (
                      <img
                        src={`data:image/jpeg;base64,${msg.cachedImage}`}
                        alt="Generated"
                        className="rounded-lg max-w-full h-auto"
                      />
                    ) : (
                      <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400 mb-2">🖼️ Image generated with {msg.model_used}</p>
                        <p className="text-xs text-slate-500">Prompt: {msg.content}</p>
                      </div>
                    )
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-invert prose-sm max-w-none"
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                  {msg.role === "assistant" && msg.provider && !msg.is_image && (
                    <div className="mt-2 pt-2 border-t border-slate-700/50">
                      <span className="text-xs text-slate-500">{msg.provider}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 px-4 py-3 rounded-2xl border border-slate-700 flex items-center gap-2">
                  <FaSpinner className="animate-spin text-blue-400" />
                  <span className="text-sm text-slate-400">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <footer className="p-4 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            {!currentSession ? (
              <button
                onClick={createSession}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
              >
                <FaPlus />
                Create New Chat to Start
              </button>
            ) : (
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={selectedModel.type === "image" ? "Describe the image..." : "Type your message..."}
                  disabled={loading}
                  rows={1}
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl resize-none outline-none focus:border-blue-500 transition-all text-sm max-h-32"
                  style={{ minHeight: "48px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "48px";
                    target.style.height = Math.min(target.scrollHeight, 128) + "px";
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
                  style={{ minHeight: "48px" }}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
