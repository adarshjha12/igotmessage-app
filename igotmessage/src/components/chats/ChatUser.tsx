import React, { useEffect, useRef, useState } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Loader2Icon,
  X,
  CheckCheckIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import ChatInput from "./ChatInput";
import { io, Socket } from "socket.io-client";
import { getSocket } from "@/utils/socket";
import axios from "axios";
import { setChatId } from "@/features/chatSlice";
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
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isOtherTyping, setOtherTyping] = useState(false);
  const [preview, setPreview] = useState<{ url: string; type: string } | null>({
    url: "",
    type: "",
  });
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
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

  const addReply = (msg: string) => setReplyTo(msg);
  const cancelReply = () => setReplyTo(null);
  const dispatch = useAppDispatch();

  const reactions = ["❤️", "👍", "😂", "😮", "😢", "🔥"];
  let socket: Socket;
  let chatId: string | null = null;

  useEffect(() => {
    const element = document.getElementById("scrolldiv");
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        console.log("scrolling to bottom div", inputFocus);
      }, 500);
    }
  }, [inputFocus]);

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
    return () => {};
  }, [allMessages]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("onlineUsers", ({ onlineUsers }) => {
      console.log("onlineUsers", onlineUsers);
      setOnlineUsers(onlineUsers);
    });

    socket.on("userOnline", ({ userId }) => {
      setOnlineUsers((prev) =>
        prev ? [...new Set([...prev, userId])] : [userId]
      );
    });

    socket.on("userOffline", ({ userId, lastSeen }) => {
      setOnlineUsers((prev) =>
        prev ? prev.filter((id) => id !== userId) : []
      );
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
          setRecieverLastSeen(res.data?.recieverLastSeen);
          dispatch(setChatId(chatIdLocal));

          if (chatIdLocal) {
            setLoadingMessages(true);
            const res = await axios.get(
              `${url}/api/chat/get-messages?chatId=${chatIdLocal}`,

              { withCredentials: true }
            );

            if (res.data) {
              setAllMessages(res.data.messages);
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
    <div
      style={{
        backgroundImage: `url(${isDark ? bgUrl : lightBgUrl})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
      className="w-full h-screen text-[var(--textColor)] sm:px-4 md:px-8 flex flex-col backdrop-blur-md lg:px-[200px] xl:px-[300px]"
    >
      {/* Header */}
      <div className="flex w-full fixed left-0 items-center justify-between p-3 border-b text-white border-white/10 backdrop-blur-lg bg-white/5 top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <ArrowLeft size={22} />
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
              <h2 className="text-base font-semibold">{userName}</h2>
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
                  ""
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
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className={`flex-1 flex-col space-y-6  overflow-y-auto  px-2 pt-[80px] pb-[100px] md:px-12 lg:px-16 w-full items-end gap-6`}
      >
        {/* message timer */}
        <div className="flex justify-center w-full text-[var(--textColor)]/80">
          {/* <p
            className={` text-xs px-4 py-1 rounded-md ${
              isDark ? "bg-gray-700" : "bg-white"
            }`}
          >
            4: 45 pm
          </p> */}
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
                } items-start gap-2  relative`}
                onDoubleClick={() => addReply("Hey! How’s your app going? 🚀")}
              >
                {!isSameDayFlag && (
                  <div className="flex absolute -top-[40px] left-[50%] justify-center my-3">
                    <span className="px-4 py-1 text-xs font-medium rounded-full bg-white/80 text-gray-900 backdrop-blur-md">
                      <p>{formatDate} </p>
                    </span>
                  </div>
                )}
                {message.sender !== senderId && (
                  <img
                    src={avatar!}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                )}
                <div
                  className={`${
                    message.sender === senderId
                      ? "chat-tail-left mr-2"
                      : "chat-tail-right"
                  }  rounded-2xl backdrop-blur-xl text-white shadow-md relative  ${
                    message.sender === senderId
                      ? "bg-green-600 "
                      : isDark && message.sender !== senderId
                      ? "bg-gray-600"
                      : !isDark && message.sender !== senderId
                      ? "bg-gray-600"
                      : "bg-gray-600"
                  }  text-[var(--textColor)]`}
                >
                  <p className="px-4 py-2">{message.content}</p>

                  <span
                    className={`text-[10px] px-4 text-white rounded-b-full flex justify-end items-center gap-3 opacity-60  text-right mt-1 ${
                      isDark ? "bg-gray-800 " : "bg-gray-800"
                    }`}
                  >
                    {isValid(new Date(message.updatedAt)) &&
                      format(new Date(message.updatedAt), "hh:mm a")}

                    {message.sender === senderId && (
                      <CheckCheckIcon size={15} />
                    )}
                  </span>

                  {/* Reaction bar (on hover/long press) */}
                  <div className="hidden group-hover:flex absolute -top-8 left-0 gap-2 p-1 rounded-full backdrop-blur-lg bg-white/20 shadow-md">
                    {reactions.map((r, i) => (
                      <button
                        key={i}
                        className="hover:scale-110 transition text-lg"
                        onClick={() => console.log("Reacted:", r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
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
    </div>
  );
}

export default ChatUser;
