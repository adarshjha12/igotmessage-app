"use client";

import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import PostUpload from "./PostUpload";
import ReelUpload from "./ReelUpload";

export default function CreatePost() {
  const [activeTab, setActiveTab] = useState<"post" | "reel">("post");

  return (
    <div className="relative w-full min-h-screen h-full flex flex-col items-center justify-start mb-12 bg-[var(--bgColor)]/5 py-2 sm:text-sm text-lg">
      {/* Header tabs */}
      <div className="flex w-full mt-2 px-2 justify-between items-center gap-4">
        {/* Post Tab */}
        <button
          onClick={() => setActiveTab("post")}
          type="button"
          className={`flex items-center gap-2 w-full justify-center px-4 py-1 rounded-xl font-medium transition shadow-md 
      ${
        activeTab === "post"
          ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
          : "bg-[var(--wrapperColor)] border border-[var(--borderColor)]/30 text-[var(--textColor)] hover:bg-[var(--wrapperColor)]/80"
      }`}
        >
          <div
            className={`p-2.5 rounded-full ${
              activeTab === "post" ? "bg-black/10" : "bg-black/5"
            }`}
          >
            <PlusIcon size={20} className={`${activeTab === "post" ? "text-white" : "text-[var(--textColor)]"}`} strokeWidth={1.5} />
          </div>
          Post
        </button>

        {/* Reel Tab */}
        <button
          onClick={() => setActiveTab("reel")}
          type="button"
          className={`flex items-center gap-2 w-full justify-center px-4 py-1 rounded-xl font-medium transition shadow-md 
      ${
        activeTab === "reel"
          ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white"
          : "bg-[var(--wrapperColor)] border border-[var(--borderColor)]/30 text-[var(--textColor)] hover:bg-[var(--wrapperColor)]/80"
      }`}
        >
          <div
            className={`p-2.5 rounded-full ${
              activeTab === "reel" ? "bg-black/10" : "bg-black/5"
            }`}
          >
            <PlusIcon size={20} className={`${activeTab === "reel" ? "text-white" : "text-[var(--textColor)]"}`} strokeWidth={1.5} />
          </div>
          Reel
        </button>
      </div>

      {/* Content */}
      <div className="h-full sm:min-h-[700px] w-full px-4 bg-[var(--wrapperColor)]/50 overflow-y-scroll backdrop-blur-md mb-12 shadow-lg py-6 scroll-smooth">
        {activeTab === "post" ? <PostUpload /> : <ReelUpload />}
      </div>
    </div>
  );
}
