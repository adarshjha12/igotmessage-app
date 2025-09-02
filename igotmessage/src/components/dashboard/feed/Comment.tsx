"use client";
import { useState } from "react";
import {
  Send,
  Smile,
  UserCircle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

interface ReplyType {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  time: string;
}

interface CommentType {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  time: string;
  replies?: ReplyType[];
}

export default function Comment({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentType[]>([
    {
      id: "1",
      user: "John Doe",
      text: "🔥 This looks amazing!",
      time: "2h",
      replies: [
        { id: "11", user: "Sarah Lee", text: "Totally agree 👏", time: "1h" },
      ],
    },
    {
      id: "2",
      user: "Sarah Lee",
      text: "Wow great work 👏",
      time: "30m",
      replies: [],
    },
  ]);

  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<null | { id: string; user: string }>(null);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});

  const handleSend = () => {
    if (!input.trim()) return;

    if (replyingTo) {
      // Handle reply
      const newReply: ReplyType = {
        id: Date.now().toString(),
        user: "You",
        text: input,
        time: "Just now",
      };

      setComments((prev) =>
        prev.map((c) =>
          c.id === replyingTo.id
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        )
      );

      setExpandedReplies((prev) => ({ ...prev, [replyingTo.id]: true }));
      setReplyingTo(null);
    } else {
      // Handle new comment
      const newComment: CommentType = {
        id: Date.now().toString(),
        user: "You",
        text: input,
        time: "Just now",
        replies: [],
      };
      setComments((prev) => [...prev, newComment]);
    }

    setInput("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-5 bg-[var(--bgColor)] rounded-2xl shadow-lg space-y-4">
      {/* Comments list */}
      <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400/40">
        {comments.map((c) => (
          <div key={c.id} className="space-y-1">
            {/* Main Comment */}
            <div className="flex gap-3 items-start group hover:bg-[var(--wrapperColor)]/50 rounded-xl p-2 transition">
              {c.avatar ? (
                <img
                  src={c.avatar}
                  alt={c.user}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
                />
              ) : (
                <UserCircle
                  strokeWidth={1.2}
                  className="w-9 h-9 text-[var(--textColor)]/70"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xl text-[var(--textColor)]">
                    {c.user}
                  </span>
                  <span className="text-md text-[var(--textColor)]/60">
                    {c.time}
                  </span>
                </div>
                <p className="text-lg text-[var(--textColor)] leading-relaxed">
                  {c.text}
                </p>
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo?.id === c.id ? null : { id: c.id, user: c.user }
                      )
                    }
                    className="text-md text-rose-600 font-semibold hover:underline"
                  >
                    Reply
                  </button>
                  {c.replies && c.replies.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedReplies((prev) => ({
                          ...prev,
                          [c.id]: !prev[c.id],
                        }))
                      }
                      className="flex items-center gap-1 text-md text-[var(--textColor)]/80 hover:underline"
                    >
                      {expandedReplies[c.id] ? (
                        <>
                          Hide Replies <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          View Replies ({c.replies.length}){" "}
                          <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Replies */}
            {expandedReplies[c.id] && c.replies && c.replies.length > 0 && (
              <div className="ml-12 space-y-2">
                {c.replies.map((r) => (
                  <div
                    key={r.id}
                    className="flex gap-2 items-start bg-[var(--wrapperColor)]/40 rounded-xl p-2"
                  >
                    {r.avatar ? (
                      <img
                        src={r.avatar}
                        alt={r.user}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle
                        strokeWidth={1}
                        className="w-7 h-7 text-[var(--textColor)]/70"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-md text-[var(--textColor)]">
                          {r.user}
                        </span>
                        <span className="text-md text-[var(--textColor)]/60">
                          {r.time}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--textColor)]">
                        {r.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Shared Input Box */}
      <div className="space-y-2">
        {replyingTo && (
          <div className="flex items-center justify-between text-lg text-white bg-blue-500 px-3 py-1 rounded-md">
            Replying to <span className="font-semibold">{replyingTo.user}</span>
            <button
              onClick={() => {
                setReplyingTo(null);
                setInput("");
              }}
              className="text-white hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 border rounded-full px-4 py-2 bg-[var(--wrapperColor)] shadow-sm">
          <Smile className="w-6 h-6 text-[var(--textColor)] cursor-pointer hover:scale-110 transition" />
          <input
            type="text"
            placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent outline-none text-base text-[var(--textColor)] placeholder:text-[var(--textColor)]/60"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition text-white"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
