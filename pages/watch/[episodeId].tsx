import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { getHiAnimeWatch } from "@/lib/consumet";
import { Loader2, AlertCircle, Play } from "lucide-react";
import { useState } from "react";

export default function WatchPage() {
  const router = useRouter();
  const { episodeId } = router.query;
  const [selectedQuality, setSelectedQuality] = useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["watch", episodeId],
    queryFn: () => getHiAnimeWatch(episodeId as string),
    enabled: !!episodeId,
  });

  // Auto-select best quality when data loads
  useState(() => {
    if (data?.sources && !selectedQuality) {
      const best = data.sources.find(s => s.quality === "1080p") || 
                   data.sources.find(s => s.quality === "720p") || 
                   data.sources[0];
      setSelectedQuality(best.quality);
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
        <p className="text-white">Loading video...</p>
      </div>
    );
  }

  if (isError || !data || !data.sources.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white px-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Episode Not Found</h1>
        <p className="text-neutral-400 text-center mb-1">
          Unable to load streaming sources for this episode
        </p>
        <p className="text-sm text-neutral-500 mb-6">
          Episode ID: {episodeId}
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentSource = data.sources.find(s => s.quality === selectedQuality) || data.sources[0];

  return (
    <>
      <Head>
        <title>Watch Episode | Aichiow</title>
      </Head>
      <main className="min-h-screen bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-6">
            <video
              key={currentSource.url}
              src={currentSource.url}
              controls
              autoPlay
              className="w-full h-full"
              controlsList="nodownload"
            />
          </div>

          {/* Quality Selector */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <h3 className="text-sm font-semibold text-neutral-400 mb-3">Quality</h3>
            <div className="flex gap-2 flex-wrap">
              {data.sources.map((source) => (
                <button
                  key={source.quality}
                  onClick={() => setSelectedQuality(source.quality)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedQuality === source.quality
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-neutral-300 hover:bg-white/20"
                  }`}
                >
                  {source.quality}
                </button>
              ))}
            </div>
          </div>

          {/* Episode Info (optional) */}
          <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <p className="text-sm text-neutral-400">Episode ID: {episodeId}</p>
          </div>
        </div>
      </main>
    </>
  );
}
