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
  const avatar = useAppSelector((state) => state.auth.user.avatar);

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
    <div className="w-full py-4 px-4 h-fit z-0 flex overflow-x-auto whitespace-nowrap justify-start gap-2 scroll-smooth hide-scrollbar">
      {/* add story button */}
      <div className="flex flex-col items-center justify-center gap-2">
        <Link
          href="/create-story"
          className={`relative w-[85px] h-[85px] sm:w-[75px] sm:h-[75px] flex items-center justify-center p-[2px] rounded-full shadow-md hover:scale-105 mr-2 transition-transform duration-300 ease-out group
   bg-[var(--textColor)]/50`}
        >
          {myProfilePicture ? (
            <img
              className="w-full h-full rounded-full object-contain"
              src={myProfilePicture}
              alt="Profile"
            />
          ) : (
            <img
              className="w-full h-full rounded-full object-contain"
              src={avatar!}
              alt="Profile"
            />
          )}

          <div className="absolute bottom-0.5 -right-1 bg-green-700  rounded-full p-0.5 shadow-sm">
            <PlusIcon className="text-white" strokeWidth={2.5} size={22} />
          </div>
        </Link>

        <p
          className={`text-[12px] sm:text-[10px] font-medium ${
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
            className="relative w-[85px] h-[85px] sm:w-[75px] sm:h-[75px] rounded-full bg-gradient-to-tr from-green-500 via-blue-700  to-blue-400 p-[4px] hover:scale-105 transition-transform duration-300 ease-out group shadow-[0_0_10px_rgba(255,0,150,0.4)] animate-pulse-ring flex items-center justify-center"
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
                  <img
                    src={avatar!}
                    alt="Profile"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          </Link>

          <p
            className={`text-[12px] sm:text-[10px] font-medium ${
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
                className="relative w-[85px] h-[85px] sm:w-[75px] sm:h-[75px] rounded-full bg-gradient-to-tr from-green-500 via-blue-700  to-blue-400 p-[4px] hover:scale-105 transition-transform duration-300 ease-out group shadow-[0_0_10px_rgba(255,0,150,0.4)] animate-pulse-ring flex items-center justify-center"
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
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              </Link>

              <p
                className={`text-[12px] sm:text-[10px] font-medium ${
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
