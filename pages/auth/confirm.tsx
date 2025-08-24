"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ConfirmEmail() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const handleConfirm = async () => {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );

        if (error) {
          console.error("Error confirming email:", error);
          setStatus("error");
        } else {
          console.log("Session:", data);
          setStatus("success");
          setTimeout(() => router.push("/home"), 2000);
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    handleConfirm();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark via-gray-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl flex flex-col items-center space-y-4"
      >
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
            <p className="text-lg font-medium">Memverifikasi emailmu...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-400" />
            <p className="text-lg font-semibold">
              Email berhasil diverifikasi!
            </p>
            <p className="text-sm text-gray-300">
              Kamu akan dialihkan ke <span className="font-bold">Home</span> 🚀
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-400" />
            <p className="text-lg font-semibold">Verifikasi gagal</p>
            <p className="text-sm text-gray-300">
              Link sudah kadaluarsa atau tidak valid.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition"
            >
              Kembali ke Beranda
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
