import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.email) {
      fetchUser();
    }
  }, [session, status]);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/user/me");
      setUser(res.data);
      setName(res.data.name || "");
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (selectedFile) formData.append("avatar", selectedFile);

      await axios.post("/api/user/update", formData);
      setIsEditing(false);
      fetchUser();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center p-10">Loading...</div>;

  const avatarSrc = user.avatar || "/avatar.png";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <Image
          src={avatarSrc}
          alt="Avatar"
          width={120}
          height={120}
          className="rounded-full border-4 border-blue-500"
        />
        <h2 className="mt-4 text-2xl font-bold text-white">{user.name || "No Name"}</h2>
        <p className="text-gray-400">{user.email}</p>

        {/* Badge */}
        {user.badge && (
          <div className="mt-2 px-4 py-1 bg-yellow-500 text-black rounded-full text-sm font-semibold">
            {user.badge}
          </div>
        )}

        {/* Level & EXP */}
        <div className="mt-4 w-full">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Level {user.level}</span>
            <span>{user.exp} EXP</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full mt-1">
            <div
              className="h-3 bg-blue-500 rounded-full"
              style={{ width: `${Math.min((user.exp % 100) || 0, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(true)}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Edit Profile
        </button>
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
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
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
                onClick={handleSave}
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
