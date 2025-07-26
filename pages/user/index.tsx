// pages/user/index.tsx
import dynamic from "next/dynamic";

function UserPageComponent() {
  const { data: session, status } = require("next-auth/react").useSession();
  const { signOut } = require("next-auth/react");
  const { useRouter } = require("next/router");
  const { useEffect } = require("react");
  const { motion } = require("framer-motion");

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-lg">
        Loading...
      </div>
    );
  }

  const userInitial = session?.user?.name?.charAt(0) || "U";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white p-6">
      <motion.div
        className="max-w-4xl mx-auto mt-10 space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card Profil */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold uppercase shadow-lg">
            {userInitial}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
            <p className="text-gray-400 text-sm">{session?.user?.email}</p>
          </div>
          <motion.button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition"
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// Disable SSR untuk halaman ini agar tidak error di build
export default dynamic(() => Promise.resolve(UserPageComponent), { ssr: false });
