import { useState, useRef, useEffect } from "react";
import {
  FaPaperPlane,
  FaTrash,
  FaUser,
  FaHome,
  FaCircle,
  FaChevronDown,
  FaAngry,
  FaSmile,
  FaBriefcase,
  FaHeart,
  FaBrain,
  FaRobot,
  FaCog,
} from "react-icons/fa";
import { SiOpenai } from "react-icons/si";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  provider?: string;
};

type Persona = "tsundere" | "friendly" | "professional" | "kawaii";
type ModelType = "auto" | "openai" | "gemini" | "qwen" | "gptoss" | "llama";

const personaConfig: Record<
  Persona,
  { name: string; description: string; color: string; icon: any }
> = {
  tsundere: {
    name: "Tsundere Mode",
    description: "B-baka! Classic tsundere personality",
    color: "from-pink-500 to-rose-500",
    icon: FaAngry,
  },
  friendly: {
    name: "Friendly Mode",
    description: "Warm and welcoming assistant",
    color: "from-green-500 to-emerald-500",
    icon: FaSmile,
  },
  professional: {
    name: "Professional Mode",
    description: "Formal and efficient helper",
    color: "from-blue-500 to-indigo-500",
    icon: FaBriefcase,
  },
  kawaii: {
    name: "Kawaii Mode",
    description: "Super cute and energetic!",
    color: "from-purple-500 to-pink-500",
    icon: FaHeart,
  },
};

const modelConfig: Record<
  ModelType,
  { name: string; description: string; color: string; icon: any }
> = {
  auto: {
    name: "Auto Select",
    description: "Smart model selection with fallback",
    color: "from-purple-500 to-pink-500",
    icon: FaBrain,
  },
  openai: {
    name: "OpenAI",
    description: "GPT-4 - Most capable & intelligent",
    color: "from-green-500 to-emerald-500",
    icon: SiOpenai,
  },
  gemini: {
    name: "Gemini",
    description: "Google's AI - Fast & efficient",
    color: "from-blue-500 to-indigo-500",
    icon: FaRobot,
  },
  qwen: {
    name: "Qwen",
    description: "Alibaba's model - Balanced",
    color: "from-purple-500 to-violet-500",
    icon: FaCog,
  },
  gptoss: {
    name: "GPT-OSS",
    description: "Open source - Reliable",
    color: "from-pink-500 to-rose-500",
    icon: FaRobot,
  },
  llama: {
    name: "Llama",
    description: "Meta's AI - Always available",
    color: "from-orange-500 to-red-500",
    icon: FaRobot,
  },
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [persona, setPersona] = useState<Persona>("tsundere");
  const [selectedModel, setSelectedModel] = useState<ModelType>("auto");
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  useEffect(() => {
    const savedMessages = localStorage.getItem("aichixia-chat-history");
    const savedModel = localStorage.getItem("aichixia-selected-model");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(
          parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        );
      } catch (e) {
        console.error("Failed to load chat history");
      }
    }
    if (savedModel && savedModel !== "auto") {
      setSelectedModel(savedModel as ModelType);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("aichixia-chat-history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("aichixia-selected-model", selectedModel);
  }, [selectedModel]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setTyping(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          persona: persona === "tsundere" ? undefined : personaConfig[persona].description,
          preferredModel: selectedModel === "auto" ? undefined : selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const aiMessage: Message = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
        provider: data.provider,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Gomen! Something went wrong... Please try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (confirm("Clear all chat history?")) {
      setMessages([]);
      localStorage.removeItem("aichixia-chat-history");
    }
  };

  const getProviderBadge = (provider?: string) => {
    if (!provider) return null;

    const colors: Record<string, string> = {
      openai: "bg-green-500",
      gemini: "bg-blue-500",
      qwen: "bg-purple-500",
      gptoss: "bg-pink-500",
      llama: "bg-orange-500",
    };

    return (
      <span
        className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${
          colors[provider] || "bg-gray-500"
        }`}
      >
        {provider.toUpperCase()}
      </span>
    );
  };

  const PersonaIcon = personaConfig[persona].icon;
  const ModelIcon = modelConfig[selectedModel].icon;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Link
            href="/"
            className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
          >
            <FaHome className="text-slate-600 dark:text-slate-300" size={18} />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <img
                src="https://aichiow.vercel.app/aichixia.png"
                alt="Aichixia"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-sky-400 dark:border-sky-500 shadow-md"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                <FaCircle size={5} className="text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2 truncate">
                <span className="truncate">Aichixia 4.5</span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full font-semibold flex-shrink-0">
                  AI
                </span>
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                <FaCircle size={5} className="text-emerald-500 animate-pulse flex-shrink-0" />
                <span className="truncate">Online â€¢ Multi-AI Assistant</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 rounded-lg transition-all text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700"
            >
              <ModelIcon className="text-base sm:text-lg" />
              <span className="hidden lg:inline">{modelConfig[selectedModel].name}</span>
              <FaChevronDown
                size={10}
                className={`transition-transform hidden sm:block ${showModelMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showModelMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowModelMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20">
                  {(Object.keys(modelConfig) as ModelType[]).map((m) => {
                    const Icon = modelConfig[m].icon;
                    return (
                      <button
                        key={m}
                        onClick={() => {
                          setSelectedModel(m);
                          setShowModelMenu(false);
                        }}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${
                          selectedModel === m ? "bg-purple-50 dark:bg-purple-900/20" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Icon className="text-xl sm:text-2xl flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm truncate">
                              {modelConfig[m].name}
                            </div>
                            <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                              {modelConfig[m].description}
                            </div>
                          </div>
                          {selectedModel === m && (
                            <FaCircle size={6} className="text-purple-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <PersonaIcon className="text-base sm:text-lg" />
              <span className="hidden md:inline">{personaConfig[persona].name.split(" ")[0]}</span>
              <FaChevronDown
                size={10}
                className={`transition-transform hidden sm:block ${showPersonaMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showPersonaMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowPersonaMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20">
                  {(Object.keys(personaConfig) as Persona[]).map((p) => {
                    const Icon = personaConfig[p].icon;
                    return (
                      <button
                        key={p}
                        onClick={() => {
                          setPersona(p);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${
                          persona === p ? "bg-sky-50 dark:bg-sky-900/20" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Icon className="text-xl sm:text-2xl flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm truncate">
                              {personaConfig[p].name}
                            </div>
                            <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                              {personaConfig[p].description}
                            </div>
                          </div>
                          {persona === p && (
                            <FaCircle size={6} className="text-sky-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <button
            onClick={clearChat}
            className="p-1.5 sm:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors flex-shrink-0"
            title="Clear chat"
          >
            <FaTrash size={14} />
          </button>

          <div className="hidden lg:block flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-3 sm:px-4">
            <img
              src="https://aichiow.vercel.app/aichixia.png"
              alt="Aichixia"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-sky-400 dark:border-sky-500 shadow-lg mb-4 sm:mb-6 animate-bounce"
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3 flex items-center justify-center gap-2">
              Konnichiwa! I'm Aichixia! <FaHeart className="text-pink-500" />
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mb-2">
              Your anime-loving AI assistant powered by multiple AI providers. Ask me anything
              about anime, manga, or just chat!
            </p>
            <div className="flex items-center gap-2 mb-4 sm:mb-6 text-xs sm:text-sm">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-semibold">
                Model: {modelConfig[selectedModel].name}
              </span>
              <span className="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full font-semibold">
                {personaConfig[persona].name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-2xl w-full">
              {[
                { q: "Recommend me some anime", icon: "ðŸŽ¬" },
                { q: "What's trending right now?", icon: "ðŸ”¥" },
                { q: "Tell me about One Piece", icon: "ðŸ“š" },
                { q: "Who are you?", icon: "â“" },
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion.q)}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 rounded-lg transition-all hover:shadow-md text-left group"
                >
                  <span className="text-xl sm:text-2xl flex-shrink-0">{suggestion.icon}</span>
                  <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                    {suggestion.q}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0">
                <img
                  src="https://aichiow.vercel.app/aichixia.png"
                  alt="Aichixia"
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-sky-400 dark:border-sky-500"
                />
              </div>
            )}

            <div
              className={`flex flex-col max-w-[80%] sm:max-w-[75%] md:max-w-[70%] ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-tr-sm"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm"
                }`}
              >
                <p className="text-xs sm:text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                  {msg.content}
                </p>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 px-2">
                <span className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 dark:text-slate-500">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.role === "assistant" && msg.provider && getProviderBadge(msg.provider)}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="flex-shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold border-2 border-white dark:border-slate-800 shadow-md">
                  <FaUser size={12} className="sm:text-sm" />
                </div>
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex gap-2 sm:gap-3 justify-start">
            <img
              src="https://aichiow.vercel.app/aichixia.png"
              alt="Aichixia"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-sky-400 dark:border-sky-500"
            />
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl rounded-tl-sm shadow-md">
              <div className="flex gap-1 sm:gap-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-stretch">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
              rows={1}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 focus:border-sky-400 dark:focus:border-sky-500 rounded-xl resize-none outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base max-h-32"
              style={{
                minHeight: "46px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "46px";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-4 sm:px-5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 group flex-shrink-0"
              style={{
                minHeight: "46px",
              }}
            >
              <span className="hidden sm:inline text-sm md:text-base">Send</span>
              <FaPaperPlane
                size={14}
                className={`${loading ? "animate-pulse" : "group-hover:translate-x-0.5"} transition-transform sm:text-base`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
