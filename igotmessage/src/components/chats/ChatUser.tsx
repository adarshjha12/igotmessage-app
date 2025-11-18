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

interface Message {
  sender?: string;
  chat?: string;
  content: string;
  messageType?: string;
  updatedAt: string;
  tempId?: string;
}

function ChatUser() {
  const queryParam = useSearchParams();
  const [inputFocus, setInputFocus] = useState(false);
  const avatar = queryParam.get("avatar");
  const userName = queryParam.get("userName");
  const recieverId = queryParam.get("recieverId");
  const senderId = queryParam.get("senderId");
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);
  const onlineUsers = useAppSelector((state) => state.chat.onlineUsers);

  const [loadingMessages, setLoadingMessages] = useState(true);
  const [isOtherTyping, setOtherTyping] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const [moreButtonClicked, setMoreButtonClicked] = useState(false);

  const [preview, setPreview] = useState<{ url: string; type: string } | null>({
    url: "",
    type: "",
  });
  const addReply = (msg: string) => setReplyTo(msg);
  const cancelReply = () => setReplyTo(null);
  const dispatch = useAppDispatch();

  const reactions = ["❤️", "👍", "😂", "😮", "😢", "🔥"];
  let socket: Socket;
  let chatId: string | null = null;
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [recieverLastSeen, setRecieverLastSeen] = useState<Date | null>(null);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview({ url, type: file.type });
  };

  const removePreview = () => setPreview(null);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const bgUrl =
    "https://plus.unsplash.com/premium_photo-1686063717140-1cd04ce5f76e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZGFyayUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900";

  const lightBgUrl =
    "https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxlYWZ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900";

  useEffect(() => {
    if (inputFocus) {
      const element = document.getElementById("scrolldiv");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          console.log("scrolling to bottom div", inputFocus);
        }, 500);
      }
    }
  }, [inputFocus]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleScroll() {
    const element = document.getElementById("scrolldiv");
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        console.log("scrolling to bottom div", inputFocus);
      }, 50);
    }
  }

  useEffect(() => {
    handleScroll();
    if (allMessages.length > 0) {
      const latest = allMessages.at(-1);
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
      if (userId === recieverId) setRecieverLastSeen(lastSeen);
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, []);

  useEffect(() => {
    let chatIdLocal: string;
    const socket = getSocket();

    async function getChatId() {
      try {
        const res = await axios.post(
          `${url}/api/chat/create-chat`,
          { senderId, recieverId },
          { withCredentials: true }
        );

        if (res.data) {
          chatIdLocal = res.data.chat._id;
          console.log(res.data);

          setRecieverLastSeen(res.data?.receiverLastSeen ?? null);
          dispatch(setChatId(chatIdLocal));

          if (chatIdLocal) {
            setLoadingMessages(true);
            try {
              const res = await axios.get(
                `${url}/api/chat/get-messages?chatId=${chatIdLocal}`,

                { withCredentials: true }
              );

              if (res.data) {
                setAllMessages(res.data.messages);
                setLoadingMessages(false);
              }
            } catch (error) {
              console.log(error);
              setLoadingMessages(false);
            }
          }

          if (socket.connected) {
            socket.emit("event:joinRoom", { roomId: chatIdLocal });
          } else {
            socket.once("connect", () => {
              socket.emit("event:joinRoom", { roomId: chatIdLocal });
            });
          }

          // Chat-specific events
          socket.off("event:message");
          socket.off("event:otherTyping");
          socket.off("event:otherStopTyping");

          socket.on("event:message", (data: any) => {
            setAllMessages((prev) => [
              ...prev,
              {
                content: data.content,
                sender: data.senderId,
                chat: data.roomId,
                messageType: data.messageType,
                updatedAt: data.updatedAt,
              },
            ]);
          });

          socket.on("event:otherTyping", (data: any) => {
            if (data.senderId !== senderId) setOtherTyping(true);
          });

          socket.on("event:otherStopTyping", (data: any) => {
            if (data.senderId !== senderId) setOtherTyping(false);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    getChatId();

    return () => {
      if (chatIdLocal) socket.emit("leaveRoom", { roomId: chatIdLocal });
    };
  }, [recieverId]);

  return (
    <div className="w-full h-screen relative text-[var(--textColor)] sm:px-4 md:px-8 flex flex-col bg-gradient-to-br from-blue-800 via-red-700 to-rose-600">
      {/* Fixed Header */}
      <div className="flex w-full fixed left-0 items-center justify-between py-3 border-b text-white border-white/10 bg-white/10 backdrop-blur-sm top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="py-2 pl-2 rounded-full hover:bg-white/10 transition"
          >
            <ChevronLeftIcon size={22} />
          </button>

          <Link
            className="flex items-center gap-3"
            href={`/public-profile/${recieverId}/myId/${senderId}`}
          >
            <img
              src={avatar!}
              alt="user"
              loading="lazy"
              className="w-10 h-10 rounded-full border border-white/20"
            />

            <div>
              <h2 className="text-xl sm:text-base font-semibold">
                {width && width < 500
                  ? userName?.split("").splice(0, 11).join("") + "..."
                  : userName}
              </h2>

              <div className="text-xs opacity-70">
                {isOtherTyping ? (
                  <span className="text-white font-semibold">Typing...</span>
                ) : onlineUsers?.includes(recieverId!) ? (
                  "Online"
                ) : recieverLastSeen ? (
                  <>
                    Last seen{" "}
                    {formatDistanceToNowStrict(new Date(recieverLastSeen), {
                      addSuffix: true,
                    })}
                  </>
                ) : (
                  "Never seen"
                )}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <Phone size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <Video size={20} />
          </button>
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
        className="flex-1 overflow-y-auto px-2 pt-[95px] pb-[100px] md:px-12 lg:px-16 w-full items-end"
        style={{
          willChange: "scroll-position",
          WebkitOverflowScrolling: "touch",
        }}
      >
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
        {allMessages.length > 0 &&
          allMessages.map((message, i) => {
            const currentDate = new Date(message.updatedAt);
            const isSameDayFlag =
              i > 0 &&
              isSameDay(new Date(allMessages[i - 1].updatedAt), currentDate);

            let formatDate = "";
            if (isValid(currentDate)) {
              if (isToday(currentDate)) formatDate = "Today";
              else if (isYesterday(currentDate)) formatDate = "Yesterday";
              else formatDate = format(currentDate, "dd/MM/yyyy");
            }

            const isSender = message.sender === senderId;

            return (
              <div
                key={i}
                className={`flex ${
                  isSender ? "justify-end" : "justify-start"
                } items-end gap-2 relative group transition-all`}
                onDoubleClick={() => addReply(message.content)}
              >
                {/* Date Separator */}
                {!isSameDayFlag && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 text-xs font-medium rounded-full bg-white/60 text-black shadow border border-white/30">
                      {formatDate}
                    </span>
                  </div>
                )}

                {/* Avatar */}
                {!isSender && (
                  <img
                    src={avatar!}
                    loading="lazy"
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-white/20 shadow"
                  />
                )}

                {/* Bubble */}
                <div
                  className={`max-w-[75%] sm:max-w-[65%] mb-6 my-2 rounded-2xl px-4 py-2 text-[15px] relative transition-all duration-200 ${
                    isSender
                      ? "bg-white/85 text-black rounded-br-none"
                      : "bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 border border-white/20 rounded-bl-none"
                  } shadow`}
                >
                  <p className="leading-relaxed text-lg sm:text-base break-words">
                    {message.content}
                  </p>

                  <span
                    className={`flex items-center gap-1 text-[10px] mt-1 ${
                      isSender
                        ? "justify-end text-black/70"
                        : "justify-start text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {isValid(new Date(message.updatedAt)) &&
                      format(new Date(message.updatedAt), "hh:mm a")}

                    {isSender && (
                      <CheckCheckIcon size={13} className="opacity-70" />
                    )}
                  </span>
                </div>
              </div>
            );
          })}

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
      <ChatInput setFocus={setInputFocus} setAllMessage={setAllMessages} />

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

export default ChatUser;
