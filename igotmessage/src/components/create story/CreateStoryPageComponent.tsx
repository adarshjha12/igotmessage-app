"use client";

import {
  ImagePlus,
  LayoutDashboard,
  Camera,
  Music2,
  ChevronDown,
  PenBox,
  Sparkles,
} from "lucide-react";

import html2canvas from "html2canvas";

import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  setStoryImage,
  setMusicData,
  setStoryTextBg,
  handleStoryUpload,
} from "@/features/storySlice";
import {
  AndroidLogoIcon,
  AppleLogoIcon,
  CameraIcon,
  DeviceMobileIcon,
  EyeIcon,
  EyesIcon,
  EyeSlashIcon,
  ImageIcon,
  PlusSquareIcon,
  SparkleIcon,
  SpeakerNoneIcon,
} from "@phosphor-icons/react";
import MusicComponent from "./MusicComponent";
import Image from "next/image";
import StoryTemplates from "./StoryTemplates";
import { usePathname, useRouter } from "next/navigation";
import AudioBars from "../AudioBar";
import { SpeakerXIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import CameraCapture from "../Camera";
import StoryText from "../text/StoryText";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ImageGenrator from "../ai/ImageGenrator";
import { setShowStoryUploadModal } from "@/features/storySlice";

function CreateStoryPageComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);
  const storyImageChosen = useAppSelector(
    (state: RootState) => state.story.storyImage
  );
  const storyMusicData = useAppSelector(
    (state: RootState) => state.story.musicData
  );

  const userId = useAppSelector((state: RootState) => state.auth.user._id);
  const [showStoryMusic, setShowStoryMusic] = useState(true);

  const [selectImageClicked, setSelectImageClicked] = useState(false);
  const [selectMusicClicked, setSelectMusicClicked] = useState(false);
  const [selectWriteClicked, setSelectWriteClicked] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [aiButtonClicked, setAIButtonClicked] = useState(false);

  const [selectMusicDisabled, setSelectMusicDisabled] = useState(false);
  const [chevronActive, setChevronActive] = useState<boolean>(false);
  const [mute, setMute] = useState<"yes" | "no">("no");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const [storyCapturing, setStoryCapturing] = useState(false);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setStoryImage(""));
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      dispatch(setStoryImage(URL.createObjectURL(file)));
      dispatch(setStoryTextBg(URL.createObjectURL(file)));
    } else {
      dispatch(setStoryImage(""));
    }
  }

  useEffect(() => {
    if (
      (storyImageChosen !== "" || selectWriteClicked) &&
      storyMusicData.url &&
      audioRef.current
    ) {
      audioRef.current.src = storyMusicData.url;
      audioRef.current
        ?.play()
        .catch((err) => console.log("play interupted", err));
      if (!audioRef.current.paused) {
        setMusicPlaying(true);
      }
      setMute("no");
    }
  }, [storyImageChosen, storyMusicData.url]);

  useEffect(() => {
    if (storyImageChosen === "" && !selectWriteClicked) {
      setSelectMusicDisabled(true);
      setSelectMusicClicked(false);
    } else {
      setSelectMusicDisabled(false);
    }
  }, [storyImageChosen, selectWriteClicked]);

  if (audioRef.current && !audioRef.current.paused) {
    if (mute === "yes") {
      audioRef.current.volume = 0;
    } else if (mute === "no") {
      audioRef.current.volume = 1;
    }
  }

  const handleCreateStory = async () => {
    if (!storyRef.current) return;
    console.log("handleCreateStory called");

    setStoryCapturing(true);
    dispatch(setShowStoryUploadModal(true));

    requestAnimationFrame(async () => {
      if (!storyRef.current) return;

      const canvas = await html2canvas(storyRef.current, { useCORS: true });
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await fetch(dataUrl).then((res) => res.blob());
      const file = new File([blob], "story.png", { type: "image/png" });

      console.log("Dispatching handleStoryUpload with:", {
        userId,
        file,
        storyMusicData,
      });
      router.push("/dash/feed");
      await dispatch(
        handleStoryUpload({ userId, file, musicData: storyMusicData })
      );

      dispatch(setStoryImage(""));
      setMusicPlaying(false);
      dispatch(
        setMusicData({ title: "", artist: "", genre: "", url: "", image: "" })
      );
      setStoryCapturing(false);
    });
  };

  return (
    <div className="w-full py-2 overflow-hidden min-h-screen flex flex-col items-center justify-start gap-2 bg-[var(--bgColor)] backdrop-blur-md text-[var(--textColor)] ">
      <div className="w-full sm:w-[70%] px-2 pt-2 h-full flex flex-col items-center justify-start gap-2 ">
        <form
          action=""
          className="flex w-full items-center px-2 pb-2 justify-between gap-3"
        >
          {storyImageChosen === "" ? (
            <button
              onClick={() => {
                setSelectImageClicked((prev) => !prev);
                setSelectWriteClicked(false);
                setAIButtonClicked(false);
              }}
              type="button"
              className={`relative group rounded-2xl px-3 sm:px-2 py-2 sm:py-1 flex items-center justify-center gap-2 sm:gap-1 active:scale-95 ${
                selectImageClicked
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <ImagePlus
                strokeWidth={1.5}
                className={`w-7 h-7 sm:w-5 sm:h-5 ${
                  selectImageClicked
                    ? "text-[var(--bgColor)]"
                    : "text-[var(--textColor)]"
                }`}
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </button>
          ) : (
            <div
              title="Choose From"
              className="backdrop-blur-md text-[var(--textColor)] rounded-md py-2 flex flex-col items-center"
            >
              <div className="flex justify-center border border-[var(--textColor)] rounded-md py-1 items-center gap-2 sm:gap-1">
                <button
                  onClick={() => {
                    setSelectMusicClicked(false);
                    setSelectWriteClicked(false);
                    setAIButtonClicked(false);
                  }}
                  type="button"
                  className="relative flex items-center flex-col justify-center px-2 sm:px-1 active:scale-90"
                >
                  <ImagePlus
                    strokeWidth={1.5}
                    className="w-6 h-6 sm:w-5 sm:h-5"
                  />
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </button>
                <p className="text-xs sm:text-[10px]">or</p>
                <button
                  onClick={() => {
                    dispatch(setStoryImage(""));
                    setSelectMusicClicked(false);
                    setSelectImageClicked(false);
                    setSelectWriteClicked(false);
                    setAIButtonClicked(false);
                  }}
                  type="button"
                  className="flex flex-col justify-center items-center px-2 sm:px-1 active:scale-90"
                >
                  <LayoutDashboard
                    strokeWidth={1.5}
                    className="w-6 h-6 sm:w-5 sm:h-5"
                  />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setCameraOpen((prev) => !prev);
              setSelectWriteClicked(false);
            }}
            type="button"
            className="cursor-pointer active:scale-90"
          >
            <Camera
              strokeWidth={1.5}
              className="w-7 h-7 sm:w-5 sm:h-5 text-[var(--textColor)]"
            />
          </button>

          {/* Music */}
          <button
            onClick={() => {
              setSelectMusicClicked((prev) => !prev);
              setSelectImageClicked(false);
            }}
            disabled={selectMusicDisabled}
            type="button"
            className={`rounded-2xl px-3 sm:px-2 py-2 sm:py-1 flex items-center gap-2 sm:gap-1 active:scale-95 ${
              selectMusicClicked
                ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                : ""
            } ${selectMusicDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Music2
              strokeWidth={1.5}
              className={`w-7 h-7 sm:w-5 sm:h-5 ${
                selectMusicClicked
                  ? "text-[var(--bgColor)]"
                  : "text-[var(--textColor)]"
              }`}
            />
            <ChevronDown
              strokeWidth={1.5}
              className={`w-5 h-5 sm:w-4 sm:h-4 transition-transform ${
                chevronActive ? "rotate-180" : ""
              } ${
                selectMusicClicked
                  ? "text-[var(--bgColor)]"
                  : "text-[var(--textColor)]"
              }`}
            />
          </button>

          {/* Write */}
          <button
            onClick={() => {
              setSelectWriteClicked((prev) => !prev);
              setSelectImageClicked(false);
              setAIButtonClicked(false);
              setSelectMusicClicked(false);
              dispatch(setStoryImage(""));
              setMusicPlaying(false);
              if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
            }}
            type="button"
            className={`rounded-2xl px-3 sm:px-2 py-2 sm:py-1 flex items-center gap-2 sm:gap-1 active:scale-95 ${
              selectWriteClicked
                ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                : ""
            }`}
          >
            <PenBox
              strokeWidth={1.5}
              className={`w-7 h-7 sm:w-5 sm:h-5 ${
                selectWriteClicked
                  ? "text-[var(--bgColor)]"
                  : "text-[var(--textColor)]"
              }`}
            />
          </button>

          {/* AI */}
          <button
            onClick={() => {
              setCameraOpen(false);
              dispatch(setStoryImage(""));
              setSelectWriteClicked(false);
              setSelectMusicClicked(false);
              setSelectImageClicked(false);
              setAIButtonClicked((prev) => !prev);
            }}
            type="button"
            className={`rounded-2xl px-3 sm:px-2 py-2 sm:py-1 flex items-center gap-2 sm:gap-1 active:scale-95 ${
              aiButtonClicked
                ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                : "text-[var(--textColor)]"
            }`}
          >
            <Sparkles
              strokeWidth={1.5}
              className="w-7 h-7 sm:w-5 sm:h-5 rotate-6"
            />
          </button>
        </form>
        {(storyImageChosen !== "" || selectWriteClicked) && (
          <div className=" w-full py-4 pr-2 flex sm:w-fit justify-between items-center gap-2 sm:gap-10 ">
            {storyMusicData.url &&
              (storyImageChosen || selectWriteClicked) &&
              !audioRef.current?.paused && (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => {
                      setMute((prev) => (prev === "yes" ? "no" : "yes"));
                    }}
                    className=" p-2 justify-self-end rounded-full active:bg-[var(--wrapperColor)] active:scale-75 flex items-center justify-center right-4 cursor-pointer"
                    type="button"
                  >
                    {mute === "no" ? (
                      <SpeakerXIcon size={30} weight="light" />
                    ) : (
                      <SpeakerNoneIcon size={30} weight="light" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStoryMusic((prev) => !prev)}
                    className="p-2 justify-self-end rounded-full active:bg-[var(--wrapperColor)] active:scale-75 flex items-center justify-center right-4 cursor-pointer"
                  >
                    {showStoryMusic ? (
                      <EyeSlashIcon size={30} weight="light" />
                    ) : (
                      <EyeIcon size={30} weight="light" />
                    )}
                  </button>
                </div>
              )}
            <div className="flex w-full justify-evenly gap-6 items-center">
              <button
                type="button"
                className="text-sm sm:text-xs flex justify-center items-center border-2 border-red-500 text-red-500 rounded-full font-medium active:scale-90 cursor-pointer py-2 px-4 sm:py-1.5 sm:px-3"
                onClick={() => {
                  dispatch(setStoryImage(""));
                  dispatch(setMusicData({}));
                  setSelectImageClicked(false);
                  setSelectMusicClicked(false);
                  setSelectWriteClicked(false);
                  setMusicPlaying(false);
                  if (audioRef.current && !audioRef.current.paused) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                }}
              >
                Discard
              </button>

              <button
                onClick={handleCreateStory}
                type="button"
                className="text-sm sm:text-xs flex justify-center items-center gap-1 sm:gap-0.5 bg-[var(--textColor)] text-[var(--bgColor)] rounded-full font-semibold active:scale-90 cursor-pointer py-2 px-6 sm:py-2 sm:px-4"
              >
                <PlusSquareIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                Add Story
              </button>
            </div>
          </div>
        )}

        {/* we play story and music here */}
        {/* this is first story ref */}

        <div className="text-xl xxx relative w-full md:w-[70%] lg:w-[70%] flex items-center flex-col justify-center font-semibold ">
          {storyImageChosen !== "" && (
            <div ref={storyRef}>
              <img
                src={storyImageChosen}
                className={`rounded-md`}
                alt="story"
              />
            </div>
          )}
          {selectWriteClicked && (
            <StoryText storyRef={storyRef} isCapturing={storyCapturing} />
          )}
        </div>
      </div>
      {selectMusicClicked && (
        <div className=" overflow-y-auto w-full px-2 down-slide h-[80%] sm:w-fit  py-2 top-35 z-50 fixed flex pb-16 items-start justify-center ">
          <MusicComponent
            setMusicModal={setSelectMusicClicked}
            setChevronActive={setChevronActive}
            muteMusicOfParent={setMute}
          />
        </div>
      )}

      <div
        className={`w-full h-full flex-col justify-center items-center ${
          selectWriteClicked ||
          selectMusicClicked ||
          storyImageChosen !== "" ||
          aiButtonClicked
            ? "hidden"
            : "flex"
        }`}
      >
        <StoryTemplates />
      </div>
      {cameraOpen && (
        <CameraCapture setCameraOpen={setCameraOpen} clickedFromStory={true} />
      )}
      {aiButtonClicked && (
        <div>
          <ImageGenrator setAiButtonClicked={setAIButtonClicked} />
        </div>
      )}

      {/* hidden music player */}
      {musicPlaying ? (
        <motion.div
          drag
          dragMomentum={false}
          className={`w-full z-40 sm:w-[70%] ${
            showStoryMusic ? "" : "opacity-0 pointer-events-none"
          } flex absolute top-24 items-center justify-center`}
        >
          <div className="flex sm:w-[40%] w-[70%] absolute top-24 gap-3 justify-center z-40 p-2 rounded-xl ">
            <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--borderColor)] bg-[var(--bgColor)]/30 backdrop-blur-md px-3 py-1">
              {/* Image */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 relative z-50  ">
                  {storyMusicData.image !== "" ? (
                    <Image
                      alt="img"
                      src={storyMusicData.image}
                      width={100}
                      height={80}
                      className="object-cover h-10 rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-violet-500 to-blue-700" />
                  )}
                </div>

                {/* Audio bars */}
                <div className="shrink-0">
                  <AudioBars />
                </div>
              </div>

              {/* Title */}
              <div className="overflow-hidden max-w-[60%]">
                <p className="text-xs whitespace-nowrap translate-animation text-white">
                  {storyMusicData.title &&
                    storyMusicData.title.split("-").slice(0, 7).join("-")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
      <audio
        controls
        loop
        hidden
        className="fixed top-24"
        ref={audioRef}
      ></audio>
    </div>
  );
}

export default CreateStoryPageComponent;
