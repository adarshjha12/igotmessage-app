import {
  Camera,
  Search,
  MoreVertical,
  ChevronLeftIcon,
  Router,
} from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "chats", label: "Chats" },
  { id: "groups", label: "Groups" },
  { id: "calls", label: "Calls" },
];

export default function ChatHomeHeader({
  setTab,
}: {
  setTab: (val: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="bg-[var(--bgColor)] w-full md:max-w-[500px] lg:max-w-[700px] backdrop-blur-lg sticky top-0 z-10">
      {/* Top header */}
      <div className="flex items-center py-1 px-2 gap-3">

        {/* Camera button */}
        <button className="p-2 rounded-full hover:bg-white/10 transition">
          <Camera size={26} className="text-[var(--textColor)]" />
        </button>

        {/* Search box */}
        <input
          type="text"
          placeholder="Search"
          className="flex-1 px-4 py-2 rounded-full bg-[var(--wrapperColor)] text-[var(--textColor)] placeholder:text-gray-400 focus:outline-none border border-[var(--borderColor)]/60 focus:ring-1 focus:ring-[var(--textColor)]/60 transition"
        />

        {/* More options */}
        <button className="p-2 rounded-full hover:bg-white/10 transition">
          <MoreVertical size={20} className="text-[var(--textColor)]" />
        </button>
      </div>

      {/* Horizontal cylindrical tabs */}
      <div className="flex items-center gap-3 px-4 py-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => (setActiveTab(tab.id), setTab(tab.id))}
            className={`
              flex-shrink-0 px-4  rounded-full  transition-all duration-300
              ${
                activeTab === tab.id
                  ? "bg-rose-600 py-1 text-white font-bold text-lg "
                  : "bg-[var(--wrapperColor)] py-2 text-[var(--textColor)] font-medium text-sm hover:bg-white/20"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
