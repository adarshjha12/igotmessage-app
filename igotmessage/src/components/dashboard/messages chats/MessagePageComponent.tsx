"use client";
import Image from "next/image";
import { MessageSquare, CheckCheck } from "lucide-react";
import Link from "next/link";

export default function ChatList() {
  const chats = [
    {
      id: 1,
      username: "john_doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastMessage: "Hey, how are you doing?",
      time: "2m",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      username: "sarah_w",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      lastMessage: "Let’s catch up tomorrow!",
      time: "1h",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      username: "dev_guy",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      lastMessage: "Code review done ✅",
      time: "3h",
      unread: 1,
      online: true,
    },
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">All Chats</h1>
        <MessageSquare className="w-6 h-6 cursor-pointer hover:scale-110 transition" />
      </div>

      {/* Chat list */}
      <div className="flex flex-col gap-3">
        {chats.map((chat) => (
          <Link
          href={`/dash/chats/${chat.id}`}
            key={chat.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 backdrop-blur-lg hover:bg-white/10 transition cursor-pointer"
          >
            {/* Left section: avatar + text */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={chat.avatar}
                  alt={chat.username}
                  width={50}
                  height={50}
                  className="rounded-full border border-white/20"
                />
                {chat.online && (
                  <span className="absolute bottom-1 right-1 block w-3 h-3 rounded-full bg-green-500 border border-black" />
                )}
              </div>
              <div>
                <p className="font-semibold text-base">{chat.username}</p>
                <p className="text-sm text-gray-300 truncate max-w-[200px]">
                  {chat.lastMessage}
                </p>
              </div>
            </div>

            {/* Right section: time + unread */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-400">{chat.time}</span>
              {chat.unread > 0 ? (
                <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                  {chat.unread}
                </span>
              ) : (
                <CheckCheck className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
