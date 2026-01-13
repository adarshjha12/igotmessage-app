import { PaperPlaneIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
import {
  ImagePlusIcon,
  Mic,
  Paperclip,
  Send,
  Smile,
  SparklesIcon,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getSocket } from "@/utils/socket";
import VoiceRecorder from "./RecordAudio";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setNewMessages } from "@/features/chatSlice";
import { useUIStore } from "@/store/zustand/chatStore";

interface ChatInputProps {
  onFileUpload?: (file: File) => void;
  onSend?: (message: string) => void;
  setFocus?: (val: "normal" | "input") => void;
  receiverId?: string;
  isAiChat?: boolean;
  setAllMessage?: (val: any) => void;
}
interface Message {
  sender?: string;
  chat?: string;
  content: string;
  messageType?: string;
  updatedAt: string;
  _id?: string;
}

const ChatInput = React.memo(
  ({ onSend, setFocus, isAiChat }: ChatInputProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dispatch = useAppDispatch();
    const { aiChatSuggestions } = useUIStore();
    const {
      mainFile,
      filePreview,
      setMainFile,
      setFilePreview,
      removeFilePreview,
    } = useUIStore();

    const [showSendButton, setShowSendButton] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [input, setInput] = useState("");
    const isDark = useSelector((state: RootState) => state.activity.isDark);
    const chatId = useSelector((state: RootState) => state.chat.chatId);
    const params = useSearchParams();
    const receiverId = params.get("recieverId");
    const myId = params.get("senderId");

    let isTyping = false;
    let typingTimeout: NodeJS.Timeout | null = null;

    const toggleEmojiPicker = () => {
      setShowEmojiPicker((prev) => !prev);
    };
    // Auto-grow textarea
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;

      const socket = getSocket();

      if (!isTyping) {
        socket.emit("event:typing", { roomId: chatId, senderId: myId });
        isTyping = true;
      }

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      typingTimeout = setTimeout(() => {
        socket.emit("event:stopTyping", { roomId: chatId, senderId: myId });
        isTyping = false;
      }, 4500);

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

      const socket = getSocket();
      const tempId = `${Date.now()}abc`;

      socket.emit("event:message", {
        content: input,
        roomId: chatId,
        senderId: myId,
        receiverId: receiverId,
        tempId,
        messageType: "text",
      });

      dispatch(
        setNewMessages({
          chatId,
          messages: [
            {
              _id: tempId,
              sender: myId,
              content: input,
              updatedAt: new Date().toISOString(),
              messageType: "text",
            },
          ],
        })
      );

      setInput("");
      setShowSendButton(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);

      setMainFile(file);
      setFilePreview(url);

      if (url) {
        URL.revokeObjectURL(filePreview || "");
      }
    };

    useEffect(() => {
      if (input.length > 0) {
        setShowSendButton(true);
      } else {
        setShowSendButton(false);
      }
      return () => {};
    }, [input]);

    useEffect(() => {
      if (isAiChat) {
        setInput(aiChatSuggestions);
      }
    }, [aiChatSuggestions]);

    useEffect(() => {
      console.log("mainFile", mainFile);
      console.log("filePreview", filePreview);

      return () => {};
    }, [mainFile, filePreview]);

    return (
      <div className="fixed left-0  bottom-0 w-full z-10 px-3 pt-3 pb-3 md:py-4">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-2">
          {/* 🔲 Inner Wrapper: File + Input + Emoji */}
          <div
            className={`flex relative flex-1 items-center gap-2 px-3 py-3 rounded-3xl bg-gray-700 text-white  backdrop-blur-md shadow-sm`}
          >
            {/* 📎 File Upload */}
            {!isAiChat && (
              <label className="px-2 rounded-full hover:bg-[var(--borderColor)]/15 transition cursor-pointer flex-shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <ImagePlusIcon className="w-5 h-5  opacity-70 hover:opacity-100 transition" />
              </label>
            )}

            {isAiChat && (
              <SparklesIcon className="w-5 h-5  opacity-70 hover:opacity-100 transition" />
            )}

            {/* 📝 Text Area */}
            <textarea
              ref={textareaRef}
              value={input}
              rows={1}
              placeholder="Message"
              onClick={() => setFocus && setFocus("input")}
              onInput={handleInput}
              className={`flex-1 w-[100px] bg-transparent resize-none border-none outline-none  text-[16.5px] placeholder:/40 leading-relaxed scrollbar-none ${
                isAiChat && "placeholder:pl-4"
              }`}
              style={{ maxHeight: "150px" }}
            />

            {/* 😄 Emoji Icon */}
            {!isAiChat && (
              <button
                onClick={toggleEmojiPicker}
                className="px-2 rounded-full hover:bg-[var(--borderColor)]/15 transition flex-shrink-0"
              >
                <Smile className="w-5 h-5  opacity-70 hover:opacity-100" />
              </button>
            )}

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

          <button
            className="p-3  bg-[#ffffff] text-black rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform flex-shrink-0 ml-1"
            onClick={() => {
              if (textareaRef.current?.value.trim()) {
                onSend?.(textareaRef.current.value.trim());
                textareaRef.current.value = "";
                handleSend();
              }
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
);

export default ChatInput;
