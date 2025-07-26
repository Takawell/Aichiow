import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    else if (session?.user) fetchUser();
  }, [session, status]);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/user/me");
      setUser(res.data);
      setName(res.data.name || "");
    } catch (err) {
      console.error(err);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name);
      if (avatarFile) form.append("avatar", avatarFile);
      await axios.post("/api/user/avatar", form);
      setIsEditing(false);
      fetchUser();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center py-10">Loading...</div>;
  const avatarSrc = user.avatar || "/avatar.png";

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
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
              <span className="px-3 py-1 bg-gray-600 rounded-full text-sm text-white">
                No Badge
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Edit Profile
        </button>
      </div>

      {/* Level Widget */}
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

      {/* Bookmark & Favorite */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Bookmarks</h3>
          <p className="text-gray-400 text-sm mb-3">
            Lihat daftar anime/manga yang kamu bookmark.
          </p>
          <button
            onClick={() => router.push("/user/bookmarks")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Lihat Bookmark
          </button>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Favorites</h3>
          <p className="text-gray-400 text-sm mb-3">
            Lihat daftar anime/manga favoritmu.
          </p>
          <button
            onClick={() => router.push("/user/favorites")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Lihat Favorites
          </button>
        </div>
      </div>

      {/* Modal Edit */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-xl font-bold text-white mb-4">Edit Profile</h3>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
            />
            <label className="block text-gray-300 mb-2">Avatar</label>
            <input
              type="file"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
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
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
