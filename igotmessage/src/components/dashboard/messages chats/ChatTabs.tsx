import { GroupIcon, MessageSquare } from "lucide-react";
import { useState, JSX } from "react";

type Tab = {
  id: string;
  label: string;
  icon: JSX.Element;
};

export default function AnimatedChatTabs() {
  const [activeTab, setActiveTab] = useState<string>("chats");

  const tabs: Tab[] = [
    { id: "chats", label: "Chats", icon: <MessageSquare /> },
    { id: "groups", label: "Groups", icon: <GroupIcon /> },
  ];

  return (
    <div className="bg-[var(--bgColor)] text-[var(--textColor)] backdrop-blur-md shadow-sm">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center w-full justify-center gap-2 text-center pb-2 px-4 font-medium
              text-[var(--textColor)] hover:text-gray-500 transition-colors duration-200
              ${activeTab === tab.id ? "border-b-4 text-[var(--textColor)] border-rose-600" : ""}
            `}
          >
            <div className={`flex-shrink-0 ${activeTab === tab.id ? "text-rose-600" : ""}`}>{tab.icon}</div>
            <span className="text-lg font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
