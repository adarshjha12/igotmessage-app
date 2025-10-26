import { PaperPlaneIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
import { Mic, Paperclip, Smile, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ChatInputProps {
  onFileUpload?: (file: File) => void;
  onSend?: (message: string) => void;
  setFocus?: (val: boolean) => void;
  setAllMessage?: (val: any) => void;
}

export default function ChatInput({
  onFileUpload,
  onSend,
  setFocus,
  setAllMessage,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [showSendButton, setShowSendButton] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [input, setInput] = useState("");
  const isDark = useSelector((state: RootState) => state.activity.isDark);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };
  // Auto-grow textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length >= 1) {
      setShowSendButton(true);
    } else {
      setShowSendButton(false);
    }
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`; // max 160px
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setAllMessage &&
      setAllMessage((prev: { message: string; date: string }[]) => [
        ...prev,
        { message: input, date: new Date().toLocaleTimeString() },
      ]);

    setInput("");
    setShowSendButton(false);
    setFocus?.(true);
  };

  return (
    <div className="fixed left-0 bottom-[56px] md:bottom-0 w-full z-10 border-t border-[var(--borderColor)]/20 bg-[var(--bgColor)]/60 backdrop-blur-xl px-3 pt-3 pb-5 md:py-4">
      <div className="max-w-3xl mx-auto w-full flex items-center gap-2">
        {/* 🔲 Inner Wrapper: File + Input + Emoji */}
        <div className="flex relative flex-1 items-center gap-2 px-3 py-2 rounded-3xl bg-[var(--borderColor)]/15 backdrop-blur-md shadow-sm">
          {/* 📎 File Upload */}
          <label className="p-2 rounded-full hover:bg-[var(--borderColor)]/15 transition cursor-pointer flex-shrink-0">
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) =>
                e.target.files && onFileUpload?.(e.target.files[0])
              }
            />
            <Paperclip className="w-5 h-5 text-[var(--textColor)] opacity-70 hover:opacity-100 transition" />
          </label>

          {/* 📝 Text Area */}
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            placeholder="Message"
            onFocus={() => setFocus?.(true)}
            onBlur={() => setFocus?.(false)}
            onInput={handleInput}
            className="flex-1 bg-transparent resize-none border-none outline-none text-[var(--textColor)] text-[16.5px] placeholder:text-[var(--textColor)]/40 leading-relaxed scrollbar-none"
            style={{ maxHeight: "150px" }}
          />

          {/* 😄 Emoji Icon */}
          <button
            onClick={toggleEmojiPicker}
            className="p-2 rounded-full hover:bg-[var(--borderColor)]/15 transition flex-shrink-0"
          >
            <Smile className="w-5 h-5 text-[var(--textColor)] opacity-70 hover:opacity-100" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-[60px] pl-6 left-1/2 -translate-x-1/2 z-20 w-[360px]">
              <div className="overflow-hidden rounded-2xl shadow-2xl border border-[var(--borderColor)]/20 bg-rose-700 backdrop-blur-xl">
                <EmojiPicker
                  onEmojiClick={(emojiObject) =>
                    setInput((prev) => prev + emojiObject.emoji)
                  }
                  theme={isDark ? Theme.DARK : Theme.LIGHT}
                  width="100%"
                  height={400}
                />

                {/* Cancel Button */}
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 border-t border-[var(--borderColor)]/20 text-white font-medium hover:bg-[var(--borderColor)]/10 active:scale-[0.98] active:scale-90 transition-all"
                >
                  <div className="rounded-full p-1 bg-white/30">
                    <X className="w-5 h-5 opacity-80" />
                  </div>
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 🎙️ Mic / Send */}
        {!showSendButton ? (
          <button className="p-3 rounded-full bg-rose-700 transition flex-shrink-0 shadow-sm ml-1">
            <Mic className="w-5 h-5 text-white opacity-90" />
          </button>
        ) : (
          <button
            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform flex-shrink-0 ml-1"
            onClick={() => {
              if (textareaRef.current?.value.trim()) {
                onSend?.(textareaRef.current.value.trim());
                textareaRef.current.value = "";
                handleSend();
              }
            }}
          >
            <PaperPlaneRightIcon
              weight="fill"
              fill="white"
              className="w-5 h-5"
            />
          </button>
        )}
      </div>
    </div>
  );
}
