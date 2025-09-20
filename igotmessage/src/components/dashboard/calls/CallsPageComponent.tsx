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

      {/* Calls List */}
      <div className="flex flex-col gap-3">
        {calls.map((call) => (
          <div
            key={call.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-[var(--wrapperColor)] backdrop-blur-lg hover:bg-[var(--wrapperColor)]/10 transition cursor-pointer"
          >
            {/* Left section: avatar + details */}
            <div className="flex items-center gap-3">
              <Image
                src={call.avatar}
                alt={call.username}
                width={50}
                height={50}
                className="rounded-full border border-white/20"
              />
              <div>
                <p className="font-semibold text-base">{call.username}</p>
                <div className="flex items-center gap-1 text-sm">
                  {call.direction === "incoming" ? (
                    <ArrowDownLeft
                      className={`w-4 h-4 ${
                        call.status === "missed"
                          ? "text-red-500"
                          : "text-green-400"
                      }`}
                    />
                  ) : (
                    <ArrowUpRight
                      className={`w-4 h-4 ${
                        call.status === "missed"
                          ? "text-red-500"
                          : "text-green-400"
                      }`}
                    />
                  )}
                  <span
                    className={`${
                      call.status === "missed"
                        ? "text-red-400"
                        : "text-[var(--textColor)]/70"
                    }`}
                  >
                    {call.status} • {call.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Right section: call type */}
            {call.type === "audio" ? (
              <Phone className="w-5 h-5 text-[var(--textColor)]/70 hover:text-[var(--textColor)] transition" />
            ) : (
              <Video className="w-5 h-5 text-[var(--textColor)]/70 hover:text-[var(--textColor)] transition" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
