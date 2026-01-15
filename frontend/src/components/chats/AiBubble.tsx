import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useUIStore } from "@/store/zustand/chatStore";

interface AiMessage {
  sender?: string;
  chat?: string;
  content: string;
  updatedAt?: string;
  tempId?: string;
}

function AiBubble({ messages }: { messages: AiMessage[] }) {
  const { sendingMesaageToAi } = useUIStore();
  const params = useSearchParams();
  const myId = params.get("senderId");

  const [displayText, setDisplayedText] = useState("");

  const startStreaming = (fullText: string) => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i >= fullText.length) {
        clearInterval(interval);
        return;
      }
      setDisplayedText((prev) => prev + fullText[i]);
      i++;
    }, 20);
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender !== myId) {
      startStreaming(lastMessage.content);
    }
  }, [messages, myId]);

  return (
    <div>
      {sendingMesaageToAi && (
        <p className="text-2xl p-6 bg-rose-700 text-white font-semibold">
          Sending...
        </p>
      )}

      {messages.map((msg, i) => {
        const isSender = msg.sender === myId;
        const isLastAiMessage =
          !isSender && i === messages.length - 1;

        return (
          <div
            key={msg.tempId ?? i}
            className={`max-w-[75%] sm:max-w-[65%] mb-6 my-2 rounded-2xl px-4 py-2 text-[15px] transition-all duration-200 ${
              isSender
                ? "bg-gradient-to-br from-orange-600 via-pink-700 to-purple-600 text-white rounded-br-none ml-auto"
                : "bg-[#dfdee2] text-[#06000e] shadow-[0_0_12px_#6d28d9aa] rounded-bl-none"
            }`}
          >
            <p className="leading-relaxed text-lg sm:text-base break-words">
              {isLastAiMessage ? displayText : msg.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default AiBubble;
