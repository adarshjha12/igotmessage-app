"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Grid, PlaySquare, Text, Phone, Video, UserPlus, MessageSquare } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Post } from "../../post/Posts";
import PostItem from "../../post/PostItem";
import { usePathname, useRouter } from "next/navigation";
import { ArrowArcLeftIcon, ArrowLeftIcon } from "@phosphor-icons/react";

export default function PublicProfileComponent({
  profileUserId,
}: {
  profileUserId: string;
}) {
  const myUserId = useAppSelector((state) => state.auth.user._id);
  const currentUser = useAppSelector((state) => state.auth.user); // logged-in user
  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "textPolls">(
    "posts"
  );
  const pathname = usePathname();

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
        setIsFollowing(res.data.profile?.followers?.includes(currentUser._id));

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
      if (isFollowing) {
        await axios.post(`${url}/user/unfollow`, {
          currentUserId: currentUser._id,
          targetUserId: profileUserId,
        });
        setIsFollowing(false);
      } else {
        await axios.post(`${url}/user/follow`, {
          currentUserId: currentUser._id,
          targetUserId: profileUserId,
        });
        setIsFollowing(true);
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
    return <p className="text-center text-gray-400">Loading profile...</p>;

  return (
    <div className="w-screen min-h-screen py-8 sm:rounded-2xl overflow-hidden bg-[var(--bgColor)] shadow-lg">
      <button type="button" onClick={() => router.back()} className="p-2 fixed top-0 left-0 flex items-center gap-4 w-full text-[var(--textColor)] z-40 bg-[var(--bgColor)] backdrop-blur-lg">
        <ArrowLeftIcon size={30}/>
        <p className="text-lg font-semibold">{normalPosts[0]?.user?.userName}</p>
      </button>
      {/* Cover */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 via-green-600 to-indigo-700">
        {profileUser?.coverPhoto && (
          <img
            src={profileUser.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {/* Profile Pic */}
        <div className="absolute left-6 bottom-[-40px]">
          <img
            src={
              profileUser?.profilePicture ||
              profileUser?.avatar ||
              "/default-avatar.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full bg-gray-200 border-4 border-[var(--bgColor)] object-cover shadow-md"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-6 text-[var(--textColor)]">
        <h2 className="text-xl sm:text-lg font-semibold">
          {profileUser?.fullName || "Full Name"}
        </h2>
        <p className="text-sm text-[var(--textColor)]/80">
          @{profileUser?.userName || "username123"}
        </p>
        <p className="mt-2 text-sm">
          {profileUser?.bio || "This is a short bio about the user."}
        </p>

        {/* Stats */}
        <div className="flex justify-between text-center mt-6">
          <div>
            <p className="text-base font-bold">
              {profileUser.posts?.length || 0}
            </p>
            <p className="text-xs text-gray-400">Posts</p>
          </div>
          <div>
            <p className="text-base font-bold">
              {profileUser.followers?.length || 0}
            </p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>
          <div>
            <p className="text-base font-bold">
              {profileUser.following?.length || 0}
            </p>
            <p className="text-xs text-gray-400">Following</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          {/* Follow */}
          <button
            onClick={handleFollow}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-sm hover:scale-[1.02] ${
              isFollowing
                ? "bg-gray-100 text-gray-800"
                : "bg-gradient-to-r from-blue-500 to-blue-800 text-white border-transparent"
            }`}
          >
            <UserPlus size={16} />
            {isFollowing ? "Following" : "Follow"}
          </button>

          {/* Message */}
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg  text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-800 text-white transition-all hover:shadow-sm hover:scale-[1.02]">
            <MessageSquare size={16} />
            Message
          </button>

          {/* Audio Call */}
          <button
            onClick={handleAudioCall}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg  text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-800 text-white transition-all hover:shadow-sm hover:scale-[1.02]"
          >
            <Phone size={16} />
            Audio
          </button>

          {/* Video Call */}
          <button
            onClick={handleVideoCall}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg  text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-800 text-white transition-all hover:shadow-sm hover:scale-[1.02]"
          >
            <Video size={16} />
            Video
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-around mt-6 border-t border-gray-700">
        {[
          { id: "posts", icon: <Grid size={20} />, label: "Posts" },
          { id: "reels", icon: <PlaySquare size={20} />, label: "Reels" },
          { id: "textPolls", icon: <Text size={20} />, label: "Text & Polls" },
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
            ? "flex flex-col gap-4 sm:px-4"
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
  );
}
