import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { FaTv, FaBookOpen, FaBook, FaFeatherAlt } from "react-icons/fa";
import { SiCodemagic } from "react-icons/si";
import { useEffect } from "react";

export default function Custom404() {
  const widgets = [
    { name: "Anime", href: "/home", icon: <FaTv size={28} /> },
    { name: "Manga", href: "/manga", icon: <FaBookOpen size={28} /> },
    { name: "Manhwa", href: "/manhwa", icon: <FaBook size={28} /> },
    { name: "Light Novel", href: "/light-novel", icon: <FaFeatherAlt size={28} /> },
  ];

  const magicControls = useAnimation();

  useEffect(() => {
    const animateMagic = async () => {
      while (true) {
        await magicControls.start({
          rotate: [0, 15, -15, 0],
          scale: [1, 1.2, 0.8, 1],
          transition: { duration: 1 },
        });
      }
    };
    animateMagic();
  }, [magicControls]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {[
        { top: "10%", left: "5%", size: 24, delay: 0 },
        { top: "70%", left: "80%", size: 32, delay: 1 },
        { top: "50%", left: "60%", size: 16, delay: 2 },
        { top: "20%", left: "50%", size: 20, delay: 0.5 },
        { top: "80%", left: "30%", size: 28, delay: 1.5 },
      ].map((b, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -25, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          className="absolute rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30"
          style={{ top: b.top, left: b.left, width: b.size, height: b.size }}
        />
      ))}

      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-8xl md:text-[9rem] font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500"
      >
        404
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold mb-4 text-white text-center"
      >
        Page Not Found
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg text-gray-300 mb-8 max-w-lg text-center"
      >
        Hmm… we couldn’t find that page! Why not explore something else instead?
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full mb-8"
      >
        {widgets.map((w) => (
          <motion.div
            key={w.name}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="glass rounded-lg p-6 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center"
          >
            <Link href={w.href} className="flex flex-col items-center justify-center">
              <div className="text-blue-400 mb-2">{w.icon}</div>
              <span className="text-white font-semibold text-sm">{w.name}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        animate={magicControls}
        className="cursor-pointer flex flex-col items-center justify-center text-white mb-8"
        onClick={() => window.location.href = "/aichixia"}
      >
        <SiCodemagic size={48} className="mb-2 text-gradient-to-r from-purple-500 to-blue-500" />
        <span className="font-semibold text-lg animate-pulse">Still confused? Ask Aichixia</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="mt-4 text-sm text-gray-400 text-center max-w-md"
      >
        Lost? Try browsing our anime, manga, manhwa, or light novel catalogs.
      </motion.p>
    </div>
  );
}
