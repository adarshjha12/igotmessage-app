import { PaperPlaneIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
import { Mic, Paperclip } from "lucide-react";
import { useEffect, useRef } from "react";

interface ChatInputProps {
  containerRef?: React.RefObject<HTMLDivElement>; // optional scrollable chat container
  onFileUpload?: (file: File) => void;
  onSend?: (message: string) => void;
  setFocus?: (val: boolean) => void;
}

export default function ChatInput({
  containerRef,
  onFileUpload,
  onSend,
  setFocus
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`; // max 160px
  };

  return (
    <div className="fixed md:sticky left-0 bottom-[56px] w-full z-10 border-t border-[var(--borderColor)]/20 bg-[var(--bgColor)]/60 backdrop-blur-xl px-3 pt-3 pb-5 md:py-4">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        {/* 📎 File Upload */}
        <label className="p-2.5 rounded-full hover:bg-[var(--borderColor)]/10 transition cursor-pointer flex-shrink-0">
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) =>
              e.target.files && onFileUpload?.(e.target.files[0])
            }
          />
          <Paperclip className="w-5 h-5 text-[var(--textColor)]" />
        </label>

        {/* ✏️ Text Area */}
        <div className="flex-1 flex items-center bg-[var(--wrapperColor)]/60 border border-[var(--borderColor)]/30 rounded-3xl px-4 py-2.5 shadow-sm backdrop-blur-lg">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Message..."
            onFocus={() => {
              setFocus?.(true);
            }}
            onInput={handleInput}
            className="flex-1 bg-transparent resize-none outline-none text-[var(--textColor)] text-[17px] placeholder:text-[var(--textColor)]/40 leading-relaxed scrollbar-none"
          />
        </div>

        {/* 🎙️ Mic / Send */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="p-2.5 rounded-full hover:bg-[var(--borderColor)]/10 transition">
            <Mic className="w-5 h-5 text-[var(--textColor)]" />
          </button>
          <button
            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform"
            onClick={() => {
              if (textareaRef.current?.value.trim()) {
                onSend?.(textareaRef.current.value.trim());
                textareaRef.current.value = "";
                handleInput({ target: textareaRef.current } as any);
              }
            }}
          >
            <PaperPlaneRightIcon
              weight="fill"
              fill="white"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
