import React, { useEffect, useRef, useState } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Loader2Icon,
  X,
  CheckCheckIcon,
  ChevronLeftIcon,
  Sparkles,
  Check,
  Image,
  Send,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import ChatInput from "./ChatInput";
import { io, Socket } from "socket.io-client";
import { getSocket } from "@/utils/socket";
import axios from "axios";
import {
  setChatId,
  setLastMessage,
  setLastSeen,
  setMessages,
  setNewMessages,
  setNewOnlineUser,
  setOfflineUser,
  setOnlineUsers,
} from "@/features/chatSlice";
import {
  format,
  formatDate,
  formatDistanceToNowStrict,
  isSameDay,
  isToday,
  isValid,
  isYesterday,
} from "date-fns";
import Link from "next/link";
import NewLoader from "../NewLoader";
import MoreOption from "./MoreOption";
import { MessagesList } from "./ChatBuubble";
import WelcomeScreen from "./WelcomeAi";
import FilePreview from "./FileSender";
import { useUIStore } from "@/store/zustand/chatStore";
import FileSendingVisual from "./FileSendingVisual";

interface Message {
  _id?: string;
  sender?: string;
  chat?: string;
  content: string;
  messageType?: string;
  updatedAt: string;
  tempId?: string;
}

function SingleChat() {
  const queryParam = useSearchParams();
  const avatar = queryParam.get("avatar");
  const userName = queryParam.get("userName");
  const recieverId = queryParam.get("recieverId");
  const senderId = queryParam.get("senderId");
  const chatId = queryParam.get("chatId");
  const isAiChat = Boolean(queryParam.get("aiChat"));
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);
  const onlineUsers = useAppSelector((state) => state.chat.onlineUsers);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isOtherTyping, setOtherTyping] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const [moreButtonClicked, setMoreButtonClicked] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { filePreview, isFileUploading, setIsFileuploading, isFileUploaded } =
    useUIStore();
  const dispatch = useAppDispatch();
  const allMessages = useAppSelector((state) => state.chat.messages);

  const recieverLastSeen = useAppSelector(
    (state: RootState) => state.chat.recieverLastSeen
  );

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const bgUrl =
    "https://plus.unsplash.com/premium_photo-1686063717140-1cd04ce5f76e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZGFyayUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900";

  const lightBgUrl =
    "https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxlYWZ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900";

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleFocus(type: "input" | "normal") {
    const element = document.getElementById("scrolldiv");
    if (element) {
      setTimeout(
        () => {
          element.scrollIntoView({ behavior: "instant", block: "center" });
        },
        type === "input" ? 500 : 50
      );
    }
  }

  useEffect(() => {
    if (!chatId || !allMessages?.[chatId]) return;

    if (allMessages[chatId]?.length > 0) {
      handleFocus("normal");
    }

    if (allMessages[chatId]?.length > 0) {
      const latest = allMessages[chatId].at(-1);
      dispatch(setLastMessage({ chatId: latest?.chat, message: latest }));
    }

    return () => {};
  }, [allMessages, dispatch]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("onlineUsers", ({ onlineUsers }) => {
      console.log("onlineUsers", onlineUsers);
      dispatch(setOnlineUsers(onlineUsers));
    });

    socket.on("userOnline", ({ userId }) => {
      dispatch(setNewOnlineUser(userId));
    });

    socket.on("userOffline", ({ userId, lastSeen }) => {
      dispatch(setOfflineUser(userId));
      dispatch(setLastSeen({ chatId, date: lastSeen ?? null }));
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, []);

  useEffect(() => {
    async function getChatId() {
      setLoadingMessages(true);

      try {
        const res = await axios.post(
          `${url}/api/chat/create-chat`,
          { senderId, recieverId },
          { withCredentials: true }
        );

        if (res.data) {
          console.log(res.data);

          dispatch(
            setMessages({ chatId: chatId, messages: res.data.allMessages })
          );
          setLoadingMessages(false);
          dispatch(
            setLastSeen({ chatId, date: res.data?.receiverLastSeen ?? null })
          );
          dispatch(setChatId(chatId));
        }
      } catch (error) {
        setLoadingMessages(false);
        console.log(error);
      }
    }
    if (!chatId) return;
    if (!allMessages?.[chatId]) {
      getChatId();
    }
  }, []);

  useEffect(() => {
    const socket = getSocket();

    if (socket.connected) {
      socket.emit("event:joinRoom", { roomId: chatId });
    } else {
      socket.once("connect", () => {
        socket.emit("event:joinRoom", { roomId: chatId });
      });
    }

    // Chat-specific events
    socket.off("event:message");
    socket.off("event:otherTyping");
    socket.off("event:otherStopTyping");

    socket.on("event:message", (data: any) => {
      dispatch(setNewMessages({ chatId, messages: [data] }));
    });

    socket.on("event:otherTyping", (data: any) => {
      if (data.senderId !== senderId) setOtherTyping(true);
    });

    socket.on("event:otherStopTyping", (data: any) => {
      if (data.senderId !== senderId) setOtherTyping(false);
    });

    return () => {
      if (chatId) socket.emit("leaveRoom", { roomId: chatId });
    };
  }, [chatId]);

  useEffect(() => {
    handleFocus("normal");
    return () => {};
  }, [filePreview, isFileUploading]);

  return (
    <div className="w-full h-screen  relative  sm:px-4 md:px-8 flex flex-col bg-[#1e2838]">
      {/* Fixed Header */}
      <div className="flex w-full fixed left-0 items-center justify-between py-3 border-b text-white border-white/10 bg-white/10 backdrop-blur-sm top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="py-2 pl-2 rounded-full hover:bg-white/10 transition"
          >
            <ChevronLeftIcon size={30} />
          </button>

          <Link
            className="flex items-center gap-3"
            href={`/public-profile/${recieverId}/myId/${senderId}`}
          >
            {avatar && (
              <img
                src={avatar!}
                alt="user"
                loading="lazy"
                className="w-10 h-10 rounded-full border border-white/20"
              />
            )}

            {!avatar && isAiChat && (
              <div className="h-10 w-10 flex items-center bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-full shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-base font-semibold">
                  {width && width < 500 && userName?.length! > 11
                    ? userName?.split("").splice(0, 11).join("") + "..."
                    : userName}
                </h2>
                {isAiChat && (
                  <div className="bg-blue-500 rounded-full p-[1px]">
                    <Check size={16} strokeWidth={4} className="text-white" />
                  </div>
                )}
              </div>

              <div className="text-xs opacity-70">
                {isOtherTyping ? (
                  <span className="text-white font-semibold">Typing...</span>
                ) : onlineUsers?.includes(recieverId!) ? (
                  "Online"
                ) : chatId && recieverLastSeen?.[chatId] ? (
                  <>
                    Last seen{" "}
                    {formatDistanceToNowStrict(
                      new Date(recieverLastSeen[chatId]),
                      {
                        addSuffix: true,
                      }
                    )}
                  </>
                ) : isAiChat ? (
                  "online"
                ) : (
                  "Never seen"
                )}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {!isAiChat && (
            <>
              <button className="p-2 rounded-full hover:bg-white/10 transition">
                <Phone size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 transition">
                <Video size={20} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setMoreButtonClicked((prev) => !prev)}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Chat Area */}
      <div
        className="flex-1 overflow-y-auto px-2 pt-[100px] pb-[100px] md:px-12 lg:px-16 w-full items-start"
        style={{
          willChange: "scroll-position",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {isAiChat && <WelcomeScreen />}
        {/* Loader */}
        <div className="flex justify-center w-full text-white/80">
          {loadingMessages && (
            <div className="flex text-white items-center gap-3 bg-black/20 px-4 py-2 rounded-2xl shadow">
              <Loader2Icon className="animate-spin" />
              <p>Getting messages</p>
            </div>
          )}
        </div>

        {/* Messages */}
        {chatId &&
          allMessages?.[chatId] &&
          allMessages?.[chatId].length > 0 && (
            <MessagesList
              allMessages={allMessages[chatId]}
              senderId={senderId!}
              avatar={avatar!}
            />
          )}

        {filePreview && !isFileUploading && <FilePreview />}

        {filePreview && isFileUploading && !isFileUploaded && (
          <FileSendingVisual />
        )}

        {/* Typing */}
        {isOtherTyping && (
          <div className="flex items-start gap-2">
            <img
              src={avatar!}
              loading="lazy"
              alt="avatar"
              className="w-8 h-8 rounded-full border border-white/20"
            />
            <div className="px-4 py-2 rounded-2xl bg-white/20 shadow flex gap-1">
              <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        <div id="scrolldiv"></div>
      </div>

      {/* Input */}
      <ChatInput
        setFocus={handleFocus}
        receiverId={recieverId!}
        isAiChat={isAiChat!}
      />

      {/* More Options Overlay */}
      {moreButtonClicked && (
        <>
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMoreButtonClicked(false)}
          />
          <MoreOption onClose={() => setMoreButtonClicked(false)} />
        </>
      )}
    </div>
  );
}

export default SingleChat;
