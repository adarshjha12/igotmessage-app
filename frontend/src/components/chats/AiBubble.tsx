import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useUIStore } from "@/store/zustand/chatStore";
import NewLoader from "../NewLoader";
import { Loader2Icon } from "lucide-react";

interface AiMessage {
  reciever?: string;
  chat?: string;
  content: string;
  updatedAt?: string;
  tempId?: string;
}

function AiBubble({ messages }: { messages: AiMessage[] }) {
  const { sendingMesaageToAi } = useUIStore();
  const params = useSearchParams();
  const myId = params.get("senderId");

  const scrollToBottom = (delay = 50) => {
    const el = document.getElementById("scrolldiv");
    if (!el) return;

    setTimeout(() => {
      el.scrollIntoView({ behavior: "instant", block: "center" });
    }, delay);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      {sendingMesaageToAi && (
        <p className="text-2xl p-6 bg-green-700 text-white font-semibold">
          Sending...
          <Loader2Icon color="white" className="ml-2 animate-spin" />
        </p>
      )}

      {messages.map((msg, index) => {
        const isAiSender = msg.reciever === myId;

        return (
          <div
            key={msg.tempId ?? index}
            className={` mb-6 my-2 rounded-2xl px-4 py-2 text-[15px] transition-all duration-200 ${
              isAiSender
                ? "max-w-[75%] sm:max-w-[65%] bg-[#cbcbcb] text-black shadow-[0_0_12px_#6d28d9aa] rounded-bl-none"
                : "bg-green-600 max-w-[35%] sm:max-w-[65%]  text-white rounded-br-none ml-auto"
            }`}
          >
            <p className="leading-relaxed text-lg sm:text-base break-words">
              {msg.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default AiBubble;
