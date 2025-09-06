"use client";
import { useParams } from "next/navigation";
import React from "react";
import NewLoader from "@/components/NewLoader";
import dynamic from "next/dynamic";

const UserPost = dynamic(() => import("@/components/post/SinglePost"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-full bg-[var(--bgColor)]">
      <NewLoader color="[var(--textColor)]" />
    </div>
  ),
});

function page() {
  return <UserPost />;
}

export default page;
