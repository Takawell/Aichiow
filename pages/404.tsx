// pages/404.tsx
import Link from "next/link";
import { motion } from "framer-motion";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full flex flex-col items-center text-center">
        {/* Animated 404 Text */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-[100px] md:text-[140px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-purple-500 drop-shadow-lg select-none"
        >
          404
        </motion.h1>

        {/* Divider line with animation */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent my-6 w-full"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-lg md:text-xl text-gray-300"
        >
          The page you are looking for may have been moved, deleted, or may not have existed.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-10"
        >
          <Link href="/">
            <a className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md text-white text-lg font-semibold shadow-lg hover:shadow-blue-500/50 hover:scale-105 transform transition duration-300 ease-in-out">
              Back to Home
            </a>
          </Link>
        </motion.div>

        {/* Optional subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="mt-8 text-sm text-gray-500"
        >
          © {new Date().getFullYear()} AICHIOW TEAM. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}
