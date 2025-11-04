import React, { useEffect, useRef, useState } from "react";
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import ChatInput from "./ChatInput";
import { io, Socket } from "socket.io-client";
import { getSocket } from "@/utils/socket";
import axios from "axios";
import { setChatId } from "@/features/chatSlice";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";

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
  const [isOtherTyping, setOtherTyping] = useState(false);
  const [preview, setPreview] = useState<{ url: string; type: string } | null>({
    url: "",
    type: "",
  });
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [recieverLastSeen, setRecieverLastSeen] = useState<number | null>(null);
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
          setRecieverLastSeen(res.data.recieverLastSeen);
          console.log(chatIdLocal);

          dispatch(setChatId(chatIdLocal));

          if (socket.connected) {
            socket.emit("event:joinRoom", { roomId: chatIdLocal });
            console.log("Joined room immediately");
          } else {
            socket.once("connect", () => {
              console.log("Connected late:", socket.id);
              socket.emit("joinRoom", { roomId: chatIdLocal });
            });
          }

          const handleMessage = (data: any) => {
            console.log("💬 received message", data);
            setAllMessages((prev: Message[]) => [
              ...prev,
              {
                content: data.content,
                sender: data.senderId,
                chat: data.roomId,
                messageType: data.messageType,
                updatedAt: data.updatedAt,
              },
            ]);
          };
          socket.off("event:message");
          socket.off("otherTyping");
          socket.off("otherStopTyping");

          socket.on("event:message", handleMessage);

          socket.on("event:otherTyping", (data: any) => {
            console.log(data);

            if (data.senderId !== senderId) {
              setOtherTyping(true);
            }
          });

          socket.on("event:otherStopTyping", (data: any) => {
            if (data.senderId !== senderId) {
              console.log(data);

              setOtherTyping(false);
            }
          });

          socket.on("onlineUsers", ({ users }) => {
            setOnlineUsers(users);
          });

          socket.on("userOnline", ({ userId }) => {
            setOnlineUsers((prev) => [...prev, userId]);
          });

          socket.on("userOffline", ({ userId, lastSeen }) => {
            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
            setRecieverLastSeen(lastSeen);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    getChatId();

    return () => {
      if (chatIdLocal) {
        socket.emit("leaveRoom", { roomId: chatIdLocal });
      }
    };
  }, []);

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
          <Link className="flex items-center gap-3" href={`/public-profile/${recieverId}/myId/${senderId}`}>
            <img
              src={avatar!}
              alt="user"
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div>
              <h2 className="text-base font-semibold">{userName}</h2>
              <p className="text-xs opacity-70">
                {onlineUsers.includes(recieverId!)
                  ? "Online"
                  : "Last seen " +
                    formatDistanceToNowStrict(recieverLastSeen!, {
                      addSuffix: true,
                    })}
              </p>
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
          <p
            className={` text-xs px-4 py-1 rounded-md ${
              isDark ? "bg-gray-700" : "bg-white"
            }`}
          >
            4: 45 pm
          </p>
        </div>
        {/* Received */}
        {allMessages.length > 0 &&
          allMessages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.sender === senderId ? "justify-end" : "justify-start"
              } items-start gap-2  relative`}
              onDoubleClick={() => addReply("Hey! How’s your app going? 🚀")}
            >
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
                    ? "bg-blue-500 "
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
                  {message.updatedAt}
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
          ))}

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
        {/* {preview && (
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
          )} */}
        <div id="scrolldiv"></div>
      </div>

      {/* 💬 Chat Input */}
      <ChatInput setFocus={setInputFocus} setAllMessage={setAllMessages} />
    </div>
  );
}

export default ChatUser;
