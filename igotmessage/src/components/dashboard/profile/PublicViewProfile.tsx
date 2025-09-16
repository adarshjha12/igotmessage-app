"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Grid,
  PlaySquare,
  Text,
  Phone,
  Video,
  UserPlus,
  MessageSquare,
  ChevronLeftIcon,
  UserCheck,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Post } from "../../post/Posts";
import PostItem from "../../post/PostItem";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function PublicProfileComponent({
  profileUserId,
}: {
  profileUserId: string;
}) {
  const params = useParams();

  const myUserId = params.myId;
  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "textPolls">(
    "posts"
  );
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const [normalPosts, setNormalPosts] = useState<Post[]>([]);
  const [textAndPollPosts, setTextAndPollPosts] = useState<Post[]>([]);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api`;

  // Fetch profile + posts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await axios.get(
          `${url}/profile/get-profile/?userId=${profileUserId}`
        );
        setProfileUser(res.data.profile);
        setIsFollowing(res.data.profile?.followers?.includes(myUserId));
        if (res.data) {
          console.log("followers", res.data.profile?.followers);
        }
        const postsRes = await axios.get(
          `${url}/post/get-single-user-post?userId=${profileUserId}`
        );
        if (postsRes.data) {
          const normal = postsRes.data.posts.filter(
            (p: Post) => p.postType === "normal" && p.mediaUrls?.length! > 0
          );
          const textPolls = postsRes.data.posts.filter(
            (p: Post) =>
              p.postType === "poll" ||
              (p.postType === "normal" && p.mediaUrls?.length === 0)
          );
          setNormalPosts(normal);
          setTextAndPollPosts(textPolls);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfileData();
  }, [profileUserId]);

  const handleFollow = async () => {
    try {
      if (myUserId && profileUserId) {
        if (isFollowing) {
          await axios.post(
            `${url}/profile/follow-toggle`,
            {
              currentUserId: myUserId,
              targetUserId: profileUserId,
            },
            { withCredentials: true }
          );

          setIsFollowing(false);
        } else {
          await axios.post(
            `${url}/profile/follow-toggle`,
            {
              currentUserId: myUserId,
              targetUserId: profileUserId,
            },
            { withCredentials: true }
          );

          setIsFollowing(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAudioCall = () => {
    console.log("Start audio call with", profileUser.userName);
    // integrate WebRTC or call service here
  };

  const handleVideoCall = () => {
    console.log("Start video call with", profileUser.userName);
    // integrate WebRTC or call service here
  };

  useEffect(() => {
    if (!myUserId || !profileUserId) return;

    if (myUserId === profileUserId && pathname !== "/dash/profile") {
      router.replace("/dash/profile");
    }
  }, [myUserId, profileUserId, pathname, router]);

  if (!profileUser)
    return (
      <div className="flex w-full flex-col bg-[var(--bgColor)] min-h-screen gap-6 px-4 py-6">
        {/* Header section */}
        <div className="flex items-center gap-6">
          {/* Profile image */}
          <div className="h-20 w-20 rounded-full bg-[var(--wrapperColor)] animate-pulse" />

          {/* Stats */}
          <div className="flex-1 flex justify-around">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-5 w-full max-w-[50px] bg-[var(--wrapperColor)] animate-pulse rounded" />
                <div className="h-3 w-full max-w-[60px] mt-1 bg-[var(--wrapperColor)] animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Username & Bio */}
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full max-w-[150px] bg-[var(--wrapperColor)] animate-pulse rounded" />
          <div className="h-3 w-full max-w-[200px] bg-[var(--wrapperColor)] animate-pulse rounded" />
          <div className="h-3 w-full max-w-[180px] bg-[var(--wrapperColor)] animate-pulse rounded" />
        </div>

        {/* Grid posts */}
        <div className="grid grid-cols-3 gap-1 mt-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-[var(--wrapperColor)] animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-8 overflow-hidden bg-[var(--bgColor)] shadow-lg">
      <div
        className={`w-full ${
          activeTab === "textPolls" ? "max-w-[700px]" : "max-w-[700px]"
        }`}
      >
        {" "}
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 fixed top-0 left-0 flex items-center gap-4 w-full text-[var(--textColor)] z-40 bg-[var(--bgColor)] backdrop-blur-lg"
        >
          <ChevronLeftIcon size={34} strokeWidth={2} />
          <p className="text-lg font-semibold">
            {normalPosts[0]?.user?.userName}
          </p>
        </button>
        {/* Public Profile Header */}
        <div className="px-6 pt-6">
          {/* Top Row: Profile Pic + Info */}
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--bgColor)] shadow-md">
              <img
                src={
                  profileUser?.profilePicture ||
                  profileUser?.avatar ||
                  "/default-avatar.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Section */}
            <div className="flex-1">
              {/* Name & Bio */}
              <h2 className="text-base font-semibold text-[var(--textColor)]">
                {profileUser?.fullName || "Full Name"}
              </h2>
              <p className="text-sm text-gray-400">
                @{profileUser?.userName || "username123"}
              </p>
              <p className="mt-1 text-sm text-[var(--textColor)]/80 max-w-md">
                {profileUser?.bio || "This is a short bio about the user."}
              </p>

              {/* Action Buttons */}
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                {/* Follow */}
                <button
                  onClick={handleFollow}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all hover:shadow-sm hover:scale-[1.01] ${
                    isFollowing
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gradient-to-r from-blue-500 to-blue-800 text-white"
                  }`}
                >
                  {isFollowing ? (
                    <UserCheck size={16} />
                  ) : (
                    <UserPlus size={16} />
                  )}
                  {isFollowing ? "Following" : "Follow"}
                </button>

                {/* Message */}
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[var(--bgSecondary)] text-[var(--textColor)] border hover:shadow-sm hover:scale-[1.01] transition">
                  <MessageSquare size={16} />
                  Message
                </button>

                {/* More (overflow menu) */}
                <div className="relative">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-[var(--bgSecondary)] text-[var(--textColor)] border hover:shadow-sm hover:scale-[1.01] transition"
                  >
                    ⋯
                  </button>

                  {showMore && (
                    <div className="absolute right-0 mt-2 w-32 bg-[var(--wrapperColor)] rounded-lg shadow-lg overflow-hidden border">
                      <button
                        onClick={handleAudioCall}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--textColor)] transition"
                      >
                        <Phone size={14} />
                        Audio Call
                      </button>
                      <button
                        onClick={handleVideoCall}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--textColor)] transition"
                      >
                        <Video size={14} />
                        Video Call
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex justify-around text-center mt-6">
            <div>
              <p className="text-lg font-bold text-[var(--textColor)]">
                {profileUser.posts?.length || 0}
              </p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
            <span>
              <p className="text-lg font-bold text-[var(--textColor)]">
                {profileUser.followers?.length || 0}
              </p>
              <p className="text-xs text-gray-400">Followers</p>
            </span>
            <span>
              <p className="text-lg font-bold text-[var(--textColor)]">
                {profileUser.following?.length || 0}
              </p>
              <p className="text-xs text-gray-400">Following</p>
            </span>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex justify-around mt-6 border-t border-gray-700">
          {[
            { id: "posts", icon: <Grid size={20} />, label: "Posts" },
            { id: "reels", icon: <PlaySquare size={20} />, label: "Reels" },
            {
              id: "textPolls",
              icon: <Text size={20} />,
              label: "Text & Polls",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center py-3 flex-1 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "text-[var(--textColor)] border-t-4 border-blue-500"
                  : "text-[var(--textColor)]/50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        {/* Content */}
        <div
          className={`${
            activeTab === "textPolls"
              ? "flex w-full flex-col gap-4 sm:px-4"
              : "grid grid-cols-3 gap-[1px]"
          } mt-2`}
        >
          {activeTab === "posts" &&
            normalPosts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}/user/${post.user._id}`}
                className="aspect-[3.5/5] bg-gray-200"
              >
                <img
                  src={post.mediaUrls?.[0]}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}

          {activeTab === "reels" &&
            normalPosts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}/user/${post.user._id}`}
                className="aspect-[3.5/5] bg-black"
              >
                <video
                  className="w-full h-full object-cover"
                  muted
                  loop
                  src={post.mediaUrls?.[0]}
                />
              </Link>
            ))}

          {activeTab === "textPolls" &&
            textAndPollPosts.map((post) => (
              <div
                key={post._id}
                className="w-full bg-[var(--cardColor)] rounded-xl py-4 shadow-md"
              >
                <PostItem post={post} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
