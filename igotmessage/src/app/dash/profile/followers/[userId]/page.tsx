"use client"
import React from "react";
import dynamic from "next/dynamic";
import NewLoader from "@/components/NewLoader";
import { useParams } from "next/navigation";

const FollowingsList = dynamic(
  () => import("@/components/dashboard/profile/FollowersList"),
  {
    ssr: false,
    loading: () => (
      <div className=" w-full h-screen flex bg-[var(--bgColor)] items-center justify-center">
        <NewLoader color="[var(--textColor)]" />
      </div>
    ),
  }
);

function page() {
  const params = useParams();
  const userId = params.userId as string;

  return <FollowingsList userId={userId} type="followers" />;
}

export default page;
