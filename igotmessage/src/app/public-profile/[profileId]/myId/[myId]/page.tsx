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
  <div className="flex bg-[var(--bgColor] min-h-screen flex-col gap-6  py-6">
    {/* Header section */}
    <div className="flex items-center gap-6">
      {/* Profile image */}
      <Skeleton circle width={80} height={80} />
      {/* Stats */}
      <div className="flex-1 flex justify-around">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton width={40} height={20} />
            <Skeleton width={50} height={12} className="mt-1" />
          </div>
        ))}
      </div>
    </div>

    {/* Username & Bio */}
    <div>
      <Skeleton width={120} height={18} />
      <Skeleton width={200} height={14} className="mt-2" />
      <Skeleton width={160} height={14} className="mt-1" />
    </div>

    {/* Grid posts */}
    <div className="grid grid-cols-3 gap-1">
      {[...Array(9)].map((_, i) => (
        <Skeleton key={i} height={120} />
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

  return (
      <PublicProfile profileUserId={profileId} />
  );
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
