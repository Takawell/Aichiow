import { motion } from "framer-motion";
import Link from "next/link";
import { FaTv, FaBookOpen, FaBook, FaFeatherAlt } from "react-icons/fa";
import { GiGemini } from "react-icons/gi";

export default function Custom404() {
  const widgets = [
    { name: "Anime", href: "/home", icon: <FaTv size={28} /> },
    { name: "Manga", href: "/manga", icon: <FaBookOpen size={28} /> },
    { name: "Manhwa", href: "/manhwa", icon: <FaBook size={28} /> },
    { name: "Light Novel", href: "/light-novel", icon: <FaFeatherAlt size={28} /> },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {[
        { top: "10%", left: "5%", size: 24, delay: 0 },
        { top: "70%", left: "80%", size: 32, delay: 1 },
        { top: "50%", left: "60%", size: 16, delay: 2 },
      ].map((b, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          className="absolute rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
          style={{ top: b.top, left: b.left, width: b.size, height: b.size }}
        />
      ))}

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-8xl md:text-[9rem] font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-purple-500"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-white"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-gray-300 mb-8 max-w-lg mx-auto"
        >
          Hmm… we couldn’t find that page! Why not check out something else instead?
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
              className="glass rounded-lg p-6 hover:bg-white/10 transition-all cursor-pointer"
            >
              <Link href={w.href} className="flex flex-col items-center justify-center">
                <div className="text-blue-400 mb-2">{w.icon}</div>
                <span className="text-white font-semibold text-sm">{w.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/aichixia"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <GiGemini size={24} />
            <span className="font-semibold">Still confused? Ask Aichixia</span>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 text-sm text-gray-500"
        >
          Lost? Try browsing our anime, manga, manhwa, or light novel catalogs.
        </motion.p>
      </div>
    </div>
  );
}
