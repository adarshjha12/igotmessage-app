"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Image,
  Video,
  Loader2,
  UserIcon,
  Music,
  FileStack,
  BarChart3,
  Globe,
  Lock,
  Plus,
  Trash,
  ArrowLeft,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export default function CreatePost() {
  const maxChars = 500;
  const maxFiles = 2;
  const currentUser = useAppSelector((state) => state.auth.user);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [posting, setPosting] = useState(false);
  const [posType, setPostType] = useState<"normal" | "poll">("normal");

  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileMode, setFileMode] = useState<"image" | "video" | null>(null);

  const remaining = maxChars - text.length;
  const canPost =
    (text.trim().length > 0 || files.length > 0 || pollQuestion.trim()) &&
    remaining >= 0;

  const pickFiles = (mode: "image" | "video") => {
    setFileMode(mode);
    fileInputRef.current?.click();
  };

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list);
    const filtered = next.filter((f) =>
      fileMode === "image"
        ? f.type.startsWith("image/")
        : f.type.startsWith("video/")
    );
    setFiles((prev) => {
      const all = [...prev, ...filtered];
      return all.slice(0, maxFiles);
    });
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleAddOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleSubmit = async () => {
    if (!canPost) return;
    try {
      setPosting(true);

      const payload = {
        text: text.trim(),
        files,
        privacy,
        type: posType,
        poll: showPoll
          ? {
              question: pollQuestion,
              options: pollOptions.filter((opt) => opt.trim() !== ""),
            }
          : null,
      };

      console.log("Submitting post:", payload);
      setPostType("normal");
      setText("");
      setFiles([]);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setShowPoll(false);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center bg-[var(--bgColor)]/5 overflow-hidden p-5 text-lg">
      {/* Background shapes */}
      <div className="absolute inset-0 -z-10 grid grid-cols-1 sm:grid-cols-2 gap-10 px-12">
        <div className="flex flex-col rounded-b-full rotate-12 blur-2xl bg-blue-700 h-80 w-80"></div>
        <div className="flex flex-col rounded-b-full rotate-45 blur-2xl bg-blue-800 h-96 w-96"></div>
        <div className="hidden sm:flex flex-col -rotate-12 blur-2xl bg-blue-700 h-80 w-80"></div>
      </div>

      {/* Card */}
      <div className=" w-full max-w-2xl rounded-2xl border border-[var(--textColor)]/30 bg-[var(--bgColor)]/80 backdrop-blur-md shadow-lg p-6">
        {/* User header + Privacy */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
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
            <p className="font-semibold text-[var(--textColor)]">
              {currentUser?.fullName || "You"}
            </p>
          </div>

          {/* Privacy Selector */}
          <div className="flex items-center gap-2 bg-[var(--bgColor)]/20 border border-[var(--textColor)]/30 px-3 py-1 rounded-xl cursor-pointer">
            {privacy === "public" ? (
              <Globe className="w-5 h-5 text-blue-500" />
            ) : (
              <Lock className="w-5 h-5 text-red-500" />
            )}
            <select
              value={privacy}
              onChange={(e) =>
                setPrivacy(e.target.value as "public" | "private")
              }
              className="bg-transparent text-sm outline-none cursor-pointer text-[var(--textColor)]"
            >
              <option className="text-black" value="public">
                Public
              </option>
              <option className="text-black" value="private">
                Private
              </option>
            </select>
          </div>
        </div>

        {/* Normal Post Mode */}
        {!showPoll && (
          <>
            {/* Textarea */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={maxChars}
              placeholder="What's happening?"
              className="w-full min-h-[100px] p-3 rounded-xl border border-[var(--textColor)]/30 bg-[var(--bgColor)]/10 text-[var(--textColor)] focus:outline-none focus:ring-2 focus:ring-[var(--textColor)]/50 resize-none mb-4 placeholder:text-[var(--textColor)]/50 text-lg"
            />

            {/* Upload / Options */}
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => pickFiles("image")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition font-semibold"
              >
                <Image className="w-5 h-5" /> Photo
              </button>

              <button
                onClick={() => pickFiles("video")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition font-semibold"
              >
                <Video className="w-5 h-5" /> Video
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-700 text-white hover:bg-green-800 transition font-semibold">
                <FileStack className="w-5 h-5" /> Library
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-700 text-white hover:bg-pink-800 transition font-semibold">
                <Music className="w-5 h-5" /> Music
              </button>

              <button
                onClick={() => setShowPoll(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition active:scale-90 bg-yellow-500 text-black"
              >
                <BarChart3 className="w-5 h-5" /> Poll
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept={fileMode === "image" ? "image/*" : "video/*"}
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
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Poll Form */}
        <AnimatePresence>
          {showPoll && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 border border-gray-700 rounded-xl bg-black text-white mb-4"
            >
              <button
                onClick={() => setShowPoll(false)}
                className="flex items-center gap-2 mb-4 text-sm px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Go Back
              </button>

              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Poll Question"
                className="w-full p-2 rounded-md border border-gray-700 bg-gray-900 text-white mb-3 focus:outline-none"
              />

              <div className="space-y-2">
                {pollOptions.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 p-2 rounded-md border border-gray-700 bg-gray-900 text-white focus:outline-none"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => handleRemoveOption(idx)}
                        className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollOptions.length < 4 && (
                <button
                  onClick={handleAddOption}
                  className="flex items-center gap-2 mt-3 text-sm px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
                >
                  <Plus className="w-4 h-4" /> Add Option
                </button>
              )}
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
            className="bg-[var(--textColor)] text-[var(--bgColor)] px-6 py-2 rounded-full flex items-center gap-2 disabled:opacity-50 transition text-lg"
          >
            {posting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
