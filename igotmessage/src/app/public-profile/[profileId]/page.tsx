"use client"
import React from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import NewLoader from "@/components/NewLoader";

const PublicProfile = dynamic(
  () => import("@/components/dashboard/profile/PublicViewProfile"),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-screen w-full">
      <NewLoader color="[var(--textColor)]" />
    </div>
  }
);

const page = () => {
  const param = useParams();
  const profileId = param.profileId as string;
  return (
    <div>
      <PublicProfile profileUserId={profileId} /> 
    </div>
  );
};

export default page;
