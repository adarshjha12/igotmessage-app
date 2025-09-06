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
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import Comment from "./Comment";
import { generateRandomString } from "@/utils/api";
import PopupWithLink from "@/components/popups/PopupWithLink";
import { ArrowRightIcon, BoxArrowUpIcon } from "@phosphor-icons/react";

export interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  const [showMore, setShowMore] = useState(false);
  const isDark = useAppSelector((state) => state.activity.isDark);
  const isGuest = useAppSelector((state) => state.auth.user.isGuest);
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length ?? 0);
  const userId = useAppSelector((state) => state.auth.user._id);
  const [showGuestError, setShowGuestError] = useState(false);

  const randomAvatarNames = generateRandomString();

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/post/toggle-like`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/post/toggle-like`;

  useEffect(() => {
    if (!isGuest && post.likes?.includes(userId)) {
      setLikeClicked(true);
    }
  }, [post, userId]);

  const handleLike = async () => {
    if (isGuest) {
      setShowGuestError(true);
      return;
    }
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
    <div className=" pt-2 pb-5 border-[var(--borderColor)]/50  duration-300">
      {/* --- Header --- */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-3">
          <Link href={`/public-profile/${post?.user?._id}`}>
            {post.user?.profilePicture ? (
              <img
                src={post.user.profilePicture ?? ""}
                alt="avatar"
                className="w-11 h-11 rounded-full object-cover cursor-pointer hover:opacity-90 transition"
              />
            ) : (
              <img
                src={post.user.avatar}
                alt="avatar"
                className="w-11 h-11  rounded-full object-cover cursor-pointer hover:opacity-90 transition"
              />
            )}
          </Link>

          <div className="flex flex-col">
            <Link
              href={`/public-profile/${post?.user?._id}`}
              className="flex items-center gap-2"
            >
              <span className="font-semibold text-xl sm:text-base text-[var(--textColor)] hover:underline cursor-pointer">
                {post?.user?.userName}
              </span>
              <div className="w-4 h-4 flex items-center justify-center rounded-full bg-blue-500">
                <Check size={14} className="text-white" strokeWidth={3} />
              </div>
            </Link>
            <div className="flex items-center gap-2">
              {post?.privacy === "public" ? (
                <Globe className="w-3 h-3 text-[var(--textColor)]/60" />
              ) : (
                <Lock className="w-3 h-3 text-red-500" />
              )}

              <span className="text-sm sm:text-xs text-[var(--textColor)]/60">
                {formatDistanceToNowStrict(new Date(post?.createdAt ?? ""), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Three dots menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="p-2 rounded-full hover:bg-[var(--borderColor)]/20 transition"
          >
            <MoreVertical className="text-[var(--textColor)]" size={20} />
          </button>
          {showMore && (
            <div className="absolute z-30 right-0 mt-2 py-4 w-fit bg-[var(--wrapperColor)] rounded-lg shadow-lg overflow-hidden ">
              <Link
                href={`/public-profile/${post.user._id}`}
                className="w-full flex items-center gap-2 px-3 py-2 text-md font-semibold text-[var(--textColor)] text-nowrap transition"
              >
                <ArrowRightIcon className="-rotate-45" size={24} />
                View Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* --- Text / Media / Poll --- */}
      {post?.postType === "normal" ? (
        <>
          {post?.text && (
            <p className="mb-3 mt-5 px-4 text-md sm:text-sm font-medium text-[var(--textColor)] leading-relaxed">
              {post.text}
            </p>
          )}

          {post?.mediaUrls && post.mediaUrls.length > 0 && (
            <div className=" mb-3">
              <PostMedia urls={post.mediaUrls} />
            </div>
          )}
        </>
      ) : (
        post?.poll && <Poll postId={post._id} pollData={post.poll} />
      )}

      {/* --- Footer Actions --- */}

      <div
        className={`rounded-full px-4 py-3 grid grid-cols-3 justify-items-center mt-3 text-sm transition-all duration-300`}
      >
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          className="flex items-center gap-2 group transition-all duration-300 ease-in-out"
        >
          <Heart
            strokeWidth={likeClicked ? 0 : 2}
            fill={likeClicked ? "#ff2525" : "none"}
            className={`w-7 h-7 sm:w-6 sm:h-6 transition-transform duration-300 ${
              likeClicked
                ? "scale-110 text-blue-500"
                : "scale-100 group-hover:scale-110"
            }`}
          />
          <span
            className={`text-base sm:text-sm font-medium transition-colors ${
              isDark ? "group-hover:text-red-400" : "group-hover:text-red-500"
            }`}
          >
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </span>
        </button>

        {/* Comment Button */}
        <button
          type="button"
          onClick={() => setCommentOpen((prev) => !prev)}
          className="flex items-center gap-2 group transition-all duration-300 ease-in-out"
        >
          <MessageCircle
            className={`w-6 h-6 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 ${
              isDark ? "group-hover:text-blue-400" : "group-hover:text-blue-500"
            }`}
          />
          {post.comments?.length! > 0 && (
            <span
              className={`text-base sm:text-sm font-medium transition-colors ${
                isDark
                  ? "group-hover:text-blue-400"
                  : "group-hover:text-blue-500"
              }`}
            >
              {post.comments?.length}
            </span>
          )}
        </button>

        {/* Share Button */}
        <button
          type="button"
          className="flex items-center gap-2 group transition-all duration-300 ease-in-out"
        >
          <Send
            className={`w-6 h-6 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 ${
              isDark
                ? "group-hover:text-green-400"
                : "group-hover:text-green-500"
            }`}
          />
          {post.shares?.length! > 0 && (
            <span
              className={`text-base sm:text-sm font-medium transition-colors ${
                isDark
                  ? "group-hover:text-green-400"
                  : "group-hover:text-green-500"
              }`}
            >
              {post?.shares?.length}
            </span>
          )}
        </button>
      </div>

      {/* --- Comments Section --- */}
      {commentOpen && (
        <div className="mt-0 px-1">
          <Comment postId={post._id} />
        </div>
      )}
      {showGuestError && (
        <PopupWithLink
          linkHref="/login"
          linkText="signup"
          type="error"
          message="Sorry, Guest users can't like"
          show={showGuestError}
          onClose={() => setShowGuestError(false)}
        />
      )}
    </div>
  );
}
