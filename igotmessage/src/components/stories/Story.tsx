"use client";

import { PlusIcon, UserIcon } from "lucide-react";
import React, { useEffect } from "react";
import Link from "next/link";
import { fetchMyStories, fetchOtherStories } from "@/utils/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setMyFetchedStories,
  setOtherFetchedStories,
} from "@/features/storySlice";

function Story() {
  const dispatch = useAppDispatch();
  const myId = useAppSelector((state) => state.auth.user._id);
  const userId = myId;
  const storyUploadStatus = useAppSelector(
    (state) => state.story.uploadStoryStatus
  );

  const myStories = useAppSelector((state) => state.story.myFetchedStories);
  const otherStories = useAppSelector(
    (state) => state.story.otherFetchedStories
  );

  async function getStories() {
    const myStoriesFromApi = (await fetchMyStories(userId)).data.myStories;
    const otherStoriesFromApi = await (
      await fetchOtherStories()
    ).data.otherStories;

    dispatch(setMyFetchedStories(myStoriesFromApi));
    dispatch(setOtherFetchedStories(otherStoriesFromApi));
  }

  const uniqueUsers = Array.from(
    new Map(
      otherStories
        .filter((s) => s.user && s.user._id)
        .map((s) => [s.user._id, s.user])
    ).values()
  );

  useEffect(() => {
    getStories();
  }, [storyUploadStatus]);

  useEffect(() => {
  }, [myStories]);

  return (
    <div className="w-full py-4 px-0 h-fit z-0 flex overflow-x-auto whitespace-nowrap gap-2 scroll-smooth hide-scrollbar">
      {/* add story button */}
      <div className="flex flex-col items-center justify-center gap-2">
        <Link
          href="/create-story"
          className="relative w-[88px] h-[88px] flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-800 shadow-md hover:scale-105 transition-transform duration-300 ease-out group"
        >
          <div className="grid place-items-center w-full h-full">
            <UserIcon
              size={40}
              strokeWidth={1.2}
              className="text-white group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="absolute bottom-1.5 right-1.5 bg-black border-2 border-white rounded-full p-1 shadow-sm">
            <PlusIcon className="text-white" size={14} />
          </div>
        </Link>
        <p className="text-[13px] font-medium text-[var(--textColor)] ">
          Create Story
        </p>
      </div>

      {/* myStory button */}
      {myStories && myStories.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-2">
          <Link
            href={`/stories/${myStories[0].user}`}
            className="relative w-[88px] h-[88px]  rounded-full bg-gradient-to-tr from-blue-500 via-blue-400 to-rose-500 p-[3px] hover:scale-105 transition-transform duration-300 ease-out group shadow-[0_0_10px_rgba(255,0,150,0.4)] animate-pulse-ring flex items-center justify-center"
          >
            <div className="flex items-center justify-center w-full h-full bg-black rounded-full">
              <UserIcon
                size={40}
                strokeWidth={1.2}
                className="text-white group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </Link>
          <p className="text-[13px] font-medium text-[var(--textColor)]">
            {myStories[0].user.username ?? "My Story"}
          </p>
        </div>
      )}

      {uniqueUsers &&
        uniqueUsers.length > 0 &&
        uniqueUsers
          .filter((user) => user._id !== myId)
          .map((user, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2"
            >
              <Link
                href={`/stories/${user._id}`}
                className="relative w-[88px] h-[88px]  rounded-full bg-gradient-to-tr from-blue-500 via-blue-400 to-rose-500 p-[3px] hover:scale-105 transition-transform duration-300 ease-out group shadow-[0_0_10px_rgba(255,0,150,0.4)] animate-pulse-ring flex items-center justify-center"
              >
                <div className="flex items-center justify-center w-full h-full bg-black rounded-full">
                  <UserIcon
                    size={36}
                    strokeWidth={1.5}
                    className="text-white group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </Link>

              <p className="text-[13px] font-medium text-[var(--textColor)]">
                {user.username ?? `other Story ${index}`}
              </p>
            </div>
          ))}
    </div>
  );
}

export default Story;
