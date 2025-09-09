"use client";

import React from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

// Reusable Instagram-style profile skeleton
const ProfileSkeleton = () => (
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

const PublicProfile = dynamic(
  () => import("@/components/dashboard/profile/PublicViewProfile"),
  {
    ssr: false,
    loading: () => <ProfileSkeletonWrapper />,
  }
);

const Page = () => {
  const param = useParams();
  const profileId = param.profileId as string;

  return <PublicProfile profileUserId={profileId} />;
};

function ProfileSkeletonWrapper() {
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);

  return (
    <SkeletonTheme
      baseColor={isDark ? "#1f2937" : "#e5e7eb"} // slate-800 vs gray-200
      highlightColor={isDark ? "#374151" : "#f3f4f6"} // slate-700 vs gray-100
    >
        <ProfileSkeleton />
    </SkeletonTheme>
  );
}

export default Page;
