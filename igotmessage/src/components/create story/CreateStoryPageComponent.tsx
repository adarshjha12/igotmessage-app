"use client";

import {
  ChevronDown,
  DownloadIcon,
  EyeClosed,
  ImagePlusIcon,
  Info,
  LayoutDashboardIcon,
  Music2Icon,
  PenBoxIcon,
  Sparkle,
  XIcon,
} from "lucide-react";

import html2canvas from "html2canvas";

import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setStoryImage, setMusicData } from "@/features/activitySlice";
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
import { useAppSelector } from "@/store/hooks";

function CreateStoryPageComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isDark = useAppSelector((state: RootState) => state.activity.isDark);
  const storyImageChosen = useSelector(
    (state: RootState) => state.activity.story.storyImage
  );
  const storyMusicData = useSelector(
    (state: RootState) => state.activity.story.musicData
  );
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

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setStoryImage(""));
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      dispatch(setStoryImage(URL.createObjectURL(file)));
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
      setMusicPlaying(true);
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

  return (
    <div className="w-full py-2 overflow-hidden min-h-screen flex flex-col items-center justify-start gap-2 bg-[var(--bgColor)] backdrop-blur-md text-[var(--textColor)] ">
      <div className="w-full sm:w-[70%] px-2 pt-2 h-full flex flex-col items-center justify-start gap-2 ">
        <form
          action=""
          className="flex w-full items-center pr-4 pb-2 justify-between gap-3"
        >
          {storyImageChosen === "" ? (
            <button
              onClick={() => {
                setSelectImageClicked((prev) => !prev);
                setSelectWriteClicked(false);
              }}
              type="button"
              className={`relative group sm:w-fit hover:bg-opacity-90 cursor-pointer rounded-2xl px-2 py-1 flex active:bg-[var(--wrapperColor)] items-center gap-3 justify-center active:scale-95 ${
                selectImageClicked
                  ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                  : ""
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <ImagePlusIcon
                  size="40"
                  strokeWidth={1}
                  className={`${
                    selectImageClicked
                      ? " text-[var(--bgColor)]"
                      : "text-[var(--textColor)]"
                  }`}
                />
                {/* <p className='text-sm font-semibold font-exo2'>Select Image</p> */}
              </div>
              <input
                type="file"
                onChange={handleImageChange}
                className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer`}
              />
            </button>
          ) : (
            <div
              title="Choose From"
              className="backdrop-blur-md down-slide text-[var(--textColor)] rounded-md py-2 gap-0 flex flex-col justify-center items-center"
            >
              <div className="flex justify-center border-1 border-[var(--textColor)] gap-1 rounded-md py-1 items-center">
                <button
                  onClick={() => {
                    setSelectMusicClicked(false);
                  }}
                  type="button"
                  className="relative active:scale-75 cursor-pointer flex items-center flex-col justify-end px-1 gap-1"
                >
                  <ImagePlusIcon strokeWidth={1} size={40} />
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </button>
                <p className="text-xs">or</p>
                <button
                  onClick={() => {
                    dispatch(setStoryImage(""));
                    setSelectMusicClicked(false);
                    setSelectImageClicked(false);
                    setSelectWriteClicked(false);
                  }}
                  type="button"
                  className="active:scale-75 flex flex-col cursor-pointer justify-end items-center gap-1 px-1"
                >
                  <LayoutDashboardIcon strokeWidth={1} size={40} />
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setCameraOpen((prev) => !prev)}
            type="button"
            className="cursor-pointer active:scale-75"
          >
            <CameraIcon
              size={45}
              strokeWidth={1}
              weight="light"
              className="text-[var(--textColor)]"
            />
          </button>
          {cameraOpen && <div></div>}

          <button
            onClick={() => {
              setSelectMusicClicked((prev) => !prev);
              setSelectImageClicked(false);
            }}
            disabled={selectMusicDisabled}
            type="button"
            className={`${
              selectMusicDisabled ? "opacity-50 cursor-not-allowed" : ""
            } cursor-pointer justify-center sm:w-fit rounded-2xl px-2 py-1 flex items-center gap-3 active:bg-[var(--wrapperColor)] active:scale-95 ${
              selectMusicClicked
                ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                : ""
            }`}
          >
            <div className="flex relative justify-center items-center">
              <div className="flex flex-col items-center justify-center gap-1">
                <Music2Icon
                  size="40"
                  strokeWidth={1}
                  className={`${
                    selectMusicClicked ? " text-[var(--bgColor)]" : ""
                  }`}
                />
                {/* <p className='text-sm font-semibold opacity-70 font-exo2'>Select Music</p> */}
              </div>
              <div className="absolute -right-2">
                {" "}
                <ChevronDown
                  size={30}
                  strokeWidth={1.5}
                  className={`transition-all duration-150 ease-in ${
                    chevronActive ? "rotate-180" : ""
                  } ${
                    selectMusicClicked
                      ? "text-[var(--bgColor)]"
                      : "text-[var(--textColor)]"
                  }`}
                />
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setSelectWriteClicked((prev) => !prev);
              setSelectImageClicked(false);
              setSelectMusicClicked(false);
              dispatch(setStoryImage(""));
            }}
            type="button"
            className={` cursor-pointer justify-center sm:w-fit rounded-2xl px-2 py-1 flex items-center gap-3 active:bg-[var(--wrapperColor)] active:scale-95 ${
              selectWriteClicked
                ? "bg-[var(--textColor)] text-[var(--bgColor)]"
                : ""
            }`}
          >
            <div className="flex relative justify-center items-center">
              <div className="flex flex-col items-center justify-center gap-1">
                <PenBoxIcon
                  size="40"
                  strokeWidth={1}
                  className={`${
                    selectWriteClicked
                      ? " text-[var(--bgColor)]"
                      : "text-[var(--textColor)]"
                  }`}
                />
                {/* <p className='text-sm opacity-70 font-semibold font-exo2'>Write</p> */}
              </div>
            </div>
          </button>
          <button
            onClick={() => setAIButtonClicked((prev) => !prev)}
            type="button"
            className={`cursor-pointer relative tex-[var(--textColor)] justify-center sm:w-fit rounded-2xl px-2 py-1 flex items-center gap-3 active:bg-[var(--wrapperColor)] active:scale-95 `}
          >
            <Sparkle
              size={40}
              strokeWidth={1}
              className="text-[var(--textColor)] rotate-6"
            />
            <Sparkle
              size={20}
              strokeWidth={2}
              className="text-[var(--textColor)] z-40 absolute top-0 -right-2"
            />
            <p className="text-[8px] tracking-wider z-40 border-1 border-[var(--textColor)] rounded-sm px-1 py-0 font-medium font-exo2 absolute top-6 -right-2">
              AI
            </p>
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
                className=" text-xl flex justify-center items-center border-2 border-red-500 text-red-500 rounded-md font-medium active:scale-90 cursor-pointer py-2 px-2"
                onClick={() => {
                  dispatch(setStoryImage(""));
                  dispatch(setMusicData({}));
                  setSelectImageClicked(false);
                  setSelectMusicClicked(false);
                  setSelectWriteClicked(false);
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                }}
              >
                Discard
              </button>

              <button
                type="button"
                className=" text-xl flex justify-center items-center gap-1 bg-[var(--textColor)] text-[var(--bgColor)] rounded-md font-medium active:scale-90 cursor-pointer py-2 px-1"
                // onClick={() => {

                //   router.push('/create-story')
                //   }}
              >
                {" "}
                <PlusSquareIcon size={30} />
                Add Story
              </button>
            </div>
          </div>
        )}
        {/* we play story and music here */}
        <div className="text-xl relative w-full md:w-[70%] lg:w-[70%] flex items-center flex-col justify-center font-semibold ">
          {storyImageChosen !== "" && (
            <img src={storyImageChosen} className={`rounded-md`} alt="story" />
          )}

          {musicPlaying ? (
            <motion.div
              drag
              dragMomentum={false}
              className={`w-full z-40 sm:w-[70%] ${
                showStoryMusic ? "" : "opacity-0 pointer-events-none"
              } flex items-center justify-center`}
            >
              <div className="flex w-[70%] absolute top-24 gap-3 justify-center z-40 p-2 rounded-xl ">
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
                      {storyMusicData.title.split("-").slice(0, 7).join("-")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
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
          selectWriteClicked || selectMusicClicked || storyImageChosen !== ""
            ? "hidden"
            : "flex"
        }`}
      >
        <StoryTemplates />
      </div>
      {cameraOpen && <CameraCapture />}
      {aiButtonClicked && (
        <div className="w-full up-slide fixed z-50 top-[10%] flex items-center justify-center flex-col left-0">
          <button
            type="button"
            onClick={() => setAIButtonClicked(false)}
            className="absolute top-2 right-4 active:scale-90 active:bg-[var(--bgColor)] p-2 rounded-full cursor-pointer"
          >
            <XIcon />
          </button>
          <div className="bg-[var(--wrapperColor)] flex flex-col justify-center items-center px-8 py-20 rounded-3xl gap-6">
            <p className="text-4xl text-red-600 font-semibold">Oops...</p>
            <p className="text-[var(--textColor)] flex items-center gap-2 text-xl text-center  ">
              <Info size={50} className="text-red-600" />
              Currently unavailable due to server cost limits
            </p>
          </div>
        </div>
      )}
      {aiButtonClicked && (
        <div
          onClick={() => setAIButtonClicked(false)}
          className="w-full bg-black/70 fixed z-40 inset-0 flex items-center justify-center left-0"
        >
          {" "}
        </div>
      )}

      {selectWriteClicked && <StoryText />}

      {/* hidden music player */}
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
