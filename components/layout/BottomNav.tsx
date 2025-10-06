"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function BottomNav() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  useEffect(() => {
    const idx = navItems.findIndex(
      (it) => router.pathname === it.href || router.pathname.startsWith(it.href + "/")
    );
    setActiveIndex(idx >= 0 ? idx : null);
  }, [router.pathname]);

  const handleNavClick = async (index: number, href: string, e: React.MouseEvent) => {
    setActiveIndex(index);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    await controls.start({
      scale: [1, 1.18, 1],
      transition: { duration: 0.4, ease: "easeOut" },
    });
    setTimeout(() => router.push(href), 200);
  };

  const computeHighlightX = (index: number | null) => {
    if (!navRef.current || index === null || index < 0) return 0;
    const container = navRef.current;
    const items = Array.from(container.querySelectorAll("[data-nav-item]")) as HTMLElement[];
    const item = items[index];
    if (!item) return 0;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const x = itemRect.left - containerRect.left + itemRect.width / 2 - 20;
    return clamp(Math.round(x), 0, containerRect.width);
  };

  const FloatingGlow = () => (
    <motion.div
      aria-hidden
      className="absolute inset-[-25%] pointer-events-none rounded-3xl"
      animate={{
        opacity: [0.15, 0.35, 0.15],
        scale: [1, 1.05, 1],
        rotate: [0, 2, 0],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background:
          "radial-gradient(40% 50% at 25% 25%, rgba(56,189,248,0.08), transparent 60%), radial-gradient(30% 40% at 70% 70%, rgba(147,197,253,0.06), transparent 80%)",
        filter: "blur(24px)",
      }}
    />
  );

  const Sparks = () => {
    const sparks = Array.from({ length: 8 });
    return (
      <div className="absolute inset-0 pointer-events-none">
        {sparks.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[6px] h-[6px] rounded-full bg-sky-400/70"
            style={{
              left: `${10 + i * 12}%`,
              top: `${Math.random() * 80}%`,
              filter: "blur(1px)",
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="close"
              aria-label="Close navigation"
              initial={{ opacity: 0, scale: 0.7, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 25 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={() => setOpen(false)}
              className="fixed bottom-[115px] right-5 z-[60] w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-900/95 border border-sky-500/30 hover:bg-neutral-800/90 text-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.35)] backdrop-blur-xl transition-all duration-300"
            >
              <IoClose size={20} />
            </motion.button>

            <motion.div
              key="nav"
              initial={{ opacity: 0, scale: 0.85, y: 120 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 120 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="fixed md:hidden bottom-6 inset-x-0 flex justify-center z-50"
            >
              <motion.div
                ref={navRef}
                className="relative w-[92%] sm:w-[86%] max-w-[480px] bg-gradient-to-b from-neutral-900/80 to-neutral-900/70 border border-sky-500/15 backdrop-blur-2xl rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.6)] flex justify-between items-center py-3 px-4 overflow-visible"
              >
                <FloatingGlow />
                <Sparks />

                <motion.div
                  layoutId="highlight"
                  className="absolute bottom-4 left-0 h-[3px] rounded-full shadow-[0_0_14px_rgba(56,189,248,0.6)]"
                  initial={false}
                  animate={{
                    x: computeHighlightX(activeIndex),
                    width: 40,
                    opacity: activeIndex === null ? 0 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  style={{
                    background: "linear-gradient(90deg,#38bdf8,#0ea5e9,#38bdf8)",
                  }}
                />

                <div className="relative z-10 flex justify-between w-full items-center">
                  {navItems.map((item, index) => {
                    const isActive =
                      router.pathname === item.href ||
                      router.pathname.startsWith(item.href + "/");

                    return (
                      <div
                        key={item.href}
                        data-nav-item
                        className="relative flex flex-col items-center justify-center w-[56px]"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleNavClick(index, item.href, e)}
                          className={`relative flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors duration-200 ${
                            isActive ? "text-sky-400" : "text-gray-400 hover:text-sky-300"
                          }`}
                        >
                          {ripples.map((r) => (
                            <motion.span
                              key={r.id}
                              className="absolute bg-sky-400/40 rounded-full"
                              style={{
                                left: r.x,
                                top: r.y,
                                width: 4,
                                height: 4,
                                transform: "translate(-50%, -50%)",
                              }}
                              animate={{
                                scale: [0, 20],
                                opacity: [0.6, 0],
                              }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          ))}
                          <motion.span
                            animate={{
                              y: isActive ? -6 : 0,
                              scale: isActive ? 1.15 : 1,
                              opacity: 1,
                            }}
                            transition={{ type: "spring", stiffness: 320, damping: 26 }}
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
                                className="text-[11px] font-medium text-sky-400"
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
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.button
            key="open"
            initial={{ scale: 0, opacity: 0, rotate: -120 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 120 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900/95 to-neutral-800/80 border border-sky-400/30 shadow-[0_8px_40px_rgba(56,189,248,0.3)] hover:scale-105 active:scale-95 transition-transform duration-200 backdrop-blur-xl"
          >
            <motion.div
              animate={{
                rotate: [0, 12, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-sky-400"
            >
              <MdMenuOpen size={28} />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.12), transparent 60%)",
                filter: "blur(12px)",
              }}
            />
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                y: [0, -3, 0],
              }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute -top-1 right-2 text-sky-300/90"
            >
              <BsStars size={12} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
