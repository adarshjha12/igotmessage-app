import { ChevronLeftIcon, MessageSquare, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import PopupMenu from "./MoreOption";
import { useAppSelector } from "@/store/hooks";

function ChatHeader() {
  const [moreButtonClicked, setMoreButtonClicked] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      {/* Chat Header */}
      <div
        className="flex fixed top-0 left-0 z-50 items-center mb-4 justify-between w-full pr-4 py-3 bg-[var(--bgColor)]/80 backdrop-blur-md "
        
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-white/10 transition duration-200"
          >
            <ChevronLeftIcon size={26} className="text-[var(--textColor)]" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={user?.avatar!}
              alt={user?.userName!}
              width={30}
              height={30}
              className="rounded-full border border-white/20"
            />
            <p className="text-lg font-semibold tracking-wide">
              My Chats
            </p>
          </div>
        </div>

        {/* <div className="flex items-center gap-3">
         
        </div> */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMoreButtonClicked((prev) => !prev)}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <MoreVertical
              size={22}
              className="text-[var(--textColor)] opacity-80 hover:opacity-100"
            />
          </button>
        </div>
      </div>
      {moreButtonClicked && (
        <div className="">
          <div
            className="fixed z-40 inset-0 bg-black/50"
            onClick={() => setMoreButtonClicked(false)}
          />
          <PopupMenu onClose={() => setMoreButtonClicked(false)} />
        </div>
      )}
    </div>
  );
}

export default ChatHeader;
