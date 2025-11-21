import Link from "next/link";
import { CheckCheck, SparklesIcon } from "lucide-react";
import React from "react";

const AiChatCard = React.memo(({ myId }: { myId: string }) => {
  const aiAvatar =
    "https://imgs.search.brave.com/WTc4RIEDsPQMAXReQAyCgYhK48SuMwGpSuGBbi1STRY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/anNkZWxpdnIubmV0/L2doL2hvbWFyci1s/YWJzL2Rhc2hib2Fy/ZC1pY29ucy9wbmcv/bWlzdHJhbC1haS5w/bmc";

  return (
    <Link
      href={`/chats/${myId}?avatar=${aiAvatar}&userName=MistralAI&receiverId=ai_bot&senderId=${myId}`}
      className="flex items-center justify-between p-3 rounded-2xl  backdrop-blur-lg hover:bg-white/10 transition cursor-pointer"
    >
      {/* Left: avatar + name + last message */}
      <div className="flex items-center gap-3">
        <div className="relative w-[50px] h-[50px]">
          <img
            src={aiAvatar}
            alt="OpenAI"
            className="w-full h-full rounded-full object-cover border border-white/20"
          />
        </div>

        <div>
          <div className="font-semibold flex gap-3 items-center text-base">
            Mistral AI
            <SparklesIcon className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-sm text-[var(--textColor)]/80 truncate max-w-[200px]">
            Hello! Ask me anything 👋
          </p>
        </div>
      </div>

      {/* Right: time + sent icon */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-[var(--textColor)]/80">Now</span>
        <CheckCheck className="w-4 h-4 text-[var(--textColor)]/80" />
      </div>
    </Link>
  );
})

export default AiChatCard
