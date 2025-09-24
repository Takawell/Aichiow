"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useRouter } from "next/router";
import Hls from "hls.js";
import { v4 as uuidv4 } from "uuid";

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
  replies?: Comment[];
  reactions?: Record<string, number>;
}

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query; 

  const videoRef = useRef<HTMLVideoElement>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  // fetch stream
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

  // setup HLS / normal video
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

  // handle new comment
  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: uuidv4(),
      user: "Anonymous",
      text: commentText.trim(),
      timestamp: Date.now(),
      replies: [],
      reactions: {},
    };
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  // handle reaction
  const addReaction = (commentId: string, emoji: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const newReactions = { ...c.reactions };
          newReactions[emoji] = (newReactions[emoji] || 0) + 1;
          return { ...c, reactions: newReactions };
        }
        return c;
      })
    );
  };

  if (loading) return <p className="text-center mt-10 text-white">Loading player...</p>;
  if (!sources.length) return <p className="text-center mt-10 text-red-500">Stream not found.</p>;

  return (
    <div className="bg-dark min-h-screen text-white flex flex-col items-center px-4 py-6">
      {/* Video Player */}
      <div className="w-full max-w-5xl mb-6">
        <video
          ref={videoRef}
          controls
          className="w-full rounded-2xl shadow-lg"
          poster="/default.png"
        >
          {subtitles.map((s, i) => (
            <track key={i} src={s.url} kind="subtitles" label={s.lang} default={i === 0} />
          ))}
        </video>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-6">
        <span>Rate this episode:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl ${rating && rating >= star ? "text-yellow-400" : "text-gray-500"}`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Comments Section */}
      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            Send
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {comments.length === 0 && <p className="text-gray-400">No comments yet.</p>}
          {comments.map((c) => (
            <div key={c.id} className="bg-gray-900 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{c.user}</span>
                <span className="text-gray-400 text-sm">
                  {new Date(c.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mb-2">{c.text}</p>
              <div className="flex gap-2 text-sm">
                {["❤️", "😂", "👍"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(c.id, emoji)}
                    className="hover:scale-110 transition"
                  >
                    {emoji} {c.reactions?.[emoji] || 0}
                  </button>
                ))}
              </div>
              {/* Nested replies (optional) */}
              {c.replies && c.replies.length > 0 && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  {c.replies.map((r) => (
                    <div key={r.id} className="bg-gray-800 p-2 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>{r.user}</span>
                        <span className="text-gray-400">{new Date(r.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
