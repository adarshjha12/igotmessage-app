"use client";

import React, { useState } from "react";
import { BarChart3, Check } from "lucide-react";

interface PollProps {
  postId: string;
  pollData: {
    question: string;
    options: { text: string; votes?: string[] }[];
  };
}

export default function Poll({ postId, pollData }: PollProps) {
  const [voted, setVoted] = useState<Record<string, number>>({});

  const handleVote = (postId: string, idx: number) => {
    setVoted((prev) => ({ ...prev, [postId]: idx }));
    // TODO: send vote API
  };

  const totalVotes = pollData?.options?.reduce(
    (sum, o) => sum + (o.votes?.length || 0),
    0
  );

  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* Question */}
      <div className="font-semibold px-4 gap-2 flex item-center text-lg text-[var(--textColor)] mb-2">
        <BarChart3 size={30} className="text-rose-600" />
        {pollData.question}
      </div>

      {/* Options */}
      {pollData?.options?.map((opt, idx) => {
        const voteCount = opt.votes?.length || 0;
        const percentage =
          totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
        const userVoted = voted[postId] === idx;

        return (
          <button
            key={idx}
            disabled={voted[postId] !== undefined}
            onClick={() => handleVote(postId, idx)}
            className={`w-full relative rounded-2xl overflow-hidden border-4 text-left
              ${
                userVoted ? "border-blue-500" : "border-[var(--borderColor)]/40"
              }
              disabled:opacity-80 bg-[var(--wrapperColor)] shadow-sm hover:shadow-md transition-all`}
          >
            {/* Progress Background */}
            <div
              className="absolute left-0 top-0 h-full bg-blue-500/30 transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
            {/* Option Text */}
            <div className="relative flex justify-between items-center px-4 py-3">
              <span
                className={`flex items-center gap-2 text-[var(--textColor)] ${
                  userVoted ? "font-semibold" : ""
                }`}
              >
                {userVoted && <Check strokeWidth={4} size={30} className="text-blue-500" />}
                {opt.text}
              </span>
              <span className="text-sm font-medium text-[var(--textColor)]/70">
                {percentage}% <span className="text-xs">({voteCount})</span>
              </span>
            </div>
          </button>
        );
      })}

      {/* Footer */}
      <span className="text-xs text-[var(--textColor)]/60 mt-1">
        Total votes: {totalVotes}
      </span>
    </div>
  );
}
