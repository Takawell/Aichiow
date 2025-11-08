import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
    const num = window.innerWidth < 768 ? 25 : 45;
    
    const particles = Array.from({ length: num }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);
      
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.6)";
        ctx.fill();
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />
      
      <div className="absolute inset-0 bg-gradient-to-br from-sky-950/20 via-black to-blue-950/20" />
      
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-500/10 via-transparent to-blue-600/10 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(56, 189, 248, 0.3)",
                  "0 0 40px rgba(56, 189, 248, 0.5)",
                  "0 0 20px rgba(56, 189, 248, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] font-black bg-gradient-to-b from-sky-400 to-blue-600 bg-clip-text text-transparent"
            >
              404
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-3 sm:space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Page Not Found
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-md mx-auto px-4">
              The page you're looking for doesn't exist. Choose a portal below to continue.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 sm:pt-6"
          >
            {widgets.map((w, i) => (
              <motion.div
                key={w.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href={w.href}
                  className="block relative group"
                >
                  <div className="relative backdrop-blur-sm bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-400/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 transition-all duration-300 hover:border-sky-400/50 hover:bg-sky-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400/0 to-blue-500/0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative flex flex-col items-center gap-3 sm:gap-4">
                      <div className="text-sky-400 group-hover:text-sky-300 transition-colors duration-300">
                        {w.icon}
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-white group-hover:text-sky-100 transition-colors duration-300">
                        {w.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="pt-6 sm:pt-8"
          >
            <p className="text-xs sm:text-sm text-gray-600">
              Return to your favorite content
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="text-xs text-gray-700 uppercase tracking-widest">Redirecting</div>
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            boxShadow: [
              "0 0 10px rgba(56, 189, 248, 0.3)",
              "0 0 20px rgba(56, 189, 248, 0.6)",
              "0 0 10px rgba(56, 189, 248, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-sky-500 rounded-full"
        />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-sky-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-56 sm:h-56 bg-blue-600 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}
