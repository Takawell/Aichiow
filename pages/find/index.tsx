import dynamic from "next/dynamic";
import Head from "next/head";
import { useTraceSearch } from "@/hooks/useTraceSearch";
import { useAnimeDetail } from "@/hooks/useAnimeDetail";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ImageUpload = dynamic(() => import("@/components/TraceSearch/ImageUpload"), {
  ssr: false,
});

export default function FindAnimePage() {
  const { result } = useTraceSearch();
  const { anime } = useAnimeDetail(result?.anilist || 0);

  return (
    <>
      <Head>
        <title>FIND ANIME | Aichiow</title>
        <meta name="description" content="Cari anime dari gambar menggunakan Trace.moe dan Anilist" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white py-16 px-4">
        {/* Hero */}
        <section className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            FIND ANIME
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-300 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Unggah gambar anime dan temukan judulnya secara instan dengan AI-powered Trace.moe.
          </motion.p>
        </section>

        {/* Upload Section */}
        <ImageUpload />

        {/* Hasil */}
        {result && anime && (
          <motion.section
            className="mt-10 w-full max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Hasil Pencarian</h2>
            <div className="flex items-start gap-4">
              <img
                src={anime.coverImage.large}
                alt={anime.title.romaji}
                className="w-32 h-44 object-cover rounded-md border border-white/10"
              />
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold">{anime.title.romaji}</p>
                <p className="text-gray-400 text-sm italic">Episode: {result.episode ?? "Tidak Diketahui"}</p>
                <p className="text-gray-400 text-sm">Similarity: {(result.similarity * 100).toFixed(2)}%</p>
                <Link
                  href={`/anime/${anime.id}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm text-blue-400 hover:underline"
                >
                  Lihat Detail Anime <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </>
  );
}
