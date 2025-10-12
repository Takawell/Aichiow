import { useEffect, useRef, useState, Fragment } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaTv, FaBookOpen, FaBook, FaFeatherAlt, FaHome, FaBug, FaCopy, FaMoon, FaSun } from "react-icons/fa";

const widgets = [
  { name: "Anime", href: "/anime", icon: <FaTv size={22} /> },
  { name: "Manga", href: "/manga", icon: <FaBookOpen size={22} /> },
  { name: "Manhwa", href: "/manhwa", icon: <FaBook size={22} /> },
  { name: "Light Novel", href: "/light-novel", icon: <FaFeatherAlt size={22} /> },
];

function useDeviceTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(("ontouchstart" in window) || navigator.maxTouchPoints > 0);
  }, []);
  return isTouch;
}

export default function Custom404() {
  const [showReport, setShowReport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isTouch = useDeviceTouch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = (canvas.width = canvas.clientWidth * devicePixelRatio);
    let height = (canvas.height = canvas.clientHeight * devicePixelRatio);
    const particles = new Array(60).fill(0).map(() => createParticle(width, height));
    function resize() {
      width = canvas.width = canvas.clientWidth * devicePixelRatio;
      height = canvas.height = canvas.clientHeight * devicePixelRatio;
    }
    function createParticle(w: number, h: number) {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1.2 + Math.random() * 2.5,
        hue: Math.floor(200 + Math.random() * 120),
      };
    }
    function step() {
      ctx.clearRect(0, 0, width, height);
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, "rgba(20,24,35,0.2)");
      g.addColorStop(1, "rgba(40,12,80,0.15)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        const dx = (mouseRef.current.x * devicePixelRatio || -9999) - p.x;
        const dy = (mouseRef.current.y * devicePixelRatio || -9999) - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 20000) {
          p.vx += dx * 0.00002;
          p.vy += dy * 0.00002;
        }
        if (p.x < -50) p.x = width + 50;
        if (p.y < -50) p.y = height + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y > height + 50) p.y = -50;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, 0.85)`;
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx2 = p.x - q.x;
          const dy2 = p.y - q.y;
          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist < 120 * devicePixelRatio) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${p.hue}, 70%, 60%, ${0.12 - dist / (120 * devicePixelRatio) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(step);
    }
    window.addEventListener("resize", resize);
    step();
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e && e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      } else if ("clientX" in e) {
        mouseRef.current.x = (e as MouseEvent).clientX;
        mouseRef.current.y = (e as MouseEvent).clientY;
      }
    };
    const onLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchend", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchend", onLeave);
    };
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleReport() {
    setShowReport(true);
    setTimeout(() => {
      setShowReport(false);
      alert("Report sent (mock).");
    }, 900);
  }

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-[#071021] via-[#0b1220] to-[#120922] dark:from-[#000] dark:via-[#050510] dark:to-[#060414] text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-10">
        <motion.div aria-hidden initial={{ opacity: 0.2, scale: 0.9 }} animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute -left-48 -top-48 w-[34rem] h-[34rem] bg-gradient-to-r from-[#2b6ef6]/20 to-[#a855f7]/20 rounded-full blur-3xl" />
        <motion.div aria-hidden initial={{ opacity: 0.25 }} animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} className="absolute -right-36 -bottom-36 w-[28rem] h-[28rem] bg-gradient-to-tr from-[#06b6d4]/20 to-[#7c3aed]/10 rounded-full blur-2xl" />
      </div>
      <main className="relative z-20 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <section className="px-6 py-8 md:py-12 bg-white/5 backdrop-blur-md border border-white/6 rounded-2xl shadow-xl">
            <header className="flex items-start justify-between gap-4">
              <div>
                <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">404</span>
                </motion.h1>
                <motion.p initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.05 }} className="mt-2 text-lg md:text-xl text-gray-200 max-w-lg">
                  The page you’re looking for wandered into another timeline.
                </motion.p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} className="p-2 rounded-lg bg-white/6 hover:bg-white/8 transition focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Toggle theme">
                  {theme === "dark" ? <FaSun /> : <FaMoon />}
                </button>
                <button onClick={handleCopy} className="p-2 rounded-lg bg-white/6 hover:bg-white/8 transition focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Copy current URL">
                  <FaCopy />
                </button>
              </div>
            </header>
            <div className="mt-6 grid gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <div className="mt-3 md:mt-0 md:w-48 flex items-center gap-2">
                  <Link href="/" className="w-full">
                    <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg text-black font-semibold hover:scale-[1.01] transform transition">
                      <span className="inline-flex items-center justify-center gap-2"><FaHome /> Home</span>
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex gap-3 flex-wrap">
                  {widgets.map((w) => (
                    <Link key={w.name} href={w.href} className="group">
                      <motion.a whileHover={{ y: -6 }} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/3 hover:bg-white/7 transition border border-white/6" aria-label={`Go to ${w.name}`}>
                        <span className="p-2 rounded-md bg-white/6 group-hover:bg-white/10">{w.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold">{w.name}</div>
                        </div>
                      </motion.a>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleReport} className="py-2 px-3 rounded-md bg-red-600/80 hover:bg-red-600/95 transition flex items-center gap-2 text-sm">
                    <FaBug /> Report
                  </button>
                  <button onClick={() => window.history.back()} className="py-2 px-3 rounded-md bg-white/6 hover:bg-white/8 transition text-sm">
                    Back
                  </button>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                {copied ? <span className="inline-block px-3 py-1 rounded-md bg-green-500/20 text-green-200">URL copied!</span> : <Fragment>Can’t find what you want? Try browsing categories above.</Fragment>}
              </div>
            </div>
            <footer className="mt-8 text-xs text-gray-500 flex flex-col sm:flex-row gap-2 items-center justify-between">
              <div>© {new Date().getFullYear()} Aichiow Plus. All Rights Reserved.</div>
              <div className="flex items-center gap-3">
                <a href="/terms" className="hover:underline">Terms</a>
                <a href="/privacy" className="hover:underline">Privacy</a>
              </div>
            </footer>
          </section>
          <aside className="px-6 py-8 md:py-12 flex flex-col items-center justify-center rounded-2xl bg-white/3 border border-white/6 shadow-xl">
            <div className="w-full max-w-md">
              <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.05 }} className="bg-gradient-to-b from-white/3 to-transparent rounded-xl p-6">
                <motion.div initial={{ rotate: -6, y: 6 }} animate={{ rotate: 0, y: 0 }} transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }} className="relative">
                  <svg viewBox="0 0 500 300" className="w-full h-48 md:h-56" role="img">
                    <defs>
                      <radialGradient id="g1" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                      </radialGradient>
                      <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="12" />
                      </filter>
                    </defs>
                    <rect x="0" y="0" width="500" height="300" fill="transparent" />
                    <g filter="url(#f1)">
                      <ellipse cx="240" cy="140" rx="160" ry="80" fill="url(#g1)" />
                      <motion.ellipse cx="250" cy="130" rx="110" ry="45" fill="#a78bfa" opacity={0.12} animate={{ rx: [110, 118, 110], ry: [45, 50, 45] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                    </g>
                    <g>
                      <motion.g animate={{ y: [-4, 4, -4] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                        <text x="50%" y="30%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fill="#e6edf3" fontWeight="700">Lost Realm</text>
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fill="#d1d5db">A mysterious pocket between pages</text>
                      </motion.g>
                    </g>
                  </svg>
                </motion.div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button onClick={() => window.location.href = "/"} className="py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 font-semibold">Teleport Home</button>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="py-2 rounded-lg border border-white/6">Scroll Up</button>
                </div>
                <div className="mt-4 text-xs text-gray-400">Tip: press <kbd className="px-2 py-1 rounded bg-white/6">Esc</kbd> to focus search.</div>
              </motion.div>
              <div className="mt-5 flex items-center gap-3">
                <button onClick={() => { navigator.vibrate?.(50); handleCopy(); }} className="px-3 py-2 rounded-md bg-white/6 hover:bg-white/8 transition flex items-center gap-2">
                  <FaCopy /> Copy URL
                </button>
                <button onClick={() => { navigator.vibrate?.(50); handleReport(); }} className="px-3 py-2 rounded-md bg-amber-500/80 hover:bg-amber-500/95 transition flex items-center gap-2">
                  <FaBug /> Report Issue
                </button>
              </div>
              <div className="mt-6 text-xs text-gray-400">Performance: lightweight canvas, CSS blobs, and motion animations.</div>
            </div>
          </aside>
        </div>
      </main>
      <div className="fixed right-6 bottom-6 z-40">
        <AnimatePresence>
          {!showReport ? (
            <motion.button key="help" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} onClick={() => { setShowReport(true); setTimeout(() => setShowReport(false), 900); }} className="rounded-full p-3 bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition">
              <FaBug size={18} />
            </motion.button>
          ) : (
            <motion.div key="sent" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} className="rounded-full p-3 bg-green-600 shadow-lg text-white">Sent</motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
