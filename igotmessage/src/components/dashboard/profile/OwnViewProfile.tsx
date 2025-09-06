"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Pencil,
  PlusCircle,
  Image as ImageIcon,
  Grid,
  Video,
  Tag,
  Play,
  Text,
  PlaySquare,
} from "lucide-react";
import CreateProfileModal from "@/components/dashboard/profile/CreateProfile";
import PopupMessages from "@/components/popups/PopupMessages";
import Link from "next/link";
import { setProfileUpdateStatus } from "@/features/authSlice";
import axios from "axios";
import { Post } from "../../post/Posts";
import PostItem from "../../post/PostItem";

export default function ProfileComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const profileUpdateStatus = useAppSelector(
    (state) => state.auth.user.updateProfileStatus
  );

  const [editProfileClick, setEditProfileClick] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    "posts" | "reels" | "textPolls"
  >("posts");

  const [normalPosts, setNormalPosts] = useState<Post[]>([]);
  const [textAndPollPosts, setTextAndPollPosts] = useState<Post[]>([]);

  const onClose = () => setShowPopup(false);

  useEffect(() => {
    if (profileUpdateStatus === "succeeded") {
      setShowPopup(true);
    }
    const timeout = setTimeout(() => {
      dispatch(setProfileUpdateStatus("idle"));
    }, 8000);
    return () => clearTimeout(timeout);
  }, [profileUpdateStatus]);

  const closeProfileModal = () => setEditProfileClick(false);

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/post/get-posts`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/post/get-posts`;

  useEffect(() => {
    console.log("getting post");

    const getMyPosts = async function (userId: string) {
      try {
        const res = await axios.get(`${url}?userId=${userId}`);
        if (res.data) {
          setNormalPosts((prev) => {
            const filtered = res.data.posts?.filter(
              (post: Post) =>
                post.postType === "normal" && post.mediaUrls?.length! > 0
            );
            const merged = [...filtered, ...prev];
            const unique = Array.from(
              new Map(merged.map((p) => [p._id, p])).values()
            );

            return unique;
          });
          setTextAndPollPosts((prev) => {
            const filtered = res.data.posts.filter(
              (post: Post) =>
                post.postType === "poll" ||
                (post.postType === "normal" && post.mediaUrls?.length === 0)
            );

            const merged = [...filtered, ...prev];
            const unique = Array.from(
              new Map(merged.map((p) => [p._id, p])).values()
            );

            return unique;
          });
          console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getMyPosts(user._id);
    return () => {};
  }, []);

  useEffect(() => {
    console.log("+++++++++++++++++++//", normalPosts, textAndPollPosts);
    return () => {};
  }, [normalPosts]);

  return (
    <div className="w-screen min-h-screen sm:py-4 pb-6 sm:rounded-2xl overflow-hidden bg-[var(--bgColor)] shadow-lg">
      {/* Profile Header */}
      <div className="px-6 pt-6">
        {/* Top Row: Profile Pic + Name + Buttons */}
        <div className="flex items-start gap-6">
          {/* Profile Photo */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--bgColor)] shadow-md">
            <img
              src={
                user?.profilePicture || user?.avatar || "/default-avatar.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Section */}
          <div className="flex-1">
            {/* Name */}
            <h2 className="text-base font-semibold text-[var(--textColor)]">
              {user?.fullName || "Full Name"}
            </h2>
            <p className="text-sm text-gray-400">
              @{user?.userName || "username123"}
            </p>
            <p className="mt-1 text-sm text-[var(--textColor)]/80 max-w-md">
              {user?.bio || "This is a short bio about the user."}
            </p>

            {/* Buttons */}
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setEditProfileClick(true)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-[var(--bgSecondary)] text-[var(--textColor)] font-medium border shadow-sm hover:scale-[1.01] transition"
              >
                <Pencil size={16} />
                Edit Profile
              </button>

              <Link href={"/create-story"} className="flex-1">
                <button className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white font-medium shadow-sm hover:scale-[1.01] transition">
                  <PlusCircle size={16} />
                  Add Story
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-around text-center mt-6">
          <div>
            <p className="text-lg font-bold text-[var(--textColor)]">
              {user.posts?.length}
            </p>
            <p className="text-xs text-gray-400">Posts</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--textColor)]">
              {user.followers?.length}
            </p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--textColor)]">
              {user.following?.length}
            </p>
            <p className="text-xs text-gray-400">Following</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
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
        {/* Posts tab → show media posts */}
        {activeTab === "posts" &&
          normalPosts
            .filter((p) => p.mediaUrls?.length! > 0) // only media
            .map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}/user/${post.user._id}`}
                className="aspect-[3.5/5] bg-gray-400"
              >
                <img
                  src={post.mediaUrls?.[0]}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}

        {/* Reels tab → placeholder for now */}
        {activeTab === "reels" &&
          normalPosts
            .filter((p) => p.mediaUrls?.length! > 0) // later: filter for video type
            .map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}/user/${post.user._id}`}
                className="aspect-[3.5/5] bg-gray-400"
              >
                <video
                  className="w-full h-full object-cover"
                  muted
                  loop
                  src={post.mediaUrls?.[0]}
                />
              </Link>
            ))}

        {/* Text & Polls tab → full-width feed */}
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

      {/* Modals & Popups */}
      {editProfileClick && (
        <CreateProfileModal
          onClose={closeProfileModal}
          isOpen={editProfileClick}
        />
      )}
      {profileUpdateStatus === "succeeded" && (
        <PopupMessages
          show={showPopup}
          message={"Profile updated successfully"}
          type={"success"}
          onClose={onClose}
        />
      )}
    </div>
  );
}
