// components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      router.push("/auth/verify");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1a1a] p-6 rounded-xl shadow-lg border border-[#2d2d2d]">
      <div className="flex flex-col space-y-2">
        <label htmlFor="username" className="text-sm text-gray-300">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={form.username}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md bg-[#111] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-sm text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md bg-[#111] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="password" className="text-sm text-gray-300">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-md bg-[#111] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition flex items-center justify-center"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
      </button>
    </form>
  );
}
