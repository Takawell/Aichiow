import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import Image from "next/image";

type ProfileData = {
  username: string;
  email: string;
  avatar_url: string;
  bio: string;
  level: number;
  xp: number;
  watch_time: number;
  read_time: number;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<ProfileData>>({});
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setForm(data);
        setAvatarPreview(data.avatar_url);
      }
    };

    getProfile();
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (!error && data) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${data.path}`;
      setForm(prev => ({ ...prev, avatar_url: url }));
    }
  };

  const saveChanges = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update(form)
      .eq("id", user.id);

    setEditing(false);
    setProfile({ ...(profile as ProfileData), ...form });
  };

  if (!profile) {
    return <div className="text-center text-white mt-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <div className="bg-[#121212] border border-[#2a2a2a] p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28">
            <Image
              src={avatarPreview || "/default-avatar.png"}
              alt="Avatar"
              className="rounded-full border-4 border-blue-600 object-cover"
              fill
            />
            {editing && (
              <input
                type="file"
                accept="image/*"
                className="absolute bottom-0 left-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handleAvatarChange}
              />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <p className="text-sm text-gray-400">{profile.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {editing ? (
            <>
              <Input
                placeholder="Username"
                value={form.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
              <Textarea
                placeholder="Bio"
                value={form.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
              />
            </>
          ) : (
            <>
              <p className="text-gray-300"><span className="font-semibold">Bio:</span> {profile.bio || "No bio yet."}</p>
            </>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-[#1e1e1e] rounded-lg p-4">
            <p className="text-sm text-gray-400">Level</p>
            <p className="text-xl font-bold text-blue-400">{profile.level}</p>
          </div>
          <div className="bg-[#1e1e1e] rounded-lg p-4">
            <p className="text-sm text-gray-400">XP</p>
            <p className="text-xl font-bold text-yellow-400">{profile.xp}</p>
          </div>
          <div className="bg-[#1e1e1e] rounded-lg p-4">
            <p className="text-sm text-gray-400">Watch Time</p>
            <p className="text-xl font-bold text-green-400">{profile.watch_time} min</p>
          </div>
          <div className="bg-[#1e1e1e] rounded-lg p-4">
            <p className="text-sm text-gray-400">Read Time</p>
            <p className="text-xl font-bold text-pink-400">{profile.read_time} min</p>
          </div>
        </div>

        {/* Badge Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              🚀 Early Adopter
            </span>
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              🎖️ Pro Watcher
            </span>
            <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              📚 Manga Reader
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          {editing ? (
            <>
              <Button onClick={() => setEditing(false)} className="bg-gray-600 hover:bg-gray-700">
                Cancel
              </Button>
              <Button onClick={saveChanges}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>
    </div>
  );
}
