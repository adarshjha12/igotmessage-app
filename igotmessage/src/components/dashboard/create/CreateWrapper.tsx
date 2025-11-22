"use client";

import dynamic from "next/dynamic";
import NewLoader from "@/components/NewLoader";

const CreatePageComponent = dynamic(
  () => import("@/components/dashboard/create/CreatePageComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen w-full bg-[var(--bgColor)]">
        <NewLoader color="[var(--textColor)]" />
      </div>
    ),
  }
);

export default function CreateWrapper() {
  return <CreatePageComponent />;
}
