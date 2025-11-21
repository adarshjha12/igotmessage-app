import { MessageSquare, MessageSquarePlus } from "lucide-react";
import React from "react";

const FloatingAddChat = React.memo(({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-26 sm:bottom-14 left-[80%] sm:left-[80%] md:left-[80%] lg:left-[50%]
        w-14 h-14
        bg-green-600
        text-white
        rounded-2xl
        shadow-lg
        flex items-center justify-center
        hover:bg-green-600
        active:scale-95
        transition
        duration-200
        focus:outline-none
      "
    >
      <MessageSquarePlus className="w-7 h-7 " />
    </button>
  );
});

export default FloatingAddChat;