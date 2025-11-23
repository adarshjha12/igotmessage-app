"use client";
import Image from "next/image";
import {
  MessageSquare,
  CheckCheck,
  ChevronLeft,
  ChevronLeftIcon,
  MoreVertical,
  Loader2Icon,
} from "lucide-react";
import Link from "next/link";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios from "axios";
import NoChats from "./NoChats";
import AddChatButton from "./AddChat";
import FollowersList from "../dashboard/profile/AllUsers";
import ChatHeader from "./ChatHeader";
import { format, isValid } from "date-fns";
import { RootState } from "@/store/store";
import AiChatCard from "./AiChat";
import { usePathname, useSearchParams } from "next/navigation";
import { setChatList } from "@/features/chatSlice";
import BottomNav from "../dashboard/BottomNav";

export interface Chat {
  _id: string;
  coParticipant: {
    _id: string;
    userName: string;
    avatar: string;
    profilePicture?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    sender: {
      _id: string;
      userName: string;
      avatar: string;
      profilePicture?: string;
    };
  };
  unreadCount?: number;
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
  const params = useSearchParams();
  const pathName = usePathname();
  const dispatch = useAppDispatch();

  const myId = params.get("userId");
  const [addChatClicked, setAddChatClicked] = useState(false);
  const onlineUsers = useAppSelector((state) => state.chat.onlineUsers);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const chatList = useAppSelector((state: RootState) => state.chat.chatList);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chats");
  const lastMessage = useAppSelector(
    (state: RootState) => state.chat.lastMessage
  );

  async function getAllChats() {
    setLoading(true);
    try {
      const res = await axios.get(
        `${url}/api/chat/get-my-chats?userId=${myId}`
      );
      dispatch(setChatList(res.data.chats));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!chatList) {
      getAllChats();
    }

    return () => {};
  }, []);

  return (
    <div className="w-full min-h-screen bg-[var(--bgColor)] text-[var(--textColor)] py-0 flex flex-col items-center sm:px-4 md:px-8">
      <div className="w-full">
        <ChatHeader />
      </div>
      {/* loader */}
      {loading && (
        <div className="flex mt-[80px] text-[var(--bgColor)] items-center gap-3 bg-[var(--textColor)]/80 px-4 py-2 rounded-2xl backdrop-blur-md">
          <Loader2Icon className="animate-spin" />
          <p> Getting chats</p>
        </div>
      )}{" "}
      <div className="w-full mb-3 px-2 mt-[80px] flex justify-center">
        <div className="flex max-w-[600px]  w-full flex-col gap-3">
          <AiChatCard myId={myId!} />
        </div>
      </div>
      {chatList !== null && (
        <div className="w-full  mb-12 px-2 flex justify-center">
          {/* Chat list */}
          <div className="flex max-w-[600px] w-full flex-col gap-3">
            {chatList.map((chat) => (
              <Link
                href={`/chats/${myId}?avatar=${
                  chat.coParticipant.profilePicture || chat.coParticipant.avatar
                }&userName=${chat.coParticipant.userName}&recieverId=${
                  chat.coParticipant._id
                }&senderId=${myId}&&chatId=${chat._id}`}
                key={chat.coParticipant._id}
                className="flex items-center justify-between p-3 rounded-2xl  backdrop-blur-lg hover:bg-white/10 transition cursor-pointer"
              >
                {/* Left section: avatar + text */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        chat?.coParticipant?.profilePicture ||
                        chat?.coParticipant?.avatar!
                      }
                      alt={chat?.coParticipant?.userName}
                      width={50}
                      height={50}
                      className="rounded-full border border-white/20"
                    />
                    {onlineUsers.includes(chat.coParticipant._id) && (
                      <span className="absolute bottom-1 right-1 block w-3 h-3 rounded-full bg-green-500 " />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-base">
                      {chat.coParticipant.userName}
                    </p>
                    <p className="text-sm text-[var(--textColor)]/80 truncate max-w-[200px]">
                      {chat?.lastMessage?.content ||
                        lastMessage?.[chat._id]?.content}
                    </p>
                  </div>
                </div>

                {/* Right section: time + unread */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-[var(--textColor)]/80">
                    {chat?.lastMessage &&
                      isValid(new Date(chat?.lastMessage?.createdAt)) &&
                      format(new Date(chat.lastMessage?.createdAt), "dd/MM/y")}
                  </span>
                  {chat?.unreadCount && chat.unreadCount > 0 ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                      {chat.unreadCount}
                    </span>
                  ) : (
                    chat?.lastMessage?.sender?._id === myId && (
                      <CheckCheck className="w-4 h-4 text-[var(--textColor)]/80" />
                    )
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* No chats, groups, calls available */}
      {!chatList && !loading && <NoChats tabName={activeTab} />}
      {!chatList && !loading && (
        <div className={`flex max-w-[600px] w-full flex-col gap-3`}>
          <FollowersList userId={myId!} type="chats" />
        </div>
      )}
      <div>
        <AddChatButton onClick={() => setAddChatClicked(!addChatClicked)} />
      </div>
      {addChatClicked && (
        <div className="fixed top-0 left-0 w-full h-full bg-[var(--bgColor)] z-50 flex flex-col items-center justify-start">
          <button
            onClick={() => setAddChatClicked(false)}
            type="button"
            className=" pt-4 active:scale-90 transition-all ease-in-out duration-300 pl-3 w-full flex items-center text-red-500 hover:text-green-600 hover:scale-110 origin-left font-semibold justify-start text-xl"
          >
            {/* Back button */}
            <ChevronLeft />
            Back
          </button>
          <FollowersList userId={myId!} type="chats" />
        </div>
      )}

      <BottomNav pathname={pathName}/>
    </div>
  );
}
