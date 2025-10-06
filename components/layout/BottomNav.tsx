"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  FaHome,
  FaCalendarAlt,
  FaCompass,
  FaBookOpen,
} from "react-icons/fa";
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

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function BottomNav() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    navItems.findIndex((it) => router.pathname === it.href || router.pathname.startsWith(it.href + "/"))
  );
  const [pressing, setPressing] = useState(false);
  const controls = useAnimation();
  const navRef = useRef<HTMLDivElement | null>(null);
  const [sparkSeed] = useState(() => Math.random());

  useEffect(() => {
    const idx = navItems.findIndex(
      (it) => router.pathname === it.href || router.pathname.startsWith(it.href + "/")
    );
    setActiveIndex(idx >= 0 ? idx : null as unknown as number);
  }, [router.pathname]);

  const handleNavClick = (index: number, href: string) => {
    setActiveIndex(index);
    controls.start({
      scale: [1, 1.16, 1],
      rotate: [0, -3, 0],
      transition: { duration: 0.4, ease: "easeOut" },
    });
    setPressing(true);
    setTimeout(() => setPressing(false), 280);
    setTimeout(() => {
      router.push(href);
    }, 180);
  };

  const FloatingGlow = () => (
    <motion.div
      aria-hidden
      className="absolute inset-[-25%] pointer-events-none rounded-3xl"
      initial={{ opacity: 0.18, scale: 1 }}
      animate={{
        opacity: [0.18, 0.4, 0.18],
        scale: [1, 1.05, 1],
        rotate: [0, 4, 0],
      }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background:
          "radial-gradient(50% 50% at 30% 30%, rgba(56,189,248,0.08), transparent 25%), radial-gradient(60% 60% at 80% 70%, rgba(99,102,241,0.04), transparent 35%)",
        filter: "blur(18px)",
      }}
    />
  );

  const Sparks = ({ count = 6 }: { count?: number }) => {
    return (
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {Array.from({ length: count }).map((_, i) => {
          const seed = (sparkSeed * 999 + i * 33) % 1;
          const left = `${Math.floor(seed * 90) + 5}%`;
          const top = `${Math.floor((1 - seed) * 60) + 10}%`;
          const size = Math.floor(3 + seed * 8);
          const delay = (seed * 2.8).toFixed(2);
          return (
            <motion.div
              key={i}
              style={{
                left,
                top,
                width: size,
                height: size,
                borderRadius: 999,
                position: "absolute",
                background: "linear-gradient(90deg,#60a5fa,#38bdf8)",
                boxShadow: "0 0 8px rgba(56,189,248,0.7)",
              }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0.1, 0.9, 0.3], scale: [0.6, 1.15, 0.7] }}
              transition={{ duration: 3.2, delay: Number(delay), repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
      </div>
    );
  };

  const computeBubbleX = (index: number | null) => {
    if (!navRef.current || index === null || index === undefined || index < 0) return 0;
    const container = navRef.current;
    const children = Array.from(container.querySelectorAll("[data-nav-item]")) as HTMLElement[];
    const item = children[index];
    if (!item) return 0;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const x = itemRect.left - containerRect.left + itemRect.width / 2 - 25;
    return clamp(Math.round(x), 0, Math.max(0, containerRect.width - 50));
  };

  const startDrag = useRef<number | null>(null);
  const onDragStart = (e: React.PointerEvent) => {
    startDrag.current = e.clientX;
  };
  const onDragEnd = () => {
    startDrag.current = null;
  };
  const onDrag = (e: React.PointerEvent) => {
    if (!navRef.current || startDrag.current === null) return;
    const dx = e.clientX - startDrag.current;
    const children = navRef.current.querySelectorAll("[data-nav-item]");
    children.forEach((c, i) => {
      const n = c as HTMLElement;
      const offset = clamp((dx / 40) * (i - (children.length - 1) / 2), -6, 6);
      n.style.transform = `translateX(${offset}px)`;
    });
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="close"
              aria-label="Close navigation"
              initial={{ opacity: 0, y: 26, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 26, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={() => setOpen(false)}
              className="fixed bottom-[110px] right-5 z-[60] w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-900/90 border border-sky-500/20 hover:bg-neutral-800/90 text-sky-300 shadow-[0_6px_24px_rgba(56,189,248,0.25)] backdrop-blur-md transition-all duration-220"
            >
              <IoClose size={18} />
            </motion.button>

            <motion.nav
              key="nav"
              initial={{ y: 160, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 160, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="md:hidden fixed bottom-6 inset-x-0 flex justify-center z-50"
            >
              <div
                ref={navRef}
                onPointerDown={onDragStart}
                onPointerMove={onDrag}
                onPointerUp={onDragEnd}
                onPointerCancel={onDragEnd}
                className="relative w-[94%] sm:w-[86%] max-w-[480px] bg-gradient-to-b from-neutral-900/80 to-neutral-900/60 backdrop-blur-2xl border border-sky-500/14 rounded-3xl flex items-center justify-between px-4 py-3 shadow-[0_10px_40px_rgba(2,6,23,0.6)]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <FloatingGlow />
                <Sparks count={6} />
                <motion.div
                  aria-hidden
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    x: computeBubbleX(activeIndex),
                    scale: [1, 1.1, 1],
                    opacity: activeIndex === null ? 0 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                  }}
                  className="absolute -top-4 w-[50px] h-[50px] rounded-full bg-gradient-to-br from-sky-500/25 to-blue-400/25 blur-md shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                />
                <div className="relative z-10 flex gap-1 items-center justify-between w-full">
                  {navItems.map((item, index) => {
                    const isActive =
                      router.pathname === item.href ||
                      router.pathname.startsWith(item.href + "/");
                    return (
                      <div
                        key={item.href}
                        data-nav-item
                        className="relative flex-0 w-[56px] flex flex-col items-center justify-center"
                      >
                        <motion.button
                          aria-label={item.label}
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleNavClick(index, item.href)}
                          className={`relative z-20 w-full flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 transition-all duration-220 ${
                            isActive ? "text-sky-300" : "text-gray-400 hover:text-sky-300"
                          }`}
                        >
                          <motion.span
                            initial={false}
                            animate={{
                              y: isActive ? -8 : 0,
                              scale: isActive ? 1.14 : 1,
                              rotate: isActive ? 0 : 0,
                            }}
                            transition={{ type: "spring", stiffness: 320, damping: 26 }}
                            className="relative z-30"
                          >
                            {item.icon}
                          </motion.span>
                          <AnimatePresence>
                            {isActive && (
                              <motion.span
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.25 }}
                                className="text-[11px] font-medium text-sky-300 z-30"
                              >
                                {item.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.nav>
          </>
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
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-900/92 to-neutral-800/84 border border-sky-400/30 shadow-[0_8px_40px_rgba(56,189,248,0.18)] hover:scale-105 active:scale-95 transition-transform duration-200 backdrop-blur-md overflow-hidden"
          >
            <motion.div
              aria-hidden
              className="absolute inset-0"
              initial={{ opacity: 0.15 }}
              animate={{ opacity: [0.15, 0.32, 0.15], scale: [1, 1.08, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "linear-gradient(135deg, rgba(56,189,248,0.06), rgba(99,102,241,0.04))",
                filter: "blur(10px)",
              }}
            />
            <motion.div
              initial={{ rotate: -12, y: -2, opacity: 0.8 }}
              animate={{ rotate: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-20"
            >
              <MdMenuOpen size={28} className="text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
            </motion.div>
            <motion.div
              aria-hidden
              className="absolute -top-1 right-1 z-10"
              animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <BsStars size={12} className="text-sky-300/90" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
