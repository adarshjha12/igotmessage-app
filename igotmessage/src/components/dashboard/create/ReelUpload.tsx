"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Video, Loader2, Globe, Lock, UploadIcon, Info } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PopupMessage from "@/components/popups/PopupMessages";
import PopupWithLink from "@/components/popups/PopupWithLink";
import axios from "axios";
import { setShowPostUploadModal, uploadPost } from "@/features/postSlice";
import { setPostId } from "@/features/authSlice";

interface MusicData {
  title: string;
  artist?: string;
  genre?: string;
  url: string;
  image?: string;
}

const MAX_REEL_SECONDS = 30;

export default function ReelUpload() {
  const dispatch = useAppDispatch();
  const postingStatus = useAppSelector((s) => s.post.uploadPostStatus);
  const postId = useAppSelector((s) => s.post.postId);
  const userIdInPost = useAppSelector((s) => s.post.userIdInPost);
  const currentUser = useAppSelector((s) => s.auth.user);
  const userId = currentUser?._id;

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [postType, setPostType] = useState<"normal" | "poll">("normal");

  const [posting, setPosting] = useState(false);
  const [videoDurationError, setVideoDurationError] = useState(false);
  const [showVideoSizeError, setShowVideoSizeError] = useState(false);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  const onVideoSelected = (list: FileList | null) => {
    if (!list || !list[0]) return;
    const file = list[0];
    if (!file.type.startsWith("video/")) return;
    if (file.size > 25 * 1024 * 1024) {
      setShowVideoSizeError(true);
      return;
    }
    const url = URL.createObjectURL(file);

    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.onloadedmetadata = () => {
      const duration = videoEl.duration || 0;
      if (duration > MAX_REEL_SECONDS) {
        URL.revokeObjectURL(url);
        setVideoDurationError(true);
      } else {
        // revoke previous preview
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoFile(file);
        setVideoPreview(url);
      }
    };
    videoEl.onerror = () => {
      URL.revokeObjectURL(url);
      setVideoDurationError(true);
    };
    videoEl.src = url;
  };

  useEffect(() => {
    if (!videoDurationError) return;
    const t = setTimeout(() => setVideoDurationError(false), 7000);
    return () => clearTimeout(t);
  }, [videoDurationError]);

  const tryDispatchUploadPost = async (payload: any) => {
    try {
      // try redux thunk
      await dispatch(uploadPost(payload));
    } catch (e) {
      console.log(e);
    }
  };

  const handleUploadReel = async () => {
    if (!videoFile || posting) return;
    setPosting(true);
    dispatch(setShowPostUploadModal(true));

    const payload = {
      userId,
      files: [videoFile],
      postType,
      privacy,
    };

    try {
      console.log("payload", payload);

      await tryDispatchUploadPost(payload);
      setVideoFile(null);
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
      }
    } catch (err) {
      console.error("reel upload fail", err);
      dispatch(setShowPostUploadModal(false));
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    if (postingStatus === "succeeded") {
      dispatch(setPostId(postId ?? ""));
      dispatch(setShowPostUploadModal(false));
      setShowSuccessPopup(true);
    }
  }, [postingStatus, postId]);

  return (
    <div className="w-full flex flex-col p-5 rounded-2xl bg-[var(--bgColor)]/40 backdrop-blur-md shadow-lg border border-[var(--textColor)]/10">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.profilePicture || currentUser?.avatar!}
            alt={currentUser?.fullName || "User"}
            className="h-12 w-12 rounded-full object-cover border border-[var(--textColor)]/20 shadow-sm"
          />
          <p className="font-semibold text-lg text-[var(--textColor)]">
            {currentUser?.userName || "You"}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bgColor)]/50 border border-[var(--textColor)]/20 hover:bg-[var(--bgColor)]/70 transition">
          {privacy === "public" ? (
            <Globe className="w-5 h-5 text-blue-500" />
          ) : (
            <Lock className="w-5 h-5 text-red-500" />
          )}
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as any)}
            className="bg-transparent text-sm font-medium outline-none cursor-pointer text-[var(--textColor)]"
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

      {/* select button */}
      <div className="mb-5">
        <button
          onClick={() => videoInputRef.current?.click()}
          className="w-full py-1 rounded-xl border border-[var(--textColor)]/20 bg-gradient-to-r from-green-400 to-green-700 flex items-center justify-center gap-2 text-white font-medium transition shadow-sm"
        >
          <div className="flex items-center gap-1 p-4 rounded-full bg-white/20">
            <Video className="w-5 h-5" />
          </div>
          Select Video
        </button>
        <input
          ref={videoInputRef}
          className="hidden"
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(e) => onVideoSelected(e.target.files)}
        />
      </div>
      <div className="flex items-center gap-2 pb-2 text-sm">
        <Info className="text-green-600" size={16} />
        <p>Max video size: 25MB</p>
      </div>
      {/* preview */}
      <div className="mb-5">
        {videoPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-[var(--textColor)]/20 shadow-md">
            <video
              src={videoPreview}
              controls
              className="w-full max-h-[420px] object-contain rounded-xl"
            />
            <button
              onClick={() => {
                setVideoFile(null);
                if (videoPreview) {
                  URL.revokeObjectURL(videoPreview);
                  setVideoPreview(null);
                }
              }}
              className="absolute top-3 right-3 rounded-full p-2 bg-black/60 text-white hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="w-full h-44 rounded-xl border border-[var(--textColor)]/20 flex items-center justify-center text-[var(--textColor)]/60 text-sm">
            No video selected
          </div>
        )}
      </div>

      {videoDurationError && (
        <PopupMessage
          show={videoDurationError}
          type="error"
          message={`Video must be ${MAX_REEL_SECONDS} seconds or less`}
          onClose={() => setVideoDurationError(false)}
        />
      )}

      {showVideoSizeError && (
        <PopupMessage
          show={showVideoSizeError}
          type="error"
          message={`Video must be under 25mb`}
          onClose={() => setShowVideoSizeError(false)}
        />
      )}

      {showSuccessPopup && (
        <PopupWithLink
          show={showSuccessPopup}
          type="success"
          message="Reel uploaded"
          linkHref={`/post/${postId}/user/${userIdInPost}`}
          linkText="View Reel"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}

      {/* footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-[var(--textColor)]/70">
          {videoFile ? "✅ Ready to upload" : "Pick a video to upload"}
        </div>
        <button
          onClick={handleUploadReel}
          disabled={!videoFile || posting}
          className="px-6 py-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-700 text-white font-medium shadow-md hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {posting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 p-2 rounded-full bg-black/20">
                <UploadIcon className="w-5 h-5" />
              </div>
              Upload
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
