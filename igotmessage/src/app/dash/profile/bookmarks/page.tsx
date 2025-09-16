"use client"
import React from "react";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import Skeleton from "react-loading-skeleton";

function PostsSkeleton() {
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);

  return (
    <div className="flex flex-col w-full gap-4 px-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden p-4">
          <Skeleton
            borderRadius={10}
            baseColor={isDark ? "#2e302e" : "#ececec"}
            highlightColor={isDark ? "#232323" : "#f5f5f5"}
            height={20}
            width={120}
          />
          <Skeleton
            borderRadius={10}
            baseColor={isDark ? "#2e302e" : "#ececec"}
            highlightColor={isDark ? "#232323" : "#f5f5f5"}
            height={250}
            className="mt-2 rounded-xl"
          />
          <Skeleton
            borderRadius={10}
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

const Bookmarks = dynamic(
  () => import("@/components/dashboard/profile/Bookmarks"),
  {
    ssr: false,
    loading: () => <PostsSkeleton />,
  }
);

function page() {
  return <Bookmarks />;
}

export default page;
