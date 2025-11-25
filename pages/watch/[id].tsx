"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Hls from "hls.js";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Send, ThumbsUp, MessageCircle, Share2, Clock, Eye, Loader2 } from "lucide-react";

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
  const [error, setError] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

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
        setError(false);
      } catch (err) {
        console.error("Failed to fetch stream:", err);
        setError(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwYjk1ZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0em0wIDI4YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0ek0xNiAzNmMwIDIuMjEgMS43OSA0IDQgNHM0LTEuNzkgNC00LTEuNzktNC00LTQtNCAxLjc5LTQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <motion.div
        className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-16 h-16 text-sky-400" />
              </motion.div>
              <p className="mt-6 text-slate-300 text-lg">Loading player...</p>
            </motion.div>
          ) : error || !sources.length ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-12 border border-red-500/30 max-w-md">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                    <Play className="w-10 h-10 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Stream Not Found</h2>
                  <p className="text-slate-400">The requested stream is unavailable or has been removed.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 backdrop-blur-xl border border-sky-500/20 shadow-2xl shadow-sky-500/10"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                  <div className="text-center space-y-4 px-6">
                    <div className="w-20 h-20 mx-auto bg-sky-500/20 rounded-full flex items-center justify-center">
                      <Play className="w-10 h-10 text-sky-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Stream Coming Soon</h3>
                    <p className="text-slate-400 max-w-md">Video player will be loaded here. The stream is being processed.</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>Available sources: {sources.map((s) => s.quality).join(", ")}</span>
                    </div>
                  </div>
                </div>
                <video
                  ref={videoRef}
                  controls
                  className="w-full h-full opacity-0"
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-sky-500/20"
              >
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Episode Info</h2>
                    <p className="text-slate-400">
                      Watching episode ID: <span className="text-sky-400 font-semibold">{id}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                      <Eye className="w-4 h-4 text-sky-400" />
                      <span className="text-slate-300">1.2K views</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span className="text-slate-300">24:00</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                      <Play className="w-4 h-4 text-sky-400" />
                      <span className="text-slate-300">{sources.length} sources</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 px-4 py-2 rounded-lg border border-sky-500/30 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Like</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 px-4 py-2 rounded-lg border border-slate-700/50 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-sky-500/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="w-6 h-6 text-sky-400" />
                  <h3 className="text-xl font-bold text-white">Comments</h3>
                  <span className="text-slate-500 text-sm">({comments.length})</span>
                </div>

                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 border border-slate-700/50 transition-all"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <motion.button
                    onClick={handleAddComment}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/30 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {comments.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500">No comments yet. Be the first!</p>
                      </motion.div>
                    )}
                    {comments.map((c, idx) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-sky-500/30 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                            {c.user[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-white">{c.user}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(c.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <p className="text-slate-300 break-words">{c.text}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
