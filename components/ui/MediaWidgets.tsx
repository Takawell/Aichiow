"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaTv, FaBook, FaBookOpen, FaFeatherAlt } from "react-icons/fa";

const mediaItems = [
  {
    title: "Anime",
    icon: <FaTv size={28} />,
    link: "/home",
    color: "from-purple-500 to-indigo-500",
    shadow: "shadow-purple-500/30",
  },
  {
    title: "Manga",
    icon: <FaBook size={28} />,
    link: "/manga",
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/30",
  },
  {
    title: "Manhwa",
    icon: <FaBookOpen size={28} />,
    link: "/manhwa",
    color: "from-green-500 to-emerald-500",
    shadow: "shadow-green-500/30",
  },
  {
    title: "Light Novel",
    icon: <FaFeatherAlt size={28} />,
    link: "/light-novel",
    color: "from-yellow-400 to-amber-500",
    shadow: "shadow-yellow-500/30",
  },
];

export default function MediaWidgets() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-10">
      {mediaItems.map(({ title, icon, link, color, shadow }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <Link href={link}>
            <div
              className={`
                relative rounded-xl p-6 text-white cursor-pointer
                bg-zinc-900/70 backdrop-blur-md border border-white/10
                hover:scale-[1.03] transition-transform duration-300 group
                overflow-hidden shadow-lg ${shadow}
              `}
            >
              <div
                className={`absolute -top-1/2 -left-1/2 w-[200%] h-[200%] 
                  bg-gradient-to-br ${color} opacity-20 blur-3xl z-0
                  group-hover:opacity-30 transition-all duration-500`}
              />
              <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                <div className="group-hover:animate-pulse text-2xl">{icon}</div>
                <span className="font-semibold tracking-wide">{title}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
