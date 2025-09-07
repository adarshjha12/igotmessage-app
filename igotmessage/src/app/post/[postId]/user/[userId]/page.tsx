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
  return <div className="w-full items-start flex justify-center min-h-screen bg-[var(--bgColor)]">
    <div className=""><UserPost /></div>
  </div>
}

export default page;
