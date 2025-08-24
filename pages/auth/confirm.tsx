"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@/lib/supabaseClient"; // pastikan ada supabase client

export default function Confirm() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          console.error(error);
          setStatus("error");
          return;
        }
        setStatus("success");
        setTimeout(() => router.push("/"), 2000); // redirect ke home setelah sukses
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    confirmEmail();
  }, [supabase, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {status === "loading" && (
        <div className="text-xl animate-pulse">Verifying your email...</div>
      )}
      {status === "success" && (
        <div className="text-xl text-green-400 animate-bounce">
          ✅ Email verified! Redirecting...
        </div>
      )}
      {status === "error" && (
        <div className="text-xl text-red-400">
          ❌ Verification failed. Please try again.
        </div>
      )}
    </div>
  );
}
