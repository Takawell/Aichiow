import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaTv, FaBookOpen, FaBook, FaFeatherAlt } from "react-icons/fa";

export default function Custom404() {
  const widgets = [
    { name: "Anime", href: "/home", icon: <FaTv size={24} /> },
    { name: "Manga", href: "/manga", icon: <FaBookOpen size={24} /> },
    { name: "Manhwa", href: "/manhwa", icon: <FaBook size={24} /> },
    { name: "Light Novel", href: "/light-novel", icon: <FaFeatherAlt size={24} /> },
  ];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const num = 50;
    
    const particles = Array.from({ length: num }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: `hsla(${200 + Math.random() * 60}, 70%, 60%, 0.6)`,
    }));

    let animationId: number;

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
          
          if (dist < 100) {
            ctx.strokeStyle = `hsla(220, 70%, 60%, ${0.15 - dist / 100 * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#040714] via-[#0a0e27] to-[#0a0528] text-white">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />
      
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 1.5 }}
        className="absolute w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-blue-500/30 via-purple-600/20 to-fuchsia-700/20 blur-3xl"
      />

      <div className="relative z-20 text-center px-4 sm:px-6 w-full max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl sm:text-8xl md:text-9xl font-black leading-none bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4"
        >
          Lost in Another Dimension
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The page you are looking for doesn't exist or has been transported to another realm. Choose your portal below to return.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10"
        >
          {widgets.map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 cursor-pointer transition-all hover:bg-white/10 hover:border-blue-400/40"
            >
              <Link href={w.href} className="flex flex-col items-center justify-center gap-2">
                <div className="text-blue-400">{w.icon}</div>
                <span className="font-semibold text-xs sm:text-sm">{w.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full font-semibold text-sm sm:text-base shadow-lg transition-all"
            >
              Return to Home
            </motion.button>
          </Link>
        </motion.div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 text-xs sm:text-sm text-gray-500"
          >
            Return safely to your favorite worlds.
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: [0.3, 0.6, 0.3], y: [50, 40, 50] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">
          Portal reconnecting...
        </div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"
        />
      </motion.div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-blue-400/10 rounded-full w-[25rem] h-[25rem] sm:w-[35rem] sm:h-[35rem]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-purple-400/10 rounded-full w-[35rem] h-[35rem] sm:w-[50rem] sm:h-[50rem]"
      />

      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-[20%] left-[20%] w-4 h-4 bg-blue-500/30 rounded-full blur-sm"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-[30%] right-[25%] w-5 h-5 bg-purple-400/30 rounded-full blur-sm"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-[15%] left-[15%] w-6 h-6 bg-fuchsia-500/30 rounded-full blur-md"
      />
    </div>
  );
}
