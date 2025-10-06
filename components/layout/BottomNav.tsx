"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaCalendarAlt, FaCompass, FaBookOpen } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { MdMenuBook } from "react-icons/md";
import { FaTimes } from "react-icons/fa";

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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!collapsed && (
          <motion.nav
            key="nav-expanded"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.35 }}
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

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCollapsed(true)}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300"
            >
              <FaTimes size={18} />
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {collapsed && (
          <motion.div
            key="nav-collapsed"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="fixed bottom-5 right-5 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCollapsed(false)}
              className="w-14 h-14 rounded-full bg-neutral-900 border border-gray-700
                backdrop-blur-md flex items-center justify-center shadow-lg overflow-hidden"
            >
              <Image
                src="/logo.png"
                alt="logo"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
