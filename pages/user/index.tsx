"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  badge: string | null;
  level: number;
  exp: number;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [meRes, bookmarkRes, favoriteRes] = await Promise.all([
          axios.get("/api/user/me"),
          axios.get("/api/user/bookmark/index"),
          axios.get("/api/user/favorite/index"),
        ]);

        setUser(meRes.data);
        setName(meRes.data.name || "");
        setBookmarks(bookmarkRes.data || []);
        setFavorites(favoriteRes.data || []);
      } catch (err) {
        console.error("Failed to load user data:", err);
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const saveProfile = async () => {
    try {
      await axios.post("/api/user/update", { name });
      setIsEditing(false);
      const meRes = await axios.get("/api/user/me");
      setUser(meRes.data);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  if (loading) return <div className="text-center py-10 text-white">Loading user data...</div>;
  if (!user) return <div className="text-center py-10 text-red-500">User data not found.</div>;

  const avatarSrc = user.avatar || "/avatar.png";

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Profil Header */}
      <div className="flex items-center bg-gray-900 p-6 rounded-2xl shadow-lg">
        <Image
          src={avatarSrc}
          alt="Avatar"
          width={100}
          height={100}
          className="rounded-full border-4 border-blue-500"
        />
        <div className="ml-6 text-white">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-400">{user.email}</p>
          <div className="mt-2">
            {user.badge ? (
              <span className="px-3 py-1 bg-yellow-500 rounded-full text-sm font-semibold text-black">
                {user.badge}
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-600 rounded-full text-sm text-white">No Badge</span>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Edit Name
        </button>
      </div>

      {/* Level Progress */}
      <div className="bg-gray-800 mt-6 rounded-2xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold">Level Progress</h2>
        <div className="flex justify-between text-sm mt-1 text-gray-300">
          <span>Level {user.level || 1}</span>
          <span>{user.exp || 0} EXP</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full mt-2">
          <div
            className="h-3 bg-blue-500 rounded-full transition-all"
            style={{ width: `${(user.exp % 100) || 0}%` }}
          />
        </div>
      </div>

      {/* Bookmarks */}
      <div className="bg-gray-800 mt-6 rounded-2xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Bookmarks</h2>
        {bookmarks.length === 0 ? (
          <p className="text-gray-400 text-sm">Belum ada bookmark.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bookmarks.map((item, i) => (
              <div key={i} className="bg-gray-900 p-2 rounded-lg text-center">
                <Image
                  src={item.cover || "/placeholder.png"}
                  alt={item.title}
                  width={120}
                  height={160}
                  className="mx-auto rounded-lg"
                />
                <p className="mt-2 text-sm">{item.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorites */}
      <div className="bg-gray-800 mt-6 rounded-2xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-400 text-sm">Belum ada favorit.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favorites.map((item, i) => (
              <div key={i} className="bg-gray-900 p-2 rounded-lg text-center">
                <Image
                  src={item.cover || "/placeholder.png"}
                  alt={item.title}
                  width={120}
                  height={160}
                  className="mx-auto rounded-lg"
                />
                <p className="mt-2 text-sm">{item.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Name Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-xl font-bold text-white mb-4">Edit Name</h3>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
