"use client";
import Image from "next/image";
import { Heart, MessageCircle, UserPlus } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      username: "john_doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      action: "liked your post",
      type: "like", // like | comment | follow
      time: "2m ago",
      preview: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
    },
    {
      id: 2,
      username: "sarah_w",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      action: "commented: Amazing work 🔥",
      type: "comment",
      time: "1h ago",
      preview: "https://media.giphy.com/media/2A75RyXVzzSI2bx4Gj/giphy.gif",
    },
    {
      id: 3,
      username: "dev_guy",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      action: "started following you",
      type: "follow",
      time: "3h ago",
    },
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* <h1 className="text-xl font-bold">Notifications</h1> */}
      </div>

      <div className="h-full w-full flex items-center justify-center bg-black">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-semibold text-white">
            Notifications Coming Soon
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            notifications are on the way. stay tuned 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
