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
  const isDark = useAppSelector((state) => state.activity.isDark);
  const myProfilePicture = useAppSelector(
    (state) => state.auth.user.profilePicture
  );

  const myStories = useAppSelector((state) => state.story.myFetchedStories);
  const otherStories = useAppSelector(
    (state) => state.story.otherFetchedStories
  );

  async function getStories() {
    const myStoriesFromApi = await fetchMyStories(userId);
    const otherStoriesFromApi = await fetchOtherStories();

    if (myStoriesFromApi?.data?.myStories) {
      dispatch(setMyFetchedStories(myStoriesFromApi.data.myStories));
    }
    if (otherStoriesFromApi?.data?.otherStories) {
      dispatch(setOtherFetchedStories(otherStoriesFromApi.data.otherStories));
    }
    
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


  return (
    <div className="w-full py-4 px-0 h-fit z-0 flex overflow-x-auto whitespace-nowrap gap-2 scroll-smooth hide-scrollbar">
      {/* add story button */}
      <div className="flex flex-col items-center justify-center gap-2">
        <Link
          href="/create-story"
          className={`relative w-[75px] h-[75px] flex items-center justify-center border-3 border-[var(--borderColor)]/50 p-[2px] rounded-full shadow-md hover:scale-105 transition-transform duration-300 ease-out group overflow-hidden
    ${
      myProfilePicture
        ? "bg-[var(--bgColor)]"
        : "bg-gradient-to-br from-blue-500 to-indigo-800"
    }`}
        >
          {myProfilePicture ? (
            <img
              className="w-full h-full rounded-full object-contain"
              src={myProfilePicture}
              alt="Profile"
            />
          ) : (
            <UserIcon
              size={40}
              strokeWidth={1.2}
              className="text-white group-hover:scale-110 transition-transform duration-300"
            />
          )}

          <div className="absolute bottom-1.5 right-1.5 bg-black border-2 border-white rounded-full p-1 shadow-sm">
            <PlusIcon className="text-white" size={16} />
          </div>
        </Link>

        <p
          className={`text-[12px] font-medium ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {" "}
          Create Story
        </p>
      </div>

      {/* myStory button */}
      {myStories && myStories.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-2">
          <Link
            href={`/stories/${myStories[0].user._id}`}
            className="relative w-[75px] h-[75px] rounded-full bg-gradient-to-tr from-blue-500  to-blue-400 p-[3px] hover:scale-105 transition-transform duration-300 ease-out group shadow-[0_0_10px_rgba(255,0,150,0.4)] animate-pulse-ring flex items-center justify-center"
          >
            <div className="flex items-center justify-center w-full h-full bg-[var(--bgColor)] p-[3px] rounded-full overflow-hidden">
              <div className="flex items-center justify-center w-full h-full bg-[var(--bgColor)] rounded-full overflow-hidden">
                {myStories[0]?.user.profilePicture ? (
                  <img
                    src={myStories[0].user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <UserIcon
                    size={40}
                    strokeWidth={1.2}
                    className="text-white group-hover:scale-110 transition-transform duration-300"
                  />
                )}
              </div>
            </div>
          </Link>

          <p
            className={`text-[12px] font-medium ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            My Stories
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
                className="relative w-[75px] h-[75px] rounded-full bg-gradient-to-tr from-blue-500  to-blue-400 p-[3px] hover:scale-105 transition-transform duration-300 ease-out group shadow-[0_0_10px_rgba(255,0,150,0.4)] animate-pulse-ring flex items-center justify-center"
              >
                <div className="flex items-center justify-center w-full h-full bg-[var(--bgColor)] p-[3px] rounded-full overflow-hidden">
                  <div className="flex items-center justify-center w-full h-full rounded-full overflow-hidden bg-[var(--bgColor)]">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <UserIcon
                        size={36}
                        strokeWidth={1.5}
                        className="text-[var(--textColor)] group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                </div>
              </Link>

              <p
                className={`text-[12px] font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {user.userName ?? `other Story ${index}`}
              </p>
            </div>
          ))}
    </div>
  );
}

export default Story;
