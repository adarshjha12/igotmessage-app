import React, { useEffect, useRef, useState } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  CheckCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import ChatInput from "./ChatInput";
import { io, Socket } from "socket.io-client";
import { getSocket } from "@/utils/socket";
import axios from "axios";
import { setChatId } from "@/features/chatSlice";

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
  const recieverId = queryParam.get("userId");
  const senderId = useAppSelector((state) => state.auth.user._id);
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);
  const [typing, setTyping] = useState(true);
  const [preview, setPreview] = useState<{ url: string; type: string } | null>({
    url: "",
    type: "",
  });
  
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

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
    "https://images.unsplash.com/photo-1535868463750-c78d9543614f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=876";

  const lightBgUrl =
    "https://images.unsplash.com/photo-1639437038507-749a056cd07c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387";

  const addReply = (msg: string) => setReplyTo(msg);
  const cancelReply = () => setReplyTo(null);
  const dispatch = useAppDispatch();

  const reactions = ["❤️", "👍", "😂", "😮", "😢", "🔥"];
  let socket: Socket;
  let chatId: string | null = null;

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
    async function getChatId() {
      try {
        const res = await axios.post(
          `${url}/api/chat/create-chat`,
          { senderId, recieverId },
          {
            withCredentials: true,
          }
        );
        if (res.data) {
          chatId = res.data.chat._id;
          console.log(chatId);

          if (chatId) {
            dispatch(setChatId(chatId));
            socket = getSocket();
            socket.emit("joinRoom", { roomId: chatId });

            socket.on("event:message", (data) => {
              console.log("senderId", typeof data.senderId);
              console.log("myId", typeof senderId);

              setAllMessages((prev: Message[]) => [
                ...prev,
                {
                  content: data.message,
                  sender: data.senderId,
                  chat: data.roomId,
                  messageType: data.messageType,
                  updatedAt: data.updatedAt,
                },
              ]);
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    getChatId();

    return () => {
      socket = getSocket();
      socket.emit("leaveRoom", { roomId: chatId });
      socket.off("event:message");
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
      className="w-full h-full flex flex-col "
    >
      {/* Header */}
      <div className="flex w-full fixed left-0 items-center justify-between p-3 border-b border-white/10 backdrop-blur-lg bg-white/5 top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <ArrowLeft size={22} />
          </button>
          <img
            src={avatar!}
            alt="user"
            className="w-10 h-10 rounded-full border border-white/20"
          />
          <div>
            <h2 className="text-base font-semibold">{userName}</h2>
            <p className="text-xs opacity-70">
              {typing ? "typing..." : "online"}
            </p>
          </div>
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
      <div className="flex-1 gap-2 ">
        <div
          className={`flex-1 flex-col space-y-6  overflow-y-auto bg-black/15  px-2 pt-[80px] pb-[200px] md:pb-[100px] w-full h-full items-start gap-6`}
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
            allMessages
              .filter(
                (message) => message.sender?.toString() !== senderId.toString()
              )
              .map((message, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 group relative"
                  onDoubleClick={() =>
                    addReply("Hey! How’s your app going? 🚀")
                  }
                >
                  <img
                    src={avatar!}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                  <div
                    className={`max-w-xs md:max-w-sm  rounded-2xl backdrop-blur-xl shadow-md relative chat-tail-right  ${
                      isDark ? "bg-gray-600" : "bg-white"
                    }  text-[var(--textColor)]`}
                  >
                    <p className="px-4 py-2">{message.content}</p>

                    <span
                      className={`text-[10px] px-4 rounded-b-full  text-[var(--textColor)] flex justify-end items-center gap-3 opacity-60  text-right mt-1 ${
                        isDark ? "bg-gray-800" : "bg-gray-300"
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

          {/* Sent - Delivered */}
          {allMessages.length > 0 &&
            allMessages
              .filter(
                (message) => message.sender?.toString() === senderId.toString()
              )
              .map((message, i) => (
                <div
                  key={i}
                  className="flex pr-2 justify-end group relative"
                  onDoubleClick={() =>
                    addReply("It’s going amazing! I just added stories 🎉")
                  }
                >
                  <div className="chat-tail-left max-w-xs md:max-w-sm  text-white  rounded-2xl backdrop-blur-xl bg-orange-700 shadow-md relative">
                    <p className="px-4 py-2">{message.content}</p>
                    <span className="text-[10px] px-4 rounded-b-full bg-orange-900 flex justify-end items-center gap-3 opacity-60  text-right mt-1">
                      {message.updatedAt}
                      <span className="ml-1">
                        <CheckCheck color="aqua" size={16} />
                      </span>
                    </span>

                    {/* Reaction bar */}
                    {/* <div className="hidden group-hover:flex absolute -top-8 right-0 gap-2 p-1 rounded-full backdrop-blur-lg bg-white/20 shadow-md">
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
              ))}

          {/* Typing Indicator */}
          {/* {typing && (
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
          )} */}

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

          {/* Reply Preview */}
          {/* {replyTo && (
            <div className="px-4 py-2 border-t border-white/10 backdrop-blur-lg bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <Reply size={18} />
                <span className="opacity-80 truncate max-w-[200px]">
                  {replyTo}
                </span>
              </div>
              <button
                onClick={cancelReply}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>
          )} */}
        </div>
      </div>

      {/* 💬 Chat Input */}
      <ChatInput setFocus={setInputFocus} setAllMessage={setAllMessages} />
      <div id="scrolldiv"></div>
    </div>
  );
}

export default ChatUser;
