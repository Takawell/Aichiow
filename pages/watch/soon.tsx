"use client"

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  FaDiscord,
  FaWhatsapp,
  FaTiktok,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export default function ComingSoonPage() {
  const [lang, setLang] = useState<"ID" | "EN">("EN");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [20, -20]);
  const rotateY = useTransform(x, [-200, 200], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    x.set(e.clientX - innerWidth / 2);
    y.set(e.clientY - innerHeight / 2);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let particles: Particle[] = [];
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 1.2
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.03)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#0ff";
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    resize();
    window.addEventListener("resize", resize);
    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  const [gridGlow, setGridGlow] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setGridGlow((g) => (g >= 360 ? 0 : g + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const content = {
    ID: (
      <>
        <p className="text-xl text-gray-200 font-light">
          🚧 <span className="text-primary font-semibold">Fitur Streaming Sedang Dikembangkan</span>
        </p>
        <p>
          Aichiow sedang merancang{" "}
          <span className="text-blue-400 font-semibold">
            pengalaman streaming generasi berikutnya
          </span>{" "}
          — cepat, bersih, dan sepenuhnya legal.
        </p>
        <p>
          Tidak seperti platform yang hanya menyalin konten tanpa izin, kami membangun ekosistem yang{" "}
          <span className="text-pink-400 font-semibold">menghormati kreator</span>, menjaga kualitas, dan menghadirkan kenyamanan terbaik bagi komunitas anime.
        </p>
        <p>
          💡 Ini bagian dari visi besar kami: <br />
          Menciptakan{" "}
          <span className="text-yellow-400 font-semibold">
            satu rumah utama
          </span>{" "}
          bagi penikmat anime di seluruh dunia.
        </p>
        <p>
          🔧 Mohon bersabar. Kami sedang menguji, menyempurnakan, dan menyiapkan sesuatu yang belum pernah ada sebelumnya.
        </p>
        <p className="italic text-gray-400 text-sm">
          Aichiow bukan sekadar streaming — ini standar baru.
        </p>
      </>
    ),
    EN: (
      <>
        <p className="text-xl text-gray-200 font-light">
          🚧 <span className="text-primary font-semibold">Streaming Feature Under Development</span>
        </p>
        <p>
          Aichiow is building the{" "}
          <span className="text-blue-400 font-semibold">
            next-generation streaming experience
          </span>
          : fast, clean, and fully legal.
        </p>
        <p>
          Unlike platforms that simply scrape content without permission, we’re creating an ecosystem that{" "}
          <span className="text-pink-400 font-semibold">respects creators</span>, preserves quality, and delivers true comfort for anime fans.
        </p>
        <p>
          💡 This is part of our bigger vision: <br />
          To build{" "}
          <span className="text-yellow-400 font-semibold">
            the ultimate home
          </span>{" "}
          for anime lovers worldwide.
        </p>
        <p>
          🔧 Please be patient. We’re testing, refining, and preparing something the anime world hasn’t seen before.
        </p>
        <p className="italic text-gray-400 text-sm">
          Aichiow is not just streaming — it’s a new standard.
        </p>
      </>
    ),
  };

  return (
    <>
      <Head>
        <title>Coming Soon | Aichiow</title>
      </Head>

      <main
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6 py-12"
      >
        <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

        <div
          className="absolute inset-0 -z-20 opacity-40"
          style={{
            backgroundImage: `linear-gradient(${gridGlow}deg, rgba(0,255,255,0.05) 1px, transparent 1px),
                              linear-gradient(${gridGlow + 90}deg, rgba(255,0,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.05, 0.9] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,0,255,0.15)_0%,transparent_70%)] blur-3xl"
        />

        <motion.h1
          style={{ rotateX, rotateY }}
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="glitch shine text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 drop-shadow-[0_0_30px_rgba(255,0,255,0.6)] mb-6"
        >
          COMING SOON!
        </motion.h1>

        <motion.div
          className="flex gap-4 mb-8 bg-neutral-900/70 rounded-full px-4 py-2 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {["ID", "EN"].map((tab) => (
            <button
              key={tab}
              onClick={() => setLang(tab as "ID" | "EN")}
              className={`px-5 py-2 rounded-full font-bold transition text-sm md:text-base ${
                lang === tab
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-black shadow-[0_0_15px_rgba(0,200,255,0.7)]"
                  : "hover:bg-neutral-700 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-gray-300 leading-relaxed text-lg space-y-5 mb-10"
          >
            {content[lang]}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10"
        >
          <h2 className="text-2xl font-bold mb-4 tracking-wide">Connect with Us</h2>
          <motion.div
            className="flex gap-5 justify-center text-3xl flex-wrap"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {[
              { icon: <FaDiscord />, url: "https://discord.com/aichiow", color: "hover:bg-indigo-600" },
              { icon: <FaWhatsapp />, url: "https://whatsapp.com/channel/0029Vb5lXCA1SWsyWyJbvW0q", color: "hover:bg-green-500" },
              { icon: <FaTiktok />, url: "https://tiktok.com/putrawangyyy", color: "hover:bg-pink-500" },
              { icon: <FaInstagram />, url: "https://instagram.com/putrasenpaiii", color: "hover:bg-pink-400" },
              { icon: <FaYoutube />, url: "https://youtube.com/@TakaDevelompent", color: "hover:bg-red-500" },
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.25, rotate: 6 }}
                whileTap={{ scale: 0.9 }}
                className={`p-4 rounded-full bg-neutral-800/80 backdrop-blur-sm ${social.color} transition-all border border-white/10 shadow-lg`}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/home"
            className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(255,0,255,0.6)] hover:shadow-[0_0_40px_rgba(255,100,255,0.8)] transition-transform hover:scale-110"
          >
            Back to Home
          </Link>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 text-sm text-gray-400"
        >
          © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
        </motion.footer>
      </main>
    </>
  );
}
