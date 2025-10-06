"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useAnimation, Variants } from "framer-motion";
import { FaHome, FaCalendarAlt, FaCompass, FaBookOpen } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { MdMenuBook, MdMenuOpen } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { BsStars } from "react-icons/bs";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { href: "/home", label: "Home", icon: <FaHome size={22} /> },
  { href: "/upcoming", label: "Schedule", icon: <FaCalendarAlt size={22} /> },
  { href: "/explore", label: "Explore", icon: <FaCompass size={22} /> },
  { href: "/manga", label: "Manga", icon: <FaBookOpen size={22} /> },
  { href: "/manhwa", label: "Manhwa", icon: <MdMenuBook size={22} /> },
  { href: "/light-novel", label: "Light Novel", icon: <GiBookshelf size={22} /> },
];

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function useWindowSize() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    function onResize() {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

export default function BottomNavPro() {
  const router = useRouter();
  const size = useWindowSize();
  const navRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const idx = navItems.findIndex(
      (it) => router.pathname === it.href || router.pathname.startsWith(it.href + "/")
    );
    return idx >= 0 ? idx : 0;
  });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; s: number }[]>([]);
  const rippleCounter = useRef(0);
  const controls = useAnimation();
  const highlightControls = useAnimation();
  const openControls = useAnimation();
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef<number | null>(null);
  const particleSeed = useMemo(() => Math.random(), []);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const fabRef = useRef<HTMLButtonElement | null>(null);
  const initialFocusRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const idx = navItems.findIndex(
      (it) => router.pathname === it.href || router.pathname.startsWith(it.href + "/")
    );
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [router.pathname]);

  useEffect(() => {
    openControls.start(open ? "open" : "closed");
  }, [open, openControls]);

  function computeHighlight(index: number) {
    if (!navRef.current) return { x: 0, w: 36 };
    const container = navRef.current;
    const items = Array.from(container.querySelectorAll("[data-nav-item]")) as HTMLElement[];
    if (!items || items.length === 0) return { x: 0, w: 36 };
    const item = items[index];
    if (!item) return { x: 0, w: 36 };
    const cRect = container.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();
    const center = iRect.left - cRect.left + iRect.width / 2;
    const width = clamp(Math.round(iRect.width * 0.62), 28, 70);
    const x = clamp(Math.round(center - width / 2), 6, Math.max(6, cRect.width - width - 6));
    return { x, w: width };
  }

  function handleRipple(e: React.MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = Math.max(rect.width, rect.height) * 1.6;
    const id = rippleCounter.current++;
    setRipples((s0) => [...s0, { id, x, y, s }]);
    setTimeout(() => {
      setRipples((s0) => s0.filter((r) => r.id !== id));
    }, 700);
  }

  async function onNavClick(i: number, href: string, e: React.MouseEvent) {
    handleRipple(e);
    setActiveIndex(i);
    await controls.start({
      scale: [1, 1.12, 1],
      rotate: [0, -6, 0],
      transition: { duration: 0.44, ease: "easeOut" },
    });
    const { x, w } = computeHighlight(i);
    highlightControls.start({ x, width: w, opacity: 1, transition: { type: "spring", stiffness: 420, damping: 30 } });
    setTimeout(() => router.push(href), 190);
  }

  function onPointerDown(e: React.PointerEvent) {
    dragStart.current = e.clientX;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragStart.current === null || !navRef.current) return;
    const dx = e.clientX - dragStart.current;
    const damped = clamp(dx / 12, -12, 12);
    setDragOffset(damped);
    const items = Array.from(navRef.current.querySelectorAll("[data-nav-item]")) as HTMLElement[];
    items.forEach((c, idx) => {
      const n = c as HTMLElement;
      const offset = clamp((damped / 2) * (idx - (items.length - 1) / 2), -10, 10);
      n.style.transform = `translateY(0px) translateX(${offset}px)`;
    });
  }

  function onPointerUp() {
    dragStart.current = null;
    setDragOffset(0);
    if (!navRef.current) return;
    const items = Array.from(navRef.current.querySelectorAll("[data-nav-item]")) as HTMLElement[];
    items.forEach((c) => {
      const n = c as HTMLElement;
      n.style.transform = "";
    });
  }

  const navVariant: Variants = {
    open: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 220, damping: 22 } },
    closed: { y: 48, opacity: 0, scale: 0.98, transition: { duration: 0.28 } },
  };

  const overlayVariant: Variants = {
    visible: { opacity: 1, transition: { duration: 0.28 } },
    hidden: { opacity: 0, transition: { duration: 0.28 } },
  };

  const fabVariant: Variants = {
    closed: { scale: 1, rotate: 0 },
    open: { scale: 1.04, rotate: 10, transition: { duration: 0.6 } },
  };

  const glowGradient = "linear-gradient(90deg,#38bdf8,#0ea5e9,#60a5fa)";

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "m" && (e.ctrlKey || e.metaKey)) setOpen((s) => !s);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onResize() {
      const idx = activeIndex ?? 0;
      const { x, w } = computeHighlight(idx);
      highlightControls.set({ x, width: w });
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, highlightControls, size.w]);

  useEffect(() => {
    const init = activeIndex ?? 0;
    const { x, w } = computeHighlight(init);
    highlightControls.set({ x, width: w, opacity: 1 });
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => initialFocusRef.current?.focus(), 180);
    } else {
      fabRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              ref={overlayRef}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariant}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={navVariant}
              className="fixed inset-x-0 bottom-6 md:hidden flex justify-center z-50"
              style={{ pointerEvents: "auto" }}
            >
              <motion.div
                ref={navRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="relative w-[94%] sm:w-[86%] max-w-[520px] bg-gradient-to-b from-neutral-900/86 to-neutral-900/72 rounded-[28px] px-4 py-3 flex items-center justify-between shadow-[0_16px_70px_rgba(0,0,0,0.6)] border border-white/6 overflow-visible"
                style={{
                  backdropFilter: "saturate(120%) blur(10px)",
                  WebkitBackdropFilter: "saturate(120%) blur(10px)",
                }}
                role="navigation"
                aria-label="Bottom navigation"
              >
                <motion.div
                  className="absolute inset-0 rounded-[28px] pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    background:
                      "radial-gradient(40% 40% at 20% 20%, rgba(56,189,248,0.03), transparent 18%), radial-gradient(30% 30% at 80% 80%, rgba(99,102,241,0.02), transparent 26%)",
                    filter: "blur(16px)",
                  }}
                />
                <motion.div
                  className="absolute -left-6 -top-6 w-[120px] h-[120px] rounded-full pointer-events-none"
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: "radial-gradient(circle, rgba(56,189,248,0.03), transparent 50%)",
                    filter: "blur(20px)",
                  }}
                />
                <motion.div
                  ref={highlightRef}
                  className="absolute bottom-4 left-0 h-[3px] rounded-full z-40"
                  initial={false}
                  animate={highlightControls}
                  style={{
                    background: glowGradient,
                    boxShadow: "0 0 18px rgba(56,189,248,0.45)",
                  }}
                />
                <motion.div
                  className="relative z-50 flex items-center gap-2 justify-between w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.08, duration: 0.45 }}
                >
                  {navItems.map((item, i) => {
                    const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + "/") || activeIndex === i;
                    const key = `nav-${i}`;
                    return (
                      <div
                        key={key}
                        data-nav-item
                        className="relative flex flex-col items-center justify-center w-[56px]"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            const fakeEvent = { clientX: (e as any).clientX || window.innerWidth / 2, clientY: (e as any).clientY || 0 } as unknown as React.MouseEvent;
                            onNavClick(i, item.href, fakeEvent);
                          }
                        }}
                      >
                        <motion.button
                          ref={i === 0 ? initialFocusRef : null}
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={(e) => onNavClick(i, item.href, e)}
                          className={`relative z-50 w-full flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors duration-200 ${isActive ? "text-sky-400" : "text-gray-400 hover:text-sky-300"}`}
                          aria-current={isActive ? "page" : undefined}
                          aria-label={item.label}
                          style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                          {ripples.map((r) => (
                            <motion.span
                              key={r.id}
                              className="absolute rounded-full"
                              style={{
                                left: r.x,
                                top: r.y,
                                width: r.s,
                                height: r.s,
                                transform: "translate(-50%, -50%)",
                                background: "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.45), rgba(56,189,248,0.12))",
                                zIndex: 10,
                                pointerEvents: "none",
                              }}
                              initial={{ scale: 0, opacity: 0.6 }}
                              animate={{ scale: 1, opacity: 0 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          ))}
                          <motion.span
                            initial={false}
                            animate={{
                              y: isActive ? -8 : 0,
                              scale: isActive ? 1.14 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 340, damping: 26 }}
                            className="relative z-60"
                          >
                            {item.icon}
                          </motion.span>
                          <AnimatePresence>
                            {isActive && (
                              <motion.span
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.26 }}
                                className="text-[11px] font-medium text-sky-300 z-60"
                              >
                                {item.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    );
                  })}
                </motion.div>
                <motion.div
                  className="absolute right-3 top-[-34px] z-60"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  <motion.button
                    onClick={() => setOpen(false)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-neutral-900/96 border border-sky-500/18 text-sky-300 shadow-[0_8px_30px_rgba(56,189,248,0.12)]"
                    aria-label="Close navigation"
                    ref={fabRef}
                  >
                    <IoClose size={16} />
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-60 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-neutral-900/94 to-neutral-800/84 border border-sky-400/20 shadow-[0_18px_60px_rgba(56,189,248,0.14)] backdrop-blur-xl"
            aria-label="Open navigation"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -6, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <MdMenuOpen size={28} className="text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{ opacity: [0.16, 0.34, 0.16], scale: [1, 1.06, 1] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.06), transparent 60%)",
                filter: "blur(10px)",
              }}
            />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.6, repeat: Infinity }}
            >
              <BsStars size={12} className="text-sky-300/90" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((s) => !s)}
        aria-label="Toggle navigation"
        className="fixed bottom-[115px] right-5 z-60 hidden md:flex items-center justify-center w-11 h-11 rounded-xl bg-neutral-900/92 border border-sky-500/12 text-sky-300 shadow-[0_8px_30px_rgba(56,189,248,0.12)] backdrop-blur-md"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <AnimatePresence>
          {open ? (
            <motion.div
              key="close-ico"
              initial={{ opacity: 0, rotate: -30, scale: 0.86 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.86 }}
              transition={{ duration: 0.36 }}
            >
              <IoClose size={18} />
            </motion.div>
          ) : (
            <motion.div
              key="open-ico"
              initial={{ opacity: 0, rotate: -30, scale: 0.86 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.86 }}
              transition={{ duration: 0.36 }}
            >
              <MdMenuOpen size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      <div aria-hidden className="pointer-events-none">
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
      <style jsx>{`
        .z-60 {
          z-index: 60;
        }
        .rounded-[28px] {
          border-radius: 28px;
        }
        @media (max-width: 420px) {
          .w-[94%] {
            width: 96% !important;
          }
          .w-[56px] {
            width: 48px !important;
          }
        }
      `}</style>
    </>
  );
}
