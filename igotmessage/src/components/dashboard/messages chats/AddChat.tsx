import { MessageSquare, MessageSquarePlus } from "lucide-react";

export default function FloatingAddChat({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-20 right-6
        w-14 h-14
        bg-green-500
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
}
