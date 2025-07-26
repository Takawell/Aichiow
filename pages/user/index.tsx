import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function UserPage() {
  const { data: session, status } = useSession();
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

        {/* Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Bookmark" value="12" color="bg-indigo-500" />
          <StatCard label="Riwayat" value="5" color="bg-green-500" />
          <StatCard label="Badge" value="3" color="bg-yellow-500" />
        </div>

        {/* Daftar Bookmark */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Bookmark Saya</h2>
          <div className="space-y-3">
            {["Attack on Titan", "One Piece", "Jujutsu Kaisen"].map((title, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <p>{title}</p>
                <Link href={`/anime/${title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <span className="text-indigo-400 hover:underline cursor-pointer">
                    Lihat
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Profil */}
        <motion.div
          className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <p className="mb-3 text-gray-300">
            Ingin mengubah nama atau email Anda?
          </p>
          <motion.button
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold"
            whileTap={{ scale: 0.95 }}
          >
            Edit Profil (Coming Soon)
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Komponen Kartu Statistik
function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <motion.div
      className={`p-6 rounded-xl text-center font-bold text-white shadow-md ${color}`}
      whileHover={{ scale: 1.05 }}
    >
      <p className="text-3xl">{value}</p>
      <p className="text-sm mt-2">{label}</p>
    </motion.div>
  );
}
