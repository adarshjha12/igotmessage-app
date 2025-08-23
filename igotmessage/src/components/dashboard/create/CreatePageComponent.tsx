"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image, Video, Loader2, UserIcon } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

type CreatePostProps = {
  currentUser?: { name: string; avatarUrl?: string };
  maxChars?: number;
  maxFiles?: number;
  onSubmit: (payload: { text: string; files: File[] }) => Promise<void> | void;
};

export default function CreatePost() {
  const maxChars = 500;
  const maxFiles = 5;
  const currentUser = useAppSelector((state) => state.auth.user);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const remaining = maxChars - text.length;
  const canPost =
    (text.trim().length > 0 || files.length > 0) && remaining >= 0;

  const pickFiles = () => fileInputRef.current?.click();

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list);
    const filtered = next.filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    setFiles((prev) => {
      const all = [...prev, ...filtered];
      return all.slice(0, maxFiles);
    });
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!canPost) return;
    try {
      setPosting(true);
      // await onSubmit({ text: text.trim(), files });
      setText("");
      setFiles([]);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center bg-[var(--bgColor)]/5 overflow-hidden p-5">
      {/* Violet background shapes */}
      <div className="absolute inset-0 -z-10 grid grid-cols-1 sm:grid-cols-2 gap-10 px-12">
        <div className="flex flex-col rounded-b-full rotate-12 blur-2xl bg-blue-700 h-80 w-80"></div>
        <div className="flex flex-col rounded-b-full rotate-45 blur-2xl bg-blue-800 h-96 w-96"></div>
        <div className="hidden sm:flex flex-col -rotate-12 blur-2xl bg-blue-700 h-80 w-80"></div>
      </div>

      {/* Glassmorphic card */}
      <div className="z-20 w-full max-w-2xl rounded-2xl border border-[var(--textColor)]/30 bg-[var(--bgColor)]/50 backdrop-blur-md shadow-lg p-6">
        {/* User header */}
        <div className="flex items-center gap-3 mb-4">
          {currentUser?.profilePicture ? (
            <img
              src={currentUser.profilePicture}
              alt={currentUser.fullName || "User"}
              className="h-10 w-10 rounded-full object-cover border border-[var(--textColor)]/30"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[var(--textColor)]/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[var(--textColor)]" />
            </div>
          )}
          <div>
            <p className="font-semibold text-[var(--textColor)]">
              {currentUser?.fullName || "You"}
            </p>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={maxChars}
          placeholder="What's happening?"
          className="w-full min-h-[80px] p-3 rounded-xl border border-[var(--textColor)]/30 bg-[var(--bgColor)]/10 text-[var(--textColor)] focus:outline-none focus:ring-2 focus:ring-[var(--textColor)]/50 resize-none mb-4 placeholder:text-[var(--textColor)]/50"
        />

        {/* Media upload */}
        <div
          onClick={pickFiles}
          className="flex items-center gap-2 p-2 border-2 border-dashed border-[var(--textColor)]/30 rounded-xl cursor-pointer mb-4 hover:bg-[var(--bgColor)]/10 transition"
        >
          <Image className="w-5 h-5 text-[var(--textColor)]" />
          <span className="text-[var(--textColor)] text-sm">
            Add photos or videos (click or drag & drop)
          </span>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*,video/*"
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>

        {/* Preview */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4"
            >
              {files.map((file, idx) => {
                const isVideo = file.type.startsWith("video/");
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={idx}
                    className="relative rounded-xl overflow-hidden border border-[var(--textColor)]/30"
                  >
                    {isVideo ? (
                      <video
                        src={url}
                        className="w-full h-40 object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={url}
                        alt={file.name}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="absolute top-1 right-1 bg-[var(--bgColor)]/50 rounded-full p-1 backdrop-blur-sm shadow hover:bg-[var(--bgColor)]/70 transition"
                    >
                      <X className="w-4 h-4 text-[var(--textColor)]" />
                    </button>
                    {isVideo && (
                      <div className="absolute bottom-1 left-1 bg-[var(--bgColor)]/50 rounded-full px-1 flex items-center gap-1 text-xs backdrop-blur-sm">
                        <Video className="w-3 h-3 text-[var(--textColor)]" />{" "}
                        Video
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${
              remaining < 0 ? "text-red-400" : "text-[var(--textColor)]"
            }`}
          >
            {remaining} characters left
          </span>
          <button
            onClick={handleSubmit}
            disabled={!canPost || posting}
            className="bg-[var(--textColor)] text-[var(--bgColor)] px-5 py-1 rounded-full flex items-center gap-2 disabled:opacity-50  transition"
          >
            {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
