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
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[70] flex items-center justify-center
        w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-600
        border border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.6)]
        hover:scale-105 transition-transform backdrop-blur-lg overflow-hidden"
      >
        {open ? (
          <IoClose size={26} className="text-white" />
        ) : (
          <Image
            src="/logo.png"
            alt="Aichiow"
            width={34}
            height={34}
            className="object-contain rounded-full"
          />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="nav"
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="fixed bottom-[85px] left-1/2 -translate-x-1/2
            w-[88%] max-w-[420px] bg-neutral-900/85 backdrop-blur-2xl
            border border-sky-700/30 rounded-3xl flex justify-around items-center
            py-3 px-3 z-[60] shadow-[0_8px_30px_rgba(0,0,0,0.5)]
            ring-1 ring-sky-500/10"
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
                      scale: isActive ? 1.15 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-sky-500/20 shadow-[0_0_14px_rgba(56,189,248,0.6)] text-sky-400"
                        : "text-gray-400 hover:bg-white/5 hover:text-sky-300"
                    }`}
                  >
                    {item.icon}
                  </motion.div>

                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] font-medium mt-1 text-sky-400"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
