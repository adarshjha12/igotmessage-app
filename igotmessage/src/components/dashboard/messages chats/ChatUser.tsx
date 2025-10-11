import React, { useState } from "react";
import {
  Send,
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

function ChatUser() {
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

  const addReply = (msg: string) => setReplyTo(msg);
  const cancelReply = () => setReplyTo(null);

  const reactions = ["❤️", "👍", "😂", "😮", "😢", "🔥"];

  return (
     <div
    className="w-full h-screen flex flex-col pb-12"
    style={{ backgroundColor: "var(--bgColor)", color: "var(--textColor)" }}
  >
    {/* Header */}
    <div className="flex items-center justify-between p-3 border-b border-white/10 backdrop-blur-lg bg-white/5 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <ArrowLeft size={22} />
          </button>
          <img
            src="https://via.placeholder.com/40"
            alt="user"
            className="w-10 h-10 rounded-full border border-white/20"
          />
          <div>
            <h2 className="text-base font-semibold">John Doe</h2>
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
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Received */}
        <div
          className="flex items-start gap-2 group relative"
          onDoubleClick={() => addReply("Hey! How’s your app going? 🚀")}
        >
          <img
            src="https://via.placeholder.com/35"
            alt="avatar"
            className="w-8 h-8 rounded-full border border-white/20"
          />
          <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl backdrop-blur-xl bg-white/10 shadow-md relative">
            <p>Hey! How’s your app going? 🚀</p>
            <span className="text-[10px] opacity-60 block mt-1">10:20 AM</span>

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
          <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-green-700 to-green-800 shadow-md relative">
            <p>It’s going amazing! I just added stories 🎉</p>
            <span className="text-[10px] opacity-60 block text-right mt-1">
              10:21 AM <span className="ml-1">✔✔</span>
            </span>

            {/* Reaction bar */}
            <div className="hidden group-hover:flex absolute -top-8 right-0 gap-2 p-1 rounded-full backdrop-blur-lg bg-white/20 shadow-md">
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

        {/* Sent - Seen */}
        <div
          className="flex justify-end group relative"
          onDoubleClick={() => addReply("Nice! Can’t wait to see it 🔥")}
        >
          <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 shadow-md relative">
            <p>Nice! Can’t wait to see it 🔥</p>
            <span className="text-[10px] opacity-60 block text-right mt-1">
              10:23 AM <span className="ml-1 text-sky-400 font-bold">✔✔</span>
            </span>

            {/* Reaction bar */}
            <div className="hidden group-hover:flex absolute -top-8 right-0 gap-2 p-1 rounded-full backdrop-blur-lg bg-white/20 shadow-md">
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

        {/* Typing Indicator */}
        {typing && (
          <div className="flex items-start gap-2">
            <img
              src="https://via.placeholder.com/35"
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
      </div>

      {/* File Preview */}
      {preview && (
        <div className="p-3 flex items-center gap-3 border-t border-white/10 backdrop-blur-lg bg-white/5">
          {preview.type.startsWith("image/") ? (
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
          <button
            onClick={removePreview}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Reply Preview */}
      {replyTo && (
        <div className="px-4 py-2 border-t border-white/10 backdrop-blur-lg bg-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm">
            <Reply size={18} />
            <span className="opacity-80 truncate max-w-[200px]">{replyTo}</span>
          </div>
          <button
            onClick={cancelReply}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Input Box */}
       <div className="border-t border-white/10 backdrop-blur-lg bg-white/5 sticky bottom-0 pb-8 z-10 p-3">
      <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <Smile size={22} />
          </button>

          {/* Hidden file input */}
          <label className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer">
            <Paperclip size={22} />
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <textarea
         
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 max-h-40 resize-none rounded-full outline-none bg-white/10 backdrop-blur-lg placeholder-white/50 text-sm placeholder:text-lg"
          />

          {/* Mic or Send button */}
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <Mic size={22} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatUser;
