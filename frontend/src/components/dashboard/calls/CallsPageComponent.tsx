"use client";
import Image from "next/image";
import { Phone, Video, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function Calls() {
  const calls = [
    {
      id: 1,
      username: "john_doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      type: "video", // audio | video
      direction: "incoming", // incoming | outgoing
      status: "missed", // missed | answered
      time: "2m ago",
    },
    {
      id: 2,
      username: "sarah_w",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      type: "audio",
      direction: "outgoing",
      status: "answered",
      time: "1h ago",
    },
    {
      id: 3,
      username: "dev_guy",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      type: "video",
      direction: "incoming",
      status: "answered",
      time: "Yesterday",
    },
  ];

  return (
    <div className="w-full h-screen bg-[var(--bgColor)] text-[var(--textColor)] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Calls</h1>
        <Phone className="w-6 h-6 cursor-pointer hover:scale-110 transition" />
      </div>
      <div className="h-full w-full flex items-center justify-center bg-black">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-semibold text-white">
            Calls Coming Soon
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Seamless audio & video calls are on the way 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
