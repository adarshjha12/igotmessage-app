"use client";

import Story from "@/components/create story/StoryCircles";
import React, { useEffect, useState } from "react";
import musicTracks from "@/utils/music";
import CameraCapture from "@/components/Camera";
import NewLoader from "@/components/NewLoader";
import SplashScreen from "@/components/SplashScreen";
import { DownloadIcon } from "@phosphor-icons/react";
import MainModal from "@/components/modals/MainModal";
import Skeleton from "react-loading-skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import dynamic from "next/dynamic";
import CreateProfile from "@/components/create profile/CreateProfile";
import { InfoIcon } from "lucide-react";
import { logOut } from "@/features/authSlice";
import { useRouter } from "next/navigation";
// import { useRouter, useSearchParams } from 'next/navigation'

const Posts = dynamic(() => import("@/components/dashboard/feed/Posts"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[200px] w-full">
      <NewLoader />
    </div>
  ),
});

function FeedPageComponent() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleLogout() {
    const res = await dispatch(logOut());
    if (res.meta.requestStatus === "fulfilled") {
      router.push("/login");
    }
  }
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);
  const isGuest = useAppSelector((state: RootState) => state.auth.user.isGuest);

  return (
    <div className=" w-full min-h-screen pb-12">
      <Story />
      {isGuest && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-blue-200 bg-[var(--wrapperColor)] shadow-sm">
          <div className="flex-shrink-0 text-blue-500">
            <InfoIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-[var(--textColor)]/90 leading-relaxed">
              <span className="font-medium">Note:</span> Dear User, we can’t
              show your personal stories and posts because you are a guest.
              Please <span className="font-semibold  text-black bg-gray-300 px-1 rounded-2xl">Signup</span>{" "}
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
