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

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function BottomNav() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    navItems.findIndex((it) => router.pathname === it.href || router.pathname.startsWith(it.href + "/"))
  );
  const navRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const [pressing, setPressing] = useState(false);
  const [sparkSeed] = useState(() => Math.random());
  const startDrag = useRef<number | null>(null);

  useEffect(() => {
    const idx = navItems.findIndex(
      (it) => router.pathname === it.href || router.pathname.startsWith(it.href + "/")
    );
    setActiveIndex(idx >= 0 ? idx : null as unknown as number);
  }, [router.pathname]);

  const handleNavClick = (index: number, href: string) => {
    setActiveIndex(index);
    controls.start({
      scale: [1, 1.18, 1],
      rotate: [0, -4, 0],
      transition: { duration: 0.45, ease: "circOut" },
    });
    setPressing(true);
    setTimeout(() => setPressing(false), 260);
    setTimeout(() => router.push(href), 190);
  };

  const FloatingGlow = () => (
    <motion.div
      aria-hidden
      className="absolute inset-[-20%] pointer-events-none rounded-3xl"
      initial={{ opacity: 0.18, scale: 1 }}
      animate={{ opacity: [0.18, 0.45, 0.18], scale: [1, 1.06, 1], rotate: [0, 3, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background:
          "radial-gradient(60% 60% at 30% 30%, rgba(56,189,248,0.08), transparent 18%), radial-gradient(40% 40% at 75% 65%, rgba(99,102,241,0.04), transparent 25%)",
        filter: "blur(12px)",
      }}
    />
  );

  const startDragHandler = (e: React.PointerEvent) => {
    startDrag.current = e.clientX;
  };

  const endDragHandler = () => {
    startDrag.current = null;
    if (!navRef.current) return;
    Array.from(navRef.current.querySelectorAll("[data-nav-item]")).forEach((el) => {
      (el as HTMLElement).style.transform = "translateX(0px) translateY(0px)";
    });
  };

  const dragHandler = (e: React.PointerEvent) => {
    if (!navRef.current || startDrag.current === null) return;
    const dx = e.clientX - startDrag.current;
    Array.from(navRef.current.querySelectorAll("[data-nav-item]")).forEach((el, i) => {
      const offset = clamp((dx / 40) * (i - (navItems.length - 1) / 2), -8, 8);
      (el as HTMLElement).style.transform = `translateX(${offset}px) translateY(0px)`;
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
              className="fixed bottom-[112px] right-5 z-[60] w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-900/92 border border-sky-500/20 hover:bg-neutral-800/90 text-sky-300 shadow-[0_6px_24px_rgba(56,189,248,0.25)] backdrop-blur-md transition-all duration-220"
            >
              <IoClose size={18} />
            </motion.button>

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
                onPointerDown={startDragHandler}
                onPointerMove={dragHandler}
                onPointerUp={endDragHandler}
                onPointerCancel={endDragHandler}
                className="relative w-[94%] sm:w-[86%] max-w-[480px] bg-neutral-900/80 backdrop-blur-sm border border-sky-500/10 rounded-3xl overflow-visible flex items-center justify-between px-4 py-3 shadow-[0_10px_50px_rgba(2,6,23,0.6)]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <FloatingGlow />
                <Sparks count={6} />
                <div className="relative z-10 flex gap-1 items-center justify-between w-full">
                  {navItems.map((item, index) => {
                    const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + "/");
                    return (
                      <div key={item.href} data-nav-item className="relative flex-0 w-[56px] flex flex-col items-center justify-center">
                        <motion.button
                          aria-label={item.label}
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.96 }}
                          onPointerDown={() => controls.start({ scale: [1, 0.96, 1], transition: { duration: 0.24 } })}
                          onClick={() => handleNavClick(index, item.href)}
                          className={`relative z-20 w-full flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 transition-all duration-220 ${isActive ? "text-sky-300" : "text-gray-400 hover:text-sky-300"}`}
                        >
                          <motion.span
                            initial={false}
                            animate={{ y: isActive ? -6 : 0, scale: isActive ? 1.12 : 1 }}
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
                                transition={{ duration: 0.26 }}
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
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-900/92 to-neutral-800/84 border border-sky-400/30 shadow-[0_8px_40px_rgba(56,189,248,0.18)] hover:scale-105 active:scale-95 transition-transform duration-200 backdrop-blur-sm overflow-hidden"
          >
            <motion.div
              aria-hidden
              className="absolute inset-0"
              initial={{ opacity: 0.15 }}
              animate={{ opacity: [0.15, 0.32, 0.15], scale: [1, 1.08, 1] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.06), rgba(99,102,241,0.04))" }}
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
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BsStars size={12} className="text-sky-300/90" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
