"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  FaTv,
  FaBookOpen,
  FaBook,
  FaFeatherAlt,
  FaLanguage,
} from "react-icons/fa";
import { PiMagicWandFill } from "react-icons/pi";

export default function Custom404() {
  const [lang, setLang] = useState<"EN" | "ID">("EN");

  const widgets = [
    { name: lang === "EN" ? "Anime" : "Anime", href: "/anime", icon: <FaTv size={28} /> },
    { name: lang === "EN" ? "Manga" : "Manga", href: "/manga", icon: <FaBookOpen size={28} /> },
    { name: lang === "EN" ? "Manhwa" : "Manhwa", href: "/manhwa", icon: <FaBook size={28} /> },
    { name: lang === "EN" ? "Light Novel" : "Light Novel", href: "/light-novel", icon: <FaFeatherAlt size={28} /> },
  ];

  const text = {
    EN: {
      title: "Page Not Found",
      desc: "Looks like this anime has disappeared into another dimension! Explore our worlds instead.",
      lost: "Lost? Try browsing our anime, manga, manhwa, or light novel catalogs.",
      ask: "Still confused? Ask Aichixia!",
    },
    ID: {
      title: "Halaman Tidak Ditemukan",
      desc: "Sepertinya anime ini menghilang ke dimensi lain! Jelajahi dunia kami sebagai gantinya.",
      lost: "Tersesat? Coba jelajahi katalog anime, manga, manhwa, atau light novel kami.",
      ask: "Masih bingung? Tanya Aichixia!",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden text-white">
      {[
        { top: "10%", left: "5%", size: 24, delay: 0 },
        { top: "70%", left: "80%", size: 32, delay: 1 },
        { top: "50%", left: "60%", size: 16, delay: 2 },
      ].map((b, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          className="absolute rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-md"
          style={{ top: b.top, left: b.left, width: b.size, height: b.size }}
        />
      ))}

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-all"
          onClick={() => setLang(lang === "EN" ? "ID" : "EN")}
        >
          <FaLanguage />
          {lang === "EN" ? "ID" : "EN"}
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-8xl md:text-[9rem] font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          {text[lang].title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-gray-300 mb-8 max-w-lg mx-auto"
        >
          {text[lang].desc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {widgets.map((w) => (
            <motion.div
              key={w.name}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
            >
              <Link href={w.href} className="flex flex-col items-center justify-center">
                <div className="text-pink-400 mb-2">{w.icon}</div>
                <span className="font-semibold text-sm">{w.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <p className="text-gray-400 text-sm">{text[lang].lost}</p>
          <Link
            href="/aichixia"
            className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-all mt-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <PiMagicWandFill size={22} />
            </motion.div>
            <span className="font-semibold">{text[lang].ask}</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
