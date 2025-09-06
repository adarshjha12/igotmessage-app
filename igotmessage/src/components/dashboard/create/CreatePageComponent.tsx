"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
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
  Sparkles,
  SendHorizontalIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Textarea } from "@headlessui/react";
import StoryTemplates from "@/components/create story/StoryTemplates";
import PopupMessage from "@/components/popups/PopupMessages";
import MusicComponent from "@/components/create story/MusicComponent";
import ImageCropper from "@/components/ImageCropper";
import Toggle from "@/components/Toggle";
import axios from "axios";
import NewLoader from "@/components/NewLoader";
import { setShowPostUploadModal, uploadPost } from "@/features/postSlice";
import UploadPostModal from "@/components/modals/UploadPostModal";
import { useRouter } from "next/navigation";
import PopupWithLink from "@/components/popups/PopupWithLink";
import { setPostId } from "@/features/authSlice";

interface MusicData {
  title: string;
  artist?: string;
  genre?: string;
  url: string;
  image?: string;
}

export default function CreatePost() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const postingStatus = useAppSelector((state) => state.post.uploadPostStatus);
  const postId = useAppSelector((state) => state.post.postId);
  const userIdInPost = useAppSelector((state) => state.post.userIdInPost);
  const showPostUploadModal = useAppSelector(
    (state) => state.post.showPostUploadModal
  );
  const userId = useAppSelector((state) => state.auth.user._id);

  const maxChars = 1500;
  const maxFiles = 2;
  const currentUser = useAppSelector((state) => state.auth.user);
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [posting, setPosting] = useState(false);
  const [postType, setPostType] = useState<"normal" | "poll">("normal");
  const [templateImage, setTemplateImage] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [libraryClicked, setLibraryClicked] = useState(false);
  const [musicClicked, setMusicClicked] = useState(false);
  const [showTemplateSelectedPopup, setShowTemplateSelectedPopup] =
    useState(true);
  const [showMusicSelectedPopup, setShowMusicSelectedPopup] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [enableAiText, setEnableAiText] = useState(false);
  const [musicData, setMusicData] = useState<MusicData>({
    title: "",
    artist: "",
    genre: "",
    url: "",
    image: "",
  });
  const [showVideoDurationError, setShowVideoDurationError] = useState(false);

  const remaining = maxChars - text.length;
  const canPost =
    (text.trim().length > 0 ||
      files.length > 0 ||
      pollQuestion.trim() ||
      templateImage) &&
    remaining >= 0;

  const [aiTextLoading, setAiTextLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowVideoDurationError(false);
    }, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, [showVideoDurationError]);

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const newFiles = Array.from(list);

    newFiles.forEach((file) => {
      if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          const duration = video.duration;

          if (duration >= 50) {
            setShowVideoDurationError(true);
          } else {
            setFiles((prev) => {
              const all = [...prev, file];
              return all.slice(0, maxFiles);
            });
          }
        };

        video.src = URL.createObjectURL(file);
      } else {
        setFiles((prev) => {
          const all = [...prev, file];
          return all.slice(0, maxFiles);
        });
      }
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
      dispatch(setShowPostUploadModal(true));

      const payload = {
        userId,
        text: text.trim(),
        files,
        templateImage,
        privacy,
        postType,
        poll: showPoll
          ? {
              question: pollQuestion,
              options: pollOptions.map((option) => ({ text: option.trim() })),
            }
          : null,
        musicData: musicData,
      };

      await dispatch(uploadPost(payload));
      console.log("Submitting post:", payload);
      setPostType("normal");
      setText("");
      setFiles([]);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setShowPoll(false);
      setTemplateImage("");
      setMusicData({
        title: "",
        url: "",
      });
    } catch (error) {
      console.log(error);
      dispatch(setShowPostUploadModal(false));
      setPosting(false);
      setPostType("normal");
      setText("");
      setFiles([]);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setShowPoll(false);
    }
  };

  function startStreaming(fullText: string) {
    let i = 0;

    const interval = setInterval(() => {
      if (i >= fullText.length) {
        clearInterval(interval);
        return;
      }

      setDisplayedText((prev) => prev + fullText[i]);
      i++;
    }, 30);
  }

  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/text/ai`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/text/ai`;

  async function handleAiTextGeneration() {
    setDisplayedText("");
    setAiTextLoading(true);
    const prompt = inputText;
    try {
      const response = await axios.post(url, {
        prompt,
      });

      setText(response.data?.output);
      startStreaming(response.data?.output);
      setAiTextLoading(false);
      setInputText("");
    } catch (error) {
      console.error("Error:", error);
      setAiTextLoading(false);
    }
  }

  useEffect(() => {
    if (postingStatus === "succeeded") {
      dispatch(setPostId(postId ?? ""));
      dispatch(setShowPostUploadModal(false));
      console.log("post id", postId);
      setPosting(false);
      setShowSuccessPopup(true);
    }
  }, [postingStatus, postId, router, dispatch]);

  useEffect(() => {
    if (displayedText.includes("undefined")) {
      setDisplayedText((prev) => prev.replace(/undefined/g, ""));
    }
  }, [displayedText]);

  useEffect(() => {
    setShowTemplateSelectedPopup(true);
    setTimeout(() => {
      setShowTemplateSelectedPopup(false);
    }, 5000);
  }, [templateImage]);

  useEffect(() => {
    setShowMusicSelectedPopup(true);
    setTimeout(() => {
      setShowMusicSelectedPopup(false);
    }, 5000);
  }, [musicData.url]);

  return (
    <div className="relative w-full min-h-screen h-full flex items-start justify-center mb-12 bg-[var(--bgColor)]/5  py-2 text-lg">
      {/* Card */}
      <div className=" h-full sm:min-h-[700px] w-full px-4 rounded-2xl border border-[var(--textColor)]/30 bg-[var(--wrapperColor)]/50 overflow-y-scroll backdrop-blur-md mb-12 shadow-lg py-6 scroll-smooth">
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
              <img
                src={currentUser.avatar!}
                alt={currentUser.fullName || "User"}
                className="h-10 w-10 rounded-full object-cover border border-[var(--textColor)]/30"
              />
            )}
            <p className="font-semibold text-[var(--textColor)]">
              {currentUser?.userName || "You"}
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
            {!musicClicked && !libraryClicked && (
              <>
                <div className="flex items-center w-full my-4 justify-between gap-3 px-2 py-1 rounded-lg bg-gradient-to-r from-rose-500 to-indigo-800 border border-white/30 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    <p className="text-sm font-medium text-white">AI Text</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEnableAiText((prev) => !prev);
                      setMusicClicked(false);
                      setLibraryClicked(false);
                    }}
                    className="transform scale-90 hover:scale-100 transition-transform duration-200"
                  >
                    <Toggle toggleNow={enableAiText} />
                  </button>
                </div>

                {/* Conditional rendering */}
                {!enableAiText ? (
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleTextAreaChange}
                    maxLength={maxChars}
                    placeholder={"What's happening?"}
                    className="w-full min-h-[100px] p-3 rounded-xl border border-[var(--textColor)]/50 bg-[var(--bgColor)]/10 text-[var(--textColor)] focus:outline-none focus:ring-2 focus:ring-[var(--textColor)]/50 resize-none mb-2 placeholder:text-[var(--textColor)]/80 text-lg placeholder:text-xl overflow-hidden"
                  />
                ) : (
                  <div className="w-full flex flex-col justify-center mb-10 items-center">
                    {aiTextLoading && (
                      <div className="w-full p-4 flex mb-4 justify-end items-center">
                        <span className="text-[var(--textColor)] opacity-60 text-3xl animate-pulse">
                          Thinking...
                        </span>
                      </div>
                    )}

                    {displayedText && (
                      <div
                        className="
                          w-full 
                          min-h-[100px] 
                          p-4 
                          rounded-2xl 
                          border 
                          border-[var(--textColor)]/30 
                          bg-[var(--bgColor)]/80
                          backdrop-blur-md 
                          text-[var(--textColor)] 
                          text-lg 
                          leading-relaxed 
                          whitespace-pre-wrap 
                          shadow-md 
                          transition-all 
                          duration-300 mb-4
                          ease-in-out
                        "
                      >
                        <span>{displayedText}</span>
                      </div>
                    )}

                    <div className="w-full flex gap-3 justify-center items-center px-4 py-2 rounded-2xl border border-[var(--textColor)]/50 bg-[var(--bgColor)]/10 text-[var(--textColor)] focus:outline-none focus:ring-2 focus:ring-[var(--textColor)]/50 resize-none mb-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="Enter prompt"
                        className="w-full min-h-[50px] placeholder:text-[var(--textColor)]/80 border-none outline-none text-lg placeholder:text-xl overflow-hidden"
                      />
                      <button
                        type="button"
                        disabled={inputText.length === 0 || aiTextLoading}
                        onClick={handleAiTextGeneration}
                        className="transform active:scale-75 active:bg-green-500 scale-90 hover:scale-100 transition-transform duration-200 rounded-full p-1 px-3 text-[var(--bgColor)] bg-[var(--textColor)] "
                      >
                        {aiTextLoading ? (
                          <NewLoader />
                        ) : (
                          <SendHorizontalIcon
                            strokeWidth={1.5}
                            size={34}
                            className="text-[var(--bgColor)]"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Upload / Options */}
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bgColor)] text-[var(--textColor)] border border-[var(--textColor)]/30 transition-all duration-200 font-semibold relative overflow-hidden group active:scale-95"
              >
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-blue-500/30 to-transparent blur-md"></span>
                <Image className="w-5 h-5 text-blue-500 relative z-10" /> Photo
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bgColor)] text-[var(--textColor)] border border-[var(--textColor)]/30 transition-all duration-200 font-semibold relative overflow-hidden group active:scale-95"
              >
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-purple-500/30 to-transparent blur-md"></span>
                <Video className="w-5 h-5 text-purple-500 relative z-10" />{" "}
                Video
              </button>

              <button
                onClick={() => {
                  setLibraryClicked((prev) => !prev);
                  setMusicClicked(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bgColor)] text-[var(--textColor)] border border-[var(--textColor)]/30 transition-all duration-200 font-semibold relative overflow-hidden group active:scale-95"
              >
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-green-500/30 to-transparent blur-md"></span>
                <FileStack className="w-5 h-5 text-green-500 relative z-10" />{" "}
                Library
              </button>

              <button
                onClick={() => {
                  setMusicClicked((prev) => !prev);
                  setLibraryClicked(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bgColor)] text-[var(--textColor)] border border-[var(--textColor)]/30 transition-all duration-200 font-semibold relative overflow-hidden group active:scale-95"
              >
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-pink-500/30 to-transparent blur-md"></span>
                <Music className="w-5 h-5 text-pink-500 relative z-10" /> Music
              </button>

              <button
                onClick={() => {
                  setShowPoll(true);
                  setPostType("poll");
                  setMusicClicked(false);
                  setLibraryClicked(false);
                  setDisplayedText("");
                  setText("");
                  setFiles([]);
                  setTemplateImage("");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bgColor)] text-[var(--textColor)] border border-[var(--textColor)]/30 transition-all duration-200 font-semibold relative overflow-hidden group active:scale-95"
              >
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-yellow-500/30 to-transparent blur-md"></span>
                <BarChart3 className="w-5 h-5 text-yellow-500 relative z-10" />{" "}
                Poll
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*,video/*"
                onChange={(e) => onFiles(e.target.files)}
              />
            </div>

            {musicData.url !== "" && (
              <div className="flex px-2 h-fit py-1 w-fit my-4 border-1 border-[var(--borderColor)]/30 rounded-xl gap-2 items-center justify-center overflow-hidden">
                <Music strokeWidth={1.5} />
                <div className="overflow-hidden">
                  <p className="translate-animation text-nowrap text-sm">
                    {musicData.title.slice(0, 20)}
                  </p>
                </div>
                <button onClick={() => setMusicData({ title: "", url: "" })}>
                  <X />
                </button>
              </div>
            )}
            {/* Preview */}
            <AnimatePresence>
              {(files.length > 0 ||
                templateImage !== "" ||
                musicData.url !== "") && (
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
                  {templateImage !== "" && (
                    <div className="relative rounded-xl overflow-hidden border border-[var(--textColor)]/30">
                      <img
                        src={templateImage}
                        alt="template"
                        className="w-full h-40 object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTemplateImage("");
                        }}
                        className="absolute top-1 right-1 bg-[var(--bgColor)]/50 rounded-full p-1 backdrop-blur-sm shadow hover:bg-[var(--bgColor)]/70 transition"
                      >
                        <X className="w-4 h-4 text-[var(--textColor)]" />
                      </button>
                    </div>
                  )}
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
              className="p-5 w-full border border-gray-700/50 rounded-2xl bg-[var(--bgColor)] text-[var(--textColor)] shadow-md backdrop-blur-sm mb-4"
            >
              {/* Go Back */}
              <button
                onClick={() => {
                  setShowPoll(false);
                  setPostType("normal");
                }}
                className="flex items-center gap-2 mb-4 text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-rose-800 to-rose-500 text-white font-medium shadow hover:scale-[1.02] hover:shadow-lg transition-all"
              >
                <X className="w-4 h-4" /> Cancel
              </button>

              {/* Poll Question */}
              <textarea
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask your question..."
                className="w-full min-h-[140px] p-3 rounded-xl border border-gray-700/50 bg-[var(--wrapperColor)] text-[var(--textColor)] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />

              {/* Poll Options */}
              <div className="space-y-3 mt-4">
                {pollOptions.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 p-3 rounded-xl border border-gray-500/50  text-[var(--textColor)] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => handleRemoveOption(idx)}
                        className="p-2 rounded-xl bg-red-600/80 text-white hover:bg-red-500 transition-all shadow-sm"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Option */}
              {pollOptions.length < 4 && (
                <button
                  onClick={handleAddOption}
                  className="flex items-center gap-2 mt-4 text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] hover:shadow-lg transition-all"
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
        {libraryClicked && (
          <div className=" w-full backdrop-blur-lg mt-4 rounded-2xl py-2 flex items-center justify-center ">
            <button
              onClick={() => setLibraryClicked(false)}
              className="flex fixed top-4 left-2 items-center gap-2 mb-4 text-sm px-3 py-1 text-[var(--textColor)] rounded-md hover:bg-red-700 transition"
            >
              <X className="w-8 h-8" />
            </button>
            <StoryTemplates
              feedPost={true}
              setTemplateImage={setTemplateImage}
            />
          </div>
        )}
        {musicClicked && (
          <div className=" w-full backdrop-blur-lg mt-4 rounded-2xl py-2 flex items-center justify-center ">
            <button
              onClick={() => setMusicClicked(false)}
              className="flex fixed top-8 left-2 items-center gap-2 mb-4 text-sm z-50 px-3 py-1 text-[var(--textColor)] ] rounded-md hover:bg-red-700 transition"
            >
              <X className="w-8 h-8" />
            </button>
            <MusicComponent
              postFeed={true}
              setMusicDataForPost={setMusicData}
            />
          </div>
        )}
      </div>
      {showVideoDurationError && (
        <PopupMessage
          key={1}
          show={showVideoDurationError}
          type="error"
          message="Video must be less than 50 seconds"
          onClose={() => setShowVideoDurationError(false)}
        />
      )}
      {templateImage !== "" && (
        <div className="fixed top-4 z-50 flex items-start justify-center mt-5">
          <PopupMessage
            key={2}
            show={showTemplateSelectedPopup}
            type="success"
            message="image Added"
            onClose={() => setShowTemplateSelectedPopup(false)}
          />
        </div>
      )}
      {musicData.url !== "" && (
        <div className="fixed top-4 z-50 flex items-start justify-center mt-5">
          <PopupMessage
            show={showMusicSelectedPopup}
            type="success"
            message="music selected"
            onClose={() => setShowMusicSelectedPopup(false)}
          />
        </div>
      )}
      {showPostUploadModal && <UploadPostModal />}
      {showSuccessPopup && (
        <PopupWithLink
          linkHref={`/post/${postId}/user/${userIdInPost}`}
          linkText="View Post"
          show={showSuccessPopup}
          type="success"
          message="Post Uploaded Successfully"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
}
