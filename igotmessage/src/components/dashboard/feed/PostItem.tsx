import React from "react";
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

export interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <div className="rounded-2xl bg-[var(--wrapperColor)] py-5  shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* --- Header --- */}
      <div className="flex px-4 items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="#">
            {post.user.profilePicture ? (
              <img
                src={post.user.profilePicture}
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
              <span className="font-semibold text-xl text-[var(--textColor)] hover:underline cursor-pointer">
                {post.user.userName}
              </span>
            </Link>
            <div className="flex items-center gap-2">
               {post.privacy === "public" ? (
              <Globe className="w-3 h-3 text-[var(--textColor)]/60" />
            ) : (
              <Lock className="w-3 h-3 text-red-500" />
            )}

            <span className="text-sm text-[var(--textColor)]/60">
              {formatDistanceToNow(new Date(post?.createdAt ?? ""), {
                addSuffix: true,
              })}
            </span>
            </div>
            
          </div>
          <div>
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500">
              <Check size={14} className="text-white" strokeWidth={3} />
            </div>
           
          </div>
        </div>

        {/* Three dots menu */}
        <button className="p-2 rounded-full hover:bg-[var(--borderColor)]/20 transition">
          <MoreVertical className="text-[var(--textColor)]" size={20} />
        </button>
      </div>

      {/* --- Text --- */}
      {post.postType === "normal" ? (
        <div>
          {post.text && (
            <p className="mb-3 px-4 text-lg font-medium text-[var(--textColor)] leading-relaxed">
              {post.text}
            </p>
          )}

          {/* --- Media --- */}
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="rounded-xl overflow-hidden mb-3">
              <PostMedia urls={post.mediaUrls} />
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* --- Poll --- */}
          {post.poll && <Poll postId={post._id} pollData={post.poll} />}
        </div>
      )}

      {/* --- Footer Actions --- */}
      <div className="flex px-4 items-center justify-between mt-3 pt-3 border-t border-[var(--borderColor)]/40 text-[var(--textColor)]/80 text-sm">
        <button className="flex items-center gap-2 hover:text-red-500 transition">
          <Heart size={32} />
          <span className="text-lg">{post.likes?.length ?? 0}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-blue-500 transition">
          <MessageCircle size={30} />
          <span className="text-lg">{post.comments?.length ?? 0}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-green-500 transition">
          <Send size={30} />
          <span className="text-lg">{post.shares?.length ?? 0}</span>
        </button>
      </div>
    </div>
  );
}
