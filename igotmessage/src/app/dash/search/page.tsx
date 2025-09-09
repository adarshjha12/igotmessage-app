"use client";
import React from "react";
import dynamic from "next/dynamic";
import NewLoader from "@/components/NewLoader";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

const PeopleList = dynamic(
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
  const userId = useAppSelector((state) => state.auth.user._id);
  const params = useParams();
  return <PeopleList userId={userId} type="people" />;
}

export default page;
