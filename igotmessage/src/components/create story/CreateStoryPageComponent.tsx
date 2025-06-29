"use client";

import {
  ChevronDown,
  ImagePlusIcon,
  LayoutDashboardIcon,
  Music2Icon,
  PenBoxIcon,
  Sparkle,
} from "lucide-react";

import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setStoryImage, setMusicData } from "@/features/activitySlice";
import {
  CameraIcon,
  DeviceMobileIcon,
  ImageIcon,
  PlusSquareIcon,
  SparkleIcon,
  SpeakerNoneIcon,
} from "@phosphor-icons/react";
import MusicComponent from "./MusicComponent";
import Image from "next/image";
import StoryTemplates from "./StoryTemplates";
import { useRouter } from "next/navigation";
import AudioBars from "../AudioBar";
import { SpeakerXIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import CameraCapture from "../Camera";

function CreateStoryPageComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.activity.isDark);
  const storyImageChosen = useSelector(
    (state: RootState) => state.activity.story.storyImage
  );
  const storyMusicData = useSelector(
    (state: RootState) => state.activity.story.musicData
  );

  const [selectImageClicked, setSelectImageClicked] = useState(false);
  const [selectMusicClicked, setSelectMusicClicked] = useState(false);
  const [selectWriteClicked, setSelectWriteClicked] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const [selectMusicDisabled, setSelectMusicDisabled] = useState(false);
  const [musicChosen, setMusicChosen] = useState(false);

  const [chevronActive, setChevronActive] = useState<boolean>(false);
  const [volume, setVolume] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // const newAudio = new Audio(storyMusicData.url)
  // audioRef.current = newAudio
  // console.log(newAudio);
  console.log("audioref", audioRef.current?.duration);
  console.log("storyMusicData.url", storyMusicData.url);
  console.log("storyMusicData.image", storyMusicData.image);

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
    if (storyImageChosen !== "" && storyMusicData.url !== "") {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const newAudio = new Audio(storyMusicData.url);
      audioRef.current = newAudio;
      newAudio.play();
      newAudio.loop = true;
    }
  }, [storyImageChosen, storyMusicData.url]);

  useEffect(() => {
    setSelectImageClicked(false);
    setSelectMusicClicked(false);
    setSelectWriteClicked(false);
    audioRef.current?.pause();
  }, [router]);

  useEffect(() => {
    if (!storyImageChosen) {
      setSelectMusicDisabled(true);
      setSelectMusicClicked(false);
    } else {
      setSelectMusicDisabled(false);
    }
  }, [storyImageChosen]);

  function handleVolume() {
    if (audioRef.current && !audioRef.current.paused) {
      if (audioRef.current.volume > 0) {
        audioRef.current.volume = 0;
        setVolume(false);
      } else {
        audioRef.current.volume = 1;
        setVolume(true);
      }
    }
  }

  return (
    <div className="w-full py-5 overflow-hidden min-h-screen flex flex-col items-center justify-start gap-2.5 bg-[var(--bgColor)] backdrop-blur-md text-[var(--textColor)] ">
      <div className="w-full sm:w-[50%] px-2 py-2 h-full flex flex-col items-center justify-start gap-2.5 ">
        <form
          action=""
          className="flex w-full items-center pb-4 justify-between gap-3"
        >
          {storyImageChosen === "" ? (
            <button
              onClick={() => setSelectImageClicked((prev) => !prev)}
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
            // onClick={() => setCameraOpen(prev => !prev)}
            type="button"
            className="cursor-pointer active:scale-75 relative"
          >
            <Sparkle
              size={40}
              strokeWidth={1}
              className="text-[var(--textColor)] rotate-6"
            />
            <Sparkle
              size={20}
              strokeWidth={2}
              className="text-[var(--textColor)] absolute top-0 -right-2"
            />
            <p className="text-[8px] tracking-wider border-1 border-[var(--textColor)] rounded-sm px-1 py-0 font-medium font-exo2 absolute top-6 -right-2">
              AI
            </p>
          </button>
          <button
            onClick={() => {
              setSelectMusicClicked((prev) => !prev);
              setSelectImageClicked(false);
              setChevronActive((prev) => !prev);
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
        </form>
        {/* we play story and music here */}
        <div className="text-xl relative w-full flex items-center flex-col justify-center font-semibold ">
          {storyImageChosen && (
            <img src={storyImageChosen} className={`rounded-md`} alt="story" />
          )}
          {storyMusicData.url &&
            storyImageChosen &&
            !audioRef.current?.paused && (
              <button onClick={handleVolume} className="absolute -bottom-12 p-2 rounded-full active:bg-[var(--wrapperColor)] active:scale-75 flex items-center justify-center right-4 cursor-pointer" type="button">
                {volume ? (
                  <SpeakerXIcon size={30} weight="light"/>
                ) : (
                  <SpeakerNoneIcon size={30} weight="light"/>
                )}
              </button>
            )}
          {storyImageChosen &&
          storyMusicData.url &&
          !audioRef.current?.paused ? (
            <motion.div
              drag
              dragMomentum={false}
              className="w-full flex items-center justify-center"
            >
              <div className="flex w-[60%] absolute bottom-10 gap-3 justify-center p-1 rounded-md">
                <div className="border w-full flex p-1 justify-between items-center gap-2 border-[var(--borderColor)] rounded-md bg-[var(--bgColor)]/30 backdrop-blur-md">
                  <div className="w-[60px] h-[40px] relative">
                    {storyMusicData.image !== "" ? (
                      <Image
                        className="object-cover rounded-md"
                        fill
                        alt="img"
                        src={storyMusicData.image}
                      />
                    ) : (
                      <div className="w-full h-full flex justify-center items-center rounded-md bg-gradient-to-r from-violet-500 to-blue-700"></div>
                    )}
                  </div>
                  <div>
                    <AudioBars isPlaying={true} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-nowrap translate-animation">
                      {storyMusicData.title.split(" - ")[0]}
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
          <MusicComponent setMusicModal={setSelectMusicClicked} />
        </div>
      )}

      <div
        className={`w-full h-full flex-col justify-center items-center ${
          selectWriteClicked || selectMusicClicked || storyImageChosen
            ? "hidden"
            : "flex"
        }`}
      >
        <StoryTemplates />
      </div>
      {cameraOpen && <CameraCapture />}
      {storyImageChosen && 
      <div className="absolute bottom-12 sm:right-10 md:right-10 lg:right-30 sm:flex-col-reverse sm:top-50 sm:bottom-auto w-full flex  sm:w-fit justify-evenly items-center gap-2 sm:gap-10 ">
        <button type='button'
            className=' text-xl flex justify-center items-center border-2 border-red-500 text-red-500 rounded-xl font-medium active:scale-90 cursor-pointer py-2 px-3'
            onClick={() => {
              
              dispatch(setStoryImage(''))
              dispatch(setMusicData({}))
              setSelectImageClicked(false)
             if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
             }
              }}>
             Discard
          </button>

        <button type='button'
            className=' text-xl flex justify-center items-center gap-1 bg-[var(--textColor)] text-[var(--bgColor)] rounded-xl font-medium active:scale-90 cursor-pointer py-2 px-3'
            // onClick={() => {
              
            //   router.push('/create-story')
            //   }}
            > <PlusSquareIcon size={30} />
             Add Story
          </button>
      </div>
      }
    </div>
  );
}

export default CreateStoryPageComponent;
