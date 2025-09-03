import React, { useEffect, useState } from "react";
import PostMedia from "./PostMedia";
import Poll from "./Poll";
import {
  UserIcon,
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  Globe,
  Lock,
  Check,
} from "lucide-react";
import { Post } from "./Posts";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import Comment from "./Comment";

export interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length ?? 0);
  const userId = useAppSelector((state) => state.auth.user._id);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/post/toggle-like`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/post/toggle-like`;

  useEffect(() => {
    if (post.likes?.includes(userId)) {
      setLikeClicked(true);
    }
  }, [post, userId]);

  const handleLike = async () => {
    try {
      setLikeClicked((prev) => {
        setLikeCount((count) => (prev ? count - 1 : count + 1));
        return !prev;
      });

      const res = await axios.post(
        url,
        { userId, postId: post._id },
        { withCredentials: true }
      );

      if (res) {
        setLikeCount(res.data.likeCount);
      }
    } catch (error) {
      console.error("toggle like error", error);
      setLikeClicked((prev) => !prev);
    }
  };

  return (
    <div className="rounded-2xl bg-[var(--wrapperColor)] p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="#">
            {post.user?.profilePicture ? (
              <img
                src={post.user.profilePicture ?? ""}
                alt="avatar"
                className="w-11 h-11 border border-[var(--borderColor)]/50 rounded-full object-cover cursor-pointer hover:opacity-90 transition"
              />
            ) : (
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[var(--borderColor)]/20">
                <UserIcon size={24} className="text-[var(--textColor)]/80" />
              </div>
            )}
          </Link>

          <div className="flex flex-col">
            <Link href="#">
              <span className="font-semibold text-xl sm:text-base text-[var(--textColor)] hover:underline cursor-pointer">
                {post?.user?.userName}
              </span>
            </Link>
            <div className="flex items-center gap-2">
              {post?.privacy === "public" ? (
                <Globe className="w-3 h-3 text-[var(--textColor)]/60" />
              ) : (
                <Lock className="w-3 h-3 text-red-500" />
              )}

              <span className="text-sm sm:text-xs text-[var(--textColor)]/60">
                {formatDistanceToNow(new Date(post?.createdAt ?? ""), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {post?.user && (
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500">
              <Check size={14} className="text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Three dots menu */}
        <button className="p-2 rounded-full hover:bg-[var(--borderColor)]/20 transition">
          <MoreVertical className="text-[var(--textColor)]" size={20} />
        </button>
      </div>

      {/* --- Text / Media / Poll --- */}
      {post?.postType === "normal" ? (
        <>
          {post?.text && (
            <p className="mb-3 text-lg sm:text-sm font-medium text-[var(--textColor)] leading-relaxed">
              {post.text}
            </p>
          )}

          {post?.mediaUrls && post.mediaUrls.length > 0 && (
            <div className=" rounded-xl mb-3">
              <PostMedia urls={post.mediaUrls} />
            </div>
          )}
        </>
      ) : (
        post?.poll && <Poll postId={post._id} pollData={post.poll} />
      )}

      {/* --- Footer Actions --- */}
      <div className="flex items-center justify-between mt-3 pt-3  text-[var(--textColor)]/80 text-sm transition-all duration-400 ease-in">
        <button
          type="button"
          onClick={handleLike}
          className="flex items-center gap-2 hover:text-red-500 transition-all duration-400 ease-in"
        >
          <Heart
            strokeWidth={likeClicked ? 0 : 2}
            fill={likeClicked ? "red" : "none"}
            className={`w-8 h-8 sm:w-6 sm:h-6 transition-transform duration-300 ${
              likeClicked ? "scale-110" : "scale-100"
            }`}
          />

          <span className="text-lg sm:text-sm">
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setCommentOpen((prev) => !prev)}
          className="flex items-center gap-2 hover:text-blue-500 transition-all duration-400 ease-in"
        >
          <MessageCircle className="w-8 h-8 sm:w-6 sm:h-6" />
          <span className="text-lg sm:text-sm">
            {post?.comments?.length ?? 0}
          </span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 hover:text-green-500 transition-all duration-400 ease-in"
        >
          <Send className="w-7 h-7 sm:w-6 sm:h-6" />
          <span className="text-lg sm:text-sm">
            {post?.shares?.length ?? 0}
          </span>
        </button>
      </div>

      {/* --- Comments Section --- */}
      {commentOpen && (
        <div className="mt-4 px-1">
          <Comment postId={post._id} />
        </div>
      )}
    </div>
  );
}
