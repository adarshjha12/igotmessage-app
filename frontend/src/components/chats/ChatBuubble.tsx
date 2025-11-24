import React from "react";
import { isToday, isYesterday, isSameDay, isValid, format } from "date-fns";
import { CheckCheckIcon } from "lucide-react";

interface Message {
  _id?: string;
  sender?: string;
  chat?: string;
  content: string;
  messageType?: string;
  updatedAt: string;
  tempId?: string;
}
export interface MessageBubbleProps {
  message: Message;
  previousMessage: Message | null;
  avatar: string;
  senderId: string;
  addReply: (msg: string) => void;
}

export interface MessagesListProps {
  allMessages: Message[];
  senderId: string;
  avatar: string;
  addReply: (msg: string) => void;
}

const MessageBubble = React.memo(function MessageBubble({
  message,
  previousMessage,
  avatar,
  senderId,
  addReply,
}: MessageBubbleProps) {
  const currentDate = new Date(message.updatedAt);
  const isSender = message.sender === senderId;

  const isSameDayFlag =
    previousMessage &&
    isSameDay(new Date(previousMessage.updatedAt), currentDate);

  let formatDate = "";
  if (isValid(currentDate)) {
    if (isToday(currentDate)) formatDate = "Today";
    else if (isYesterday(currentDate)) formatDate = "Yesterday";
    else formatDate = format(currentDate, "dd/MM/yyyy");
  }

  return (
    <div
      className={`flex ${
        isSender ? "justify-end" : "justify-start"
      } items-end gap-2 relative group transition-all`}
      onDoubleClick={() => addReply(message.content)}
    >
      {/* DATE SEPARATOR */}
      {!isSameDayFlag && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 text-xs font-medium rounded-full bg-[#D4AF37] text-black shadow border border-white/30">
            {formatDate}
          </span>
        </div>
      )}

      {/* AVATAR */}
      {!isSender && (
        <img
          src={avatar}
          loading="lazy"
          alt="avatar"
          className="w-8 h-8 rounded-full border border-white/20 shadow"
        />
      )}

      {/* BUBBLE */}
      <div
        className={`max-w-[75%] sm:max-w-[65%] mb-6 my-2 rounded-2xl px-4 py-2 text-[15px] relative transition-all ${!isSameDayFlag && "mt-12"} duration-200 ${
          isSender
            ? "bg-[#6d28d9] text-white rounded-br-none"
            : "bg-[#dfdee2] text-[#06000e]  border-[#6d28d955]  shadow-[0_0_12px_#6d28d9aa] rounded-bl-none"
        } shadow`}
      >
        <p className="leading-relaxed text-lg sm:text-base break-words">
          {message.content}
        </p>

        <span
          className={`flex items-center gap-1 text-[10px] mt-1 ${
            isSender
              ? "justify-end text-white/70"
              : "justify-start text-black/80"
          }`}
        >
          {isValid(currentDate) && format(currentDate, "hh:mm a")}

          {isSender && <CheckCheckIcon size={13} className="opacity-70" />}
        </span>
      </div>
    </div>
  );
});

export default MessageBubble;
const MessagesList = React.memo(function MessagesList({
  allMessages,
  senderId,
  avatar,
  addReply,
}: MessagesListProps) {
  return (
    <>
      {allMessages.map((msg, i) => (
        <MessageBubble
          key={msg._id || i}
          message={msg}
          previousMessage={i > 0 ? allMessages[i - 1] : null}
          avatar={avatar}
          senderId={senderId}
          addReply={addReply}
        />
      ))}
    </>
  );
});

export { MessagesList };
