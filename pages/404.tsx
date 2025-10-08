"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaLanguage, FaTv, FaBookOpen, FaBook, FaFeatherAlt } from "react-icons/fa";
import { PiSparkleFill } from "react-icons/pi";

export default function Custom404() {
  const [lang, setLang] = useState<"EN" | "ID">("EN");
  const text = {
    EN: {
      title: "Page Not Found",
      subtitle: "Looks like this anime got lost in another world!",
      desc: "Don’t worry, you can still explore our universe of anime, manga, manhwa, and light novels.",
      ask: "Still confused? Ask Aichixia!",
      btn: "Back to Home",
    },
    ID: {
      title: "Halaman Tidak Ditemukan",
      subtitle: "Sepertinya anime ini tersesat ke dunia lain!",
      desc: "Jangan khawatir, kamu masih bisa menjelajahi dunia anime, manga, manhwa, dan light novel kami.",
      ask: "Masih bingung? Tanya Aichixia!",
      btn: "Kembali ke Beranda",
    },
  };
  const items = [
    { name: "Anime", href: "/anime", icon: <FaTv size={26} /> },
    { name: "Manga", href: "/manga", icon: <FaBookOpen size={26} /> },
    { name: "Manhwa", href: "/manhwa", icon: <FaBook size={26} /> },
    { name: "Light Novel", href: "/light-novel", icon: <FaFeatherAlt size={26} /> },
  ];
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a10] via-[#111122] to-[#1a1a2e] text-white">
      <motion.div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-pink-400/20 via-purple-400/10 to-indigo-400/20 blur-3xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${60 + Math.random() * 120}px`,
              height: `${60 + Math.random() * 120}px`,
            }}
            animate={{
              x: [0, Math.random() * 40 - 20, 0],
              y: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setLang(lang === "EN" ? "ID" : "EN")}
        className="absolute top-5 right-5 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-md transition-all"
      >
        <FaLanguage />
        {lang === "EN" ? "ID" : "EN"}
      </motion.button>
      <motion.h1
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-8xl md:text-[10rem] font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 drop-shadow-[0_0_20px_rgba(255,0,255,0.4)]"
      >
        404
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold tracking-wide mb-3"
      >
        {text[lang].title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-base md:text-lg text-gray-300 mb-8 text-center max-w-md px-4"
      >
        {text[lang].subtitle}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="text-sm md:text-base text-gray-400 mb-10 text-center max-w-lg px-6"
      >
        {text[lang].desc}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl w-full px-4"
      >
        {items.map((it, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05, y: -6 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-pink-400/40 hover:bg-white/10 transition-all duration-300 p-6 text-center cursor-pointer shadow-lg"
          >
            <Link href={it.href} className="flex flex-col items-center gap-2">
              <div className="text-pink-400">{it.icon}</div>
              <span className="font-semibold text-sm md:text-base">{it.name}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.2 }}
        className="mt-14 flex flex-col items-center justify-center gap-3"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-pink-400 text-2xl"
        >
          <PiSparkleFill />
        </motion.div>
        <Link
          href="/aichixia"
          className="relative group text-lg md:text-xl font-semibold text-pink-400 hover:text-pink-300 transition-all duration-300"
        >
          <span className="relative z-10">{text[lang].ask}</span>
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-400/20 to-indigo-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-all"
            layoutId="aichixia"
          />
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 1.6 }}
        className="mt-10"
      >
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full text-white font-semibold text-sm md:text-base hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.4)]"
        >
          {text[lang].btn}
        </Link>
      </motion.div>
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-6 text-xs text-gray-500 text-center"
      >
        © {new Date().getFullYear()} Aichiow Plus. All rights reserved.
      </motion.div>
    </div>
  );
}
