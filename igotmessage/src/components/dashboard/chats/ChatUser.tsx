import React, { useEffect, useRef, useState } from "react";
import {
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Mic,
  X,
  Reply,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";

function ChatUser() {
  const queryParam = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputFocus, setInputFocus] = useState(false);
  const avatar = queryParam.get("avatar");
  const userName = queryParam.get("userName");
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);
  const [typing, setTyping] = useState(true);
  const [preview, setPreview] = useState<{ url: string; type: string } | null>({
    url: "",
    type: "",
  });
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview({ url, type: file.type });
  };

  const removePreview = () => setPreview(null);

  const bgUrl =
    "https://images.unsplash.com/photo-1518112166137-85f9979a43aa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387";

  const lightBgUrl =
    "https://images.unsplash.com/photo-1639437038507-749a056cd07c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387";

  const addReply = (msg: string) => setReplyTo(msg);
  const cancelReply = () => setReplyTo(null);

  const reactions = ["❤️", "👍", "😂", "😮", "😢", "🔥"];

  useEffect(() => {
    if (inputFocus) {
      const element = document.getElementById("inputdiv");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [inputFocus]);

  return (
    <div className="w-full h-full flex flex-col ">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 backdrop-blur-lg bg-white/5 sticky top-0 z-10">
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
      <div
        style={{
          backgroundImage: `url(${isDark ? bgUrl : lightBgUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className="flex-1 gap-2 "
      >
        <div
          className={`flex-1 flex-col space-y-6  overflow-y-auto bg-black/15 p-4 w-full h-full items-start gap-6`}
        >
          {/* Received */}
          <div
            className="flex items-start gap-2 group relative"
            onDoubleClick={() => addReply("Hey! How’s your app going? 🚀")}
          >
            <img
              src={avatar!}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-white/20"
            />
            <div
              className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl backdrop-blur-xl shadow-md relative chat-tail-right  ${
                isDark ? "bg-gray-600" : "bg-white"
              }  text-[var(--textColor)]`}
            >
              <p>Hey! How’s your app going? 🚀</p>
              <span className="text-[10px] opacity-60 block mt-1">
                10:20 AM
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

          {/* Sent - Delivered */}
          <div
            className="flex justify-end group relative"
            onDoubleClick={() =>
              addReply("It’s going amazing! I just added stories 🎉")
            }
          >
            <div className="chat-tail-left max-w-xs md:max-w-sm px-4 text-white py-2 rounded-2xl backdrop-blur-xl bg-blue-600 shadow-md relative">
              <p>It’s going amazing! I just added stories 🎉</p>
              <span className="text-[10px] opacity-60 block text-right mt-1">
                10:21 AM <span className="ml-1">✔✔</span>
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
      <div className="fixed md:sticky left-0 bottom-[56px] w-full z-10 border-t border-[var(--borderColor)]/20 bg-[var(--bgColor)]/60 backdrop-blur-xl px-3 pt-3 pb-5  md:py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          {/* 📎 File Upload */}
          <label className="p-2.5 rounded-full hover:bg-[var(--borderColor)]/10 transition cursor-pointer flex-shrink-0">
            <Paperclip size={22} className="text-[var(--textColor)]/70" />
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* ✏️ Text Area */}
          <div
            id="inputdiv"
            className="flex-1 flex items-center bg-[var(--wrapperColor)]/60 border border-[var(--borderColor)]/30 rounded-3xl px-4 py-2.5 shadow-sm backdrop-blur-lg"
          >
            <textarea
              id="textarea"
              ref={textareaRef}
              rows={1}
              placeholder="Message..."
              onFocus={() => {
                setTimeout(() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }, 150);
              }}
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  160
                )}px`; // 160px = max-h-40
              }}
              className="flex-1 bg-transparent resize-none outline-none text-[var(--textColor)] text-[17px] placeholder:text-[var(--textColor)]/40 leading-relaxed scrollbar-none"
            />
          </div>

          {/* 🎙️ Mic / Send */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="p-2.5 rounded-full hover:bg-[var(--borderColor)]/10 transition">
              <Mic size={22} className="text-[var(--textColor)]/70" />
            </button>

            <button className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform">
              <PaperPlaneRightIcon weight="fill" fill="#fff" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatUser;
