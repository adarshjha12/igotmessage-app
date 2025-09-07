"use client";

import React from "react";
import { InfoIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import dynamic from "next/dynamic";
import { logOut } from "@/features/authSlice";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Story skeleton with dark mode support
function StorySkeleton() {
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);

  return (
    <div className="flex gap-4 overflow-x-auto py-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <Skeleton
            baseColor={isDark ? "#2e302e" : "#ececec"}
            highlightColor={isDark ? "#232323" : "#f5f5f5"}
            circle
            width={60}
            height={60}
          />
          <Skeleton
            baseColor={isDark ? "#2e302e" : "#ececec"}
            highlightColor={isDark ? "#232323" : "#f5f5f5"}
            width={50}
            height={12}
            className="mt-2 rounded"
          />
        </div>
      ))}
    </div>
  );
}

// Posts skeleton with dark mode support
function PostsSkeleton() {
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);

  return (
    <div className="flex flex-col gap-4 px-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden p-4">
          <Skeleton
            baseColor={isDark ? "#2e302e" : "#ececec"}
            highlightColor={isDark ? "#232323" : "#f5f5f5"}
            height={20}
            width={120}
          />
          <Skeleton
            baseColor={isDark ? "#2e302e" : "#ececec"}
            highlightColor={isDark ? "#232323" : "#f5f5f5"}
            height={250}
            className="mt-2 rounded-xl"
          />
          <Skeleton
            baseColor={isDark ? "#2e302e" : "#ececec"}
            highlightColor={isDark ? "#232323" : "#f5f5f5"}
            height={20}
            width={`80%`}
            className="mt-2"
          />
        </div>
      ))}
    </div>
  );
}

// Dynamically import Story & Posts with skeleton fallback
const Story = dynamic(() => import("@/components/create story/StoryCircles"), {
  ssr: false,
  loading: () => <StorySkeleton />,
});

const Posts = dynamic(() => import("@/components/post/Posts"), {
  ssr: false,
  loading: () => <PostsSkeleton />,
});

function FeedPageComponent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isGuest = useAppSelector((state: RootState) => state.auth.user.isGuest);

  async function handleLogout() {
    const res = await dispatch(logOut());
    if (res.meta.requestStatus === "fulfilled") {
      router.push("/login");
    }
  }

  return (
    <div className="w-full min-h-screen pb-12">
      <Story />

      {isGuest && (
        <div className="flex items-start gap-3 mb-4 p-4 rounded-2xl border border-blue-200 bg-[var(--wrapperColor)] shadow-sm">
          <div className="flex-shrink-0 text-blue-500">
            <InfoIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <p className="text-md sm:text-xs text-[var(--textColor)]/90 leading-relaxed">
              <span className="font-medium">Note:</span> Dear User, we can’t
              show your stories, posts and comments because you are a guest.
              Please{" "}
              <span className="font-semibold text-black bg-gray-300 px-1 rounded-2xl">
                Signup
              </span>{" "}
              with google or email to access all features.
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow"
            >
              Signup
            </button>
          </div>
        </div>
      )}

      <Posts />
    </div>
  );
}

export default FeedPageComponent;
