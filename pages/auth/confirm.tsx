import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function Confirm() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const exchangeSession = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );

        if (error) {
          console.error("Exchange session error:", error);
          setStatus("error");
          return;
        }

        setStatus("success");

        // redirect otomatis setelah sukses
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    exchangeSession();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="text-center p-6 rounded-2xl shadow-lg bg-gray-950/60 backdrop-blur-lg w-[90%] max-w-md">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            <p className="text-lg font-medium">Verifying your email...</p>
            <p className="text-sm text-gray-400">
              Please wait while we confirm your account.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
            <p className="text-xl font-semibold">Email confirmed!</p>
            <p className="text-sm text-gray-400">
              Redirecting you to Aichiow...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="w-12 h-12 text-red-400" />
            <p className="text-xl font-semibold">Something went wrong</p>
            <p className="text-sm text-gray-400">
              Please try again or request a new confirmation link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
