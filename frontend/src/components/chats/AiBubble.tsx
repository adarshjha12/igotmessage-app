import { useSearchParams } from "next/navigation";
import React from "react";
import { useUIStore } from "@/store/zustand/chatStore";

function AiBubble({ message }: { message: { sender: ""; content: "" } }) {
  const { sendingMesaageToAi, setSendingMessageToAi } = useUIStore();

  const params = useSearchParams();
  const myId = params.get("senderId");
  const isSender = message.sender === myId;

  const startStreaming = (fullText: string) => {
    // setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i >= fullText.length) {
        clearInterval(interval);
        return;
      }
      //   setDisplayedText((prev) => prev + fullText[i]);
      //   i++;
    }, 20);
  };

  return (
    <div>
      {/* BUBBLE */}
      <div
        className={`max-w-[75%] sm:max-w-[65%] mb-6 my-2 rounded-2xl px-4 py-2 text-[15px] relative transition-all duration-200 ${
          isSender
            ? "bg-gradient-to-br from-orange-600 via-pink-700 to-purple-600 text-white rounded-br-none"
            : "bg-[#dfdee2] text-[#06000e]  border-[#6d28d955]  shadow-[0_0_12px_#6d28d9aa] rounded-bl-none"
        } shadow`}
      >
        <p className="leading-relaxed text-lg sm:text-base break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}

export default AiBubble;
