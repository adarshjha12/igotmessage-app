"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Image,
  Video,
  Loader2,
  Globe,
  Lock,
  Sparkles,
  SendHorizontalIcon,
  Music2Icon,
  BarChart3,
  DeleteIcon,
  BoomBox,
  Trash2,
  PlusIcon,
  Music,
  ArrowUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import StoryTemplates from "@/components/create story/StoryTemplates";
import PopupMessage from "@/components/popups/PopupMessages";
import MusicComponent from "@/components/create story/MusicComponent";
import Toggle from "@/components/Toggle";
import axios from "axios";
import NewLoader from "@/components/NewLoader";
import { setShowPostUploadModal, uploadPost } from "@/features/postSlice";
import PopupWithLink from "@/components/popups/PopupWithLink";
import { setPostId } from "@/features/authSlice";
import { StackIcon } from "@phosphor-icons/react";

interface MusicData {
  title: string;
  artist?: string;
  genre?: string;
  url: string;
  image?: string;
}

type FilePreview = {
  id: string;
  file: File;
  url: string;
  isVideo: boolean;
  duration?: number;
};

const MAX_POST_FILES = 2;
const MAX_POST_VIDEO_SECONDS = 50;
const MAX_CHARS = 1500;

export default function PostUpload() {
  const dispatch = useAppDispatch();
  const postingStatus = useAppSelector((s) => s.post.uploadPostStatus);
  const postId = useAppSelector((s) => s.post.postId);
  const userIdInPost = useAppSelector((s) => s.post.userIdInPost);
  const globalPostImage = useAppSelector((s) => s.post.globalPostImage);
  const currentUser = useAppSelector((s) => s.auth.user);
  const userId = currentUser?._id;

  // UI & inputs
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [templateImage, setTemplateImage] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [showPoll, setShowPoll] = useState(false);
  const [postType, setPostType] = useState<"normal" | "poll">("normal");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [libraryClicked, setLibraryClicked] = useState(false);
  const [musicClicked, setMusicClicked] = useState(false);
  const [musicData, setMusicData] = useState<MusicData>({
    title: "",
    artist: "",
    genre: "",
    url: "",
    image: "",
  });
  const [enableAiText, setEnableAiText] = useState(false);
  const [aiTextLoading, setAiTextLoading] = useState(false);

  // status / popups
  const [posting, setPosting] = useState(false);
  const [showVideoDurationError, setShowVideoDurationError] = useState(false);
  const [showTemplateSelectedPopup, setShowTemplateSelectedPopup] =
    useState(true);
  const [showMusicSelectedPopup, setShowMusicSelectedPopup] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const remaining = MAX_CHARS - text.length;
  const [showVideoSizeError, setShowVideoSizeError] = useState(false);
  const [showInvalidFileError, setShowInvalidFileError] = useState(false);

  const canPost =
    (text.trim().length > 0 ||
      previews.length > 0 ||
      pollQuestion.trim() ||
      templateImage) &&
    remaining >= 0;

  // helper: unique id
  const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // revoke preview URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []); // eslint-disable-line

  // If a global image is set (from camera), convert & add
  useEffect(() => {
    if (!globalPostImage) return;
    let cancelled = false;
    (async () => {
      try {
        const blob = await fetch(globalPostImage as string).then((r) =>
          r.blob()
        );
        if (cancelled) return;
        const file = new File([blob], "global-post.png", { type: "image/png" });
        const url = URL.createObjectURL(file);
        setPreviews((prev) => {
          const next = [...prev, { id: genId(), file, url, isVideo: false }];
          return next.slice(0, 1); // single template image
        });
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [globalPostImage]);

  // file -> FilePreview promise
  type FileProcessResult =
    | FilePreview
    | { error: "tooLarge" | "tooLong" | "invalid" };

  const MAX_VIDEO_SIZE = 25 * 1024 * 1024;

  const processFile = (file: File): Promise<FileProcessResult> =>
    new Promise((resolve) => {
      const isVideo = file.type.startsWith("video/");
      const url = URL.createObjectURL(file);

      // Size check first
      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        URL.revokeObjectURL(url);
        resolve({ error: "tooLarge" });
        return;
      }

      if (!isVideo) {
        resolve({ id: genId(), file, url, isVideo: false });
        return;
      }

      // Check video duration
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";
      videoEl.onloadedmetadata = () => {
        const duration = videoEl.duration || 0;
        if (duration > MAX_POST_VIDEO_SECONDS) {
          URL.revokeObjectURL(url);
          resolve({ error: "tooLong" });
        } else {
          resolve({ id: genId(), file, url, isVideo: true, duration });
        }
      };
      videoEl.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ error: "invalid" });
      };
      videoEl.src = url;
    });

  const onFiles = useCallback(
    async (list: FileList | null) => {
      if (!list) return;
      const arr = Array.from(list);
      const processed: FilePreview[] = [];

      for (const f of arr) {
        const result = await processFile(f);

        if ("error" in result) {
          if (result.error === "tooLarge") {
            setShowVideoSizeError(true); // ⬅️ you define this state
          } else if (result.error === "tooLong") {
            setShowVideoDurationError(true);
          } else {
            setShowInvalidFileError(true);
          }
          continue;
        }

        processed.push(result);
        if (processed.length + previews.length >= MAX_POST_FILES) break;
      }

      if (processed.length === 0) return;
      setPreviews((prev) => {
        const next = [...prev, ...processed];
        return next.slice(0, MAX_POST_FILES);
      });
    },
    [previews]
  );

  const removePreview = (id: string) => {
    setPreviews((prev) => {
      const toRemove = prev.find((p) => p.id === id);
      if (toRemove) URL.revokeObjectURL(toRemove.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  useEffect(() => {
    if (!showVideoDurationError) return;
    const t = setTimeout(() => setShowVideoDurationError(false), 7000);
    return () => clearTimeout(t);
  }, [showVideoDurationError]);

  // AI text generation (streaming visual)
  const AI_URL =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/text/ai`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/text/ai`;

  const startStreaming = (fullText: string) => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i >= fullText.length) {
        clearInterval(interval);
        return;
      }
      setDisplayedText((prev) => prev + fullText[i]);
      i++;
    }, 20);
  };

  async function handleAiTextGeneration() {
    if (!inputText) return;
    setAiTextLoading(true);
    try {
      const res = await axios.post(AI_URL, { prompt: inputText });
      const output = res?.data?.output ?? "";
      setText(output);
      startStreaming(output);
      setInputText("");
    } catch (err) {
      console.error(err);
    } finally {
      setAiTextLoading(false);
    }
  }

  // dispatch uploadPost with fallback to FormData/axios
  const tryDispatchUploadPost = async (payload: any) => {
    try {
      const r = await dispatch(uploadPost(payload));
      return r;
    } catch (e) {
      // fallback to axios + FormData
      // build FormData
      const fd = new FormData();
      if (payload.userId) fd.append("userId", payload.userId);
      if (payload.text) fd.append("text", payload.text);
      if (payload.privacy) fd.append("privacy", payload.privacy);
      if (payload.postType) fd.append("postType", payload.postType);
      if (payload.isReel) fd.append("isReel", String(payload.isReel));
      if (payload.musicData)
        fd.append("musicData", JSON.stringify(payload.musicData));
      if (payload.poll) fd.append("poll", JSON.stringify(payload.poll));
      // files
      if (payload.files && Array.isArray(payload.files)) {
        payload.files.forEach((file: File, i: number) => {
          fd.append("files", file, file.name || `file-${i}`);
        });
      }
      // POST to backend url (try common endpoint)
      const url =
        process.env.NODE_ENV === "production"
          ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/posts`
          : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/posts`;
      const headers: Record<string, string> = {};
      // axios will set multipart boundary automatically
      const response = await axios.post(url, fd, { headers });
      return response.data;
    }
  };

  const handleSubmit = async () => {
    if (!canPost || posting) return;
    setPosting(true);
    dispatch(setShowPostUploadModal(true));

    const payload = {
      userId,
      text: text.trim(),
      files: previews.map((p) => p.file),
      templateImage,
      privacy,
      postType,
      poll: showPoll
        ? {
            question: pollQuestion,
            options: pollOptions.map((o) => ({ text: o.trim() })),
          }
        : null,
      musicData,
      isReel: false,
    };

    try {
      await tryDispatchUploadPost(payload);
      // reset
      setText("");
      setPreviews((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url));
        return [];
      });
      setTemplateImage("");
      setPollQuestion("");
      setPollOptions(["", ""]);
      setShowPoll(false);
      setMusicData({ title: "", artist: "", genre: "", url: "", image: "" });
    } catch (err) {
      console.error("upload error:", err);
      // ensure modal closed
      dispatch(setShowPostUploadModal(false));
    } finally {
      setPosting(false);
    }
  };

  // when slice reports success
  useEffect(() => {
    if (postingStatus === "succeeded") {
      dispatch(setPostId(postId ?? ""));
      dispatch(setShowPostUploadModal(false));
      setPosting(false);
      setShowSuccessPopup(true);
    }
  }, [postingStatus, postId]);

  // autoshow template/music popup briefly
  useEffect(() => {
    setShowTemplateSelectedPopup(true);
    const t = setTimeout(() => setShowTemplateSelectedPopup(false), 7000);
    return () => clearTimeout(t);
  }, [templateImage]);

  useEffect(() => {
    setShowMusicSelectedPopup(true);
    const t = setTimeout(() => setShowMusicSelectedPopup(false), 7000);
    return () => clearTimeout(t);
  }, [musicData.url]);

  // small helpers for poll options
  const handleAddOption = () =>
    pollOptions.length < 4 && setPollOptions([...pollOptions, ""]);
  const handleRemoveOption = (index: number) =>
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  const handleOptionChange = (index: number, value: string) => {
    const next = [...pollOptions];
    next[index] = value;
    setPollOptions(next);
  };

  useEffect(() => {
    let element;
    if (musicClicked) {
      element = document.getElementById(`music`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else if (libraryClicked) {
      element = document.getElementById(`library`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [musicClicked, libraryClicked]);

  return (
    <div className="relative w-full flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {currentUser?.profilePicture ? (
            <img
              src={currentUser.profilePicture}
              alt={currentUser.fullName || "User"}
              className="h-10 w-10 rounded-full object-cover border border-[var(--textColor)]/30"
            />
          ) : (
            <img
              src={currentUser?.avatar!}
              alt={currentUser?.fullName || "User"}
              className="h-10 w-10 rounded-full object-cover border border-[var(--textColor)]/30"
            />
          )}
          <p className="font-semibold text-[var(--textColor)]">
            {currentUser?.userName || "You"}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[var(--bgColor)]/20 border border-[var(--textColor)]/30 px-3 py-1 rounded-xl cursor-pointer">
          {privacy === "public" ? (
            <Globe className="w-5 h-5 text-blue-500" />
          ) : (
            <Lock className="w-5 h-5 text-red-500" />
          )}
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as any)}
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

      {!showPoll && (
        <div>
          {/* AI / textarea */}
          <div className="mb-4">
            <div className="flex items-center justify-between w-full mb-3 gap-3 px-2 py-2 rounded-2xl bg-gradient-to-r from-green-700 to-green-400 text-white shadow-md">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 p-2 rounded-full bg-white/10">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                </div>
                <p className="text-lg sm:text-sm font-medium">AI Text</p>
              </div>
              <button
                onClick={() => setEnableAiText((v) => !v)}
                className="transform scale-90 hover:scale-100 transition-transform duration-200"
              >
                <Toggle toggleNow={enableAiText} />
              </button>
            </div>

            {!enableAiText ? (
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={MAX_CHARS}
                placeholder={"What's happening?"}
                className="w-full min-h-[100px] p-3 rounded-xl border border-[var(--textColor)]/50 outline-none bg-[var(--bgColor)]/10 text-[var(--textColor)] resize-none mb-2"
              />
            ) : (
              <div className="w-full flex flex-col items-center mb-4">
                {aiTextLoading && (
                  <div className="w-full p-4 mb-4 text-right">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                )}
                {displayedText && (
                  <div className="w-full min-h-[100px] p-4 rounded-2xl border border-[var(--textColor)]/30 bg-[var(--bgColor)]/80 mb-4">
                    <span className="whitespace-pre-wrap">{displayedText}</span>
                  </div>
                )}
                <div className="w-full flex gap-3 justify-center items-center px-4 py-2 rounded-2xl border border-[var(--textColor)]/50 mb-4 bg-[var(--bgColor)]/10">
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter prompt"
                    className="w-full min-h-[50px] border-none outline-none"
                  />
                  <button
                    disabled={!inputText || aiTextLoading}
                    onClick={handleAiTextGeneration}
                    className="rounded-2xl p-2  text-[var(--bgColor)] bg-[var(--textColor)]"
                  >
                    {aiTextLoading ? (
                      <NewLoader />
                    ) : (
                      <ArrowUp strokeWidth={2.5} size={28} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* options row */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-1 rounded-xl text-white font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition shadow-md"
            >
              <div className="p-2.5 rounded-full bg-black/10">
                <Image className="w-5 h-5 text-white" />
              </div>
              Photo
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-1 rounded-xl text-white font-medium bg-gradient-to-r from-purple-500 to-purple-700 hover:opacity-90 transition shadow-md"
            >
              <div className="p-2.5 rounded-full bg-black/10">
                <Video className="w-5 h-5 text-white" />
              </div>
              Video
            </button>

            <button
              onClick={() => {
                setLibraryClicked((p) => !p);
                setMusicClicked(false);
              }}
              className="flex items-center gap-2 px-4 py-1 rounded-xl text-white font-medium bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition shadow-md"
            >
              <div className="p-2.5 rounded-full bg-black/10">
                <StackIcon className="w-5 h-5 text-white" />
              </div>
              Library
            </button>

            <button
              onClick={() => {
                setMusicClicked((p) => !p);
                setLibraryClicked(false);
              }}
              className="flex items-center gap-2 px-4 py-1 rounded-xl text-white font-medium bg-gradient-to-r from-pink-500 to-pink-700 hover:opacity-90 transition shadow-md"
            >
              <div className="p-2.5 rounded-full bg-black/10">
                <Music2Icon className="w-5 h-5 text-white" />
              </div>
              Music
            </button>

            <button
              onClick={() => {
                setShowPoll(true);
                setPostType("poll");
                setMusicClicked(false);
                setLibraryClicked(false);
                setText("");
                setPreviews([]);
                setTemplateImage("");
              }}
              className="flex items-center gap-2 px-4 py-1 rounded-xl text-white font-medium bg-gradient-to-r from-yellow-500 to-yellow-700 hover:opacity-90 transition shadow-md"
            >
              <div className="p-2.5 rounded-full bg-black/10">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              Poll
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*,video/*"
              onChange={(e) => onFiles(e.target.files)}
            />
          </div>

          {/* music chip */}
          {musicData.url && (
            <div className="flex px-2 py-1 w-fit my-4 rounded-xl gap-2 items-center border">
              <Music className="w-4 h-4" />
              <div className="overflow-hidden">
                <p className="text-sm translate-animation">
                  {musicData.title.slice(0, 20)}
                </p>
              </div>
              <button
                onClick={() =>
                  setMusicData({
                    title: "",
                    artist: "",
                    genre: "",
                    url: "",
                    image: "",
                  })
                }
              >
                <X />
              </button>
            </div>
          )}

          {/* previews */}
          <AnimatePresence>
            {(previews.length > 0 || templateImage || musicData.url) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4"
              >
                {previews.map((p) => (
                  <div
                    key={p.id}
                    className="relative rounded-xl overflow-hidden border border-[var(--textColor)]/30"
                  >
                    {p.isVideo ? (
                      <video
                        src={p.url}
                        className="w-full h-40 object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={p.url}
                        className="w-full h-40 object-cover"
                        alt={p.file.name}
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePreview(p.id);
                      }}
                      className="absolute top-1 right-1 bg-[var(--bgColor)]/50 rounded-full p-1"
                    >
                      <X className="w-4 h-4 text-[var(--textColor)]" />
                    </button>
                  </div>
                ))}
                {templateImage && (
                  <div className="relative rounded-xl overflow-hidden border border-[var(--textColor)]/30">
                    <img
                      src={templateImage}
                      alt="template"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => setTemplateImage("")}
                      className="absolute top-1 right-1 bg-[var(--bgColor)]/50 rounded-full p-1"
                    >
                      <X />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Poll form */}
      <AnimatePresence>
        {showPoll && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-5 w-full border border-[var(--textColor)]/30 outline-none rounded-2xl bg-[var(--bgColor)] text-[var(--textColor)] shadow-md mb-4"
          >
            <button
              onClick={() => {
                setShowPoll(false);
                setPostType("normal");
              }}
              className="flex items-center gap-2 mb-4 px-4 py-1 rounded-xl font-medium bg-gradient-to-r from-rose-500 to-rose-700 text-white hover:opacity-90 transition shadow-md"
            >
              <div className="p-2.5 rounded-full bg-black/10">
                <X className="w-5 h-5 text-white" />
              </div>
              Cancel
            </button>

            <textarea
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="Ask your question..."
              className="w-full min-h-[140px] p-3 rounded-xl border border-[var(--textColor)]/30 outline-none bg-[var(--wrapperColor)] text-[var(--textColor)]"
            />
            <div className="space-y-3 mt-4">
              {pollOptions.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 p-3 rounded-xl border border-[var(--textColor)]/30 outline-none"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => handleRemoveOption(idx)}
                      className="p-2 rounded-xl bg-red-600 text-white"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {pollOptions.length < 4 && (
              <button
                onClick={handleAddOption}
                className="mt-4 flex items-center gap-2 px-4 py-1 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:opacity-90 transition shadow-md"
              >
                <div className="p-2.5 rounded-full bg-black/10">
                  <PlusIcon className="w-5 h-5 text-white" />
                </div>
                Add Option
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* footer */}
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
          className="bg-[var(--textColor)] text-[var(--bgColor)] px-6 py-2 rounded-full flex items-center gap-2 disabled:opacity-50"
        >
          {posting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Post"}
        </button>
      </div>

      {/* overlays */}
      {libraryClicked && (
        <div
          id="library"
          className=" w-full backdrop-blur-lg mt-4 rounded-2xl py-2 flex items-center justify-center "
        >
          <button
            onClick={() => setLibraryClicked(false)}
            className="fixed top-4 left-2 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <StoryTemplates feedPost={true} setTemplateImage={setTemplateImage} />
        </div>
      )}

      {musicClicked && (
        <div
          id="music"
          className=" w-full backdrop-blur-lg mt-4 rounded-2xl py-2 flex items-center justify-center "
        >
          <button
            onClick={() => setMusicClicked(false)}
            className="fixed z-20 top-4 left-2 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <MusicComponent postFeed={true} setMusicDataForPost={setMusicData} />
        </div>
      )}

      {/* popups */}
      {showVideoDurationError && (
        <PopupMessage
          show={showVideoDurationError}
          type="error"
          message={`Video must be less than ${MAX_POST_VIDEO_SECONDS} seconds`}
          onClose={() => setShowVideoDurationError(false)}
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

      {templateImage && showTemplateSelectedPopup && (
        <div className="fixed top-4 z-50">
          <PopupMessage
            show={showTemplateSelectedPopup}
            type="success"
            message="Image added"
            onClose={() => setShowTemplateSelectedPopup(false)}
          />
        </div>
      )}

      {musicData.url && showMusicSelectedPopup && (
        <div className="fixed top-4 z-50">
          <PopupMessage
            show={showMusicSelectedPopup}
            type="success"
            message="Music selected"
            onClose={() => setShowMusicSelectedPopup(false)}
          />
        </div>
      )}

      {showSuccessPopup && (
        <PopupWithLink
          show={showSuccessPopup}
          type="success"
          message="Post Uploaded Successfully"
          linkHref={`/post/${postId}/user/${userIdInPost}`}
          linkText="View Post"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
}
