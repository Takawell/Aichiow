type QuickRepliesProps = {
  onReply: (text: string) => void;
};

export default function QuickReplies({ onReply }: QuickRepliesProps) {
  const suggestions = [
    "Anime trending?",
    "Manhwa populer?",
    "Top seasonal anime?",
    "Anime genre fantasy",
    "Rekomendasi manhwa action",
  ];

  return (
    <div className="quick-replies">
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => onReply(s)} className="quick-reply-btn">
          {s}
        </button>
      ))}
    </div>
  );
}
