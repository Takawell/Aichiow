"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

export default function UserDashboard() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/register");
    if (status === "authenticated") fetchUser();
  }, [status]);

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

  if (status === "loading") return <div className="text-center py-10 text-white">Loading session...</div>;
  if (!user) return <div className="text-center py-10 text-white">Loading user data...</div>;

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
    </div>
  );
}

// FIX: Hindari SSG di Vercel
export async function getServerSideProps() {
  return { props: {} };
}
