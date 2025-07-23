import React from "react";
import dynamic from "next/dynamic";
import ChatBox from "@/components/Aichixia/ChatBox";

const ModelViewer = dynamic(() => import("@/components/Aichixia/ModelViewer"), { ssr: false });

export default function AichixiaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">🤖 AichixiA</h1>
        <p className="text-center text-gray-400">Asisten AI yang bisa jawab anime & manhwa.</p>
        <ModelViewer />
        <ChatBox />
      </div>
    </main>
  );
}
