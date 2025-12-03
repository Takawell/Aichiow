import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { getHiAnimeWatch } from "@/lib/consumet";
import { Loader2, AlertCircle } from "lucide-react";

export default function WatchPage() {
  const router = useRouter();
  const { episodeId } = router.query;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["watch", episodeId],
    queryFn: () => getHiAnimeWatch(episodeId as string),
    enabled: !!episodeId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (isError || !data || !data.sources.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white px-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Episode Not Found</h1>
        <p className="text-neutral-400 text-center">
          Unable to load streaming sources for this episode
        </p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const source = data.sources.find(s => s.quality === "1080p") || data.sources[0];

  return (
    <>
      <Head>
        <title>Watch Episode | Aichiow</title>
      </Head>
      <main className="min-h-screen bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <video
              src={source.url}
              controls
              autoPlay
              className="w-full h-full"
              controlsList="nodownload"
            />
          </div>

          <div className="mt-4 flex gap-2 flex-wrap">
            {data.sources.map((s, i) => (
              <button
                key={i}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-blue-500 transition text-sm"
              >
                {s.quality}
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
