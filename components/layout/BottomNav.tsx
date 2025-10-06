"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FaHome, FaCalendarAlt, FaCompass, FaBookOpen } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { MdMenuBook, MdMenuOpen } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { BsStars } from "react-icons/bs";

const navItems = [
  { href: "/home", label: "Home", icon: <FaHome size={22} /> },
  { href: "/upcoming", label: "Schedule", icon: <FaCalendarAlt size={22} /> },
  { href: "/explore", label: "Explore", icon: <FaCompass size={22} /> },
  { href: "/manga", label: "Manga", icon: <FaBookOpen size={22} /> },
  { href: "/manhwa", label: "Manhwa", icon: <MdMenuBook size={22} /> },
  { href: "/light-novel", label: "Light Novel", icon: <GiBookshelf size={22} /> },
];

export default function BottomNav() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    navItems.findIndex(
      (it) => router.pathname === it.href || router.pathname.startsWith(it.href + "/")
    )
  );
  const controls = useAnimation();

  useEffect(() => {
    const idx = navItems.findIndex(
      (it) => router.pathname === it.href || router.pathname.startsWith(it.href + "/")
    );
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [router.pathname]);

  const handleNavClick = (index: number, href: string) => {
    setActiveIndex(index);
    controls.start({
      scale: [1, 1.15, 1],
      transition: { duration: 0.3, ease: "easeOut" },
    });
    setTimeout(() => router.push(href), 200);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.nav
            key="nav"
            initial={{ y: 160, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 160, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="md:hidden fixed bottom-6 inset-x-0 flex justify-center z-50"
          >
            <div className="relative w-[94%] sm:w-[86%] max-w-[480px] bg-neutral-900/80 backdrop-blur-[2px] border border-sky-500/10 rounded-3xl flex items-center justify-between px-4 py-3 shadow-[0_10px_50px_rgba(2,6,23,0.4)] overflow-visible">
              <div className="relative z-10 flex gap-1 items-center justify-between w-full">
                {navItems.map((item, index) => {
                  const isActive =
                    router.pathname === item.href || router.pathname.startsWith(item.href + "/");
                  return (
                    <motion.button
                      key={item.href}
                      aria-label={item.label}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleNavClick(index, item.href)}
                      className={`flex flex-col items-center justify-center gap-1 w-[56px] text-gray-400 hover:text-sky-300 ${
                        isActive ? "text-sky-300" : ""
                      }`}
                    >
                      <motion.span
                        initial={false}
                        animate={{ y: isActive ? -4 : 0, scale: isActive ? 1.12 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      >
                        {item.icon}
                      </motion.span>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.26 }}
                          className="text-[11px] font-medium text-sky-300"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.button
            key="toggle"
            aria-label="Open navigation"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-900/92 to-neutral-800/84 border border-sky-400/30 shadow-[0_8px_40px_rgba(56,189,248,0.18)] hover:scale-105 active:scale-95 transition-transform duration-200 backdrop-blur-[2px] overflow-hidden"
          >
            <MdMenuOpen
              size={28}
              className="text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]"
            />
            <BsStars className="absolute -top-1 right-1 text-sky-300/90" size={12} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
