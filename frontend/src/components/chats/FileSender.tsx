import uploadFiles from "@/utils/uploadFile";
import { Image, Send, X } from "lucide-react";
import React, { useEffect } from "react";
import { useUIStore } from "@/store/zustand/chatStore";
import { useAppDispatch } from "@/store/hooks";
import { getSocket } from "@/utils/socket";
import { setNewMessages } from "@/features/chatSlice";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function FilePreview() {
  const {
    mainFile,
    filePreview,
    setFilePreview: setPreview,
    setMainFile,
    isFileUploading,
    setIsFileuploading,
    setFileUploaded,
  } = useUIStore();

  const dispatch = useAppDispatch();
  const chatId = useSelector((state: RootState) => state.chat.chatId);
  const params = useSearchParams();
  const receiverId = params.get("recieverId");
  const myId = params.get("senderId");

  async function handleFileUploadAndDelivery() {
    // lets upload file first broooo.
    if (!mainFile) return;

    setIsFileuploading(true);
    const response = await uploadFiles([mainFile]);
    if (response[0].url) {
      console.log("imagekitt file response----------------", response);

      const socket = getSocket();
      const tempId = `${Date.now()}abc`;

      socket.emit("event:message", {
        content: response[0].url,
        roomId: chatId,
        messageType: "image",
        senderId: myId,
        receiverId: receiverId,
        tempId,
      });

      dispatch(
        setNewMessages({
          chatId,
          messages: [
            {
              _id: tempId,
              sender: myId,
              content: response[0].url,
              messageTyppe: "image",
              updatedAt: new Date().toISOString(),
            },
          ],
        })
      );
    }

    setFileUploaded();
    setIsFileuploading(false);
    setMainFile(null);
    setPreview(null);
  }

  return (
    <>
      {filePreview && (
        <div
          className="flex items-center justify-between gap-4
               w-full px-3 py-3
               rounded-2xl
               bg-violet-600/10 backdrop-blur-md
               border border-violet-500/30
               shadow-lg shadow-violet-600/20"
        >
          {/* Left: Preview section */}
          <div className="flex items-center gap-3">
            <div
              className="relative w-[120px] rounded-xl rounded-br-md
                   overflow-hidden
                   border border-violet-500/30
                   bg-black/30"
            >
              <img
                src={filePreview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-violet-300 text-sm">
                <Image size={14} />
                <span>Image preview</span>
              </div>
              <span className="text-xs text-white/60">Ready to send</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPreview(null);
                setMainFile(null);
              }}
              className="flex items-center justify-center w-9 h-9 rounded-full
                   bg-white/10 hover:bg-rose-500/20
                   text-white/80 hover:text-rose-400
                   transition active:scale-95"
            >
              <X size={16} />
            </button>

            <button
              onClick={handleFileUploadAndDelivery}
              className="flex items-center justify-center w-10 h-10 rounded-full
                   bg-violet-600 hover:bg-violet-700
                   text-white
                   shadow-md shadow-violet-600/30
                   transition active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FilePreview;
