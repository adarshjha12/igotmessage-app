"use client";
import Image from "next/image";
import { MessageSquare, CheckCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import NoChats from "./NoChats";
import AddChatButton from "./AddChat";
import AnimatedChatTabs from "./ChatTabs";
import FollowersList from "../profile/AllUsers";

interface Chat {
  _id: string;
  userName: string;
  avatar: string;
  profilePicture?: string;
  lastMessage?: {
    text: string;
    createdAt: string;
  };
  unreadMessages?: number;
  online?: boolean;
  isGroupChat?: boolean;
  groupAdmin?: {
    _id: string;
    userName: string;
    profilePicture: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function ChatList() {
  const myId = useAppSelector((state) => state.auth.user._id);
  const [addChatClicked, setAddChatClicked] = useState(false);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const [chats, setChats] = useState<Chat[] | null>(null);
  const [groups, setGroups] = useState<[] | null>(null);
  const [calls, setCalls] = useState<[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chats");

  useEffect(() => {
    async function getAllChats() {
      try {
        const res = await axios.get(`${url}/api/chats/get-all-chats/${myId}`);
        setChats(res.data.chats);
      } catch (error) {
        console.log(error);
      }
    }

    return () => {
    };
  }, []);

  return (
    <div className="w-full h-full bg-[var(--bgColor)] text-[var(--textColor)] py-2">
      <AnimatedChatTabs setTab={setActiveTab} />
      {loading && <div>Loading...</div>}
      {chats !== null && (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">All Chats</h1>
            <MessageSquare className="w-6 h-6 cursor-pointer hover:scale-110 transition" />
          </div>

          {/* Chat list */}
          <div className="flex flex-col gap-3">
            {chats.map((chat) => (
              <Link
                href={`/dash/chats/${chat._id}`}
                key={chat._id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/5 backdrop-blur-lg hover:bg-white/10 transition cursor-pointer"
              >
                {/* Left section: avatar + text */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={chat.avatar}
                      alt={chat.userName}
                      width={50}
                      height={50}
                      className="rounded-full border border-white/20"
                    />
                    {chat.online && (
                      <span className="absolute bottom-1 right-1 block w-3 h-3 rounded-full bg-green-500 border border-black" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-base">{chat.userName}</p>
                    <p className="text-sm text-gray-300 truncate max-w-[200px]">
                      {chat?.lastMessage?.text}
                    </p>
                  </div>
                </div>

                {/* Right section: time + unread */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400">
                    {chat.updatedAt}
                  </span>
                  {chat?.unreadMessages && chat.unreadMessages > 0 ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                      {chat.unreadMessages}
                    </span>
                  ) : (
                    <CheckCheck className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No chats, groups, calls available */}

      {(!chats || !groups || !calls) && <NoChats tabName={activeTab} />}

      <div>
        <AddChatButton onClick={() => setAddChatClicked(!addChatClicked)} />
      </div>
      {addChatClicked && (
        <div className="fixed top-0 left-0 w-full h-full bg-[var(--bgColor)] z-50 flex flex-col items-center justify-center">
          <button
            onClick={() => setAddChatClicked(false)}
            type="button"
           className=" pt-4 active:scale-90 transition-all ease-in-out duration-300 pl-3 w-full flex items-center text-red-500 hover:text-green-600 hover:scale-110 origin-left font-semibold justify-start text-xl">
            {/* Back button */}
            <ChevronLeft/>
            Back
          </button>
          <FollowersList userId={myId} type="chats"/>
        </div>
      )}
    </div>
  );
}
