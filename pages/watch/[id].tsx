"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Hls from "hls.js";

interface Source {
  url: string;
  quality: string;
  isM3U8: boolean;
}

interface Subtitle {
  url: string;
  lang: string;
}

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchStream = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/zoro/watch/${episodeId}`
        );
        const data = await res.json();

        setSources(data.sources || []);
        setSubtitles(data.subtitles || []);
      } catch (err) {
        console.error("Failed to fetch stream:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [id]);

  useEffect(() => {
    if (!sources.length || !videoRef.current) return;

    const video = videoRef.current;
    const source = sources[0];

    if (source.isM3U8 && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source.url);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else {
      video.src = source.url;
    }
  }, [sources]);

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading player...</p>;
  }

  if (!sources.length) {
    return <p className="text-center mt-10 text-red-500">Stream not found.</p>;
  }

  return (
    <div className="flex flex-col items-center p-4 bg-dark min-h-screen">
      <video
        ref={videoRef}
        controls
        className="w-full max-w-5xl rounded-2xl shadow-lg"
        poster="/default.png"
      >
        {subtitles.map((s, i) => (
          <track
            key={i}
            src={s.url}
            kind="subtitles"
            label={s.lang}
            default={i === 0}
          />
        ))}
      </video>
    </div>
  );
}
