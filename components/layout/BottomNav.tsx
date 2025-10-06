"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FaHome, FaCalendarAlt, FaCompass, FaBookOpen } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { MdMenuBook, MdMenuOpen } from "react-icons/md";
import { IoClose } from "react-icons/io5";

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
  const navRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const idx = navItems.findIndex(
      (it) => router.pathname === it.href || router.pathname.startsWith(it.href + "/")
    );
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [router.pathname]);

  useEffect(() => {
    if (!navRef.current || activeIndex === null) return;
    const navItemsEls = Array.from(navRef.current.querySelectorAll<HTMLDivElement>("[data-nav-item]"));
    const current = navItemsEls[activeIndex];
    if (current && highlightRef.current) {
      const rect = current.getBoundingClientRect();
      const parentRect = navRef.current.getBoundingClientRect();
      const left = rect.left - parentRect.left;
      highlightRef.current.animate(
        [
          { transform: `translateX(${highlightRef.current.offsetLeft}px)` },
          { transform: `translateX(${left}px)` }
        ],
        { duration: 300, easing: "ease-in-out", fill: "forwards" }
      );
    }
  }, [activeIndex]);

  const handleNavClick = (index: number, href: string) => {
    setActiveIndex(index);
    controls.start({
      scale: [1, 1.18, 1],
      rotate: [0, -4, 0],
      transition: { duration: 0.45, ease: "circOut" },
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
            <div
              ref={navRef}
              className="relative w-[94%] sm:w-[86%] max-w-[480px] bg-neutral-900/90 backdrop-blur-md border border-sky-500/10 rounded-3xl flex items-center justify-between px-4 py-3 shadow-[0_10px_50px_rgba(2,6,23,0.6)] overflow-visible"
            >
              <div
                ref={highlightRef}
                className="absolute bottom-1 h-1 w-[56px] bg-sky-400 rounded-full transition-all duration-300"
                style={{ left: 0 }}
              />

              <div className="relative z-10 flex gap-1 items-center justify-between w-full">
                {navItems.map((item, index) => {
                  const isActive =
                    router.pathname === item.href || router.pathname.startsWith(item.href + "/");
                  return (
                    <div
                      key={item.href}
                      data-nav-item
                      className="relative flex-0 w-[56px] flex flex-col items-center justify-center"
                    >
                      <motion.button
                        aria-label={item.label}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleNavClick(index, item.href)}
                        className={`relative z-20 w-full flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 transition-all duration-220 ${
                          isActive ? "text-sky-300" : "text-gray-400 hover:text-sky-300"
                        }`}
                      >
                        <motion.span
                          initial={false}
                          animate={{ y: isActive ? -6 : 0, scale: isActive ? 1.15 : 1 }}
                          transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        >
                          {item.icon}
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
                          transition={{ duration: 0.26 }}
                          className="text-[11px] font-medium text-sky-300"
                        >
                          {item.label}
                        </motion.span>
                      </motion.button>
                    </div>
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
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-900/92 to-neutral-800/85 border border-sky-400/30 shadow-[0_8px_40px_rgba(56,189,248,0.2)] hover:scale-105 active:scale-95 transition-transform duration-200 backdrop-blur-sm overflow-hidden"
          >
            <MdMenuOpen size={28} className="text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
