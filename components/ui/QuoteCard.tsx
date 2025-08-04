import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import Image from "next/image";

interface QuoteCardProps {
  avatar: string;
  username: string;
  text: string;
  likes: number;
  comments: number;
  shares: number;
}

export default function QuoteCard({
  avatar,
  username,
  text,
  likes,
  comments,
  shares,
}: QuoteCardProps) {
  return (
    <div className="bg-neutral-900 rounded-xl p-5 text-white shadow-lg hover:scale-[1.02] transition-all duration-300">
      <div className="flex gap-4 items-start">
        <Image
          src={avatar}
          alt={username}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{username}</span>
            <BsPatchCheckFill className="text-blue-500" />
          </div>
          <p className="text-sm leading-relaxed text-gray-200">{text}</p>
          <div className="flex gap-6 mt-4 text-gray-400 text-sm">
            <div className="flex items-center gap-1 hover:text-red-400 cursor-pointer">
              <FaHeart /> {likes}
            </div>
            <div className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
              <FaComment /> {comments}
            </div>
            <div className="flex items-center gap-1 hover:text-green-400 cursor-pointer">
              <FaShare /> {shares}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
