"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaCalendarAlt,
  FaCompass,
  FaBookOpen,
} from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { MdMenuBook } from "react-icons/md";
import { IoClose, IoMenu } from "react-icons/io5";

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
          <motion.nav
            key="nav"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-lg
            bg-neutral-900/80 backdrop-blur-lg border border-gray-800 
            rounded-2xl flex justify-around items-center py-2.5 z-50 shadow-lg"
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
                      scale: isActive ? 1.15 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-sky-500/20 shadow-[0_0_12px_rgba(56,189,248,0.5)] text-sky-400"
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
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500
          ${open ? "rotate-0" : "rotate-180"}
        `}
      >
        <motion.div
          initial={false}
          animate={{
            scale: open ? 1 : [1, 1.2, 1],
            rotate: open ? 0 : 360,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl border
            ${open
              ? "bg-neutral-900/80 border-gray-800 hover:bg-neutral-800/90"
              : "bg-gradient-to-br from-sky-500 to-blue-600 border-sky-400 shadow-sky-500/40 hover:scale-105"
            } backdrop-blur-lg`}
        >
          {open ? (
            <IoClose className="text-sky-400 text-2xl" />
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative w-9 h-9"
            >
              <Image
                src="/logo.png"
                alt="Aichiow"
                fill
                className="object-contain rounded-full drop-shadow-lg"
              />
            </motion.div>
          )}
        </motion.div>
      </motion.button>
    </>
  );
}
