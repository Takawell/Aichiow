import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaTv, FaBookOpen, FaBook, FaFeatherAlt } from "react-icons/fa";

const emotionalQuotes = [
  "Are you lost, or did your path abandon you?",
  "Chasing ghosts in empty hallways, aren't we?",
  "The world doesn't wait. Neither should you.",
  "Looking for something that was never there?",
  "Sometimes we lose ourselves searching for others.",
  "Did you expect a different ending this time?",
  "Every wrong turn teaches you what's right. Eventually."
];

export default function Custom404() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const widgets = [
    { name: "Anime", href: "/home", icon: <FaTv size={28} /> },
    { name: "Manga", href: "/manga", icon: <FaBookOpen size={28} /> },
    { name: "Manhwa", href: "/manhwa", icon: <FaBook size={28} /> },
    { name: "Light Novel", href: "/light-novel", icon: <FaFeatherAlt size={28} /> },
  ];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/nothing.mp3");
    audio.loop = true;
    audio.volume = 1.0;
    audioRef.current = audio;

    const playAudio = () => {
      audio.play().catch(err => console.log("Audio autoplay blocked:", err));
      document.removeEventListener("click", playAudio);
    };

    audio.play().catch(() => {
      document.addEventListener("click", playAudio);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      document.removeEventListener("click", playAudio);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % emotionalQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = (canvas.width = window.innerWidth * devicePixelRatio);
    let height = (canvas.height = window.innerHeight * devicePixelRatio);
    const num = 80;
    const particles = Array.from({ length: num }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      color: `hsla(${Math.random() * 360}, 80%, 70%, 0.8)`,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      for (let i = 0; i < num; i++) {
        for (let j = i + 1; j < num; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 * devicePixelRatio) {
            ctx.strokeStyle = `hsla(${(i * 15) % 360}, 80%, 60%, ${0.1 - dist / (120 * devicePixelRatio) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      width = (canvas.width = window.innerWidth * devicePixelRatio);
      height = (canvas.height = window.innerHeight * devicePixelRatio);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#040714] via-[#090b22] to-[#0a0528] text-white">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />

      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-blue-500/20 via-purple-600/20 to-fuchsia-700/20 blur-3xl animate-pulse"
      />
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute w-[50rem] h-[50rem] bg-gradient-to-br from-indigo-600/10 via-blue-400/10 to-cyan-500/10 rounded-full blur-[200px]"
      />

      <div className="relative z-20 text-center px-4 sm:px-6 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <h1 className="text-[6rem] sm:text-[8rem] md:text-[12rem] font-black leading-none bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(139, 92, 246, 0.3)",
                "0 0 60px rgba(139, 92, 246, 0.6)",
                "0 0 20px rgba(139, 92, 246, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Lost in Another Dimension
            </h2>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="mb-12"
          >
            <p className="text-gray-300 max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed font-light italic px-4">
              "{emotionalQuotes[currentQuote]}"
            </p>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-4 flex justify-center gap-2"
            >
              {emotionalQuotes.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i === currentQuote ? "bg-purple-400 w-8" : "bg-gray-600"
                  }`}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto px-4"
        >
          {widgets.map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.8, duration: 0.6, type: "spring" }}
              whileHover={{
                scale: 1.08,
                y: -12,
                boxShadow: "0 20px 40px rgba(100,100,255,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-300 hover:bg-white/15 hover:border-purple-400/50 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500"
              />
              <Link href={w.href} className="flex flex-col items-center justify-center relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-blue-400 group-hover:text-purple-300 mb-3 transition-colors"
                >
                  {w.icon}
                </motion.div>
                <span className="font-semibold text-sm sm:text-base group-hover:text-purple-200 transition-colors">
                  {w.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-12 sm:mt-16"
        >
          <Link href="/home">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-full font-bold text-base sm:text-lg shadow-2xl transition-all duration-300 border border-white/20"
            >
              Return to Home
            </motion.button>
          </Link>
        </motion.div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.2, delay: 1.6 }}
            className="mt-8 sm:mt-12 text-xs sm:text-sm text-gray-500 font-light"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              The journey continues elsewhere...
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: [0.4, 1, 0.4], y: [100, 80, 100] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-gray-500 text-xs uppercase tracking-widest"
        >
          Portal reconnecting...
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="mt-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto shadow-lg shadow-purple-500/50"
        />
      </motion.div>

      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-blue-400/20 rounded-full w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem]"
      />
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-purple-400/10 rounded-full w-[30rem] sm:w-[45rem] h-[30rem] sm:h-[45rem]"
      />

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{ 
            duration: 5 + Math.random() * 3, 
            repeat: Infinity,
            delay: i * 0.5
          }}
          className="absolute w-4 h-4 sm:w-6 sm:h-6 bg-purple-500/30 rounded-full blur-md"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          }}
        />
      ))}
    </div>
  );
}
