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
  Bookmark,
  Repeat2Icon,
} from "lucide-react";
import { Post } from "./Posts";
import Link from "next/link";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import Comment from "./Comment";
import { generateRandomString } from "@/utils/api";
import PopupWithLink from "@/components/popups/PopupWithLink";
import {
  ArrowRightIcon,
  BoxArrowUpIcon,
  HeartIcon,
  ChatCircleIcon,
  PaperPlaneTiltIcon,
  BookmarkSimpleIcon,
  StarIcon,
  ChatsTeardropIcon,
  ArrowBendUpRightIcon,
  PushPinIcon,
  FireIcon,
  ChatTeardropIcon,
  BookmarkIcon,
  RepeatIcon,
} from "@phosphor-icons/react";
import HighlightHashtags from "./PostText";
import RepostModal from "./RepostModal";

export interface PostItemProps {
  post: Post;
}

export default function PostItem({
  post,
  hideFooter,
}: {
  post: Post;
  hideFooter?: boolean;
}) {
  const [isRepostOpen, setRepostOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const isDark = useAppSelector((state) => state.activity.isDark);
  const isGuest = useAppSelector((state) => state.auth.user.isGuest);
  const [likeClicked, setLikeClicked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length ?? 0);
  const userId = useAppSelector((state) => state.auth.user._id);
  const [showGuestError, setShowGuestError] = useState(false);
  const bookmarks = useAppSelector((state) => state.auth.user.bookmarks);

  const randomAvatarNames = generateRandomString();

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}`;

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
        `${url}/api/post/toggle-like`,
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

  const handleBookmark = async () => {
    setBookmarked((prev) => {
      return !prev;
    });
    try {
      await axios.post(
        `${url}/api/post/toggle-bookmark`,
        { userId, postId: post._id },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
      setBookmarked((prev) => !prev);
    }
  };

  useEffect(() => {
    if (bookmarks?.includes(post._id)) {
      setBookmarked(true);
    }
    return () => {};
  }, [bookmarks]);

  return (
    <div className="pt-2 pb-5 border-[var(--borderColor)]/50 duration-300">
      {/* --- Repost Header (only if reposted) --- */}
      {post.isReposted && post.whoReposted && (
        <div className="flex items-center gap-2 px-4 mb-2 text-[var(--textColor)]/70 text-sm">
          <RepeatIcon className="w-4 h-4 text-[var(--textColor)]/60" />
          <Link
            href={`/public-profile/${post.whoReposted._id}/myId/${userId}`}
            className="flex items-center gap-2 hover:underline"
          >
            <img
              src={post.whoReposted.profilePicture || post.whoReposted.avatar}
              alt="reposter"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="font-medium">{post.whoReposted.userName}</span>
          </Link>
          <span className="text-xs">reposted</span>
        </div>
      )}

      {/* --- Header (original post user) --- */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-3">
          <Link href={`/public-profile/${post?.user?._id}/myId/${userId}`}>
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
                className="w-11 h-11 rounded-full object-cover cursor-pointer hover:opacity-90 transition"
              />
            )}
          </Link>

          <div className="flex flex-col">
            <Link
              href={`/public-profile/${post?.user?._id}/myId/${userId}`}
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
            <div className="absolute z-30 right-0 mt-2 py-4 w-fit bg-blue-600 rounded-lg shadow-lg overflow-hidden">
              <Link
                href={`/public-profile/${post?.user?._id}/myId/${userId}`}
                className="w-full flex items-center gap-2 px-3 py-2 text-md font-semibold text-white text-nowrap transition"
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
            <div className="px-4 pb-2">
              <HighlightHashtags text={post.text} />
            </div>
          )}

          {post?.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="mb-3">
              <PostMedia urls={post.mediaUrls} />
            </div>
          )}
        </>
      ) : (
        post?.poll && <Poll postId={post._id} pollData={post.poll} />
      )}

      {/* --- Footer Actions --- */}
      {!hideFooter && (
        <div className="w-full mt-3 px-4 text-sm">
          {/* Icons Row */}
          <div className="flex items-center">
            {/* Like (as Fire) */}
            <button
              type="button"
              onClick={handleLike}
              className="transition-transform p-2 duration-200 hover:scale-110"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {likeClicked ? (
                  <HeartIcon
                    size={36}
                    weight="fill"
                    className="text-sky-500 scale-125"
                  />
                ) : (
                  <HeartIcon
                    size={36}
                    weight="regular"
                    className="text-[var(--textColor)] scale-110"
                  />
                )}
              </div>
            </button>

            {/* Comment */}
            <button
              type="button"
              onClick={() => setCommentOpen((prev) => !prev)}
              className="transition-transform p-2 duration-200 hover:scale-110"
            >
              <ChatTeardropIcon
                size={34}
                weight="regular"
                className="text-[var(--textColor)]"
              />
            </button>

            {/* Repost */}
            {!post.isReposted && (
              <div>
                <button
                  onClick={() => setRepostOpen(true)}
                  className="transition-transform p-2 duration-200 hover:scale-110"
                >
                  <RepeatIcon size={34} className="text-[var(--textColor)]" />
                </button>
                <RepostModal
                  isOpen={isRepostOpen}
                  onClose={() => setRepostOpen(false)}
                  post={post}
                />
              </div>
            )}

            {/* Bookmark */}
            <div className="ml-auto">
              <button
                onClick={handleBookmark}
                className="transition-transform p-2 duration-200 hover:scale-110"
              >
                <BookmarkSimpleIcon
                  size={32}
                  weight={bookmarked ? "fill" : "regular"}
                  className={
                    bookmarked ? "text-rose-600" : "text-[var(--textColor)]"
                  }
                />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="px-2 flex flex-col gap-1 text-[var(--textColor)]">
            {likeCount > 0 && (
              <span className="font-medium">
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </span>
            )}
            {post.comments?.length! > 0 && (
              <button
                type="button"
                onClick={() => setCommentOpen((prev) => !prev)}
                className="hover:underline w-fit"
              >
                View all {post.comments?.length}{" "}
                {post.comments?.length === 1 ? "comment" : "comments"}
              </button>
            )}
          </div>
        </div>
      )}

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
