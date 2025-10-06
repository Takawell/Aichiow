"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  FaHome,
  FaCalendarAlt,
  FaCompass,
  FaBookOpen,
} from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { MdMenuBook, MdMenu } from "react-icons/md";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const controls = useAnimation();

  const handleNavClick = (index: number, href: string) => {
    setActiveIndex(index);
    controls.start({
      scale: [1, 1.3, 1],
      transition: { duration: 0.5, ease: "easeOut" },
    });
    setTimeout(() => router.push(href), 250);
  };

  const FloatingGlow = () => (
    <motion.div
      className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/10 via-transparent to-transparent blur-2xl"
      animate={{
        opacity: [0.4, 0.7, 0.4],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />
  );

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="close"
              initial={{ opacity: 0, rotate: -90, y: 30 }}
              animate={{ opacity: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, rotate: 90, y: 30 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={() => setOpen(false)}
              className="fixed bottom-[108px] right-6 z-[60]
              w-10 h-10 flex items-center justify-center
              rounded-xl bg-neutral-900/90 border border-sky-500/40
              hover:bg-neutral-800/90 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.6)]
              backdrop-blur-lg transition-all duration-300
              hover:scale-105 active:scale-95"
            >
              <IoClose size={20} />
            </motion.button>

            <motion.nav
              key="nav"
              initial={{ y: 120, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 120, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="md:hidden fixed bottom-5 inset-x-0 flex justify-center z-50"
            >
              <div
                className="relative w-[92%] sm:w-[88%] max-w-[430px]
                bg-neutral-900/70 backdrop-blur-2xl
                border border-sky-500/20 rounded-2xl overflow-hidden
                flex justify-between items-center
                py-3 px-5 shadow-[0_4px_40px_rgba(56,189,248,0.15)]"
              >
                <FloatingGlow />

                <motion.div
                  layoutId="highlight"
                  className="absolute bottom-0 h-[3px] bg-gradient-to-r from-sky-400 to-blue-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                  initial={false}
                  animate={{
                    x: activeIndex !== null ? activeIndex * 65 : 0,
                    width: 50,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />

                {navItems.map((item, index) => {
                  const isActive =
                    router.pathname === item.href ||
                    router.pathname.startsWith(item.href + "/");

                  return (
                    <motion.div
                      key={item.href}
                      className="relative flex flex-col items-center justify-center w-[55px]"
                    >
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        animate={controls}
                        onClick={() => handleNavClick(index, item.href)}
                        className={`flex flex-col items-center justify-center gap-1 
                          rounded-lg px-2 py-1 transition-all duration-300 relative 
                          ${
                            isActive
                              ? "text-sky-400"
                              : "text-gray-400 hover:text-sky-300"
                          }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="ripple"
                            className="absolute inset-0 bg-sky-500/15 rounded-xl blur-sm"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 0.5, 0.7],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}

                        <motion.div
                          animate={{
                            y: isActive ? -5 : 0,
                            scale: isActive ? 1.15 : 1,
                            color: isActive ? "#38bdf8" : "#9ca3af",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          className={`relative z-10 ${
                            isActive
                              ? "drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                              : ""
                          }`}
                        >
                          {item.icon}
                        </motion.div>

                        <AnimatePresence>
                          {isActive && (
                            <motion.span
                              key="label"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              transition={{ duration: 0.25 }}
                              className="text-[10.5px] font-medium text-sky-400 z-10"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      {isActive && (
                        <motion.div
                          layoutId="activeLine"
                          className="absolute -bottom-1 h-[3px] w-[50%] bg-sky-400/70 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.button
            key="toggle"
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              mass: 0.8,
            }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center
              w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-900/90 to-neutral-800/90
              border border-sky-400/60 shadow-[0_0_25px_rgba(56,189,248,0.4)]
              hover:shadow-[0_0_35px_rgba(56,189,248,0.6)] hover:scale-105
              active:scale-95 transition-all duration-300 backdrop-blur-xl overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 to-blue-500/20 blur-xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              initial={{ rotate: -15, opacity: 0.6 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10"
            >
              <MdMenu
                size={28}
                className="text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]"
              />
            </motion.div>

            <motion.div
              className="absolute -top-1 right-0 text-sky-300/90"
              animate={{
                y: [0, -3, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <BsStars size={12} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
