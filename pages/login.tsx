// pages/login.tsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { saveUserData, getUserData } from "@/lib/userStorage";

export default function LoginPage() {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const user = getUserData();
    if (user?.isLoggedIn) {
      router.replace("/profile");
    }
  }, []);

  const handleLogin = () => {
    saveUserData({
      isLoggedIn: true,
      avatar: avatarPreview ?? "", // default kosong
    });
    router.push("/profile");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Login to Aichiow</h1>

        <div className="flex justify-center mb-4">
          <label className="cursor-pointer relative">
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mx-auto hover:scale-105 transition">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                  Upload
                </div>
              )}
            </div>
          </label>
        </div>

        <input
          type="email"
          placeholder="Email (abaikan validasi)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Password (juga abaikan)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Login Instantly
        </button>
      </div>
    </div>
  );
}
