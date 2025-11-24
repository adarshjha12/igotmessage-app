"use client";
import React from "react";
import dynamic from "next/dynamic";
import NewLoader from "@/components/NewLoader";

const SettingComponent = dynamic(
  () => import("@/components/dashboard/profile/Settings"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full  flex justify-center items-center">
        <NewLoader color="[var(--textColor)]" />
      </div>
    ),
  }
);

function page() {
  return (
    <div className="min-h-screen w-full bg-[var(--bgColor)] flex justify-center">
      <SettingComponent />
    </div>
  );
}

export default page;
