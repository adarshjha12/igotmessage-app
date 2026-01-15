"use client";
import { setChatId } from "@/features/chatSlice";
import { useAppDispatch } from "@/store/hooks";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function CreatingChatUi() {
  const queryParam = useSearchParams();
  const [loadingChatId, setLoadingChatId] = useState(false);
  const recieverId = queryParam.get("recieverId");
  const senderId = queryParam.get("senderId");
  const username = queryParam.get("userName");
  const avatar = queryParam.get("avatar");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  useEffect(() => {
    async function getChatId() {
      setLoadingChatId(true);

      try {
        const res = await axios.post(
          `${url}/api/chat/create-chat`,
          { senderId, recieverId },
          { withCredentials: true }
        );

        if (res.data.chat._id) {
          console.log(
            res.data,
            "=============================================="
          );
          dispatch(setChatId(res.data.chat._id));
          router.replace(
            `/chats/${recieverId}?avatar=${avatar}&userName=${username}&recieverId=${recieverId}&senderId=${senderId}&chatId=${res.data.chat._id}`
          );
        }
      } catch (error) {
        setLoadingChatId(false);
        console.log(error);
      }
    }

    getChatId();

    return () => {};
  }, []);

  return (
    <div className="h-screen w-full bg-[var(--bgColor)] flex flex-col items-center justify-center gap-3">
      <div className="flex gap-2">
        <div className="w-8 h-14 rounded-full bg-green-600 animate-pulse" />
        <div className="w-10 h-14 rounded-full bg-green-600 animate-pulse delay-150" />
        <div className="w-8 h-14 rounded-full bg-green-600 animate-pulse delay-300" />
      </div>

      <p className="text-lg text-[var(--textColor)] uppercase tracking-widest">
        Creating Chat
      </p>
    </div>
  );
}

export default CreatingChatUi;
