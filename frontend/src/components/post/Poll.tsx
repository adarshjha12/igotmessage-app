"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, Check } from "lucide-react";
import axios from "axios";
import { useAppSelector } from "@/store/hooks";

interface PollProps {
  postId: string;
  pollData: {
    question: string;
    options: { _id: string; text: string; votes?: string[] }[];
  };
}

export default function Poll({ postId, pollData }: PollProps) {
  const userId = useAppSelector((state) => state.auth.user._id);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/post/vote`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/post/vote`;

  // local state to reflect current poll
  const [localPoll, setLocalPoll] = useState(pollData);
  // track which option the user voted for
  const [voted, setVoted] = useState<Record<string, string>>({});

  const handleVote = async (postId: string, optId: string) => {
    // optimistically update UI
    setVoted((prev) => ({ ...prev, [postId]: optId }));
    setLocalPoll((prev) => {
      const newOptions = prev.options.map((o) =>
        o._id === optId ? { ...o, votes: [...(o.votes || []), userId] } : o
      );
      return { ...prev, options: newOptions };
    });

    try {
      const res = await axios.post(
        url,
        { postId, optId, userId },
        { withCredentials: true }
      );

      if (res.data?.vote?.poll) {
        // replace with updated poll from backend
        setLocalPoll(res.data.vote.poll);
      }
    } catch (err) {
      console.error("Vote error:", err);
    }
  };

  // calculate total votes
  const totalVotes = localPoll?.options?.reduce(
    (sum, o) => sum + (o.votes?.length || 0),
    0
  );

  useEffect(() => {
    if (pollData) {
      const checkVoted = pollData.options.some((o) =>
        o.votes?.includes(userId)
      );
      if (checkVoted) {
        setVoted((prev) => ({ ...prev, [postId]: userId }));
      }
    }
    return () => {};
  }, []);

  return (
    <div className="flex flex-col gap-4 px-4 py-5 bg-[var(--wrapperColor)] shadow-lg  border-[var(--borderColor)]/40">
      {/* Question */}
      <div className="flex items-center gap-3 text-lg font-semibold text-[var(--textColor)]">
        <BarChart3 size={24} className="text-rose-500" />
        {localPoll.question}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mt-2">
        {localPoll?.options?.map((opt) => {
          const voteCount = opt.votes?.length || 0;
          const percentage =
            totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const userVoted = voted[postId] === opt._id;

          return (
            <button
              key={opt._id}
              disabled={voted[postId] !== undefined}
              onClick={() => handleVote(postId, opt._id)}
              className={`group relative w-full rounded-full overflow-hidden border transition-all
              ${
                userVoted
                  ? "border-blue-500 shadow-md"
                  : "border-[var(--borderColor)]/30 hover:border-blue-400"
              }
              disabled:opacity-90`}
            >
              {/* Progress Fill */}
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500/30 to-blue-500/20 transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />

              {/* Option Content */}
              <div className="relative flex justify-between items-center px-5 py-3">
                <span
                  className={`flex items-center gap-2 text-md sm:text-base text-[var(--textColor)] 
                  ${userVoted ? "font-semibold" : "font-medium"}
                `}
                >
                  {userVoted && (
                    <Check
                      size={20}
                      className="text-blue-500"
                      strokeWidth={3}
                    />
                  )}
                  {opt.text}
                </span>
                <span className="text-sm sm:text-sm font-medium text-[var(--textColor)]/70">
                  {percentage}%{" "}
                  <span className="opacity-60">({voteCount})</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-2">
        <span className="text-md font-semibold sm:text-sm text-[var(--textColor)]/50">
          {totalVotes} votes
        </span>
      </div>
    </div>
  );
}
