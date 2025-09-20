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
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 backdrop-blur-lg hover:bg-white/10 transition cursor-pointer"
          >
            {/* Left: Avatar + text */}
            <div className="flex items-center gap-3">
              <Image
                src={n.avatar}
                alt={n.username}
                width={50}
                height={50}
                className="rounded-full border border-white/20"
              />
              <div>
                <p className="text-sm">
                  <span className="font-semibold">{n.username}</span>{" "}
                  {n.action}
                </p>
                <p className="text-xs text-gray-400">{n.time}</p>
              </div>
            </div>

            {/* Right: Preview / Icon */}
            {n.preview ? (
              <Image
                src={n.preview}
                alt="preview"
                width={50}
                height={50}
                className="rounded-lg object-cover"
              />
            ) : (
              <>
                {n.type === "like" && <Heart className="w-5 h-5 text-red-500" />}
                {n.type === "comment" && (
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                )}
                {n.type === "follow" && (
                  <UserPlus className="w-5 h-5 text-green-400" />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
