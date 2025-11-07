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

  const [loadingMessages, setLoadingMessages] = useState(false);
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
    <div className="w-full h-[100dvh] relative text-[var(--textColor)] sm:px-4 md:px-8 flex flex-col backdrop-blur-md lg:px-[200px] xl:px-[300px] bg-gradient-to-br from-blue-800 via-red-700 to-rose-600">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] -z-10" />

      {/* Header */}
      <div className="flex w-full fixed left-0 items-center justify-between py-3 border-b text-white border-white/10 backdrop-blur-lg bg-white/5 top-0 z-10">
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
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div>
              <h2 className="text-xl sm:text-base font-semibold">
                {width && width < 500
                  ? userName?.split("").splice(0, 11).join("") + "..."
                  : userName}
              </h2>
              <div className="text-xs opacity-70">
                {isOtherTyping && (
                  <span className="text-white  font-semibold">Typing...</span>
                )}

                {!isOtherTyping && onlineUsers?.includes(recieverId!) ? (
                  "Online"
                ) : !isOtherTyping && recieverLastSeen ? (
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

      {/* Chat Messages */}
      <div
        className={`flex-1 flex-col space-y-6  overflow-y-auto  px-2 pt-[95px] pb-[100px] md:px-12 lg:px-16 w-full items-end gap-6`}
      >
        {/* message timer */}
        <div className="flex justify-center w-full text-[var(--textColor)]/80">
          {/* loader */}
          {loadingMessages && (
            <div className="flex text-white items-center gap-3 bg-black/15 px-4 py-2 rounded-2xl backdrop-blur-md">
              <Loader2Icon className="animate-spin" />
              <p> Getting messages</p>
            </div>
          )}
        </div>
        {/* Received */}
        {allMessages.length > 0 &&
          allMessages.map((message, i) => {
            const currentDate = new Date(message.updatedAt);

            const isSameDayFlag =
              i > 0 &&
              isSameDay(new Date(allMessages[i - 1].updatedAt), currentDate);

            let formatDate = "";

            if (isValid(currentDate)) {
              if (isToday(currentDate)) {
                formatDate = "Today";
              } else if (isYesterday(currentDate)) {
                formatDate = "Yesterday";
              } else {
                formatDate = format(currentDate, "dd/MM/yyyy");
              }
            }

            return (
              <div
                key={i}
                className={`flex ${
                  message.sender === senderId ? "justify-end" : "justify-start"
                } items-end gap-2 relative group transition-all`}
                onDoubleClick={() => addReply("Hey! How’s your app going? 🚀")}
              >
                {/* Date label */}
                {!isSameDayFlag && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                    <span className="px-4  py-1 text-xs font-medium rounded-full bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-gray-200 backdrop-blur-md shadow-sm border border-white/20">
                      {formatDate}
                    </span>
                  </div>
                )}

                {/* Avatar (only for incoming messages) */}
                {message.sender !== senderId && (
                  <img
                    src={avatar!}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-white/20 shadow-md"
                  />
                )}

                {/* Message bubble */}
                <div
                  className={`max-w-[75%] my-2 sm:max-w-[65%] rounded-2xl px-4 py-2 text-[15px] relative backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all duration-300 ${
                    message.sender === senderId
                      ? " bg-white/80 backdrop-blur-xs text-black rounded-br-none"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border border-white/20 rounded-bl-none"
                  }`}
                >
                  {/* Message text */}
                  <p className="leading-relaxed text-lg sm:text-base break-words">
                    {message.content}
                  </p>

                  {/* Timestamp and ticks */}
                  <span
                    className={`flex items-center gap-1 text-[10px] mt-1 ${
                      message.sender === senderId
                        ? "justify-end text-black/80"
                        : "justify-start text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {isValid(new Date(message.updatedAt)) &&
                      format(new Date(message.updatedAt), "hh:mm a")}
                    {message.sender === senderId && (
                      <CheckCheckIcon size={13} className="opacity-70" />
                    )}
                  </span>

                  {/* Reaction bar (appears on hover) */}
                  {/* <div className="hidden group-hover:flex absolute -top-8 left-1/2 -translate-x-1/2 gap-1 p-1 rounded-full backdrop-blur-lg bg-white/30 dark:bg-gray-700/40 shadow-md border border-white/20 transition-all">
                    {reactions.map((r, i) => (
                      <button
                        key={i}
                        className="hover:scale-110 transition text-lg"
                        onClick={() => console.log("Reacted:", r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div> */}
                </div>
              </div>
            );
          })}

        {/* Typing Indicator */}
        {isOtherTyping && (
          <div className="flex items-start gap-2">
            <img
              src={avatar!}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-white/20"
            />
            <div className="px-4 py-2 rounded-2xl backdrop-blur-xl bg-white/10 shadow-md flex gap-1">
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        {/* File Preview */}
        {preview?.url && (
          <div className="p-3 flex items-center gap-3 border-t border-white/10 backdrop-blur-lg bg-white/5">
            {preview.url !== "" && (
              <div>
                {preview?.type.startsWith("image/") ? (
                  <img
                    src={preview.url}
                    alt="preview"
                    className="w-16 h-16 rounded-lg object-cover border border-white/20"
                  />
                ) : (
                  <video
                    src={preview.url}
                    className="w-24 h-16 rounded-lg border border-white/20"
                    controls
                  />
                )}
              </div>
            )}
            <button
              onClick={removePreview}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div id="scrolldiv"></div>
      </div>

      {/* 💬 Chat Input */}
      <ChatInput setFocus={setInputFocus} setAllMessage={setAllMessages} />

      {moreButtonClicked && (
        <div className="">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMoreButtonClicked(false)}
          />
          <MoreOption onClose={() => setMoreButtonClicked(false)} />
        </div>
      )}
    </div>
  );
}

export default ChatUser;
