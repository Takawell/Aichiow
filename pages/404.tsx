import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaTv, FaBookOpen, FaBook, FaFeatherAlt } from "react-icons/fa";

export default function Custom404() {
  const widgets = [
    { name: "Anime", href: "/home", icon: <FaTv size={28} /> },
    { name: "Manga", href: "/manga", icon: <FaBookOpen size={28} /> },
    { name: "Manhwa", href: "/manhwa", icon: <FaBook size={28} /> },
    { name: "Light Novel", href: "/light-novel", icon: <FaFeatherAlt size={28} /> },
  ];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      <div className="relative z-20 text-center px-4 w-full">
        <motion.h1
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-[8rem] sm:text-[10rem] font-black leading-none bg-gradient-to-r from-blue-400 via-sky-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg"
        >
          404
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-3xl md:text-4xl font-semibold tracking-tight mt-2"
        >
          Lost in Another Dimension
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-gray-300 max-w-2xl mx-auto mt-4 text-lg leading-relaxed"
        >
          The page you are looking for doesn’t exist or has been transported to another realm. Choose your portal below to return.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {widgets.map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15 + 0.8, duration: 0.6 }}
              whileHover={{
                scale: 1.07,
                y: -8,
                boxShadow: "0 0 25px rgba(100,100,255,0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 cursor-pointer transition-transform duration-300 hover:bg-white/10"
            >
              <Link href={w.href} className="flex flex-col items-center justify-center">
                <div className="text-blue-400 mb-2">{w.icon}</div>
                <span className="font-semibold text-sm">{w.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="mt-12 text-sm text-gray-400"
          >
            Return safely to your favorite worlds.
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: [0.4, 1, 0.4], y: [100, 80, 100] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
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
          className="mt-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto shadow-lg"
        />
      </motion.div>
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-blue-400/20 rounded-full w-[30rem] h-[30rem]"
      />
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-purple-400/10 rounded-full w-[45rem] h-[45rem]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-[20%] left-[25%] w-6 h-6 bg-blue-500/30 rounded-full blur-md"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-[25%] right-[30%] w-8 h-8 bg-purple-400/30 rounded-full blur-md"
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-[10%] left-[10%] w-10 h-10 bg-fuchsia-500/30 rounded-full blur-lg"
      />
    </div>
  );
}
