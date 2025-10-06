"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaCalendarAlt,
  FaCompass,
  FaBookOpen,
  FaRobot,
} from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { MdMenuBook } from "react-icons/md";
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

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="close"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              onClick={() => setOpen(false)}
              className="fixed bottom-[110px] right-6 z-[60]
              w-9 h-9 flex items-center justify-center
              rounded-full bg-neutral-900/90 border border-gray-700
              hover:bg-neutral-800/90 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.4)]
              backdrop-blur-lg transition-all duration-300"
            >
              <IoClose size={20} />
            </motion.button>

            <motion.nav
              key="nav"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="md:hidden fixed bottom-5 inset-x-0 flex justify-center z-50"
            >
              <div
                className="w-[92%] sm:w-[88%] max-w-[430px]
                bg-neutral-900/80 backdrop-blur-xl
                border border-gray-800 rounded-3xl
                flex justify-between items-center
                py-3 px-4 shadow-[0_4px_25px_rgba(0,0,0,0.5)]
                overflow-hidden"
              >
                {navItems.map((item) => {
                  const isActive =
                    router.pathname === item.href ||
                    router.pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex flex-col items-center relative"
                    >
                      <motion.div
                        animate={{
                          y: isActive ? -6 : 0,
                          color: isActive ? "#38bdf8" : "#9ca3af",
                          scale: isActive ? 1.2 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-sky-500/20 shadow-[0_0_14px_rgba(56,189,248,0.6)] text-sky-400"
                            : "hover:bg-white/5"
                        }`}
                      >
                        {item.icon}
                      </motion.div>

                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.25 }}
                            className="text-[11px] font-medium mt-1 text-sky-400"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
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
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center
              w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600
              border border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.6)]
              hover:scale-105 transition-transform backdrop-blur-lg overflow-hidden"
          >
            <FaRobot size={22} className="text-white drop-shadow-md" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
