"use client";

import dynamic from "next/dynamic";
import NewLoader from "@/components/NewLoader";

const FeedPageComponent = dynamic(
  () => import("@/components/dashboard/feed/FeedPageComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen w-full bg-[var(--bgColor)]">
        <NewLoader color="[var(--textColor)]" />
      </div>
    ),
  }
);

export default function FeedWrapper() {
  return <FeedPageComponent />;
}
