// pages/profile.tsx
import { useEffect, useState } from "react";
import { getUserData, saveUserData, clearUserData } from "@/lib/userStorage";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const user = getUserData();
    if (!user?.isLoggedIn) {
      router.replace("/login");
    } else {
      setAvatar(user.avatar || null);
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAvatar(base64);
      saveUserData({ isLoggedIn: true, avatar: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    clearUserData();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Profile</h1>

        <div className="relative w-32 h-32 mx-auto mb-6">
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-500 shadow-lg hover:scale-105 transition">
              {avatar ? (
                <img src={avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                  Upload
                </div>
              )}
            </div>
          </label>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
