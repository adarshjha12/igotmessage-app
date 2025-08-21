"use client"
import NewLoader from "@/components/NewLoader";
import dynamic from "next/dynamic";
import React from "react";

const CreateStoryPageComponent = dynamic(
  () => import("@/components/create story/CreateStoryPageComponent"),
  {
    ssr: false, 
    loading: () => <div className="flex items-center justify-center h-screen w-full">
      <NewLoader color="black"/>
    </div>, 
  }
);

function Page() {
  return <CreateStoryPageComponent />;
}

export default Page;
