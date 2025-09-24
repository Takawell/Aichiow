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

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: number;
  replies: Comment[];
  reactions: Record<string, number>;
}

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query; 

  const videoRef = useRef<HTMLVideoElement>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(true);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  // Fetch stream data
  useEffect(() => {
    if (!id) return;

    const fetchStream = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/zoro/watch/${id}`
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

  // Setup HLS
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

  // Add comment
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: crypto.randomUUID(),
      user: "Anonymous",
      text: commentText.trim(),
      timestamp: Date.now(),
      replies: [],
      reactions: {},
    };
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading player...</p>;
  }

  if (!sources.length) {
    return <p className="text-center mt-10 text-red-500">Stream not found.</p>;
  }

  return (
    <div className="bg-dark text-white min-h-screen p-4">
      {/* Video Player */}
      <div className="flex justify-center mb-6">
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

      {/* Video Info Placeholder */}
      <div className="max-w-5xl mx-auto p-4 bg-gray-800 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-2">Episode Info</h2>
        <p className="text-gray-300">
          Watching episode ID: <span className="text-white">{id}</span>
        </p>
        <p className="text-gray-400 mt-1">
          Sources: {sources.map((s) => s.quality).join(", ")}
        </p>
      </div>

      {/* Comment Section */}
      <div className="max-w-5xl mx-auto p-4 bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>

        {/* Add Comment */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Send
          </button>
        </div>

        {/* Comments List */}
        <div className="flex flex-col gap-3">
          {comments.length === 0 && (
            <p className="text-gray-400">No comments yet. Be the first!</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-400">
                {c.user} • {new Date(c.timestamp).toLocaleString()}
              </p>
              <p className="text-white mt-1">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
