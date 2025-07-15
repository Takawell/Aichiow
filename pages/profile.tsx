// pages/profile.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";
import Image from "next/image";
import { Loader2, PencilLine, Star, Trophy } from "lucide-react";
import { useRouter } from "next/router";
import clsx from "clsx";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatar_url: string;
  xp: number;
  level: number;
  watch_time: number;
  read_time: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <p>Profile not found.</p>
      </div>
    );
  }

  // Badge logic
  const getBadge = (xp: number) => {
    if (xp >= 2000) return "💎 Diamond";
    if (xp >= 1000) return "🌟 Platinum";
    if (xp >= 500) return "🥇 Gold";
    if (xp >= 250) return "🥈 Silver";
    return "🥉 Bronze";
  };

  const xpToNextLevel = (level: number) => level * 200;
  const currentLevelXP = xpToNextLevel(profile.level);
  const progress = Math.min((profile.xp / currentLevelXP) * 100, 100);

  return (
    <>
      <Head>
        <title>{profile.username} | Profile | Aichiow</title>
      </Head>
      <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-[#181818] border border-[#2c2c2c] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,153,255,0.15)] relative">

          {/* Edit */}
          <button className="absolute top-4 right-4 text-blue-500 hover:text-blue-300">
            <PencilLine size={20} />
          </button>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 rounded-full border-4 border-blue-500 shadow-[0_0_25px_rgba(0,153,255,0.4)] overflow-hidden">
              <Image
                src={profile.avatar_url || "/default-avatar.png"}
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* User Info */}
          <h2 className="text-center text-3xl font-bold text-blue-400">
            {profile.username}
          </h2>
          <p className="text-center text-gray-400 text-sm mb-2">{profile.email}</p>
          <p className="text-center text-gray-300 italic mb-4">{profile.bio || "No bio yet."}</p>

          {/* Badge */}
          <div className="text-center mb-4">
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
              Badge: {getBadge(profile.xp)}
            </span>
          </div>

          {/* XP Bar */}
          <div className="bg-[#2d2d2d] w-full h-4 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-400 mb-4">
            XP: {profile.xp} / {currentLevelXP}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
            <StatCard label="Level" value={profile.level} />
            <StatCard label="Watch Time" value={`${profile.watch_time} mins`} />
            <StatCard label="Read Time" value={`${profile.read_time} mins`} />
            <StatCard label="Total XP" value={profile.xp} />
          </div>

          {/* Achievements */}
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-blue-400">
            <Trophy size={20} />
            Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-center">
            {profile.level >= 10 && <Badge label="Lv.10 Achiever" />}
            {profile.watch_time > 100 && <Badge label="Early Watcher" />}
            {profile.read_time > 100 && <Badge label="Manga Master" />}
            {profile.xp > 500 && <Badge label="XP Hunter" />}
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#1f1f1f] p-4 rounded-lg border border-[#2d2d2d] shadow-sm">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-xl font-semibold text-blue-400">{value}</p>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-blue-600 px-4 py-2 rounded-lg shadow-md text-blue-300">
      <Star className="inline-block w-4 h-4 mr-1 text-yellow-400" />
      {label}
    </div>
  );
}
