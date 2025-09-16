"use client";

import React, { use, useEffect, useState } from "react";
import { Globe, Lock, X } from "lucide-react";
import Posts, { Post } from "./Posts";
import PostItem from "./PostItem";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios from "axios";
import { repost, setShowPostUploadModal } from "@/features/postSlice";
import { setPostId } from "@/features/authSlice";
import PopupWithLink from "../popups/PopupWithLink";

type RepostProps = {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
};

export default function RepostModal({ isOpen, onClose, post }: RepostProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const dispatch = useAppDispatch();
  const isReposted = true;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

  const handleRepost = async () => {
    dispatch(
      repost({
        isReposted,
        userId: user._id,
        postId: post._id,
        privacy,
      })
    );
    dispatch(setShowPostUploadModal(true));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-lg rounded-2xl shadow-lg relative p-4 pb-8 mt-5 mb-10 
                    bg-[var(--wrapperColor)]/50 
                    max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--textColor)] hover:opacity-70"
        >
          <X size={22} />
        </button>

        {/* User Info */}
        <div className="flex items-center pt-8 justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar!}
              alt={user.userName!}
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="font-semibold text-[var(--textColor)]">
              {user.userName}
            </p>
          </div>
          {/* Privacy Selector */}
          <div className="flex items-center gap-2 bg-[var(--bgColor)]/20 border border-[var(--textColor)]/30 px-3 py-1 rounded-xl cursor-pointer">
            {privacy === "public" ? (
              <Globe className="w-5 h-5 text-blue-500" />
            ) : (
              <Lock className="w-5 h-5 text-red-500" />
            )}
            <select
              value={privacy}
              onChange={(e) =>
                setPrivacy(e.target.value as "public" | "private")
              }
              className="bg-transparent text-sm outline-none cursor-pointer text-[var(--textColor)]"
            >
              <option className="text-black" value="public">
                Public
              </option>
              <option className="text-black" value="private">
                Private
              </option>
            </select>
          </div>
        </div>

        {/* Input box */}
        {/* <textarea
          autoFocus
          value={caption}
          spellCheck={false}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          className="w-full h-16 px-3 pt-3 rounded-t-xl resize-none 
                   border-none
                  bg-[var(--wrapperColor)] 
                   text-[var(--textColor)] 
                   outline-none"
        /> */}

        {/* Original Post Preview */}
        <div
          className=" max-h-[550px] rounded-xl  overflow-hidden px-2 pb-2 pt-3 text-sm mb-4 
                   
                   bg-[var(--wrapperColor)] text-[var(--textColor)]"
        >
          <PostItem hideFooter={true} post={post} />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--borderColor)] 
                     text-[var(--textColor)] hover:opacity-80 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleRepost}
            className="px-4 py-2 rounded-xl transition 
                     bg-[var(--textColor)] text-[var(--bgColor)] hover:opacity-90"
          >
            Repost
          </button>
        </div>
      </div>
    </div>
  );
}
