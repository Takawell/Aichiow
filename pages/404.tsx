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
    const num = window.innerWidth < 768 ? 40 : 80;
    const particles = Array.from({ length: num }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      color: `hsla(${Math.random() * 60 + 180}, 85%, 65%, 0.9)`,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
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
            ctx.strokeStyle = `hsla(200, 85%, 60%, ${0.15 - dist / (120 * devicePixelRatio) * 0.15})`;
            ctx.lineWidth = 1;
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-sky-950" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-[25rem] h-[25rem] md:w-[45rem] md:h-[45rem] rounded-full bg-gradient-to-tr from-sky-600/30 via-blue-700/20 to-cyan-600/30 blur-3xl"
      />
      
      <motion.div
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ 
          scale: [1.3, 1, 1.3],
          opacity: [0, 0.5, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[30rem] h-[30rem] md:w-[60rem] md:h-[60rem] bg-gradient-to-bl from-sky-500/20 via-blue-600/10 to-indigo-700/20 rounded-full blur-[150px]"
      />

      <div className="relative z-20 text-center px-4 sm:px-6 w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="mb-6 md:mb-8"
        >
          <motion.h1
            animate={{ 
              textShadow: [
                "0 0 20px rgba(56, 189, 248, 0.5)",
                "0 0 60px rgba(56, 189, 248, 0.8)",
                "0 0 20px rgba(56, 189, 248, 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[14rem] font-black leading-none bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent select-none"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            404
          </motion.h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mt-4 text-white"
        >
          Lost in Another Dimension
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-gray-400 max-w-xl md:max-w-2xl mx-auto mt-4 md:mt-6 text-base sm:text-lg leading-relaxed px-4"
        >
          The page you are looking for doesn't exist or has been transported to another realm. Choose your portal below to return.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="mt-8 md:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4"
        >
          {widgets.map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.9, duration: 0.6, type: "spring" }}
              whileHover={{
                scale: 1.08,
                y: -12,
              }}
              whileTap={{ scale: 0.96 }}
              className="group relative backdrop-blur-xl bg-gradient-to-br from-sky-500/10 via-blue-600/5 to-black/20 border border-sky-400/20 rounded-2xl p-5 sm:p-6 md:p-8 cursor-pointer transition-all duration-500 hover:border-sky-400/60 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-sky-400/0 via-blue-500/0 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
                whileHover={{ 
                  background: "linear-gradient(to bottom right, rgba(56, 189, 248, 0.1), rgba(59, 130, 246, 0.05), rgba(34, 211, 238, 0.1))"
                }}
              />
              <Link href={w.href} className="relative flex flex-col items-center justify-center gap-3 md:gap-4">
                <motion.div 
                  className="text-sky-400 group-hover:text-sky-300 transition-colors duration-300"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {w.icon}
                </motion.div>
                <span className="font-bold text-sm sm:text-base md:text-lg text-white group-hover:text-sky-200 transition-colors duration-300">
                  {w.name}
                </span>
              </Link>
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle at center, rgba(56, 189, 248, 0.1) 0%, transparent 70%)"
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.2, delay: 1.4 }}
            className="mt-10 md:mt-16 text-xs sm:text-sm text-gray-500"
          >
            Return safely to your favorite worlds.
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ 
          opacity: [0.3, 1, 0.3], 
          y: [100, 70, 100],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-center"
      >
        <motion.div
          animate={{ 
            y: [0, -12, 0], 
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-gray-600 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold"
        >
          Portal reconnecting
        </motion.div>
        <motion.div
          animate={{ 
            scale: [1, 1.6, 1], 
            opacity: [0.4, 1, 0.4],
            boxShadow: [
              "0 0 10px rgba(56, 189, 248, 0.5)",
              "0 0 30px rgba(56, 189, 248, 1)",
              "0 0 10px rgba(56, 189, 248, 0.5)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-3 w-3 h-3 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 rounded-full mx-auto"
        />
      </motion.div>

      <motion.div
        initial={{ rotate: 0, scale: 0.9 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-sky-400/10 rounded-full w-[20rem] h-[20rem] md:w-[35rem] md:h-[35rem]"
      />
      <motion.div
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: -360, scale: 1.1 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-blue-400/5 rounded-full w-[28rem] h-[28rem] md:w-[50rem] md:h-[50rem]"
      />

      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.6, 0.2],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute top-[15%] left-[20%] w-4 h-4 md:w-8 md:h-8 bg-sky-500/40 rounded-full blur-md"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          x: [0, -40, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-[20%] right-[25%] w-5 h-5 md:w-10 md:h-10 bg-blue-400/40 rounded-full blur-md"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.7, 0.2],
          x: [0, 20, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-[8%] left-[8%] w-6 h-6 md:w-12 md:h-12 bg-cyan-500/40 rounded-full blur-lg"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, -25, 0],
          y: [0, 15, 0]
        }}
        transition={{ duration: 9, repeat: Infinity }}
        className="absolute top-[30%] right-[15%] w-4 h-4 md:w-7 md:h-7 bg-sky-600/40 rounded-full blur-md"
      />
    </div>
  );
}
